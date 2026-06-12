import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { MessageCircle, Send, Users, Clock, Star, X, Phone } from 'lucide-react';

const socket = io.connect('http://localhost:5000');

function Chat() {
  const navigate = useNavigate();
  const [step, setStep] = useState('select'); // select, waiting, chatting
  const [astrologers, setAstrologers] = useState([]);
  const [selectedAstrologer, setSelectedAstrologer] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userId] = useState(`user_${Date.now()}`);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAvailableAstrologers();

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  const loadAvailableAstrologers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/astrologers/available');
      const result = await response.json();
      if (result.success) {
        setAstrologers(result.data);
      }
    } catch (error) {
      console.error('Error loading astrologers:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectAstrologer = async (astrologer) => {
    setSelectedAstrologer(astrologer);
    setStep('waiting');

    try {
      const response = await fetch('http://localhost:5000/api/chat/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, astrologerId: astrologer.id })
      });
      const result = await response.json();
      
      if (result.success) {
        setChatId(result.data.chatId);
        socket.emit('join_chat', result.data.chatId);
        setStep('chatting');
        
        // Add welcome message
        const welcomeMessage = {
          sender: 'astrologer',
          text: `Hello! I'm ${astrologer.name}, your ${astrologer.specialization} expert. How can I help you today?`,
          timestamp: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
        
        // Save message to backend
        await fetch('http://localhost:5000/api/chat/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatId: result.data.chatId, message: welcomeMessage })
        });
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      setStep('select');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageData = {
      sender: 'user',
      text: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, messageData]);
    socket.emit('send_message', { chatId, ...messageData });
    
    // Save message to backend
    await fetch('http://localhost:5000/api/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message: messageData })
    });

    setInputMessage('');
  };

  const endChat = async () => {
    try {
      await fetch('http://localhost:5000/api/chat/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, astrologerId: selectedAstrologer.id })
      });
      navigate('/');
    } catch (error) {
      console.error('Error ending chat:', error);
    }
  };

  const simulateAstrologerResponse = () => {
    // Simulate astrologer response for demo
    const responses = [
      "Based on your birth details, I recommend wearing a Ruby to enhance your leadership qualities.",
      "Your zodiac sign suggests that Yellow Sapphire would bring you prosperity and wisdom.",
      "For your career growth, Blue Sapphire would be very beneficial according to your planetary positions.",
      "Pearl would help you find peace and emotional balance in your current situation.",
      "Emerald is excellent for improving communication and intelligence in your case."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    setTimeout(() => {
      const messageData = {
        sender: 'astrologer',
        text: randomResponse,
        timestamp: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, messageData]);
      socket.emit('send_message', { chatId, ...messageData });
      
      fetch('http://localhost:5000/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, message: messageData })
      });
    }, 1500);
  };

  useEffect(() => {
    if (step === 'chatting' && messages.length > 0 && messages[messages.length - 1].sender === 'user') {
      simulateAstrologerResponse();
    }
  }, [messages, step]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading astrologers...</p>
        </div>
      </div>
    );
  }

  if (step === 'select') {
    return (
      <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Consult with Expert Astrologers
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Connect with our experienced astrologers for personalized guidance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {astrologers.map((astrologer) => (
              <div key={astrologer.id} className="card hover:scale-105 transition-transform">
                <div className="flex flex-col items-center">
                  <img
                    src={astrologer.avatar}
                    alt={astrologer.name}
                    className="w-24 h-24 rounded-full mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {astrologer.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-gray-600 dark:text-gray-300">{astrologer.rating}</span>
                  </div>
                  <p className="text-primary-600 font-semibold mb-2">
                    {astrologer.specialization}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    {astrologer.experience} experience
                  </p>
                  <div className="flex gap-2 mb-4">
                    {astrologer.languages.map((lang, index) => (
                      <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {lang}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center text-green-600 mb-4">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm">Available Now</span>
                  </div>
                  <button
                    onClick={() => selectAstrologer(astrologer)}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Start Chat
                  </button>
                </div>
              </div>
            ))}
          </div>

          {astrologers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                No astrologers available at the moment. Please try again later.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'waiting') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Connecting to Astrologer...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we connect you with {selectedAstrologer?.name}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Astrologer Profile Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-800 shadow-lg flex-shrink-0 overflow-y-auto">
        <div className="p-6">
          <div className="text-center mb-6">
            <img
              src={selectedAstrologer?.avatar}
              alt={selectedAstrologer?.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedAstrologer?.name}
            </h2>
            <p className="text-primary-600 font-semibold mb-2">
              {selectedAstrologer?.specialization}
            </p>
            <div className="flex items-center justify-center mb-2">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-gray-600 dark:text-gray-300">{selectedAstrologer?.rating}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-t dark:border-gray-700 pt-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Experience</h3>
              <p className="text-gray-600 dark:text-gray-300">{selectedAstrologer?.experience}</p>
            </div>

            <div className="border-t dark:border-gray-700 pt-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {selectedAstrologer?.languages.map((lang, index) => (
                  <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t dark:border-gray-700 pt-4">
              <div className="flex items-center text-green-600 mb-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                <span className="text-sm">Online</span>
              </div>
            </div>

            <button
              onClick={endChat}
              className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <X className="h-5 w-5 mr-2" />
              End Chat
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white dark:bg-gray-800 shadow-lg px-4 py-4 flex-shrink-0">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Chat with {selectedAstrologer?.name}
            </h2>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md px-4 py-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <div className="bg-white dark:bg-gray-800 shadow-lg px-4 py-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto flex gap-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 input-field"
            />
            <button
              onClick={sendMessage}
              className="btn-primary flex items-center px-6"
            >
              <Send className="h-5 w-5 mr-2" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
