import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, Image as ImageIcon, Info, ArrowLeft, MessageCircle } from 'lucide-react';
import styles from './Chat.module.css';

// Mock chat data
const initialConversations = [
  {
    id: "Priya S.",
    avatar: "https://i.pravatar.cc/150?u=priya",
    lastMessage: "I could do 1000 for the chair.",
    time: "2h ago",
    unread: true,
    messages: [
      { sender: "Priya S.", text: "Hi! Is the chair still available?", time: "2:00 PM" },
      { sender: "me", text: "Yes it is! You can pick it up today.", time: "2:15 PM" },
      { sender: "Priya S.", text: "I could do 1000 for the chair.", time: "3:00 PM" },
    ]
  },
  {
    id: "Ananya M.",
    avatar: "https://i.pravatar.cc/150?u=ananya",
    lastMessage: "Thanks, I'll be there at 5.",
    time: "Yesterday",
    unread: false,
    messages: [
      { sender: "me", text: "Here's the address: 123 Main St.", time: "4:00 PM" },
      { sender: "Ananya M.", text: "Thanks, I'll be there at 5.", time: "4:05 PM" }
    ]
  }
];

export default function Chat() {
  const { targetId } = useParams();
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConvId, setActiveConvId] = useState(targetId || null);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    if (targetId) {
      // If we route to a specific target and they aren't in our list, mock a new conversation
      if (!conversations.find(c => c.id === targetId)) {
        const newConv = {
          id: targetId,
          avatar: `https://i.pravatar.cc/150?u=${targetId}`,
          lastMessage: "",
          time: "Just now",
          unread: false,
          messages: []
        };
        setConversations(prev => [newConv, ...prev]);
      }
      setActiveConvId(targetId);
    } else if (conversations.length > 0 && window.innerWidth > 768) {
      // On desktop, auto-select first conversation if none specified
      setActiveConvId(conversations[0].id);
    }
  }, [targetId]);

  const activeConv = conversations.find(c => c.id === activeConvId);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    
    const newMsg = { sender: "me", text: inputText, time: "Just now" };
    
    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return { ...c, lastMessage: inputText, messages: [...c.messages, newMsg], unread: false };
      }
      return c;
    }));
    setInputText("");
  };

  const markRead = (id) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: false } : c));
  };

  return (
    <div className={`page-wrapper ${styles.container}`}>
      <div className={styles.chatLayout}>
        
        {/* Left Pane: Inbox List */}
        <div className={`${styles.inboxPane} ${activeConvId ? styles.hiddenOnMobile : ''}`}>
          <div className={styles.inboxHeader}>
            <h1>Messages</h1>
          </div>
          <div className={styles.convList}>
            {conversations.map(conv => (
              <button 
                key={conv.id} 
                className={`${styles.convItem} ${activeConvId === conv.id ? styles.activeConv : ''} ${conv.unread ? styles.unreadConv : ''}`}
                onClick={() => {
                  setActiveConvId(conv.id);
                  markRead(conv.id);
                }}
              >
                <img src={conv.avatar} alt={conv.id} className={styles.convAvatar} />
                <div className={styles.convMeta}>
                  <div className={styles.convTop}>
                    <span className={styles.convName}>{conv.id}</span>
                    <span className={styles.convTime}>{conv.time}</span>
                  </div>
                  <div className={styles.convBottom}>
                    <span className={styles.convLastMsg}>{conv.lastMessage || "Start a conversation..."}</span>
                    {conv.unread && <span className={styles.unreadDot}></span>}
                  </div>
                </div>
              </button>
            ))}
            {conversations.length === 0 && (
              <div className={styles.emptyInbox}>No messages yet.</div>
            )}
          </div>
        </div>

        {/* Right Pane: Active Chat */}
        <div className={`${styles.chatPane} ${!activeConvId ? styles.hiddenOnMobile : ''}`}>
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className={styles.chatHeader}>
                <div className={styles.chatHeaderLeft}>
                  <button className={styles.backBtn} onClick={() => setActiveConvId(null)}>
                    <ArrowLeft size={20} />
                  </button>
                  <img src={activeConv.avatar} alt={activeConv.id} className={styles.chatHeaderAvatar} />
                  <Link to={`/profile/${encodeURIComponent(activeConv.id)}`} className={styles.chatHeaderName}>
                    {activeConv.id}
                  </Link>
                </div>
                <button className={styles.infoBtn}><Info size={20} /></button>
              </div>

              {/* Chat Messages */}
              <div className={styles.chatHistory}>
                {activeConv.messages.length === 0 && (
                  <div className={styles.emptyChat}>
                    <p>This is the beginning of your conversation with {activeConv.id}.</p>
                  </div>
                )}
                {activeConv.messages.map((m, idx) => {
                  const isMe = m.sender === "me";
                  return (
                    <div key={idx} className={`${styles.messageWrapper} ${isMe ? styles.sentWrapper : styles.receivedWrapper}`}>
                      {!isMe && <img src={activeConv.avatar} className={styles.msgAvatar} alt="sender" />}
                      <div className={`${styles.messageBubble} ${isMe ? styles.sent : styles.received}`}>
                        <div className={styles.messageText}>{m.text}</div>
                        <div className={styles.messageTime}>{m.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <form className={styles.chatInputArea} onSubmit={handleSend}>
                <button type="button" className={styles.attachBtn}><ImageIcon size={20} /></button>
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className={styles.messageInput} 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button type="submit" className={styles.sendBtn} disabled={!inputText.trim()}>
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className={styles.noActiveChat}>
              <MessageCircle size={48} className={styles.ghostIcon} />
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
