import React, { useRef, useEffect } from "react";
import { Message } from "../../types";
import styles from "./ChatView.module.css";

interface ChatViewProps {
  messages: Message[];
  isStreaming: boolean;
  typingIndicator?: string;
  onFeedback?: (messageId: string, type: "helpful" | "unclear" | "reformulate") => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  isStreaming,
  typingIndicator,
  onFeedback,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  return (
    <div className={styles.chatContainer}>
      {messages.map((msg, idx) => (
        <div
          key={msg.id || idx}
          className={`${styles.message} ${msg.role === "user" ? styles.user : styles.assistant}`}
        >
          <div className={styles.bubble}>
            <div className={styles.content}>{msg.content}</div>
            {onFeedback && msg.role === "assistant" && (
              <div className={styles.feedback}>
                <button onClick={() => onFeedback(msg.id, "helpful")}>👍</button>
                <button onClick={() => onFeedback(msg.id, "unclear")}>🤨</button>
                <button onClick={() => onFeedback(msg.id, "reformulate")}>🔁</button>
              </div>
            )}
          </div>
        </div>
      ))}
      {isStreaming && (
        <div className={`${styles.message} ${styles.assistant} ${styles.typing}`}>
          <span className={styles.typingIndicator}>
            {typingIndicator || "…"}
          </span>
        </div>
      )}
      <div ref={bottomRef}></div>
    </div>
  );
};

export default ChatView;
