import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function App() {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_chat", room);
      if (socket.connected) {
        setIsConnected(true);
      }
    }
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      const newChat = [...chat, { content: message, sent: true }];
      setChat(newChat);
      socket.emit("send_message", { message, room });
      setMessage("");
      
    }
  };

  useEffect(() => {

 
      setIsConnected(false);
      setChat([]);
    
    
  }, [room]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      const newChat = [...chat, { content: data.message, sent: false }];
      setChat(newChat);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [chat]);

  return (
    <div className="App" style={styles.container}>
      <input
        style={styles.input}
        placeholder="Chat Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button style={styles.button} onClick={joinRoom}>
       {isConnected ? "Connected" : "Join Chat"}
      </button>
      <input
        style={styles.input}
        dissabled={!isConnected}
        placeholder="Message..."
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button style={styles.button} onClick={sendMessage}>
        Send Message
      </button>
      <h1 style={styles.message}>Messages:</h1>

      {chat.map((message, index) => (
        <div key={index} style={styles.messageContainer}>
          {message.sent ? (
            <div style={styles.sentMessage}>{message.content}</div>
          ) : (
            <div style={styles.receivedMessage}>{message.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  input: {
    padding: "10px",
    marginBottom: "10px",
    width: "300px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px 20px",
    marginBottom: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    marginBottom: "10px",
  },
  messageContainer: {
    marginBottom: "10px",
    textAlign: "center",
  },
  sentMessage: {
    padding: "10px",
    backgroundColor: "#1a6e47",
    color: "#fff",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    width: "300px",
    textAlign: "center",
  },
  receivedMessage: {
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    width: "300px",
    textAlign: "center",
  },
};

export default App;
