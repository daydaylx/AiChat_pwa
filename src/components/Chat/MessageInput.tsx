import { useState, useRef, useEffect, KeyboardEvent } from 'react';

export function MessageInput({ onSendMessage, disabled }: { onSendMessage: (msg: string) => void; disabled: boolean }) {
  const [val, setVal] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [val]);

  const handleSend = () => {
    if (val.trim()) {
      onSendMessage(val.trim());
      setVal('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', padding: 16, gap: 12, background: '#fff', borderTop: '1px solid #eee' }}>
      <textarea
        ref={ref}
        rows={1}
        style={{ flex: 1, borderRadius: 20, border: '1px solid #ddd', resize: 'none', fontSize: 16, padding: '0.75rem 1rem', minHeight: 44 }}
        placeholder="Schreib was…"
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button onClick={handleSend} disabled={!val.trim() || disabled} style={{
        background: '#007aff',
        color: '#fff',
        border: 'none',
        borderRadius: '50%',
        width: 44, height: 44, fontSize: 22, cursor: 'pointer', opacity: (!val.trim() || disabled) ? 0.6 : 1
      }}>
        ➤
      </button>
    </div>
  );
}
