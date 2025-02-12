import { motion, AnimatePresence } from "framer-motion";
import { IconHeart, IconHeartFull } from "@/Components/Client/IconSvgClient"; // Asegúrate de importar los iconos

interface LikeButtonProps {
    isLiked?: boolean; // Permite pasar un estado inicial
    onClick?: (liked: boolean) => void; // Permite manejar eventos
    classname?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ isLiked = false, onClick, classname }) => {
    const handleClick = () => {
        onClick && onClick(!isLiked); // Llama la función si está definida
    };

    return (
        <motion.li
            onClick={handleClick}
            className={"inline-block cursor-pointer " + classname}
            layout
        >
            <AnimatePresence mode="wait">
                {isLiked ? (
                    <motion.div
                        key="liked"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <IconHeartFull color="red" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="unliked"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <IconHeart color="black" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.li>
    );
};

export default LikeButton;
