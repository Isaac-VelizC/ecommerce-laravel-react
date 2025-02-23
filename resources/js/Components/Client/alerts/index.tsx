import React from "react";
import { IconClose } from "../IconSvgClient";

type AlertProps = {
    type: "success" | "info" | "warning" | "error";
    message: string;
    closeAlert: () => void
};

export const Alert: React.FC<AlertProps> = ({ type, message, closeAlert }) => {
    const alertStyles: Record<string, string> = {
        success: "bg-green-100 dark:bg-green-900 border-green-500 dark:border-green-700 text-green-900 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800",
        info: "bg-blue-100 dark:bg-blue-900 border-blue-500 dark:border-blue-700 text-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800",
        warning: "bg-yellow-100 dark:bg-yellow-900 border-yellow-500 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100 hover:bg-yellow-200 dark:hover:bg-yellow-800",
        error: "bg-red-100 dark:bg-red-900 border-red-500 dark:border-red-700 text-red-900 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800",
    };

    const iconColors: Record<string, string> = {
        success: "text-green-600",
        info: "text-blue-600",
        warning: "text-yellow-600",
        error: "text-red-600",
    };

    return (
        <div
            role="alert"
            className={`${alertStyles[type]} border-l-4 p-2 rounded-lg flex items-center justify-between transition duration-300 ease-in-out transform hover:scale-105`}
        >
            <div className="flex items-center ">
                <svg
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`h-5 w-5 flex-shrink-0 mr-2 ${iconColors[type]}`}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    ></path>
                </svg>
                <p className="text-sm font-semibold">{message}</p>
            </div>
            <div className="mr-6 cursor-pointer" onClick={closeAlert}>
                <IconClose size={20} color={iconColors[type]}/>
            </div>
        </div>
    );
};