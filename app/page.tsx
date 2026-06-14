"use client";

import { useState } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "안녕하세요. 무엇을 도와드릴까요?" },
  ]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.answer ?? "답변이 없습니다." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "API 호출 중 오류가 발생했습니다." },
      ]);
    }
  };

  return (
    <main className="page">
      <section className="hero">
        <h1>Dummy Site</h1>
        <p>Vercel + GitHub + Next.js로 만든 샘플 홈페이지입니다.</p>
      </section>

      {isOpen && (
        <div className="chatWindow">
          <div className="chatHeader">
            <span>AI 챗봇</span>
            <button type="button" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          <div className="chatBody">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chatInputArea">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요"
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button type="button" onClick={sendMessage}>
              전송
            </button>
          </div>
        </div>
      )}

      <button type="button" className="chatButton" onClick={() => setIsOpen(true)}>
        💬
      </button>
    </main>
  );
}
