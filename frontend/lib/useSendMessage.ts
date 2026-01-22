import { useMutation, useQueryClient } from "@tanstack/react-query";
import { socketService } from "@/services/socket.service";
import { chatService } from "@/services/chat.service";
import { PieceJointe } from "@/types/chat.types";

interface SendMessageParams {
  conversationId: number;
  content: string;
  piecesJointes?: PieceJointe[];
}

/**
 * Hook to send a message (via socket or REST fallback)
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, content, piecesJointes }: SendMessageParams) => {
      // Try socket first
      if (socketService.isConnected()) {
        socketService.sendMessage(conversationId, content, piecesJointes);
        // Return success immediately (socket will emit the response)
        return { success: true };
      }

      // Fallback to REST
      return chatService.sendMessage(conversationId, content, piecesJointes);
    },
    onSuccess: (_, variables) => {
      // Invalidate messages and conversations queries
      queryClient.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};
