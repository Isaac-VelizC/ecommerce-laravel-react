import AccountLayout from "@/Layouts/AccountLayout";
import React from "react";

type Props = {};

export default function ReviewClient({}: Props) {
    return (
        <AccountLayout>
            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    reseñas
                </div>
            </div>
        </AccountLayout>
    );
}
