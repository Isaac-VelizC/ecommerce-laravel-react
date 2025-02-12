import { ProductInterface } from "./Product";

export interface WishlistInterface {
    id: number;
    user_id: number;
    product_id: number;
    product: ProductInterface;
}