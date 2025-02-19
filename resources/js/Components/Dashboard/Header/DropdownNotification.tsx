import { useEffect, useState } from "react";
import ClickOutside from "../../ClickOutside";
import axios from "axios";
import { NotificationInterface } from "@/Interfaces/Notification";
import { fDateTime } from "@/Utils/format-time";

const DropdownNotification = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifying, setNotifying] = useState(true);
    const [notifications, setNotifications] = useState<NotificationInterface[]>(
        []
    );
    // Obtener notificaciones desde Laravel
    useEffect(() => {
        axios
            .get(route("all.notification"), { withCredentials: true })
            .then((res) => {
                setNotifications(res.data);
                if (res.data.length > 0) {
                    setNotifying(true);
                } else {
                  setNotifying(false);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    // Marcar notificación como leída
    const handleNotificationClick = (id: number, actionURL: string) => {
        axios
            .get(route("admin.notification", id))
            .then(() => {
                setNotifications((prev) => prev.filter((n) => n.id !== id));
                if (notifications.length === 1) setNotifying(false); // Si ya no hay notificaciones
                window.location.href = actionURL;
            })
            .catch((err) => console.error(err));
    };

    return (
        <ClickOutside
            onClick={() => setDropdownOpen(false)}
            className="relative"
        >
            <li>
                <button
                    onClick={() => {
                        setDropdownOpen(!dropdownOpen);
                    }}
                    className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
                >
                    {notifying && (
                        <span className="absolute -top-0.5 right-0 h-2 w-2 rounded-full bg-meta-1">
                            <span className="absolute h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
                        </span>
                    )}
                    🔔
                </button>

                {dropdownOpen && (
                    <div className="absolute -right-27 mt-2.5 w-75 rounded-xl border border-stroke bg-white shadow-default dark:border-[#121212] dark:bg-[#121212] sm:right-0 sm:w-80">
                        <div className="px-4.5 py-3">
                            <h5 className="text-sm font-medium text-text">
                                Notificaciones
                            </h5>
                        </div>
                        <ul className="max-h-60 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <li key={notification.id}>
                                        <button
                                            onClick={() =>
                                                handleNotificationClick(
                                                    notification.id,
                                                    notification.data.actionURL
                                                )
                                            }
                                            className="w-full text-left flex gap-3 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                                        >
                                          <i className={`fa ${notification.data.fas}`}></i>
                                          <div className="flex flex-col gap-2">
                                            <span className="text-sm text-gray-500 font-semibold">
                                                {notification.data.title}
                                            </span>
                                            <small className="text-xs text-gray-500">
                                                {fDateTime(notification.read_at)}
                                            </small>
                                          </div>
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li className="px-4.5 py-3 text-sm text-gray-500">
                                    No hay notificaciones
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </li>
        </ClickOutside>
    );
};

export default DropdownNotification;
