import { useState, useRef } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";

interface Props {
  onSend: (text: string, image?: File) => void;
  loading: boolean;
  hasConversation: boolean;
}

export default function InputBar({ onSend, loading, hasConversation }: Props) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (loading || (!text.trim() && !image)) return;
    if (!hasConversation) {
      alert("Click '+ New Conversation' to start chatting!");
      return;
    }
    onSend(text.trim(), image || undefined);
    setText("");
    setImage(null);
    setImagePreview(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  };

  return (
    <div className="input-area">
      {imagePreview && (
        <div className="img-preview">
          <img src={imagePreview} alt="preview" />
          <button onClick={() => { setImage(null); setImagePreview(null); }}>×</button>
        </div>
      )}
      <div className="input-box">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => { setText(e.target.value); autoResize(); }}
          onKeyDown={handleKey}
          placeholder={hasConversation ? "Message AI Chatbot... (Enter to send)" : "Start a new conversation first →"}
          rows={1}
          disabled={loading}
        />
        <div className="input-actions">
          <button
            className="icon-btn"
            onClick={() => fileRef.current?.click()}
            title="Upload image"
            disabled={loading}
          >🖼</button>
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={loading || (!text.trim() && !image)}
          >
            {loading ? "..." : "↑"}
          </button>
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
      <div className="input-hint">Enter to send · Shift+Enter for new line · Image upload supported</div>
    </div>
  );
}
