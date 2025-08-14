"use client";

import { use, useEffect, useState } from "react";

export default function MessagesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (use(searchParams ?? Promise.resolve({})) as {
    listingId?: string;
    userAId?: string;
    userBId?: string;
    me?: string;
  }) ?? {};
  const { listingId, userAId, userBId, me } = params;
  const [conversation, setConversation] = useState<any>(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!listingId || !userAId || !userBId) return;
    fetch(`/api/conversations?listingId=${listingId}&userAId=${userAId}&userBId=${userBId}`)
      .then((r) => r.json())
      .then((c) => setConversation(c));
  }, [listingId, userAId, userBId]);

  async function ensureConversation() {
    if (conversation) return conversation;
    const res = await fetch(`/api/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, userAId, userBId }),
    });
    const c = await res.json();
    setConversation(c);
    return c;
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const c = await ensureConversation();
    await fetch(`/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: c.id, senderId: me!, content }),
    });
    setContent("");
    const updated = await fetch(`/api/conversations?listingId=${listingId}&userAId=${userAId}&userBId=${userBId}`).then((r) => r.json());
    setConversation(updated);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Messages</h2>
      {!listingId && <div className="text-white/70">Select a listing to start a conversation.</div>}
      {conversation && (
        <div className="space-y-2 mb-4">
          {conversation.messages?.map((m: any) => (
            <div key={m.id} className="rounded border border-white/10 px-3 py-2">
              <div className="text-xs text-white/60">{m.senderId}</div>
              <div>{m.content}</div>
            </div>
          ))}
        </div>
      )}
      {me && (
        <form className="flex gap-2" onSubmit={sendMessage}>
          <input value={content} onChange={(e) => setContent(e.target.value)} className="flex-1 bg-transparent border border-white/20 rounded px-3 py-2" placeholder="Type a message..." />
          <button className="rounded border border-white/30 px-3 py-2 hover:bg-white/10">Send</button>
        </form>
      )}
    </div>
  );
}


