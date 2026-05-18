import type { Conversation } from "../types";

interface Props {
  conversations: Conversation[];
  activeId: number | null;
  onSelect: (id: number) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ conversations, activeId, onSelect, onNewChat, isOpen }: Props) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">◆</span>
          <div>
            <div className="logo-name">AI Chatbot - Laravel React PostgreSQL</div>
            <div className="logo-sub">Laravel React PostgreSQL</div>
          </div>
        </div>
      </div>

      <button className="new-chat-btn" onClick={onNewChat}>
        <span>+</span> New Conversation
      </button>

      <div className="conv-section-label">Recent Chats</div>

      <div className="conv-list">
        {conversations.length === 0 && (
          <div className="conv-empty">No conversations yet</div>
        )}
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`conv-item ${conv.id === activeId ? "active" : ""}`}
            onClick={() => onSelect(conv.id)}
          >
            <span className="conv-icon">💬</span>
            <span className="conv-title">{conv.title}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="footer-badge">
          <span className="status-dot" />
          Laravel React PostgreSQL
        </div>
      </div>
    </aside>
  );
}
