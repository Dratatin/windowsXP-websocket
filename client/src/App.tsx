import { useActionState, useEffect, useState } from 'react'
import io from 'socket.io-client';
import './App.css'

const socket = io('http://localhost:5000');

type ActionState = {
  payload?: string | null;
  message?: string;
};

function App() {
  const [userMessage, setUserMessage] = useState<string[]>([])
  const [userName, setUserName] = useState("anonymous");

  const sendMessage = (prevState: ActionState, data: FormData): ActionState => {
    const message = data.get("message") as string;
  
    if (!message) {
      return { payload: null, message:"Aucun message renseigné" };
    }
  
    // Simuler un délai pour un appel API
    try {
      socket.emit("send_message", message);
      return { payload: message, message: "Le message a bien été envoyé" };
    } catch (error) {
      return { payload: null, message: "Une erreur a été rencontrée lors de la communication avec le serveur" };
    }
  }

  const [state, formAction, isPending] = useActionState(sendMessage, { payload: null, message: '' });


  useEffect(() => {  
    const handleMessage = ({userId, message} : {userId: string, message: string}) => {
      setUserMessage((prevMessages) => [...prevMessages, message]);
      setUserName(userId);
    };
  
    socket.on("receive_message", handleMessage);
  
    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, []);

  return (
    <>
      <div id='app' className="min-h-screen flex w-full justify-between bg-stone-900 text-white p-10">
        <div className='mt-auto flex flex-col gap-4 text-left'>
          <ul>
            {userMessage.map((message, index) => (
              <li key={index}>
                <span>{userName} : </span>
                <span>{message}</span>  
              </li>
            ))}
          </ul>
 
        </div>
        <form action={formAction} className='mt-auto'>
          <input name='message' id='message' type='text' placeholder='message' className='mr-2 py-2 border-b border-white text-white placeholder:text-white' />
          <button type='submit' disabled={isPending} className='uppercase bg-pink-600 py-2 px-4 rounded text-white font-semibold cursor-pointer disabled:cursor-progress'>send</button>
        </form>
      </div>
    </>
  )
}

export default App
