import { useState, useRef, useEffect } from 'react';
interface MessageInputProps {
onSendMessage: (message: string) => void;
isLoading: boolean;
onClearChat: () => void;
disabled: boolean;
}
const MessageInput = ({ onSendMessage, isLoading, onClearChat, disabled }: MessageInputProps) => {
const [message, setMessage] = useState('');
const textareaRef = useRef<HTMLTextAreaElement>(null);
// Automatically adjust textarea height based on content
useEffect(() => {
if (textareaRef.current) {
textareaRef.current.style.height = 'auto';
textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
}
}, [message]);
const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
if (message.trim() && !isLoading && !disabled) {
onSendMessage(message);
setMessage('');
// Reset textarea height
if (textareaRef.current) {
textareaRef.current.style.height = 'auto';
}
}
};
const handleKeyDown = (e: React.KeyboardEvent) => {
if (e.key === 'Enter' && !e.shiftKey) {
e.preventDefault();
handleSubmit(e);
}
};
return (
<div className="input-container">
<form onSubmit={handleSubmit} className="message-form">
<textarea
ref={textareaRef}
className="message-input"
value={message}
onChange={(e) => setMessage(e.target.value)}
onKeyDown={handleKeyDown}
placeholder={disabled ? "Bitte API-Key in den Einstellungen hinterlegen" : "Nachricht eingeben..."}
disabled={disabled || isLoading}
rows={1}
/>
<button
type="submit"
disabled={!message.trim() || isLoading || disabled}
className="send-button"
aria-label="Senden"
>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<line x1="22" y1="2" x2="11" y2="13"></line>
<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
</svg>
</button>
<button 
       type="button" 
       onClick={onClearChat}
       className="delete-button"
       aria-label="Chat löschen"
     >
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<polyline points="3 6 5 6 21 6"></polyline>
<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
</svg>
</button>
</form>
<div className="typing-indicator">
{isLoading && 'AI schreibt...'}
</div>
</div>
);
};
export default MessageInput;
