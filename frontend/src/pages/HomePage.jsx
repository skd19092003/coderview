import { Link } from "react-router";
import { useState } from "react";
import {
  ArrowRightIcon,
  CheckIcon,
  Code2Icon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
  XIcon,
  ZapIcon,
} from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

function HomePage() {
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  return (
    <div className="bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      {/* NAVBAR */}
      <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
          {/* LOGO */}
          <Link
            to={"/"}
            className="flex items-center gap-3 hover:scale-105 transition-transform duration-200"
          >
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
              <SparklesIcon className="size-6 text-white" />
            </div>

            <div className="flex flex-col">
              <span className="font-black text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
                CoderView
              </span>
              <span className="text-xs text-base-content/60 font-medium -mt-1">Remote Interviews</span>
            </div>
          </Link>

          {/* AUTH BTN */}
          <SignInButton mode="modal">
            <button className="group px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2">
              <span>Profile</span>
              <ArrowRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-8">
            <div className="badge badge-primary badge-lg">
              <ZapIcon className="size-4" />
              Real-time interview setup
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Live Coding,
              </span>
              <br />
              <span className="text-base-content">Real Pressure</span>
            </h1>

            <p className="text-xl text-base-content/70 leading-relaxed max-w-xl">
              The ultimate platform for collaborative coding interviews and pair programming.
              Connect face-to-face, code in real-time, and ace your technical interviews.
            </p>

            {/* FEATURE PILLS */}
            <div className="flex flex-wrap gap-3">
              <div className="badge badge-lg badge-outline">
                <CheckIcon className="size-4 text-success" />
                Live Video Chat
              </div>
              <div className="badge badge-lg badge-outline">
                <CheckIcon className="size-4 text-success" />
                Code Editor
              </div>
              <div className="badge badge-lg badge-outline">
                <CheckIcon className="size-4 text-success" />
                Multi-Language Support
              </div>
              
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <SignInButton mode="modal">
                <button className="btn btn-primary btn-lg">
                  Schedule interview
                  <ArrowRightIcon className="size-5" />
                </button>
              </SignInButton>

              <button className="btn btn-outline btn-lg" onClick={() => setIsInstructionsOpen(true)}>
                <VideoIcon className="size-5" />
                Instructions (How to use)
              </button>
            </div>

            {/* STATS */}
            <div className="stats stats-vertical lg:stats-horizontal bg-base-100 shadow-lg">
              <div className="stat">
                <div className="stat-value text-primary">10K+</div>
                <div className="stat-title">Active Users</div>
              </div>
              <div className="stat">
                <div className="stat-value text-secondary">50K+</div>
                <div className="stat-title">Sessions</div>
              </div>
              <div className="stat">
                <div className="stat-value text-accent">99.9%</div>
                <div className="stat-title">Uptime</div>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <img
            src="coderview_optimized.avif"
            alt="CodeCollab Platform"
            className="w-full h-auto rounded-3xl shadow-2xl border-4 border-base-100 hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to <span className="text-primary font-mono">Succeed</span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Powerful features designed to make your coding interviews seamless and productive
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <VideoIcon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">HD Video Call</h3>
              <p className="text-base-content/70">
                Crystal clear video and audio for seamless communication during interviews
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Code2Icon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">Live Code Editor</h3>
              <p className="text-base-content/70">
                Collaborate in real-time with syntax highlighting and multiple language support
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <UsersIcon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">Easy Collaboration</h3>
              <p className="text-base-content/70">
                Share your screen, discuss solutions, and learn from each other in real-time
              </p>
            </div>
          </div>
        </div>
      </div>


{/* //for instruction button */}
      {isInstructionsOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsInstructionsOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-base-100 rounded-2xl shadow-2xl border border-base-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
              <h3 className="text-xl font-bold">How To Use CoderView</h3>
              <button
                className="btn btn-sm btn-ghost btn-circle"
                onClick={() => setIsInstructionsOpen(false)}
                aria-label="Close instructions"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-3 text-base-content/80">
              <p className="font-semibold">Coderview is used to conduct remote code interviews.</p>
              <p className="font-semibold">💻 Recruiters can use Coderview to assess candidates coding skills in a simulated interview environment which will have a coding editor with the coding question already written and a vscode style editor for running code all while video conferencing and screensharing.</p>
              <p className="font-semibold">➡️ Also can be used by friends/peers to prepare for real life coding interviews</p>
              <p className="font-semibold">🔐 1-to-1 end-to-end encryption allowing only the host (recruiter) and invited users to enter the sessions.</p>
              <p className="font-semibold">🏦 Or simply choose any problems from the problem bank and start practicing on code editor.</p>

              <ol className="list-decimal pl-5 space-y-2">
                <li> SignUp/Login to Coderview.</li>
                <li> Send the required timings to the candidate through gmail and tell to create account in coderview.</li>
                <li> On the scheduled day and time, Create a new session.</li>
                <li> In the session, choose a coding question & the candidate/invited user Email Id.</li>
                <li> Only invited users will see the session created by host(recruiter) & can join.</li>
                <li> Conduct the interview with the candidate with coding editor and question available & several options like screenshare, chat panel available.</li>
              </ol>

      
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default HomePage;
