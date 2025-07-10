import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import {  CodeSquareIcon } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import DashboardBtn from "./DashboardBtn";

function Navbar() {
  return (
    <nav className="border-b w-full">
      <div className="flex flex-wrap h-auto items-center justify-evenly p-2 sm:p-4 w-full bg-slate-800">
        {/* LEFT SIDE -LOGO */}
        <Link
          href="/"
          className="flex items-center gap-1 sm:gap-2  border font-semibold mr-4 sm:mr-6 text-2xl font-mono hover:opacity-60 transition-opacity p-1 sm:p-2 "
        >
          <CodeSquareIcon className="size-6 sm:size-8 text-green-600" />
          <span className=" text-white  bg-clip-text  text-bold">
          Vinterview
          </span>
          <CodeSquareIcon className="size-6  sm:size-8 text-green-600" />
        </Link>
        {/* RIGHT SIDE - ACTIONS */}
        <SignedIn>
          <div className="flex items-center gap-x-2 sm:space-x-4 sm:ml-auto ">
            <DashboardBtn />
            <ModeToggle />
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </nav>
  );
}
export default Navbar;