import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, BookOpenIcon, SparklesIcon, ZapIcon } from "lucide-react";

function WelcomeSection({ onCreateSession, onOpenInstructions }) {
  const { user } = useUser();

  return (
    <div className="relative overflow-hidden">
      <div className="relative mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <img
                  src="/download.svg"
                  alt=""
                  aria-hidden="true"
                  width="40"
                  height="40"
                  decoding="async"
                  className="size-10 rounded-xl shadow-lg object-cover"
                />
              </div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Welcome back, {user?.firstName || "there"}!
              </h1>
            </div>
            <p className="text-xl text-base-content/60 ml-16">
              Ready to conduct an interview? Create a new session and add your candidate as invited user.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 self-start">
            <button
              onClick={onOpenInstructions}
              className="btn btn-outline btn-sm md:btn-md gap-2 rounded-2xl border-primary/30 hover:border-primary/60 hover:bg-primary/10"
            >
              <BookOpenIcon className="size-4" />
              Instructions
            </button>

            <button
              onClick={onCreateSession}
              className="group px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-2xl transition-all duration-200 hover:opacity-90"
            >
              <div className="flex items-center gap-3 text-white font-bold text-lg">
                <ZapIcon className="w-6 h-6" />
                <span>Create Session</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;
