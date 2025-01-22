export interface CartInterface {
    id: number;
    product_id: number;
    order_id: number;
    user_id: number;
    price: number
    status: string;
    quantity: number;
    amount: number;
}