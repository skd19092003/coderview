
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
 
export default function Home() {
  return (
  
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-foreground mb-8">
            Welcome to Coderview
          </h1>
          
          <SignedOut>
            <div className="space-x-4">
              <SignInButton>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button className="bg-[#6c47ff] text-white hover:bg-[#5a3fd8]">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>
          
          <SignedIn>
            <div className="space-y-4">
              <p className="text-foreground text-lg">
                You're signed in! Start your interview journey.
              </p>
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </div>
   
  );
}
