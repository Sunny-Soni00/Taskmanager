// src/components/teams/ChatPanel.jsx

import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import MessagesApi from '../../api/messages.api';

/**
 * ChatPanel Component
 * Team chat interface with messages and input
 */

const ChatPanel = ({ team }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (team?.id) {
      loadMessages();
      const interval = setInterval(loadMessages, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [team?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await MessagesApi.getTeamMessages(team.id);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      await MessagesApi.sendMessage(team.id, newMessage.trim());
      setNewMessage('');
      await loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
        <MessageCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Team Chat
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.user.id === user?.id;
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
              >
                <Avatar name={message.user.name} size="sm" />
                <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} flex-1 max-w-[70%]`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium text-gray-900 dark:text-white ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                      {isOwnMessage ? 'You' : message.user.name}
                    </span>
                    <span className={`text-xs text-gray-500 dark:text-gray-400 ${isOwnMessage ? 'order-1' : 'order-2'}`}>
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      isOwnMessage
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap wrap-break-words">
                      {message.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isSending}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!newMessage.trim() || isSending}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;
