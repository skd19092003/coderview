import { Code2Icon, LoaderIcon, MailIcon, PlusIcon, XIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);
  const isCustomProblem = roomConfig.problemType === "custom";

  if (!isOpen) return null;

  return (
    <div className="modal modal-open items-start pt-6 pb-6">
      <div className="modal-box relative max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto px-6 py-6 sm:px-8">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-ghost btn-sm btn-circle absolute right-4 top-4"
          aria-label="Close create session modal"
        >
          <XIcon className="size-4" />
        </button>

        <h3 className="font-bold text-2xl mb-6 pr-10">Create New Session</h3>

        <div className="space-y-8">
          {/* PROBLEM SELECTION */}
          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">Select Problem</span>
              <span className="label-text-alt text-error">*</span>
            </label>

            <select
              className="select w-full"
              value={roomConfig.problem}
              onChange={(e) => {
                if (e.target.value === "__custom__") {
                  setRoomConfig({
                    ...roomConfig,
                    problemType: "custom",
                    problem: "Custom Problem",
                    difficulty: "Custom",
                  });
                  return;
                }

                const selectedProblem = problems.find((p) => p.title === e.target.value);
                setRoomConfig({
                  difficulty: selectedProblem.difficulty,
                  problem: e.target.value,
                  problemType: "predefined",
                  inviteeEmail: roomConfig.inviteeEmail,
                  customProblemTitle: "",
                  customProblemStatement: "",
                  customProblemTestCases: "",
                });
              }}
            >
              <option value="" disabled>
                Choose a coding problem...
              </option>

              <option value="__custom__">Custom Problem (Paste your own question)</option>

              {problems.map((problem) => (
                <option key={problem.id} value={problem.title}>
                  {problem.title} ({problem.difficulty})
                </option>
              ))}
            </select>
          </div>

          {isCustomProblem && (
            <div className="space-y-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
              <p className="text-sm text-base-content/80">
                Paste your full question below (LeetCode format or your own format). You can also add
                test cases. This custom problem will be visible in the session description panel and
                persist when you rejoin.
              </p>

              <div className="space-y-2">
                <label className="label py-0">
                  <span className="label-text font-semibold">Custom Problem Title (Optional)</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="e.g. Add Two Numbers"
                  value={roomConfig.customProblemTitle}
                  onChange={(e) =>
                    setRoomConfig({
                      ...roomConfig,
                      customProblemTitle: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="label py-0">
                  <span className="label-text font-semibold">Problem Statement</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <textarea
                  className="textarea textarea-bordered min-h-[220px] w-full"
                  placeholder="Paste the whole problem statement, examples, and constraints here..."
                  value={roomConfig.customProblemStatement}
                  onChange={(e) =>
                    setRoomConfig({
                      ...roomConfig,
                      customProblemStatement: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="label py-0">
                  <span className="label-text font-semibold">Test Cases (Optional)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered min-h-[120px] w-full"
                  placeholder="Add sample input/output test cases (optional)..."
                  value={roomConfig.customProblemTestCases}
                  onChange={(e) =>
                    setRoomConfig({
                      ...roomConfig,
                      customProblemTestCases: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">Invite User Email</span>
              <span className="label-text-alt text-error">*</span>
            </label>

            <label className="input input-bordered flex items-center gap-2 w-full">
              <MailIcon className="size-4 opacity-60" />
              <input
                type="email"
                className="grow"
                placeholder="registered-user@example.com"
                value={roomConfig.inviteeEmail}
                onChange={(e) =>
                  setRoomConfig({
                    ...roomConfig,
                    inviteeEmail: e.target.value,
                  })
                }
              />
            </label>
          </div>

          {/* ROOM SUMMARY */}
          {roomConfig.problem && (
            <div className="alert alert-success">
              <Code2Icon className="size-5" />
              <div>
                <p className="font-semibold">Room Summary:</p>
                <p>
                  Problem: <span className="font-medium">{roomConfig.problem}</span>
                </p>
                {isCustomProblem && (
                  <p>
                    Custom Title: <span className="font-medium">{roomConfig.customProblemTitle || "Not set"}</span>
                  </p>
                )}
                <p>
                  Difficulty: <span className="font-medium">{roomConfig.difficulty}</span>
                </p>
                <p>
                  Max Participants: <span className="font-medium">2 (1-on-1 session)</span>
                </p>
                <p>
                  Invited User: <span className="font-medium">{roomConfig.inviteeEmail || "Not set"}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-action mt-6 pb-2">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn btn-primary gap-2"
            onClick={onCreateRoom}
            disabled={
              isCreating ||
              !roomConfig.problem ||
              !roomConfig.inviteeEmail.trim() ||
              (isCustomProblem && !roomConfig.customProblemStatement.trim())
            }
          >
            {isCreating ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              <PlusIcon className="size-5" />
            )}

            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
export default CreateSessionModal;
