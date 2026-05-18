const API_BASE = import.meta.env.VITE_API_URL || "/api";

export const api = {
  async getConversations() {
    const res = await fetch(`${API_BASE}/conversations`);
    if (!res.ok) throw new Error("Failed");
    return res.json();
  },

  async createConversation() {
    const res = await fetch(`${API_BASE}/conversations`, { method: "POST" });
    if (!res.ok) throw new Error("Failed");
    return res.json();
  },

  async getMessages(id: number) {
    const res = await fetch(`${API_BASE}/conversations/${id}/messages`);
    if (!res.ok) throw new Error("Failed");
    return res.json();
  },

  async sendMessage(id: number, message: string, image?: File) {
    const form = new FormData();
    form.append("message", message || "Analyze this image");
    if (image) form.append("image", image);
    const res = await fetch(`${API_BASE}/conversations/${id}/messages`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) throw new Error("Failed");
    return res.json();
  },
};
