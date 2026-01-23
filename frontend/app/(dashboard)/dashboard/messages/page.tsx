"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useConversations } from "@/lib/useConversations";
import { useMessages } from "@/lib/useMessages";
import { useSendMessage } from "@/lib/useSendMessage";
import { useSocket } from "@/lib/useSocket";
import { useAuth } from "@/hooks/useAuth";
import { ConversationList } from "@/components/chat/ConversationList";
import { MessageThread } from "@/components/chat/MessageThread";
import { MessageInput } from "@/components/chat/MessageInput";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { socketService } from "@/services/socket.service";
import type { Conversation } from "@/types/chat.types";
import { chatService } from "@/services/chat.service";

export default function MessagesPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [showMobileList, setShowMobileList] = useState(true);

  // Initialize socket
  useSocket();

  // Fetch conversations
  const { data: conversationsData, isLoading: loadingConversations } = useConversations();
  
  // Ensure conversations is always an array
  const conversations = Array.isArray(conversationsData) ? conversationsData : [];

  // Fetch messages for selected conversation
  const { data: messages, isLoading: loadingMessages } = useMessages(selectedConversationId);

  // Send message mutation
  const sendMessageMutation = useSendMessage();

  // Handle conversation from URL parameter
  useEffect(() => {
    const conversationIdFromUrl = searchParams.get('conversation');
    if (conversationIdFromUrl) {
      setSelectedConversationId(Number(conversationIdFromUrl));
      setShowMobileList(false);
    }
  }, [searchParams]);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversationId && user) {
      chatService.markAsRead(selectedConversationId);
      if (socketService.isConnected()) {
        socketService.markAsRead(selectedConversationId);
      }
    }
  }, [selectedConversationId, user]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversationId(conversation.id);
    setShowMobileList(false);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversationId) return;
    
    sendMessageMutation.mutate({
      conversationId: selectedConversationId,
      content,
    });
  };

  const handleBack = () => {
    setShowMobileList(true);
    setSelectedConversationId(null);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid md:grid-cols-[350px_1fr] gap-4">
          {/* Conversations List - Mobile: conditional, Desktop: always visible */}
          <Card
            className={`${
              showMobileList ? "block" : "hidden"
            } md:block flex flex-col h-full`}
          >
            <div className="border-b p-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversations
              </h2>
            </div>
            <div className="flex-1 overflow-auto">
              {loadingConversations ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              ) : (
                <ConversationList
                  conversations={conversations}
                  selectedId={selectedConversationId || undefined}
                  onSelect={handleSelectConversation}
                  currentUserId={user.id}
                />
              )}
            </div>
          </Card>

          {/* Message Thread - Mobile: conditional, Desktop: always visible */}
          <Card
            className={`${
              !showMobileList ? "flex" : "hidden"
            } md:flex flex-col h-full`}
          >
            {selectedConversationId ? (
              <>
                {/* Mobile back button */}
                <div className="md:hidden border-b p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Retour
                  </Button>
                </div>

                {/* Messages */}
                <MessageThread
                  messages={messages || []}
                  currentUserId={user.id}
                  isLoading={loadingMessages}
                />

                {/* Input */}
                <MessageInput
                  onSend={handleSendMessage}
                  isLoading={sendMessageMutation.isPending}
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez une conversation</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
