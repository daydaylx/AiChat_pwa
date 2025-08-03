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
>
Senden
</button>
<button
type="button"
onClick={onClearChat}
style={{ background: '#ef4444' }}
>
🗑️
</button>
</form>
<div className="typing-indicator">
{isLoading && 'AI schreibt...'}
</div>
</div>
);
};
export default MessageInput;
