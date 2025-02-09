import "./Chat.css";

const Chat = () => {
  return (
    <div className="chat">
      <div className="chat-container">
        <div className="chat-messages">
          {/* Messages will be rendered here */}
        </div>
        <div className="chat-input">
          <input type="text" placeholder="Type a message..." />
          <button>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
