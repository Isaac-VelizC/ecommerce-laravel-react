import BagIcon from "@/assets/svg/bag.svg";
import HeartIcon from "@/assets/svg/heart.svg";
import SearchIcon from "@/assets/svg/search.svg";
import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CartInterface } from "@/Interfaces/Cart";

interface Props {
  cartItems: CartInterface[];
}

const IconsNavBar: React.FC<Props> = ({ cartItems }) => {
  const [countFavorite, setCountFavorite] = useState<number>(0);
  useEffect(() => {
    // Recuperar productos del Local Storage
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setCountFavorite(storedFavorites.length);
  }, []);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartPreviewVariants = {
    open: { opacity: 1, y: 0, display: "block" },
    closed: {
      opacity: 0,
      y: -20,
      transitionEnd: { display: "none" },
    },
  };

  return (
    <ul className="list-none flex space-x-5">
      <li>
        <img src={SearchIcon} alt="Icon Search" width={18} />
      </li>
      <li>
        <Link href={route("page.list.favorite")} className="relative">
          <img src={HeartIcon} alt="Icon Heart" width={20} />
          {countFavorite >= 0 && (
            <div className="absolute -right-3 -top-[11px] h-4 w-4 bg-black text-white text-xs leading-tight rounded-full text-center">
              {countFavorite}
            </div>
          )}
        </Link>
      </li>
      <li
        className="relative"
        onMouseEnter={() => setIsCartOpen(true)}
        onMouseLeave={() => setIsCartOpen(false)}
      >
        <a href="#" className="relative">
          <img src={BagIcon} alt="Icon Bag" width={15} />
          <div className="absolute -right-3 -top-[11px] h-4 w-4 bg-black text-white text-xs leading-tight rounded-full text-center">
            {cartCount}
          </div>
        </a>

        <motion.div
          className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-10"
          variants={cartPreviewVariants}
          initial="closed"
          animate={isCartOpen ? "open" : "closed"}
          style={{ display: "none" }} // Initially hidden
        >
          {cartItems.length === 0 ? (
            <div className="p-4 text-gray-600">Tu carrito está vacío.</div>
          ) : (
            <ul>
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="p-2 flex items-center border-b last:border-b-0"
                >
                  <img
                    src={item.product.photo}
                    alt={item.product.title}
                    className="w-12 h-12 object-cover rounded mr-4"
                  />
                  <div>
                    <p className="text-sm font-semibold">{item.product.title}</p>
                    <p className="text-xs text-gray-600">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {cartItems.length > 0 && (
            <a
              href={route('cart')}
              className="block p-4 text-center bg-primary hover:bg-pink-400 text-sm font-semibold text-white"
            >
              🛒 Ver Carrito
            </a>
          )}
        </motion.div>
      </li>
    </ul>
  );
};

export default IconsNavBar;
