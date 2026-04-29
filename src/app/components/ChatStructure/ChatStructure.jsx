import React, { useRef, useEffect } from "react";
import { SendOutlined, RobotOutlined, UserOutlined, LoadingOutlined, CopyOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import "./ChatStructure.scss";

// message: { role: "user" | "assistant", content: string, id }
const ChatMessage = ({ message, onCopy }) => {
  const isUser = message.role === "user";
  return (
    <div className={`chat-message ${isUser ? "chat-message--user" : "chat-message--assistant"}`}>
      <div className="chat-message__avatar">
        {isUser ? <UserOutlined /> : <RobotOutlined />}
      </div>
      <div className="chat-message__bubble">
        <p className="chat-message__text">{message.content}</p>
        {!isUser && (
          <Tooltip title="Copy response">
            <button
              type="button"
              className="chat-message__copy"
              onClick={() => onCopy && onCopy(message.content)}
              aria-label="Copy"
            >
              <CopyOutlined />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

const ChatStructure = ({
  messages = [],         // [{ id, role, content }]
  inputValue = "",
  onInputChange,
  onSend,
  loading = false,
  placeholder = "Type your message...",
  disabled = false,
  emptyText = "Start a conversation by filling the form and clicking Run.",
}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !loading && !disabled) {
      e.preventDefault();
      onSend && onSend();
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  return (
    <div className="chat-structure">
      {/* Messages Area */}
      <div className="chat-structure__messages">
        {messages.length === 0 && (
          <div className="chat-structure__empty">
            <RobotOutlined className="chat-structure__empty-icon" />
            <p>{emptyText}</p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} onCopy={handleCopy} />
        ))}
        {loading && (
          <div className="chat-message chat-message--assistant">
            <div className="chat-message__avatar">
              <RobotOutlined />
            </div>
            <div className="chat-message__bubble chat-message__bubble--loading">
              <LoadingOutlined spin />
              <span>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="chat-structure__input-row">
        <textarea
          className="chat-structure__input"
          value={inputValue}
          onChange={(e) => onInputChange && onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || loading}
          rows={1}
        />
        <button
          type="button"
          className={`chat-structure__send ${loading || disabled ? "disabled" : ""}`}
          onClick={onSend}
          disabled={loading || disabled}
          aria-label="Send"
        >
          {loading ? <LoadingOutlined spin /> : <SendOutlined />}
        </button>
      </div>
    </div>
  );
};

export default ChatStructure;
