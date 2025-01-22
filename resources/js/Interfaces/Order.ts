export interface Order {
    id: number;
    status: string;
    order_number: string;
    user_id: number;
    sub_total: number
    shipping_id: number;
    coupon: number;
    total_amount: number;
    quantity: number;
    payment_method: string;
    payment_status: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    country: string;
    post_code: string;
    address1: string;
    address2: string;
}