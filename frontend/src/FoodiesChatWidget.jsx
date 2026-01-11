import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import MarkdownMessage from './MarkdownMessage';
import { cleanMessageText } from './utils/textUtils';
import { formatMenuText, isMenuFormat } from './utils/formatMenuText.jsx';
import QuickReplyActions from './components/QuickReplyActions';

const FoodiesChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! Welcome to Foodies. I am your virtual assistant, here to help you navigate our menu and store services. How may I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      options: [
        { label: '📍 Find Location', value: 'Where are you located?' },
        { label: '🕒 Opening Hours', value: 'What are your opening hours?' },
        { label: '📜 View Full Menu', value: 'Show me the full menu' }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle quick reply button click
  const handleQuickReply = (value) => {
    handleSubmit(null, value);
  };

  const handleSubmit = async (e, messageText = null) => {
    if (e) e.preventDefault();
    
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!messageText) setInput('');
    setIsLoading(true);

    try {
      // Convert messages to backend format (role + content)
      const conversationHistory = messages
        .filter(msg => msg.sender !== 'bot' || msg.id !== 1) // Exclude welcome message
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));

      // Add current user message
      conversationHistory.push({
        role: 'user',
        content: textToSend
      });

      const response = await fetch('https://foodies-chatbot.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: conversationHistory
        }),
        signal: AbortSignal.timeout(60000) // 60 second timeout for cold starts on Render
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Clean the response text to remove citation annotations
      const cleanedText = cleanMessageText(data.response || data.message || 'Sorry, I couldn\'t process that.');

      const botMessage = {
        id: Date.now() + 1,
        text: cleanedText,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: error.name === 'TimeoutError' 
          ? 'The server is waking up (this happens on free hosting). Please try again in a moment! 😊'
          : 'Oops! Something went wrong. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="mb-4 w-[450px] h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header - Dark with Yellow FOODIES text */}
            <div className="bg-gray-900 p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-2xl font-bold text-gray-900">F</span>
                  </div>
                  <div>
                    <h3 className="text-yellow-400 font-bold text-xl tracking-wide">FOODIES</h3>
                    <p className="text-gray-400 text-sm">Virtual Customer Support</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-yellow-400 hover:bg-gray-800 rounded-full p-2 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Messages - Clean warm grey background */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F9FAFB]">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-2 flex-shrink-0 shadow-md">
                      <span className="text-gray-900 font-bold text-sm">F</span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <div
                      className={`${message.sender === 'user' ? 'max-w-[75%]' : 'max-w-[90%]'} px-5 py-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-[#FFCC66] text-[#111827] shadow-md rounded-br-sm'
                          : 'bg-white text-gray-700 shadow-sm rounded-bl-sm'
                      }`}
                    >
                      {message.sender === 'bot' ? (
                        <div className="text-sm md:text-base leading-snug">
                          <MarkdownMessage content={message.text} />
                        </div>
                      ) : (
                        <p className="text-sm md:text-base leading-snug font-medium">{message.text}</p>
                      )}
                    </div>
                    
                    {/* Quick Reply Buttons */}
                    {message.sender === 'bot' && message.options && (
                      <QuickReplyActions 
                        options={message.options} 
                        onSelect={handleQuickReply}
                      />
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-2 flex-shrink-0 shadow-md">
                    <span className="text-gray-900 font-bold text-sm">F</span>
                  </div>
                  <div className="bg-white px-5 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                    <div className="flex space-x-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-yellow-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-yellow-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-yellow-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input - Large rounded field with yellow send button */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-6 py-4 text-base rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFCC66] focus:border-transparent transition-all placeholder:text-gray-400"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-[#FFCC66] text-[#111827] p-4 rounded-full hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-bold"
                >
                  <Send size={22} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button - Yellow with black icon */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#FFCC66] text-[#111827] p-4 rounded-full shadow-2xl hover:shadow-yellow-400/50 transition-all hover:bg-yellow-500"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        animate={!isOpen ? { y: [0, -10, 0] } : {}}
        transition={!isOpen ? { duration: 2, repeat: Infinity, repeatDelay: 3 } : {}}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>
    </div>
  );
};

export default FoodiesChatWidget;
