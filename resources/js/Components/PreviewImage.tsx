import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconClose } from "./Client/IconSvgClient";

type Props = {
    imageUrl: string;
    isOpen: boolean;
    onClose: () => void;
};

const PreviewImage: React.FC<Props> = ({ imageUrl, isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black-2 bg-opacity-70 flex justify-center items-center z-9999"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="bg-transparent rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={imageUrl}
                            alt="Vista previa"
                            className="relative max-w-full max-h-screen rounded-lg"
                        />
                    </motion.div>
                    <button
                        className="absolute top-4 right-4 text-gray-600 hover:scale-125 transition duration-300 ease-in-out"
                        onClick={onClose}
                    >
                        <IconClose size={40} />
                    </button>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PreviewImage;
