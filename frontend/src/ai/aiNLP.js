export async function askAI(message) {
  // Fallback URL if VITE_API_URL isn't set (dev/prod safe)
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const res = await fetch(
    `${API_URL}/api/ai/chat-order`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "AI failed to chat");
  }
  
  return res.json();
}
