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
                    href={route("profile.edit")}
                    className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                >
                    Profile
                </Dropdown.Link>
                <Dropdown.Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                >
                    Log Out
                </Dropdown.Link>
            </Dropdown.Content>
        </Dropdown>
    );
};

export default DropdownUser;
