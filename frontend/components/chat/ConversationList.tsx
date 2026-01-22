"use client";

import { Conversation } from "@/types/chat.types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: number;
  onSelect: (conversation: Conversation) => void;
  currentUserId: number;
  users?: Map<number, { fullName: string; email: string }>;
}

export const ConversationList = ({
  conversations,
  selectedId,
  onSelect,
  currentUserId,
  users,
}: ConversationListProps) => {
  const getOtherUserId = (conversation: Conversation) => {
    return conversation.clientId === currentUserId
      ? conversation.gpId
      : conversation.clientId;
  };

  const getUserName = (userId: number) => {
    return users?.get(userId)?.fullName || `Utilisateur ${userId}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-muted-foreground">
        <p>Aucune conversation</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      {conversations.map((conversation) => {
        const otherUserId = getOtherUserId(conversation);
        const userName = getUserName(otherUserId);
        const isSelected = conversation.id === selectedId;

        return (
          <Card
            key={conversation.id}
            className={cn(
              "p-3 cursor-pointer hover:bg-accent transition-colors",
              isSelected && "bg-accent border-primary"
            )}
            onClick={() => onSelect(conversation)}
          >
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarFallback>{getInitials(userName)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium truncate">{userName}</p>
                  {conversation.dernierMessageDate && (
                    <span className="text-xs text-muted-foreground">
                      {format(
                        new Date(conversation.dernierMessageDate),
                        "HH:mm",
                        { locale: fr }
                      )}
                    </span>
                  )}
                </div>

                {conversation.dernierMessage && (
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {conversation.dernierMessage}
                  </p>
                )}
              </div>

              {conversation.unreadCount && conversation.unreadCount > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {conversation.unreadCount}
                </Badge>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
