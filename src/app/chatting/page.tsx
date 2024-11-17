"use client";

import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import styles from "../page.module.css";

const ChattingPage = () => {
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [chat, setChat] = useState<Chat>({
    nickname: "",
    message: "",
  });
  const socket = useMemo(() => io.connect("http://localhost:727"), []);

  useEffect(() => {
    socket.emit("init", "접속했습니다.");
    socket.on("receive message", (message: Chat) => {
      setChatList((chatList) => chatList.concat(message));
    });
    return () => socket.close();
  }, []);

  const postChat = () => {
    socket.emit("send message", {
      nickname: chat.nickname,
      message: chat.message,
    });
  };

  const changeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChat((chat) => {
      return { ...chat, [name]: value };
    });
  };

  return (
    <div className={styles.chatting}>
      <div className={styles.nick_wrap}>
        <label>nick</label>
        <input name="nickname" value={chat.nickname} onChange={changeInput} />
      </div>
      <ChatList chatList={chatList} />
      <ChatInput chat={chat} setChat={setChat} postChat={postChat} />
    </div>
  );
};

const ChatList = ({ chatList }: { chatList: Chat[] }) => {
  return (
    <div className={styles.chat_list}>
      <section className="chat-box">
        {chatList &&
          chatList.map((chat, index) => (
            <p key={index} className="chat">
              {chat.nickname}: {chat.message}
            </p>
          ))}
      </section>
    </div>
  );
};

const ChatInput = ({
  chat,
  setChat,
  postChat,
}: {
  chat: Chat;
  setChat: React.Dispatch<React.SetStateAction<Chat>>;
  postChat: () => void;
}) => {
  const changeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChat((chat) => {
      return { ...chat, [name]: value };
    });
  };

  return (
    <div className={styles.chat_input_wrap}>
      <input
        name="message"
        value={chat.message}
        onChange={changeInput}
        onKeyPress={(e) => e.key === "Enter" && postChat()}
      />
      <button onClick={postChat}>전송</button>
    </div>
  );
};

export default ChattingPage;

interface Chat {
  nickname: string;
  message: string;
}
