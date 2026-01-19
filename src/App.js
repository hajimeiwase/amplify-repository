import React, { useState } from 'react';
import './App.css';
import { searchSlides, requestDownload } from './api'; 

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [items, setItems] = useState([]);        // ★ 追加: 検索結果
  const [loading, setLoading] = useState(false); // ★ 追加
  const [error, setError] = useState('');        // ★ 追


  const handleSend = async () => {
    if (!input.trim()) return;

    // ユーザーの質問を追加
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    // API 呼び出し
    setLoading(true);
    setError('');
    try {
      const res = await searchSlides(input); // ← API Gateway 経由で Lambda のダミーAPIに接続
      setItems(res.items || []);

      // AI 側の応答メッセージ（件数表示）
      const aiMsg = {
        role: 'assistant',
        text: res.total > 0
          ? `「${res.query_echo}」に関連して ${res.total} 件ヒットしました。下のプレビューから選べます。`
          : `「${res.query_echo}」に該当するスライドは見つかりませんでした。キーワードを変えて再検索してください。`,
      };
      setMessages([...newMessages, aiMsg]);
    } catch (e) {
      console.error(e);
      setError(e.message || '検索に失敗しました');
      const aiMsg = { role: 'assistant', text: '検索中にエラーが発生しました。時間をおいて再度お試しください。' };
      setMessages([...newMessages, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  // ダウンロード（署名付きURLへ遷移）
  const handleDownload = async (s3Key) => {
    try {
      const data = await requestDownload(s3Key);
      if (data?.signed_url) {
        window.location.href = data.signed_url;
      }
    } catch (e) {
      console.error(e);
      alert('ダウンロードに失敗しました');
    }
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
