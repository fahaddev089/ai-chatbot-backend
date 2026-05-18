import { useEffect, useRef } from "react";
import type { Conversation, Message } from "../types";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";

interface Props {
  conversation?: Conversation;
  messages: Message[];
  onSend: (text: string, image?: File) => void;
  onPromptClick: (text: string) => void;
  loading: boolean;
  onToggleSidebar: () => void;
}

export default function ChatWindow({ conversation, messages, onSend, onPromptClick, loading, onToggleSidebar }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <main className="chat-main">
      {/* Topbar */}
      <header className="topbar">
        <button className="topbar-menu" onClick={onToggleSidebar}>☰</button>
        <div className="topbar-info">
          <div className="topbar-title">{conversation?.title || "AI Chatbot - Laravel React PostgreSQL"}</div>
          <div className="topbar-sub">Laravel API · React UI · PostgreSQL storage</div>
        </div>
        <div className="topbar-badge">● Live</div>
      </header>

      {/* Messages */}
      <div className="messages-area">
        {messages.length === 0 && !loading ? (
          <EmptyState onPromptClick={onPromptClick} disabled={loading} />
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {loading && <TypingIndicator />}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <InputBar onSend={onSend} loading={loading} hasConversation={!!conversation} />
    </main>
  );
}

interface EmptyStateProps {
  onPromptClick: (text: string) => void;
  disabled: boolean;
}

function EmptyState({ onPromptClick, disabled }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-orb">◆</div>
      <h1 className="empty-title">AI Chatbot - Laravel React PostgreSQL</h1>
      <p className="empty-sub">Start a conversation with text, code, or images.</p>
      <div className="chips">
        {["Explain machine learning", "Write a React component", "Analyze an image", "Debug my code"].map((s) => (
          <button key={s} className="chip" onClick={() => onPromptClick(s)} disabled={disabled}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="message assistant">
      <div className="avatar ai-avatar">◆</div>
      <div className="bubble ai-bubble typing-bubble">
        <span className="dot" /><span className="dot" /><span className="dot" />
      </div>
    </div>
  );
}
