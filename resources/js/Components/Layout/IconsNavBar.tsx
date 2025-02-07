import BagIcon from "@/assets/svg/bag.svg";
import HeartIcon from "@/assets/svg/heart.svg";
import SearchIcon from "@/assets/svg/search.svg";
import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";

type Props = {};

const IconsNavBar = (props: Props) => {
    const [countFavorite, setCountFavorite] = useState<number>(0);
    useEffect(() => {
        // Recuperar productos del Local Storage
        const storedFavorites = JSON.parse(
            localStorage.getItem("favorites") || "[]"
        );
        setCountFavorite(storedFavorites.length);
    }, []);
    
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
            <li>
                <a href="#" className="relative">
                    <img src={BagIcon} alt="Icon Bag" width={15} />
                    <div className="absolute -right-3 -top-[11px] h-4 w-4 bg-black text-white text-xs leading-tight rounded-full text-center">
                        2
                    </div>
                </a>
            </li>
        </ul>
    );
};

export default IconsNavBar;
