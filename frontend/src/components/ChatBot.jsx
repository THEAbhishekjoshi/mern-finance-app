import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import axios from 'axios';

export default function GeminiChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [close, setClose] = useState(true); // this controls show/hide
  //const [history, setHistory] = useState([])

  useEffect(() => {
    setMessages([{ from: 'gemini', text: "Hello, How can I help you in Finance?" }]);
  }, []);
  
  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);
      const formattedHistory = messages.map((msg) => ({
        role: msg.from === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/geminiapi`, {
        contents: input,
        formattedHistory
      });

      setMessages((prev) => [...prev, { from: 'user', text: input }]);
      setInput('');

      setTimeout(() => {
        setMessages((prev) => [...prev, { from: 'gemini', text: response.data.message }]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.log("Error encountered:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (close) {
    // Floating Bubble 
    return (
      <div
        onClick={() => setClose(false)}
        className="fixed bottom-4 right-4 w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-gray-700"
      >
        <BsRobot className="text-blue-600 text-2xl" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-[500px] bg-gray-800 text-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <BsRobot className="text-blue-600" />
          Finance Bro
        </div>
        <button onClick={() => setClose(true)} className="text-white hover:text-red-400">
          <IoClose size={22} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[75%] px-4 py-2 rounded-xl text-sm ${msg.from === 'user' ? 'ml-auto bg-blue-600' : 'mr-auto bg-gray-700'
              }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2 max-w-[80%]">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                🤖
              </div>
              <div className="rounded-2xl px-4 py-2 text-sm bg-gray-700 text-white animate-pulse">
                Gemini is typing...
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input */}
      <div className="p-2 bg-gray-900 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 px-3 py-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white"
        >
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
}
