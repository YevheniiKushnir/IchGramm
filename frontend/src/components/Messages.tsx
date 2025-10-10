import {
  ChangeEvent,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useOutletContext, useParams } from "react-router";
import { io } from "socket.io-client";
import { Chat, CondensedUser, Message } from "../store/types/instanceTypes.ts";
import { UserState } from "../store/types/userTypes.ts";
import { fetchChat } from "../utils/apiCalls/chatApi.ts";
import { formatMessageTime } from "../utils/formatFunctions.ts";

const TEN_MINUTES = 10 * 60 * 1000;

const socket = io(import.meta.env.VITE_BACKEND_SOCKET_URL, {
  autoConnect: true, // Allow automatic connection
  reconnection: true, // Enable reconnection
  reconnectionAttempts: 5, // Limit the number of reconnection attempts
  reconnectionDelay: 1000, // Delay between attempts in ms,
  withCredentials: true,
  transports: ["websocket"],
});

type OutletContextType = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  user: UserState;
  receiver: CondensedUser;
};

export const Messages = () => {
  const { user } = useOutletContext<OutletContextType>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [receiver, setReceiver] = useState<CondensedUser | null>(null);
  const [chatId, setChatId] = useState<string>("");
  const { username } = useParams();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect((): void => {
    const getMessages = async () => {
      if (!username) return;

      try {
        const result: Chat = await fetchChat(username);
        setMessages(result.messages);

        if (result.user1.username === username) {
          setReceiver(result.user1);
        } else {
          setReceiver(result.user2);
        }
        setChatId(result._id);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    getMessages();
  }, [username]);

  useEffect(() => {
    if (chatId) {
      // Join the chat room
      socket.emit("joinRoom", chatId);
    }

    // Listen for new messages
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup on component unmount or when chatId changes
    return () => {
      if (chatId) {
        socket.emit("leaveRoom", chatId);
      }
      socket.off("receiveMessage");
    };
  }, [chatId]);

  const onInputKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      if (!receiver) return;
      socket.emit("sendMessage", {
        authorId: user._id,
        receiverId: receiver._id,
        content: newMessage,
      });
      setNewMessage("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="w-full">
      <div className="border-b border-b-gray p-4 w-full">
        <Link
          to={`/profile/${receiver?.username}`}
          className="flex items-center gap-3 w-fit"
        >
          <img
            src={receiver?.profile_image}
            alt={receiver?.username}
            className="w-11 h-11 object-cover rounded-[50%]"
          />
          <p className="font-semibold">{receiver?.username}</p>
        </Link>
      </div>
      <div className="h-[72vh] md:h-[56vh] overflow-y-scroll">
        <div className="flex flex-col items-center mt-16 mb-20">
          <Link to={`/profile/${username}`}>
            <img
              src={receiver?.profile_image}
              alt={receiver?.username}
              className="w-24 h-24 object-cover mb-4 rounded-[50%]"
            />
          </Link>
          <Link to={`/profile/${username}`}>
            <p className="font-semibold text-xl mb-4">{receiver?.username}</p>
          </Link>
          <Link
            to={`/profile/${username}`}
            className="bg-gray text-sm py-2 w-[173px] rounded-lg text-center"
          >
            View profile
          </Link>
        </div>
        <div className="px-3.5 text-xs">
          {messages?.map((message: Message, index: number) => {
            const prevMessage = messages[index - 1];
            const showTime =
              !prevMessage ||
              new Date(message.createdAt).getTime() -
                new Date(prevMessage.createdAt).getTime() >
                TEN_MINUTES;
            return (
              <div key={message._id}>
                {showTime && (
                  <div className="flex justify-center my-2">
                    <span className="text-darkgray">
                      {formatMessageTime(message.createdAt)}
                    </span>
                  </div>
                )}
                <div className="flex justify-start">
                  {message.author.username === user?.username ? (
                    <>
                      <div className="flex gap-4 mb-2 py-5 px-4 bg-purple text-background w-60 lg:w-[397px] rounded-2xl ml-auto">
                        <p>{message.content}</p>
                      </div>
                      <img
                        src={user?.profile_image}
                        alt={user?.username}
                        className="w-7 h-7 object-cover rounded-[50%] ml-2"
                      />
                    </>
                  ) : (
                    <>
                      <img
                        src={message.author.profile_image}
                        alt={user?.username}
                        className="w-7 h-7 object-cover rounded-[50%] mr-2"
                      />
                      <div
                        className="flex gap-4 mb-2 py-5 px-4 bg-gray
                                w-60 lg:w-[397px] rounded-2xl"
                      >
                        <p>{message.content}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {/* Invisible div to act as scroll anchor */}
          <div ref={messagesEndRef}></div>
        </div>
      </div>
      <input
        className="mx-3.5 my-6 px-8 py-3 w-[92%] rounded-3xl border border-gray text-sm"
        placeholder="Write message"
        value={newMessage}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setNewMessage(e.target.value);
        }}
        onKeyDown={(e) => onInputKeyDown(e)}
      />
    </div>
  );
};

export default Messages;
