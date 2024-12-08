import moment from 'moment';
import { useAuth } from '../contexts/AuthContext';

const ChatMessage = ({ message }) => {
  const { user } = useAuth();
  const isOwnMessage = message.userId === user.id;

  return (
    <div className={`chat ${isOwnMessage ? 'chat-end' : 'chat-start'}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img 
            src={`https://ui-avatars.com/api/?name=${message.User.username}&background=random`} 
            alt={message.User.username} 
          />
        </div>
      </div>
      <div className="chat-header">
        {message.User.username}
        <time className="text-xs opacity-50 ml-1">
          {moment(message.createdAt).fromNow()}
        </time>
      </div>
      <div className={`chat-bubble ${isOwnMessage ? 'chat-bubble-primary' : ''}`}>
        {message.content}
      </div>
      {isOwnMessage && <div className="chat-footer opacity-50">
        {message.createdAt !== message.updatedAt && 'edited'}
      </div>}
    </div>
  );
};

export default ChatMessage;