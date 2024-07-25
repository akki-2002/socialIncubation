import React, { useEffect, useState, useRef } from "react";
import { addMessage, getMessages } from "../../api/MessageRequests";
import { getUser } from "../../api/UserRequests";
import "./ChatBox.css";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import { io } from 'socket.io-client';

const ChatBox = ({ chat, currentUser, setSendMessage, receivedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  // Fetch user data for chat header
  useEffect(() => {
    if (chat && chat.members) {
      const userId = chat.members.find((id) => id !== currentUser);
      const getUserData = async () => {
        try {
          const { data } = await getUser(userId);
          setUserData(data);
        } catch (error) {
          console.log(error);
        }
      };
      getUserData();
    }
  }, [chat, currentUser]);

  // Fetch messages when chat changes
  useEffect(() => {
    if (chat && chat._id) {
      const fetchMessages = async () => {
        try {
          const { data } = await getMessages(chat._id);
          setMessages(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchMessages();
    }
  }, [chat]);

  // Always scroll to the last message
  const scroll = useRef();
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending messages
  const handleSend = async (e) => {
    e.preventDefault();
    if (!chat || !chat._id) {
      console.log("Chat or chat ID is not available.");
      return;
    }

    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };
    const receiverId = chat.members.find((id) => id !== currentUser);

    // Debug log
    console.log("Message to send:", message);

    // Send message to socket server
    setSendMessage({ ...message, receiverId });

    // Send message to database
    try {
      const { data } = await addMessage(message);
      console.log("Message saved:", data);
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle received messages
  useEffect(() => {
    if (receivedMessage && chat && receivedMessage.chatId === chat._id) {
      console.log("Adding received message:", receivedMessage);
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    }
  }, [receivedMessage, chat]);

  return (
    <div className="ChatBox-container">
      {/* chat-header */}
      <div className="chat-header">
        <div className="follower">
          <div>
            <img
              src={
                userData?.profilePicture
                  ? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture
                  : process.env.REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"
              }
              alt="Profile"
              className="followerImage"
              style={{ width: "50px", height: "50px" }}
            />
            <div className="name" style={{ fontSize: "0.9rem" }}>
              <span>
                {userData?.firstname} {userData?.lastname}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* chat-body */}
      <div className="chat-body">
        {messages.map((message) => (
          <div
            key={message._id}
            ref={scroll}
            className={`message ${message.senderId === currentUser ? "own" : ""}`}
          >
            <span>{message.text}</span>
            <span>{format(message.createdAt)}</span>
          </div>
        ))}
      </div>

      {/* chat-sender */}
      <div className="chat-sender">
        <div>+</div>
        <InputEmoji value={newMessage} onChange={handleChange} />
        <button className="send-button" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
