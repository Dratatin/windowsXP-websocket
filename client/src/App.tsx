import { FormEvent, useActionState, useEffect, useState } from 'react'
import { socket } from './socket';
import Button from './components/button/Button';
import Tab from './components/tab/Tab';
import './App.css'

type ActionState = {
  payload?: string | null;
  message?: string;
};

type Message = {
  type:'message' | 'newuser';
  username: string;
  message: string;
}

function App() {
  const connexion = (e: FormEvent) => {
    e.preventDefault();
    if (e.currentTarget instanceof HTMLFormElement) {
      const data = new FormData(e.currentTarget);
      const username = data.get("username") as string;
      socket.auth = { username: username };
      setUserName(username);
      socket.connect()
    }
  };

  const onConnect = () => {
    setConnected(true);
  };

  const onNewUserConnected = ({username} : {username: string}) => {
    setChatMessages((prevMessages) => [...prevMessages, {type: 'newuser', username: username, message: `${username} vient de se connecter`}]);
  };

  const onNewMessage = ({username, message} : {username: string, message: string}) => {
    setChatMessages((prevMessages) => [...prevMessages, {type: 'message', username: username, message: message}]);
  };

  const sendMessage = async (prevState: ActionState, data: FormData): Promise<ActionState> => {
    if (!socket || !socket.connected) return { payload: null, message: "Connexion WebSocket non active." }

    const message = data.get("message") as string;
    if (!message) return { payload: null, message: "Aucun message renseigné" };
  
    socket.emit("send_message", message);
    onNewMessage({username: "Toi", message: message });
    return { payload: message, message: "Message envoyé" };
  };

  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [username, setUserName] = useState<null | string>(null);
  const [messageFormState, messageFormAction, messageFormIsPending] = useActionState(sendMessage, { payload: null, message: '' });

  useEffect(() => {    
    socket.on("new_message", onNewMessage);
    socket.on("connect", onConnect);
    socket.on("user_connected", onNewUserConnected);

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("connect", onConnect);
      socket.off("user_connected", onNewUserConnected);
    };
  }, []);

  return (
    <div id='app' className="min-h-screen flex w-full justify-between p-10">
      <Tab title='Chat' className={`chat ${!connected ? 'chat--disabled' : ''}`}>
        <ul className='chatbox-messages'>
          <li className='chatbox-message italic'>
            {connected ?
              <>
                Bienvenue dans le chat <span>{username}</span> !
              </> 
              :
              <>
                Vous devez renseigner votre pseudo avant de pouvoir accéder au chat !
              </>
            }
          </li>
          {chatMessages.map(({type, username, message}, index) => (
            type === 'message' ?
              <li key={index} className='chatbox-message'>
                <span>{username} : </span>
                <span>{message}</span>  
              </li>
            : type === 'newuser' &&
              <li key={index} className='chatbox-message italic'>
                <span>{message}</span>
              </li>
          ))}
        </ul>
        <form action={messageFormAction} className='flex gap-2 w-full'>
          <textarea name='message' id='message'  placeholder='votre message...' className='w-full disabled:cursor-not-allowed' disabled={!connected} />
          <Button content='send' disabled={!connected} />
        </form>
      </Tab>
      <dialog open={!connected} className='bg-inherit connexion-dialog'>
        <Tab title='Bienvenue !'>
          <div className='connexion-dialog-infos'>
            <p className='font-body text-balance'>
              Veuillez renseigner votre nom d'utilisateur pour vous connecter à cette session de chat
            </p>
            <form onSubmit={connexion} className='flex flex-col gap-4 w-56' id='connexion-form'>
              <input type='text' name='username' id='username' maxLength={10} placeholder='username' className='bg-white w-full mt-1' />
            </form>
          </div>
          <Button content='Ok' className='m-auto' form='connexion-form'/>
        </Tab>
      </dialog>
    </div>
  )
}

export default App
