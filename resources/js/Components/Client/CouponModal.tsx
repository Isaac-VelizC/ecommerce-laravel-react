import React, { useState } from "react";
import Modal from "../Modal";
import { CouponInterface } from "@/Interfaces/Coupon";

type Props = {
    show: boolean;
    onCloseModal: () => void;
    coupons: CouponInterface[];
    total: number;
    applyDiscount: (code: string, discount: number) => void;
};

const CouponModal = ({ show, onCloseModal, coupons, total, applyDiscount }: Props) => {
    
    const [coupon, setCoupon] = useState("");
    const [error, setError] = useState("");
    
    const applyCoupon = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const couponCode: string = coupon.trim().toUpperCase();
        const couponObj = coupons.find(c => c.code === couponCode);
        
        if (couponObj) {
            const { type, value } = couponObj;
            let discount = 0;
            
            if (type === "Fijo") {
                discount = value;
            } else if (type === "Porcentaje") {
                discount = (total * value) / 100;
            }
            applyDiscount(couponCode, discount);
            setCoupon("");
            onCloseModal();
        } else {
            setError("Código no válido");
        }
    };

    return (
        <Modal show={show} onClose={onCloseModal}>
            <div className="p-6">
                <h6 className="font-semibold uppercase text-center mb-4">Códigos de descuento</h6>
                <form onSubmit={applyCoupon} className="relative inline-block w-full">
                    <input
                        className="h-13 w-full border-[1px] bg-gray-100/80 border-solid pl-8 pr-30 text-sm rounded-full focus:ring-0 focus:border-accent"
                        type="text"
                        placeholder="Ingrese su código de cupón"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                    />
                    <button type="submit" className="site-btn absolute right-1 top-1">
                        Aplicar
                    </button>
                </form>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
        </Modal>
    );
};

export default CouponModal
