import React, { useEffect, useState } from 'react'
import Modal from "react-modal"
import { chatAboutNews } from '../services/articles'

export const AiChat = ({ user, title, author, link, launch }) => {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [inputValue, setInputValue] = useState('')
    
    const closeModal = () => {
        setOpen(false);
        setInputValue('');
        setMessages([]);
    }

    const startChat = (userId) => {
        if(!userId) {
            alert("Please log in to chat")
        }
        const initialMsg = `This is a chat about the piece: ${title} by ${author} at ${link}. Start off by providing a brief summary.`
        setInputValue(initialMsg)
        setOpen(true)
    }

    useEffect(() => {
            if(launch) {
                startChat(user)
            }
    }, [launch])
    const handleSendMessage = async() => {
        //tell user not to have empty input
        if(!inputValue.trim()) return;

        const userMsg = {
            role: 'user',
            parts: [{text: inputValue}]
        }
        setMessages(prevMsg => [...prevMsg, userMsg])

        try {
            const response = await chatAboutNews({ messages, inputValue })

            const aiMessage = {
                role: 'model',
                parts: [{text: response}]
            }
            setMessages(prevMsgs => [...prevMsgs, aiMessage])
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prevMsgs => [...prevMsgs, { role: 'system', content: 'Error sending message' }])
        }

        setInputValue('')
    }


  return (
    <div>
        <Modal
        isOpen={open}
        onRequestClose={closeModal}
        contentLabel="Chat About Stuff"
        ariaHideApp={false}
        shouldCloseOnOverlayClick={true}
        style={{
          overlay: {
            backgroundColor: "#4e4b4bf4",
          },
          content: {
            display: 'flex',
            flexDirection: 'column',
            height: '80%',
            width: '80%',
            margin: 'auto',
            backgroundColor: '#091235',
            border: 'none',
            padding: '0',
        }
        }}
      >
        <h2 className="text-sm font-subheading font-bold mb-1 bg-secondary p-2 text-center md:m-2">
            {title}
        </h2>
                <div className="flex-grow overflow-y-auto mb-4 font-sans text-sm leading-relaxed">
                    {messages.map((message, index) => (
                        <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right ml-2 mr-1 md:ml-[25%] md:mb-2 md:p-2' : 'text-left mr-2 ml-1 md:mr-[25%] md:mb-2 md:p-4'}`}>
                            <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-gray-600 text-white' : 'bg-gray-200'}`}>
                                {message.parts[0].text}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex mt-auto mb-1 mx-1">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                        className="flex-grow border rounded-l-lg p-2"
                        placeholder="Type your message..."
                        rows={3}
                    />
                    <button onClick={handleSendMessage} className="bg-accent text-primary rounded-r-md px-4 py-2">Send</button>
                </div>
      </Modal>
    </div>
  )
}
