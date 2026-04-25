import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  MailIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";

function ActiveSessions({ sessions, isLoading, isUserInSession }) {
  return (
    <div className="lg:col-span-2 card bg-base-100 border-2 border-primary/20 hover:border-primary/30 h-full">
      <div className="card-body">
        {/* HEADERS SECTION */}
        <div className="flex items-center justify-between mb-6">
          {/* TITLE AND ICON */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl">
              <ZapIcon className="size-5" />
            </div>
            <h2 className="text-2xl font-black">Active 1-to-1 Sessions</h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="size-2 bg-success rounded-full" />
            <span className="text-sm font-medium text-success">{sessions.length} active</span>
          </div>
        </div>

        {/* SESSIONS LIST */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoaderIcon className="size-10 animate-spin text-primary" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className="card bg-base-200 border-2 border-base-300 hover:border-primary/50"
              >
                <div className="flex flex-col gap-4 p-4 md:p-5">
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative size-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Code2Icon className="size-7 text-white" />
                      <div className="absolute -top-1 -right-1 size-4 bg-success rounded-full border-2 border-base-100" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="mb-2">
                        <h3 className="font-bold text-lg truncate">
                          Host - {session.host?.email || "Host email"}
                        </h3>
                    
                      </div>

                      <div className="space-y-1 text-sm opacity-80">
                        <div className="flex items-center gap-1.5">
                          <CrownIcon className="size-4" />
                          <span className="font-medium">
                            Host: {session.host?.username || session.host?.email || "Unknown Host"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MailIcon className="size-4" />
                          <span className="text-xs truncate max-w-full">
                            Invited user : {session.invitedUser?.email || "Invited user"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <UsersIcon className="size-4" />
                          <span className="text-xs">Participants: {session.participant ? "2/2" : "1/2"}</span>
                        </div>
                        <div className="pt-1">
                          {session.participant && !isUserInSession(session) ? (
                            <span className="badge badge-error badge-sm">FULL</span>
                          ) : (
                            <span className="badge badge-success badge-sm">OPEN</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    {session.participant && !isUserInSession(session) ? (
                      <button className="btn btn-disabled btn-sm">Full</button>
                    ) : (
                      <Link to={`/session/${session._id}`} className="btn btn-primary btn-sm gap-2">
                        {isUserInSession(session) ? "Rejoin" : "Join"}
                        <ArrowRightIcon className="size-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex min-h-[260px] flex-col items-center justify-center text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center">
                <SparklesIcon className="w-10 h-10 text-primary/50" />
              </div>
              <p className="text-lg font-semibold opacity-70 mb-1">No active sessions</p>
              <p className="text-sm opacity-50">Be the first to create one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ActiveSessions;
