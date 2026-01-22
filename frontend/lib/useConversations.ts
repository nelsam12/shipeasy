import { useQuery } from "@tanstack/react-query";
import { chatService } from "@/services/chat.service";

/**
 * Hook to fetch all conversations for current user
 */
export const useConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: () => chatService.getConversations(),
    refetchInterval: 5000, // Refetch every 5 seconds for updates
  });
};
