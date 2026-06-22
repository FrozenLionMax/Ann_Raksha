import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Sparkles, Loader, Bot, User } from 'lucide-react';

/**
 * #17 - AI Chatbot Assistant
 * A floating chat widget that helps users with common questions
 */

const QUICK_REPLIES = [
  'How do I donate food?',
  'How does matching work?',
  'What food can I donate?',
  'How are impact points calculated?',
  'Is my data secure?',
];

const RESPONSES = {
  'how do i donate food?': 'Easy! Go to **Create Donation** from your dashboard. Fill in the food type, quantity, pickup address, and expiry time. Once posted, nearby NGOs will be notified instantly. The whole process takes under 2 minutes! 🍽️',
  'how does matching work?': 'When you post a donation, all nearby NGOs get a **real-time notification**. They can view details and claim it instantly. Once claimed, you\'ll be notified and can coordinate pickup. The system uses WebSocket for zero-delay alerts! ⚡',
  'what food can i donate?': 'You can donate: **Cooked meals, raw ingredients, packaged food, bakery items, beverages, fruits, vegetables, dairy products**, and more. The food should be safe for consumption and within its expiry window. We have food safety checks built in! ✅',
  'how are impact points calculated?': 'Points = **Quantity (kg) × 10 × Urgency Multiplier** (2x for urgent). You also earn:\n- 🍽️ Meals Provided = servings per donation\n- 🌿 CO₂ Saved = quantity × 2.5 kg\n- 💧 Water Saved = quantity × 1000 liters\n\nClimb the leaderboard and unlock badges! 🏆',
  'is my data secure?': 'Yes! We use **JWT token authentication**, bcrypt password hashing, and role-based access controls. Your personal data is never shared publicly. Only your name and role appear on the leaderboard. 🔒',
};

function getResponse(message) {
  const lower = message.toLowerCase().trim();
  for (const [key, val] of Object.entries(RESPONSES)) {
    if (lower.includes(key.split(' ').slice(0, 3).join(' ')) || lower === key) return val;
  }

  // Fuzzy matching
  if (lower.includes('donate') || lower.includes('food') && lower.includes('how')) return RESPONSES['how do i donate food?'];
  if (lower.includes('match') || lower.includes('claim')) return RESPONSES['how does matching work?'];
  if (lower.includes('point') || lower.includes('score') || lower.includes('impact')) return RESPONSES['how are impact points calculated?'];
  if (lower.includes('secure') || lower.includes('safe') || lower.includes('privacy')) return RESPONSES['is my data secure?'];
  if (lower.includes('what') && lower.includes('donate')) return RESPONSES['what food can i donate?'];
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return 'Hello! 👋 I\'m the Ann Raksha AI assistant. How can I help you today? You can ask me about donating food, how matching works, impact points, and more!';
  if (lower.includes('thank')) return 'You\'re welcome! Happy to help. Keep saving meals! 🌱';

  return 'I\'m not sure about that, but you can explore the **Dashboard** for an overview, **Browse Donations** to find food, or **Create Donation** to post surplus food. Feel free to ask me anything else! 😊';
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hey! 👋 I\'m the Ann Raksha assistant. How can I help you today?', time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user', text: text.trim(), time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = getResponse(text);
      setMessages(prev => [...prev, { role: 'bot', text: response, time: new Date() }]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all ${
          open
            ? 'bg-slate-800 rotate-0'
            : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-emerald-500/30'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {open ? <X className="w-5 h-5 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[520px] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Ann Raksha AI</h3>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Always online
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: '340px' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-500 text-white rounded-br-md'
                      : 'bg-white/5 text-slate-300 border border-white/5 rounded-bl-md'
                  }`}>
                    {msg.text.split('**').map((part, j) =>
                      j % 2 === 1 ? <strong key={j} className="text-white">{part}</strong> : part
                    )}
                  </div>
                </motion.div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_REPLIES.map((q, i) => (
                    <button key={i} onClick={() => sendMessage(q)}
                      className="px-3 py-1.5 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-white/5">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
                <button type="submit" disabled={!input.trim()}
                  className="p-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-30 disabled:hover:bg-emerald-500 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
