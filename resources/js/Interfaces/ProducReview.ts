import { ProductInterface } from "./Product";
import { UserInterface } from "./User";

export interface ProductReviewInterface {
    id: number;
    user_info: UserInterface;
    user_id: number;
    product: ProductInterface;
    product_id: number;
    rate: number;
    status: string;
    review: string;
}