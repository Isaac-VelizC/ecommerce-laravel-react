import Breadcrumb from "@/Components/Client/Breadcrumb";
import { UserInterface } from "@/Interfaces/User";
import Client from "@/Layouts/ClientLayout";
import { Head, Link } from "@inertiajs/react";
import React from "react";

type Props = {
    user: UserInterface;
};

export default function Account({ user }: Props) {
    const breadcrumbLinks = [
        { href: "/", label: "Home" },
        { href: "#", label: "Cuenta" },
        { href: "#", label: user.name },
    ];
    return (
        <Client>
            <Head title="Cuenta" />
            <Breadcrumb links={breadcrumbLinks} />
            {user.name}
            <Link href={route("logout")} method="post">
                Salir
            </Link>
        </Client>
    );
}
