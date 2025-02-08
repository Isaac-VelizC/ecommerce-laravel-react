import { ProductInterface } from "./Product";

export interface CartInterface {
    id: number;
    //product_id: number;
    product: ProductInterface;
    order_id: number;
    user_id: number;
    price: number
    status: string;
    quantity: number;
    amount: number;
}