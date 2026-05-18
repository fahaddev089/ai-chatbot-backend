import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import type { Conversation, Message } from "./types";
import { api } from "./api";

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeConvId && !loading) loadMessages(activeConvId);
  }, [activeConvId]);

  const loadConversations = async () => {
    try {
      const data = await api.getConversations();
      setConversations(data);
    } catch (e) {
      console.error("API not connected");
    }
  };

  const loadMessages = async (id: number) => {
    try {
      const data = await api.getMessages(id);
      setMessages(data.messages || []);
    } catch (e) {
      setMessages([]);
    }
  };

  const handleNewChat = async () => {
    try {
      const conv = await api.createConversation();
      setConversations((prev) => [conv, ...prev]);
      setActiveConvId(conv.id);
      setMessages([]);
    } catch (e) {
      alert("Cannot connect to Laravel API. Is php artisan serve running on port 8000?");
    }
  };

  const sendToConversation = async (
    conversationId: number,
    text: string,
    imageFile: File | undefined,
    isFirstMessage: boolean
  ) => {
    setLoading(true);

    if (isFirstMessage) {
      const title = text.trim().replace(/\s+/g, " ").slice(0, 70) || "Image conversation";
      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === conversationId ? { ...conversation, title } : conversation
        )
      );
    }

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: text,
      image_path: imageFile ? URL.createObjectURL(imageFile) : undefined,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const data = await api.sendMessage(conversationId, text, imageFile);
      if (data.conversation) {
        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.id === data.conversation.id ? data.conversation : conversation
          )
        );
      }
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.reply,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      const errMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Could not reach Laravel API. Make sure `php artisan serve` is running on port 8000.",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    }
    setLoading(false);
  };

  const handleSend = async (text: string, imageFile?: File) => {
    if (!activeConvId) return;
    await sendToConversation(activeConvId, text, imageFile, messages.length === 0);
  };

  const handlePromptClick = async (prompt: string) => {
    if (loading) return;

    try {
      const conversation = activeConvId
        ? conversations.find((item) => item.id === activeConvId)
        : await api.createConversation();

      if (!conversation) return;

      if (!activeConvId) {
        setConversations((prev) => [conversation, ...prev]);
        setActiveConvId(conversation.id);
        setMessages([]);
      }

      await sendToConversation(conversation.id, prompt, undefined, messages.length === 0);
    } catch (e) {
      alert("Cannot connect to Laravel API. Is php artisan serve running on port 8000?");
    }
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);

  return (
    <div className="app-root">
      <Sidebar
        conversations={conversations}
        activeId={activeConvId}
        onSelect={setActiveConvId}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <ChatWindow
        conversation={activeConv}
        messages={messages}
        onSend={handleSend}
        onPromptClick={handlePromptClick}
        loading={loading}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
    </div>
  );
}
