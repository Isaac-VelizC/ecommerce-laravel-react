import { useState } from "react";
//import { Link } from 'react-router-dom';
import ClickOutside from "../../ClickOutside";
import UserOne from "@/assets/img/blog/blog-2.jpg";
import Dropdown from "@/Components/Dropdown";
import { usePage } from "@inertiajs/react";

const DropdownUser = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user } = usePage().props.auth;

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <div className="flex items-center gap-4 cursor-pointer">
                    <span className="hidden text-right lg:block">
                        <span className="block text-sm font-medium text-black dark:text-white">
                            {user.name}
                        </span>
                        <span className="block text-xs">{user.email}</span>
                    </span>
                    <div
                        className="h-12 w-12 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${UserOne})` }}
                    />
                </div>
            </Dropdown.Trigger>

            <Dropdown.Content>
                <Dropdown.Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width={20}
                        height={20}
                        fill="black"
                    >
                        <title>logout</title>
                        <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12M4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" />
                    </svg>
                    Log Out
                </Dropdown.Link>
            </Dropdown.Content>
        </Dropdown>
    );
};

export default DropdownUser;
