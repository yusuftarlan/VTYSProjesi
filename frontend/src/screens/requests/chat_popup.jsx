import React, { useState, useEffect, useRef } from 'react';
import { authService } from '../../services/authService';
import './chat_popup.css';

const ChatPopup = ({ request, onClose }) => {
    const [messages, setMessages] = useState(request.messages || []);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await authService.sendMessage(request.id, newMessage);

            const addedMsg = {
                id: Date.now(),
                content: newMessage,
                date: new Date().toISOString(),
                senderName: "Ben",
                isMe: true
            };

            setMessages([...messages, addedMsg]);
            setNewMessage("");
        } catch (error) {
            console.error("Mesaj gönderilemedi", error);
        }
    };

    return (
        <div className="chat-overlay">
            <div className="chat-modal">
                <div className="chat-header">
                    <h3>{request.technician_name} ile Sohbet</h3>
                    <button type="button" onClick={onClose} className="close-chat-btn">✕</button>
                </div>

                <div className="chat-body">
                    {messages.length === 0 ? (
                        <p className="no-msg">Henüz mesaj yok.</p>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className={`msg-row ${msg.isMe ? 'msg-me' : 'msg-other'}`}>
                                <div className="msg-bubble">
                                    <div className="msg-text">{msg.content}</div>
                                    <div className="msg-time">
                                        {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chat-footer" onSubmit={handleSend}>
                    <input
                        type="text"
                        placeholder="Mesajınızı yazın..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit">Gönder</button>
                </form>
            </div>
        </div>
    );
};

export default ChatPopup;