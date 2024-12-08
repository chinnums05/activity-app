import { useState, useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import ChatMessage from '../components/ChatMessage';
import { toast } from 'react-hot-toast';
import { BiSend } from 'react-icons/bi';

const Chat = () => {
  const [newMessage, setNewMessage] = useState('');
  const { messages, loading, sendMessage } = useChat();
  const messagesEndRef = useRef(null);
  const [isSending, setIsSending] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      await sendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
      <div className="bg-base-200 p-4">
        <h1 className="text-2xl font-bold">Community Chat Room</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-base-200">
        <div className="join w-full">
          <input
            type="text"
            placeholder="Type your message..."
            className="input input-bordered join-item flex-1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending}
          />
          <button
            type="submit"
            className="btn btn-primary join-item"
            disabled={!newMessage.trim() || isSending}
          >
            {isSending ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <BiSend size={20} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;