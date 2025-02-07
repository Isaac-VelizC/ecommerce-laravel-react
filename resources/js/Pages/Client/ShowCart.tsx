import Breadcrumb from "@/Components/Client/Breadcrumb";
import Client from "@/Layouts/ClientLayout";
import React from "react";

type Props = {};

export default function ShowCart({}: Props) {
    const breadcrumbLinks = [
        { href: "/", label: "Home" },
        { href: "cart", label: "Cart" },
    ];
    return (
        <Client>
            <Breadcrumb links={breadcrumbLinks} />
            <div>ShowCart</div>
        </Client>
    );
}
