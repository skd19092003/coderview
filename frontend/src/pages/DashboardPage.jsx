import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useActiveSessions, useCreateSession, useMyRecentSessions } from "../hooks/useSessions";
import { BookOpenIcon, CopyIcon, Link2Icon, XIcon } from "lucide-react";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const siteUrl = "coderview-3a0a.onrender.com";
  const [roomConfig, setRoomConfig] = useState({
    problem: "",
    difficulty: "",
    inviteeEmail: "",
    problemType: "predefined",
    customProblemTitle: "",
    customProblemStatement: "",
    customProblemTestCases: "",
  });

  const createSessionMutation = useCreateSession();

  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions(user?.id);
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions(user?.id);

  const handleCreateRoom = () => {
    const isCustom = roomConfig.problemType === "custom";

    if (!roomConfig.problem || !roomConfig.difficulty || !roomConfig.inviteeEmail.trim()) return;
    if (isCustom && !roomConfig.customProblemStatement.trim()) return;

    createSessionMutation.mutate(
      {
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toLowerCase(),
        inviteeEmail: roomConfig.inviteeEmail.trim(),
        problemType: roomConfig.problemType,
        customProblemTitle: roomConfig.customProblemTitle.trim(),
        customProblemStatement: roomConfig.customProblemStatement.trim(),
        customProblemTestCases: roomConfig.customProblemTestCases.trim(),
      },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          setRoomConfig({
            problem: "",
            difficulty: "",
            inviteeEmail: "",
            problemType: "predefined",
            customProblemTitle: "",
            customProblemStatement: "",
            customProblemTestCases: "",
          });
          navigate(`/session/${data.session._id}`);
        },
      }
    );
  };

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];

  const copySiteLink = async () => {
    if (!siteUrl) return;

    await navigator.clipboard.writeText(siteUrl);
  };

  const isUserInSession = (session) => {
    if (!user.id) return false;

    return (
      session.host?.clerkId === user.id ||
      session.invitedUser?.clerkId === user.id ||
      session.participant?.clerkId === user.id
    );
  };

  return (
    <>
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <WelcomeSection
          onCreateSession={() => setShowCreateModal(true)}
          onOpenInstructions={() => setShowInstructions(true)}
        />

        {/* Grid layout */}
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatsCards
              activeSessionsCount={activeSessions.length}
              recentSessionsCount={recentSessions.length}
            />
            <ActiveSessions
              sessions={activeSessions}
              isLoading={loadingActiveSessions}
              isUserInSession={isUserInSession}
            />
          </div>

          <RecentSessions sessions={recentSessions} isLoading={loadingRecentSessions} />
        </div>
      </div>

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />

      {showInstructions && (
        <div
          className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowInstructions(false)}
        >
          <div
            className="w-full max-w-2xl bg-base-100 rounded-2xl shadow-2xl border border-base-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpenIcon className="size-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">How to use CoderView</h3>
              </div>
              <button
                className="btn btn-sm btn-ghost btn-circle"
                onClick={() => setShowInstructions(false)}
                aria-label="Close instructions"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 text-sm md:text-base text-base-content/80 max-h-[70vh] overflow-y-auto">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                <p className="font-semibold text-base-content">Share this website with the candidate</p>
                <p>
                  Send this link to the invited candidate and ask them to sign up using the same email
                  that was invited. At the scheduled time, the interview session will appear in their
                  dashboard with that email, and they can join directly.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-base-100 px-3 py-2 border border-base-300 text-sm">
                    <Link2Icon className="size-4 text-primary" />
                    <span className="font-mono">{siteUrl || "Site link unavailable"}</span>
                  </div>
                  <button className="btn btn-primary btn-sm gap-2" onClick={copySiteLink}>
                    <CopyIcon className="size-4" />
                    Copy website link
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-base-content">Create session as host</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Click <span className="font-semibold">Create Session</span>.</li>
                  <li>Select a problem or choose <span className="font-semibold">Custom Problem</span>.</li>
                  <li>Enter the invited user email.</li>
                  <li>Create the session and share the website link with the candidate.</li>
                </ol>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-base-content">Join as invited user</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Sign up or sign in with the same email that was invited.</li>
                  <li>Open the dashboard or session link.</li>
                  <li>Join only if you are the invited user for that session.</li>
                  <li>If the host shared a time, wait for the session to appear and then join.</li>
                </ol>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-base-content">What you can do</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Use the code editor to solve the problem.</li>
                  <li>Run code and check output.</li>
                  <li>Use video, chat, and screensharing during interview.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-base-content">What is not allowed</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Random users cannot join.</li>
                  <li>Only the invited email can access the session.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardPage;
