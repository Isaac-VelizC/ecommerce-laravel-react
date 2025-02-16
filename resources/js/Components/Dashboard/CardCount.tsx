import React, { ReactNode, useEffect, useState } from "react";

type Props = {
    icon: ReactNode;
    value: number;
    label: string;
    variant?: "default" | "success" | "warning" | "danger";
};

const CardCount = ({ icon, value, label, variant = "default" }: Props) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 1000; // 1 segundo de animación
        const step = Math.ceil(value / (duration / 16)); // Ajusta según FPS (~16ms por frame)

        const timer = setInterval(() => {
            start += step;
            if (start >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, 16); // Aproximadamente 60FPS

        return () => clearInterval(timer);
    }, [value]);

    const variantStyles = {
        default: "bg-card text-card-foreground",
        success: "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100",
        warning: "bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100",
        danger: "bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100",
    };

    return (
        <div className={"rounded-lg py-2 transition-all hover:shadow-lg " + variantStyles[variant]}>
            <div className="flex items-center p-4">
                <div className="rounded-full p-3 bg-background/10">{icon}</div>
                <div className="ml-4">
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm text-muted-foreground">{label}</div>
                </div>
            </div>
        </div>
    );
};

export default CardCount;
