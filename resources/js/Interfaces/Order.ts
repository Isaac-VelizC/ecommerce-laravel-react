import { ShippingInterface } from "./Shipping";

export interface OrderInterface {
    id: number;
    status: string;
    order_number: string;
    user_id: number;
    sub_total: number
    shipping_id: number;
    shipping: ShippingInterface;
    coupon: string;
    total_amount: number;
    quantity: number;
    payment_method: string;
    payment_status: string;
    first_name: string;
    last_name: string;
    date: string;
    email: string;
    phone: string;
    country: string;
    post_code: string;
    address1: string;
    address2: string;
    [key: string]: unknown;
}