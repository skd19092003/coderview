import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";
import User from "../models/User.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getUserId = (value) => value?._id || value;

const isSameUser = (left, right) => getUserId(left)?.toString() === getUserId(right)?.toString();

const isAllowedSessionUser = (session, userId) =>
  isSameUser(session.host, userId) ||
  isSameUser(session.invitedUser, userId) ||
  isSameUser(session.participant, userId);

export async function createSession(req, res) {
  try {
    const { problem, difficulty, inviteeEmail } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty || !inviteeEmail) {
      return res
        .status(400)
        .json({ message: "Problem, difficulty, and invitee email are required" });
    }

    const normalizedInviteeEmail = inviteeEmail.trim().toLowerCase();

    if (normalizedInviteeEmail === req.user.email.toLowerCase()) {
      return res.status(400).json({ message: "You cannot invite yourself" });
    }

    const invitedUser = await User.findOne({
      email: { $regex: new RegExp(`^${escapeRegex(normalizedInviteeEmail)}$`, "i") },
    });

    if (!invitedUser) {
      return res.status(404).json({ message: "Invited user not found" });
    }

    // generate a unique call id for stream video
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // create session in db
    const session = await Session.create({
      problem,
      difficulty,
      host: userId,
      invitedUser: invitedUser._id,
      callId,
    });

    const hostDisplayName = req.user.name || req.user.email;

    // create stream video call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: {
          sessionId: session._id.toString(),
          hostDisplayName,
          invitedEmail: invitedUser.email,
        },
      },
    });

    // chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `${hostDisplayName} Interview Session`,
      created_by_id: clerkId,
      members: [clerkId, invitedUser.clerkId],
    });

    await channel.create();

    res.status(201).json({ session });
  } catch (error) {
    console.log("Error in createSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getActiveSessions(req, res) {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({
      status: "active",
      $or: [{ host: userId }, { invitedUser: userId }, { participant: userId }],
    })
      .populate("host", "name profileImage email clerkId")
      .populate("invitedUser", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;

    // get sessions where user is either host or participant
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { invitedUser: userId }, { participant: userId }],
    })
      .populate("host", "name profileImage email clerkId")
      .populate("invitedUser", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("invitedUser", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) return res.status(404).json({ message: "Session not found" });

    if (!isAllowedSessionUser(session, userId)) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.status !== "active") {
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    if (session.host.toString() === userId.toString()) {
      return res.status(400).json({ message: "Host cannot join their own session as participant" });
    }

    if (!isSameUser(session.invitedUser, userId)) {
      return res.status(403).json({ message: "You are not invited to this session" });
    }

    // check if session is already full - has a participant
    if (session.participant) {
      if (isSameUser(session.participant, userId)) {
        return res.status(200).json({ session });
      }

      return res.status(409).json({ message: "Session is full" });
    }

    session.participant = userId;
    await session.save();

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // check if user is the host
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the host can end the session" });
    }

    // check if session is already completed
    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    // delete stream video call
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    // delete stream chat channel
    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    session.status = "completed";
    await session.save();

    res.status(200).json({ session, message: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
