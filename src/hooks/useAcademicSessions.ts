import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { archiveAcademicSession, createAcademicSession, getAcademicSessions } from "@/lib/academic-session";

export function useAcademicSessions() { return useQuery({ queryKey: ["academic-sessions"], queryFn: getAcademicSessions }); }
export function useCreateAcademicSession() { const client = useQueryClient(); return useMutation({ mutationFn: createAcademicSession, onSuccess: () => client.invalidateQueries({ queryKey: ["academic-sessions"] }) }); }
export function useArchiveAcademicSession() { const client = useQueryClient(); return useMutation({ mutationFn: archiveAcademicSession, onSuccess: () => client.invalidateQueries({ queryKey: ["academic-sessions"] }) }); }
