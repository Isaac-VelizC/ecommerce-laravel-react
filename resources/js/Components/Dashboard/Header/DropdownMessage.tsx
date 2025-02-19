import { useContext, useState } from 'react';
import ClickOutside from '../../ClickOutside';
import { MessageContext } from '@/Context/MessageContext';
import { fDateTime } from "@/Utils/format-time";

const DropdownMessage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  const messageContext = useContext(MessageContext);

  if (!messageContext) {
    throw new Error("DropdownMessage debe estar dentro de un MessageProvider");
  }

  const { messages, markAsRead } = messageContext;

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li className="relative">
        <button
          onClick={() => {
            setNotifying(false);
            setDropdownOpen(!dropdownOpen);
            markAsRead();
          }}
          className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        >
          {messages.some((msg) => !msg.read) && notifying && (
            <span className="absolute -top-0.5 -right-0.5 z-1 h-2 w-2 rounded-full bg-meta-1">
              <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
            </span>
          )}
          💌
        </button>

        {dropdownOpen && (
          <div className="absolute -right-16 mt-2.5 flex h-90 w-75 flex-col rounded-xl border border-stroke bg-white shadow-default dark:border-[#121212] dark:bg-[#121212] opacity-95 sm:right-0 sm:w-80">
            <div className="px-4.5 py-3">
              <h5 className="text-sm font-semibold text-text">Mensajes</h5>
            </div>
            <ul className="flex h-auto flex-col overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-sm text-center py-3 text-gray-400">No hay nuevos mensajes</p>
              ) : (
                messages.map((msg) => (
                  <li key={msg.id}>
                    <a
                      className="flex border-t border-stroke px-4.5 py-2 hover:bg-gray-2 dark:hover:bg-meta-4"
                      href={route('messages.show', msg.id)}
                    >
                      <div>
                        <h6 className="text-sm font-medium text-text">
                          {msg.name}
                        </h6>
                        <span className="text-sm text-gray-500">{msg.subject}</span> <br />
                        <small className="text-xs text-gray-500">{fDateTime(msg.created_at)}</small>
                      </div>
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownMessage;
