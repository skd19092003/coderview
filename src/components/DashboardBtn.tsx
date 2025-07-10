"use client"

import Link from "next/link";

import { SparklesIcon } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole"
import { Button } from '@/components/ui/button';

function DashboardBtn() {
  
  const {isCandidate, isInterviewer, isLoading} = useUserRole();
  //this will be fetched from convex so hooks is implemented 
  if(isCandidate || isLoading) return null;
  return (
    <Link href="/dashboard">
      <Button className="gap-2 font-medium" size="sm">
        <SparklesIcon className="size-4" />
        Dashboard
      </Button>
    </Link>
  );
}

export default DashboardBtn