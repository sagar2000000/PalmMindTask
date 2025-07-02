import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

function Chat() {
  const { user, token, logout } = useAuth();
  const [chatList, setChatList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const socket = useRef(null);
  const selectedUserRef = useRef(selectedUser);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    if (!user) return;

    socket.current = io("http://localhost:9000", {
      auth: { token },
    });

    socket.current.emit("setup", user._id);

    socket.current.on("message received", (newMessage) => {
      const selUser = selectedUserRef.current;
      if (
        selUser &&
        (newMessage.sender === selUser._id || newMessage.receiver === selUser._id)
      ) {
        setMessages((prev) => {
          if (prev.find((msg) => msg._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        });
        scrollToBottom();
      }
      refreshChatList();
    });

    return () => {
      socket.current.disconnect();
    };
  }, [user, token]);

  useEffect(() => {
    if (!selectedUser) return;
    socket.current?.emit("join chat", selectedUser._id);

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/api/messages/${selectedUser._id}?currentUserId=${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data);
        scrollToBottom();
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [selectedUser, token, user._id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatSummary = async () => {
    try {
      const res = await axios.get(
        `http://localhost:9000/api/messages/summary/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setChatList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching chat summary", err);
      setChatList([]);
    }
  };

  const refreshChatList = () => {
    fetchChatSummary();
  };

  useEffect(() => {
    if (user?._id) {
      fetchChatSummary();
    }
  }, [user, token]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/api/users?search=${searchTerm}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSearchResults(res.data.filter((u) => u._id !== user._id));
      } catch (err) {
        console.error(err);
        setSearchResults([]);
      }
    };

    fetchUsers();
  }, [searchTerm, token, user._id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !selectedUser) return;

    try {
      const res = await axios.post(
        "http://localhost:9000/api/messages",
        {
          sender: user._id,
          receiver: selectedUser._id,
          content: newMsg,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => {
        if (prev.find((msg) => msg._id === res.data._id)) return prev;
        return [...prev, res.data];
      });

      setNewMsg("");
      scrollToBottom();
      socket.current.emit("new message", res.data);
      refreshChatList();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-[#1E1F4B] text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-[#24285B] p-4 overflow-auto flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Inbox</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/update-profile")}
              className="p-1 rounded hover:bg-[#3b3f7e]"
              title="Settings"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m0 14v1m8-8h1M4 12H3m15.364 6.364l-.707-.707m-12.02 0l-.707.707m12.02-12.02l.707-.707m-12.02 0l.707.707M12 7a5 5 0 100 10 5 5 0 000-10z"
                />
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#FF5E78] text-white px-2 py-1 rounded hover:bg-[#e14e66] text-xs"
            >
              Logout
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search users"
          className="mb-4 p-2 rounded bg-[#1E1F4B] text-white border border-gray-500 placeholder-gray-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {searchTerm.trim() !== "" && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-sm">Search Results</h3>
            {searchResults.length === 0 ? (
              <p className="text-gray-300 text-xs">No users found</p>
            ) : (
              <ul>
                {searchResults.map((u) => (
                  <li
                    key={u._id}
                    className={`p-2 rounded cursor-pointer hover:bg-[#3b3f7e] ${
                      selectedUser?._id === u._id ? "bg-[#5053a5]" : ""
                    }`}
                    onClick={() => setSelectedUser(u)}
                  >
                    {u.username}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="flex-grow overflow-auto">
          {chatList.length === 0 ? (
            <p className="text-gray-300 text-xs">No chats yet</p>
          ) : (
            <>
              <h3 className="font-semibold mb-2 text-sm">Chats</h3>
              <ul>
                {chatList.map(({ user: u, count }) => (
                  <li
                    key={u._id}
                    className={`p-2 rounded cursor-pointer flex justify-between items-center ${
                      selectedUser?._id === u._id ? "bg-[#5053a5]" : "hover:bg-[#3b3f7e]"
                    }`}
                    onClick={() => setSelectedUser(u)}
                  >
                    <span>{u.username}</span>
                    <span className="text-xs bg-[#FF5E78] text-white px-2 py-1 rounded">
                      {count}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Chat panel */}
      <div className="flex flex-col flex-grow p-4">
        <div className="border-b border-gray-500 pb-2 mb-2">
          <h2 className="text-xl font-semibold">
            Chat with {selectedUser ? selectedUser.username : "Select a user"}
          </h2>
        </div>

        <div className="flex-grow overflow-auto mb-4 bg-white p-4 rounded shadow text-black">
          {!selectedUser && <p>Select a user to start chatting.</p>}
          {selectedUser && (
            <ul className="space-y-2">
              {messages.map((msg) => (
                <li
                  key={msg._id}
                  className={`p-3 rounded-xl max-w-xs break-words ${
                    msg.sender === user._id
                      ? "bg-[#FF5E78] text-white ml-auto"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <div className="text-xs font-semibold mb-1">
                    {msg.sender === user._id ? "You" : selectedUser.username}
                  </div>
                  <div>{msg.content}</div>
                </li>
              ))}
              <div ref={messagesEndRef} />
            </ul>
          )}
        </div>

        {selectedUser && (
          <form
            onSubmit={handleSendMessage}
            className="flex space-x-2 bg-white p-2 rounded-lg shadow"
          >
            <input
              type="text"
              className="flex-grow border-none focus:outline-none p-2 rounded text-black"
              placeholder="Write a message..."
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
            />
            <button
              type="submit"
              className="bg-[#FF5E78] text-white px-4 rounded hover:bg-[#e14e66]"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Chat;
