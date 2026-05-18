import type { Message } from "../types";

interface Props { message: Message; }

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  const time = new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`message ${isUser ? "user" : "assistant"}`}>
      <div className={`avatar ${isUser ? "user-avatar" : "ai-avatar"}`}>
        {isUser ? "F" : "◆"}
      </div>
      <div className={`bubble ${isUser ? "user-bubble" : "ai-bubble"}`}>
        {message.image_path && (
          <img src={message.image_path} alt="uploaded" className="bubble-img" />
        )}
        {message.content && (
          <div
            className="bubble-text"
            dangerouslySetInnerHTML={{ __html: formatText(message.content) }}
          />
        )}
        <div className="bubble-time">{time}</div>
      </div>
    </div>
  );
}

function formatText(text: string): string {
  return text
    .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre class="code-block"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}
