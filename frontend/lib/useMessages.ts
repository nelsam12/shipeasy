import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { chatService } from "@/services/chat.service";
import { socketService } from "@/services/socket.service";
import { Message } from "@/types/chat.types";

/**
 * Hook to fetch messages for a conversation
 */
export const useMessages = (conversationId: number | null) => {
  const query = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () =>
      conversationId ? chatService.getMessages(conversationId) : Promise.resolve([]),
    enabled: !!conversationId,
  });

  // Real-time updates
  useEffect(() => {
    if (!conversationId) return;

    // Join conversation room
    socketService.joinConversation(conversationId);

    // Listen for new messages
    const handleNewMessage = (message: Message) => {
      if (message.conversationId === conversationId) {
        query.refetch();
      }
    };

    socketService.onMessageReceived(handleNewMessage);

    return () => {
      socketService.leaveConversation(conversationId);
      socketService.off("message-received", handleNewMessage);
    };
  }, [conversationId]);

  return query;
};
