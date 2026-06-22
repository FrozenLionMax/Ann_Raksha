import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Send, Loader, MessageCircle } from 'lucide-react';

const API = 'http://localhost:5000/api/chat';
const getAuth = () => ({ headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}` } });

export default function Chat({ donationId, otherUserId, otherUserName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const myId = JSON.parse(localStorage.getItem('userInfo'))?._id;

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [donationId, otherUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API}/messages/${donationId}/${otherUserId}`, getAuth());
      setMessages(res.data);
    } catch {} finally { setLoading(false); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    try {
      const res = await axios.post(`${API}/send`, { donationId, receiverId: otherUserId, text: input.trim() }, getAuth());
      setMessages(prev => [...prev, res.data]);
      setInput('');
    } catch (err) {
      toast.error('Failed to send message');
    } finally { setSending(false); }
  };

  const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col h-[400px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="w-6 h-6 text-emerald-400 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="w-10 h-10 text-slate-600 mb-3" />
            <p className="text-slate-400 text-sm font-semibold">No messages yet</p>
            <p className="text-slate-500 text-xs mt-1">Start a conversation about this donation</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMine = msg.sender?._id === myId || msg.sender === myId;
            return (
              <motion.div key={msg._id || i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  isMine
                    ? 'bg-emerald-500 text-white rounded-br-md'
                    : 'bg-white/5 text-slate-300 border border-white/5 rounded-bl-md'
                }`}>
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${isMine ? 'text-emerald-200' : 'text-slate-600'}`}>
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-white/5 flex items-center gap-2">
        <input
          type="text" value={input} onChange={e => setInput(e.target.value)}
          placeholder={`Message ${otherUserName || 'user'}...`}
          className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
        />
        <button type="submit" disabled={!input.trim() || sending}
          className="p-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-30 transition-all"
        >
          {sending ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
