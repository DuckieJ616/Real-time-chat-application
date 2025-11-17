'use client';

import { useState, useEffect, useRef } from 'react';

interface Room {
  id: number;
  name: string;
  description: string;
}

interface Message {
  id: number;
  room_id: number;
  user_id: number;
  username: string;
  content: string;
  created_at: string;
}

export default function ChatApp() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isClient, setIsClient] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 获取聊天室列表
  useEffect(() => {
    fetch('http://localhost:8080/api/rooms')
      .then(res => res.json())
      .then(data => {
        setRooms(data || []);
        if (data && data.length > 0) {
          setSelectedRoom(data[0]);
        }
      })
      .catch(err => console.error('Failed to fetch rooms:', err));
  }, []);

  // 获取选中聊天室的消息
  useEffect(() => {
    if (!selectedRoom) return;

    fetch(`http://localhost:8080/api/rooms/${selectedRoom.id}/messages`)
      .then(res => res.json())
      .then(data => setMessages(data || []))
      .catch(err => console.error('Failed to fetch messages:', err));
  }, [selectedRoom]);

  // WebSocket 连接
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/ws');
    
    ws.onopen = () => {
      console.log('✅ WebSocket connected');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 发送消息
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;

    const messageData = {
      room_id: selectedRoom.id,
      user_id: 1, // 临时用户 ID
      content: newMessage
    };

    try {
      await fetch('http://localhost:8080/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 左侧聊天室列表 */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Chat Rooms</h1>
          <p className="text-sm text-gray-500 mt-1">{username}</p>
        </div>
        <div className="overflow-y-auto">
          {rooms.map(room => (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                selectedRoom?.id === room.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <h3 className="font-semibold text-gray-800">{room.name}</h3>
              <p className="text-sm text-gray-500 truncate">{room.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧聊天区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部聊天室标题 */}
        {selectedRoom && (
          <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">{selectedRoom.name}</h2>
            <p className="text-sm text-gray-500">{selectedRoom.description}</p>
          </div>
        )}

        {/* 消息显示区域 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex ${msg.username === username ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg shadow ${
                  msg.username === username
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                <p className="text-xs font-semibold mb-1 opacity-75">
                  {msg.username}
                </p>
                <p className="break-words">{msg.content}</p>
                <p className="text-xs mt-1 opacity-60">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 底部消息输入框 */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={sendMessage}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}