import { Message } from "@/types/chat.types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 max-w-[70%]",
        isOwn ? "ml-auto items-end" : "mr-auto items-start"
      )}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-2",
          isOwn
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>
        
        {message.piecesJointes && message.piecesJointes.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.piecesJointes.map((piece, idx) => (
              <a
                key={idx}
                href={piece.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline block"
              >
                📎 {piece.nom}
              </a>
            ))}
          </div>
        )}
      </div>

      <div className={cn("flex items-center gap-1 text-xs text-muted-foreground")}>
        <span>
          {format(new Date(message.dateEnvoi), "HH:mm")}
        </span>
        {isOwn && (
          <span>
            {message.estLu ? (
              <CheckCheck className="w-3 h-3 text-blue-500" />
            ) : (
              <Check className="w-3 h-3" />
            )}
          </span>
        )}
      </div>
    </div>
  );
};
