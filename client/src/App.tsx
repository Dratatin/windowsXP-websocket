import { useActionState, useEffect, useState } from 'react'
import io from 'socket.io-client';
import './App.css'

const socket = io('http://localhost:5000');

type ActionState = {
  payload?: string | null;
  message?: string;
};

type Message = {
  userName: string;
  message: string;
}

function App() {
  const sendMessage = (prevState: ActionState, data: FormData): ActionState => {
    const message = data.get("message") as string;
  
    if (!message) return { payload: null, message: "Aucun message renseigné" };
    if (!socket || !socket.connected) return { payload: null, message: "Connexion WebSocket non disponible." };
  
    socket.emit("send_message", message);
    return { payload: message, message: "Le message a bien été envoyé" };
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [state, formAction, isPending] = useActionState(sendMessage, { payload: null, message: '' });

  useEffect(() => {  
    const handleMessage = ({userId, message} : {userId: string, message: string}) => {
      setMessages((prevMessages) => [...prevMessages, {userName: userId, message: message}]);
    };
  
    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, []);

  return (
    <div id='app' className="min-h-screen flex w-full justify-between p-10">
      <div className='chatbox mt-auto flex flex-col text-left'>
        <div className='chatbox-heading'>
          <h2 className='chatbox-title text-prout'>Chat box</h2>
        </div>
        <div className='chatbox-content'>
          <ul className='chatbox-messages'>
            {messages.map(({userName, message}, index) => (
              <li key={index} className='chatbox-message'>
                <span>{userName} : </span>
                <span>{message}</span>  
              </li>
            ))}
          </ul>
          <form action={formAction} className='flex gap-2'>
            <textarea name='message' id='message'  placeholder='votre message...' className='chatbox-input w-full'/>
            <button type='submit' disabled={isPending} className='chatbox-submit cursor-pointer disabled:cursor-progress'>send</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
