import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sessionApi } from "../api/sessions";

export const useCreateSession = () => {
  const result = useMutation({
    mutationKey: ["createSession"],
    mutationFn: sessionApi.createSession,
    onSuccess: () => toast.success("Session created successfully!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to create room"),
  });

  return result;
};

export const useActiveSessions = (userId) => {
  const result = useQuery({
    queryKey: ["activeSessions", userId],
    queryFn: sessionApi.getActiveSessions,
    enabled: !!userId,
  });

  return result;
};

export const useMyRecentSessions = (userId) => {
  const result = useQuery({
    queryKey: ["myRecentSessions", userId],
    queryFn: sessionApi.getMyRecentSessions,
    enabled: !!userId,
  });

  return result;
};

export const useSessionById = (id, userId) => {
  const result = useQuery({
    queryKey: ["session", id, userId],
    queryFn: () => sessionApi.getSessionById(id),
    enabled: !!id && !!userId,
    refetchInterval: 5000, // refetch every 5 seconds to detect session status changes
  });

  return result;
};

export const useJoinSession = () => {
  const result = useMutation({
    mutationKey: ["joinSession"],
    mutationFn: sessionApi.joinSession,
    onSuccess: () => toast.success("Joined session successfully!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to join session"),
  });

  return result;
};

export const useEndSession = () => {
  const result = useMutation({
    mutationKey: ["endSession"],
    mutationFn: sessionApi.endSession,
    onSuccess: () => toast.success("Session ended successfully!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to end session"),
  });

  return result;
};
