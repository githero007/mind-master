import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { messagesAtom } from '../atoms/atom'; // Import the atom
import axios from 'axios'; // Import axios
import '../css/Chatbot.css'; // Include a CSS file for styling

export const Chatbot = () => {
    const [messages, setMessages] = useRecoilState(messagesAtom); // Use Recoil state for messages
    const [input, setInput] = useState('');

    const handleSend = async () => {
        if (input.trim()) {
            // Update messages in global state using Recoil for user input
            setMessages((oldMessages) => [...oldMessages, { text: input, isUser: true }]);
            const userInput = input; // Capture the input for sending to backend
            setInput('');

            try {
                // Send user input to the /chat route and fetch response using axios
                const response = await axios.post('http://localhost:3000/chat', {
                    prompt: userInput,
                });

                const botResponse = response.data.response; // Extract bot response

                // Update messages in global state with bot response
                setMessages((oldMessages) => [
                    ...oldMessages,
                    { text: botResponse, isUser: false },
                ]);
            } catch (error) {
                console.error('Error fetching bot response:', error);
                setMessages((oldMessages) => [
                    ...oldMessages,
                    { text: 'Sorry, there was an error. Please try again later.', isUser: false },
                ]);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSend(); // Call handleSend when the "Enter" key is pressed
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`chatbot-message ${msg.isUser ? 'user' : 'bot'}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="chatbot-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress} // Add key press event listener
                    placeholder="Type a message..."
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};
