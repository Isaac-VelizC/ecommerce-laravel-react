import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { MessageInterface } from "@/Interfaces/Message";

interface MessageContextType {
  messages: MessageInterface[];
  markAsRead: () => void;
}

export const MessageContext = createContext<MessageContextType | undefined>(
  undefined
);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<MessageInterface[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("/api/message/five");
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = () => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => ({ ...msg, read: true }))
    );
  };

  return (
    <MessageContext.Provider value={{ messages, markAsRead }}>
      {children}
    </MessageContext.Provider>
  );
};
