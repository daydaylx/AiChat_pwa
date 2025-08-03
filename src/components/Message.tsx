interface MessageProps {
  message: {
    role: 'user' | 'assistant' | 'system';
    content: string;
  };
}

const Message = ({ message }: MessageProps) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`message ${isUser ? 'sent' : 'received'}`}>
      {message.content}
    </div>
  );
};

export default Message;
