import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MessageSquare, Send, ArrowLeft, ArrowRight, CheckCheck, User, Phone } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { MOCK_CONVERSATIONS, Conversation } from "../../data/mockData";

export const ScreenMessages: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { language, user } = useApp();
  const isAr = language === "ar";

  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>(id || MOCK_CONVERSATIONS[0].id);
  const [messageInput, setMessageInput] = useState("");

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      senderId: "user-amine",
      text: messageInput.trim(),
      time: "À l'instant",
      isMine: true,
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              lastMessage: newMsg.text,
              lastMessageTime: "À l'instant",
              messages: [...c.messages, newMsg],
            }
          : c
      )
    );

    setMessageInput("");
  };

  return (
    <div className="flex-1 flex flex-col bg-gasra-bg min-h-full pb-20 p-4 text-gasra-text">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gasra-surface-border">
        <div>
          <h2 className="text-base font-bold text-gasra-text flex items-center gap-2">
            <MessageSquare size={18} className="text-[#3D5AFE] dark:text-[#6F86FF]" />
            <span>{isAr ? "الرسائل الخاصة" : "Messagerie de Quartier"}</span>
          </h2>
          <p className="text-[11px] text-gasra-text-muted">
            {isAr ? "تواصل مباشر مع جيرانك وأصحاب المحلات" : "Échanges directs avec voisins et commerces"}
          </p>
        </div>
      </div>

      {/* Main 2-column or list/chat responsive view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left column: Conversations list */}
        <div className="lg:col-span-5 space-y-2">
          {conversations.map((conv) => {
            const isSelected = conv.id === activeConvId;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-gasra-surface border-[#3D5AFE] ring-1 ring-[#3D5AFE]/30"
                    : "bg-gasra-surface border-gasra-surface-border hover:bg-gasra-surface-subtle"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl btn-gasra-primary flex items-center justify-center font-bold text-xs shrink-0">
                    {conv.participantAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-bold text-xs text-gasra-text truncate">
                        {conv.participantName}
                      </h4>
                      <span className="text-[10px] text-gasra-text-muted font-mono">
                        {conv.lastMessageTime}
                      </span>
                    </div>
                    <p className="text-[11px] text-gasra-text-secondary truncate">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: Active Chat Conversation */}
        <div className="lg:col-span-7 flex flex-col justify-between p-4 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs min-h-[420px]">
          {/* Chat Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gasra-surface-border">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl btn-gasra-primary flex items-center justify-center font-bold text-xs">
                {activeConv.participantAvatar}
              </div>
              <div>
                <h3 className="font-bold text-xs text-gasra-text">
                  {activeConv.participantName}
                </h3>
                <span className="text-[10px] text-gasra-text-muted">
                  {activeConv.participantRole}
                </span>
              </div>
            </div>

            <button className="p-2 rounded-xl bg-gasra-surface-subtle text-gasra-text-secondary">
              <Phone size={14} />
            </button>
          </div>

          {/* Messages History */}
          <div className="flex-1 py-4 space-y-3 overflow-y-auto">
            {activeConv.messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.isMine ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.isMine
                      ? "btn-gasra-primary rounded-br-xs"
                      : "bg-gasra-surface-subtle text-gasra-text rounded-bl-xs border border-gasra-surface-border"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] font-mono text-gasra-text-muted mt-1 px-1 flex items-center gap-1">
                  <span>{m.time}</span>
                  {m.isMine && <CheckCheck size={11} className="text-[#3D5AFE]" />}
                </span>
              </div>
            ))}
          </div>

          {/* Chat Message Input */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-3 border-t border-gasra-surface-border">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={isAr ? "اكتب رسالة..." : "Écrire un message..."}
              className="flex-1 p-2.5 rounded-xl border border-gasra-surface-border bg-gasra-bg text-xs text-gasra-text outline-none focus:border-[#3D5AFE]"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl btn-gasra-primary shadow-xs hover:opacity-90 transition-opacity"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
