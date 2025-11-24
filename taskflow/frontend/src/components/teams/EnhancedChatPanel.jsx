// src/components/teams/EnhancedChatPanel.jsx

import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Users, Paperclip, Image, FileText, X, Download, LogOut, Trash2, MoreVertical } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import MessagesApi from '../../api/messages.api';
import TeamsApi from '../../api/teams.api';

/**
 * EnhancedChatPanel Component
 * WhatsApp-style team chat with members list and file sharing
 */

const EnhancedChatPanel = ({ team, onTeamUpdate, onAddMember, onViewProjects, onDeleteTeam, onLeaveTeam }) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState({ active: [], past: [] });
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  const isOwner = team?.owner_id === user?.id;
  
  // Debug logging
  useEffect(() => {
    console.log('=== OWNERSHIP DEBUG ===');
    console.log('team:', team);
    console.log('user:', user);
    console.log('team.owner_id:', team?.owner_id, 'type:', typeof team?.owner_id);
    console.log('user.id:', user?.id, 'type:', typeof user?.id);
    console.log('isOwner:', isOwner);
  }, [team, user, isOwner]);

  useEffect(() => {
    if (team?.id) {
      loadMessages();
      loadMembers();
      // Poll for new messages every 10 seconds
      const interval = setInterval(loadMessages, 10000);
      return () => clearInterval(interval);
    }
  }, [team?.id]);

  // Remove auto-scroll effect - only scroll when user sends message

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const loadMembers = async () => {
    try {
      const data = await TeamsApi.getTeamMembers(team.id);
      setMembers(data);
    } catch (error) {
      console.error('Failed to load members:', error);
      setMembers({ active: [], past: [] });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || isSending) return;

    try {
      setIsSending(true);
      
      if (selectedFile) {
        // Convert file to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const base64File = reader.result;
            await MessagesApi.sendMessageWithFile(team.id, newMessage.trim() || 'Sent a file', {
              file_data: base64File,
              file_name: selectedFile.name,
              file_type: selectedFile.type
            });
            setSelectedFile(null);
            setNewMessage('');
            await loadMessages();
            scrollToBottom();
            showSuccess('File sent successfully');
          } catch (error) {
            console.error('Failed to send file:', error);
            showError('Failed to send file');
          } finally {
            setIsSending(false);
          }
        };
        reader.readAsDataURL(selectedFile);
        return;
      } else {
        await MessagesApi.sendMessage(team.id, newMessage.trim());
        setNewMessage('');
      }
      
      await loadMessages();
      scrollToBottom();
    } catch (error) {
      console.error('Failed to send message:', error);
      showError('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleLeaveTeam = async () => {
    if (!window.confirm('Are you sure you want to leave this team?')) return;
    
    try {
      await TeamsApi.leaveTeam(team.id);
      showSuccess('Left team successfully');
      onTeamUpdate();
    } catch (error) {
      showError(error.response?.data?.detail || 'Failed to leave team');
    }
  };

  const handleDeleteTeam = async () => {
    if (!window.confirm(`Are you sure you want to delete "${team.name}"? This action cannot be undone.`)) return;
    
    try {
      await TeamsApi.deleteTeam(team.id);
      showSuccess('Team deleted successfully');
      onTeamUpdate();
    } catch (error) {
      showError(error.response?.data?.detail || 'Failed to delete team');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Asia/Kolkata'
      });
    } else if (isYesterday) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', { 
        month: 'short', 
        day: 'numeric',
        timeZone: 'Asia/Kolkata'
      });
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (fileType?.includes('pdf')) return <FileText className="h-4 w-4" />;
    return <Paperclip className="h-4 w-4" />;
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-full">
            <MessageCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {team.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {members.active?.length || 0} member{(members.active?.length || 0) !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="View Members"
          >
            <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Team Actions"
            >
              <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
                <button
                  onClick={() => { setShowMenu(false); onAddMember(); }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Add Member
                </button>
                <button
                  onClick={() => { setShowMenu(false); onViewProjects(); }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  View Projects
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                {!isOwner && (
                  <button
                    onClick={() => { setShowMenu(false); handleLeaveTeam(); }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Leave Team
                  </button>
                )}
                {isOwner && (
                  <button
                    onClick={() => { setShowMenu(false); handleDeleteTeam(); }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Team
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900/20">
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
              messages.map((message, index) => {
                const isOwnMessage = message.user.id === user?.id;
                const showDate = index === 0 || 
                  new Date(messages[index - 1].created_at).toDateString() !== new Date(message.created_at).toDateString();
                
                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="flex justify-center my-4">
                        <span className="px-3 py-1 bg-white dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 rounded-full shadow-sm">
                          {new Date(message.created_at).toLocaleDateString('en-IN', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            timeZone: 'Asia/Kolkata'
                          })}
                        </span>
                      </div>
                    )}
                    <div className={`flex gap-2 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                      {!isOwnMessage && (
                        <Avatar name={message.user.name} size="sm" src={message.user.profile_picture} />
                      )}
                      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[75%]`}>
                        {!isOwnMessage && (
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
                            {message.user.name}
                          </span>
                        )}
                        <div
                          className={`px-3 py-2 rounded-lg shadow-sm ${
                            isOwnMessage
                              ? 'bg-primary-600 text-white rounded-tr-none'
                              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none'
                          }`}
                        >
                          {message.file_url ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                {getFileIcon(message.file_type)}
                                <span>{message.file_name}</span>
                                <button className="hover:opacity-70">
                                  <Download className="h-4 w-4" />
                                </button>
                              </div>
                              {message.file_type?.startsWith('image/') && (
                                <img 
                                  src={message.file_url} 
                                  alt={message.file_name}
                                  className="max-w-full rounded"
                                />
                              )}
                            </div>
                          ) : (
                            <p className="text-sm whitespace-pre-wrap wrap-break-words">
                              {message.message}
                            </p>
                          )}
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span className={`text-xs ${isOwnMessage ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                              {formatTime(message.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            {selectedFile && (
              <div className="mb-2 flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                {getFileIcon(selectedFile.type)}
                <span className="text-sm flex-1 truncate">{selectedFile.name}</span>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Attach file"
              >
                <Paperclip className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isSending}
              />
              <Button
                type="submit"
                variant="primary"
                disabled={(!newMessage.trim() && !selectedFile) || isSending}
                className="px-4"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>

        {/* Members Sidebar */}
        {showMembers && (
          <div className="w-64 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="h-4 w-4" />
                Members ({(members.active?.length || 0) + (members.past?.length || 0)})
              </h4>
            </div>
            <div className="p-2 space-y-1 flex-1">
              {/* Active Members */}
              {members.active && members.active.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-2 mb-2">
                    Active ({members.active.length})
                  </h5>
                  {members.active.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <Avatar name={member.user.name} size="sm" src={member.user.profile_picture} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {member.user.name}
                          {member.user.id === user?.id && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(You)</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {member.role === 'owner' && '👑 '}
                          {member.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Past Members */}
              {members.past && members.past.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-2 mb-2">
                    Past Members ({members.past.length})
                  </h5>
                  {members.past.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg opacity-60"
                    >
                      <Avatar name={member.user.name} size="sm" src={member.user.profile_picture} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {member.user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Left team
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedChatPanel;
