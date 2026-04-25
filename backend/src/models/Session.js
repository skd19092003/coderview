import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    problemType: {
      type: String,
      enum: ["predefined", "custom"],
      default: "predefined",
    },
    problem: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard", "custom"],
      required: true,
    },
    customProblem: {
      title: {
        type: String,
        default: "",
      },
      statement: {
        type: String,
        default: "",
      },
      testCases: {
        type: String,
        default: "",
      },
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    invitedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    // stream video call ID
    callId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
