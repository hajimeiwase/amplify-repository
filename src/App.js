
import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    // ユーザーの質問を追加
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    // ダミー応答（後でAPI Gateway＋Lambdaに接続）
    const response = { role: 'assistant', text: `「${input}」に関するスライドを探しています...` };
    setMessages([...newMessages, response]);
  };

  return (
    <div className="App">
      <h2>提案資料検索チャット</h2>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role}>
            <strong>{msg.role === 'user' ? 'あなた' : 'AI'}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="質問を入力..."
        />
        <button onClick={handleSend}>送信</button>
      </div>
    </div>
  );
}

export default App;
