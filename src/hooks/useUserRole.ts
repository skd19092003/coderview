import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { is } from './../../.next/server/vendor-chunks/next';

export const useUserRole = () => {
    const {user} = useUser();
    const userData = useQuery(api.users.getUserByClerkId, {clerkId: user?.id || ""});
    const isLoading = userData === undefined;
   
    return {
        isLoading,
        isInterviewer: userData?.role === "recruiter",
        isCandidate: userData?.role === "candidate"
    }
};