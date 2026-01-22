"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types/chat.types";
import { MessageBubble } from "./MessageBubble";
import { Loader2 } from "lucide-react";

interface MessageThreadProps {
  messages: Message[];
  currentUserId: number;
  isLoading?: boolean;
}

export const MessageThread = ({
  messages,
  currentUserId,
  isLoading,
}: MessageThreadProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>Aucun message. Commencez la conversation !</p>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwn={message.senderId === currentUserId}
        />
      ))}
    </div>
  );
};
