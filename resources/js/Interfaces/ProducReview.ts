export interface ProductReview {
    id: number;
    user_id: number;
    product_id: number;
    rate: number;
    status: string;
    review: string;
}