// src/components/Chatbot.js

"use client";

import { useState, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { getResponse } from '../utils/getResponse';
import { faqs } from '../data/faqs'; // Importar las FAQs con categorías

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm your virtual assistant. How can I help you? You can ask me about schedules, prices, tours, tickets, and more.",
      options: [], // Opciones se manejarán por categorías
    },
  ]);
  const [input, setInput] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({}); // Manejar categorías desplegables
  const messagesEndRef = useRef(null);

  // Función para scroll automático
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Inicializar categorías desplegables en el primer renderizado
  useEffect(() => {
    const initialExpanded = {};
    faqs.forEach(category => {
      initialExpanded[category.category] = false;
    });
    setExpandedCategories(initialExpanded);
  }, []);

  // Función para manejar el envío de mensajes
  const handleSend = (e, messageText) => {
    if (e) e.preventDefault();

    const text = messageText || input;
    if (text.trim() === '') return;

    // Añadir mensaje del usuario
    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);

    // Obtener respuesta
    const response = getResponse(text);

    // Añadir respuesta del bot
    setMessages((prevMessages) => [
      ...newMessages,
      { sender: 'bot', text: response },
    ]);
    setInput('');
  };

  // Función para manejar la selección de opciones
  const handleOptionClick = (option) => {
    handleSend(null, option);
  };

  // Función para manejar el toggle de categorías
  const toggleCategory = (category) => {
    setExpandedCategories(prevState => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-green-700 text-white p-3 rounded-full shadow-lg hover:bg-green-800 focus:outline-none"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Ventana del chatbot */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 max-h-[80vh] bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col">
          {/* Header del chatbot */}
          <div className="bg-green-700 text-white p-3 flex justify-between items-center">
            <h3 className="font-semibold">Virtual Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="text-white">
              ×
            </button>
          </div>

          {/* Área de mensajes */}
          <div className="flex-1 p-3 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  msg.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.text}
                  {msg.options && (
                    <div className="mt-2">
                      {/* Renderizar preguntas agrupadas por categorías */}
                      {faqs.map((category, catIndex) => (
                        <div key={catIndex} className="mb-2">
                          <button
                            onClick={() => toggleCategory(category.category)}
                            className="w-full text-left bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 focus:outline-none"
                          >
                            {category.category}
                          </button>
                          {expandedCategories[category.category] && (
                            <div className="mt-1 ml-2">
                              {category.questions.map((q, qIndex) => (
                                <button
                                  key={qIndex}
                                  onClick={() => handleOptionClick(q.question)}
                                  className="block bg-green-600 text-white px-3 py-1 rounded mt-1 hover:bg-green-700"
                                >
                                  {q.question}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input para enviar mensajes */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-gray-300 flex"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-green-700 text-white px-4 rounded-r-lg hover:bg-green-800 focus:outline-none"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}