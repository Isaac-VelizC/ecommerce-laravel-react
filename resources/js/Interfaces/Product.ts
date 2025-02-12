import { BrandInterface } from "./Brand";
import { CategoryInterface } from "./Category";
import { ProductReviewInterface } from "./ProducReview";

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface ProductInterface {
    id: number;
    title: string;
    slug: string;
    summary: string;
    description: string;
    photo: string;
    cat_id: number;
    cat_info: CategoryInterface;
    get_review_avg_rate: number | null;
    get_review: ProductReviewInterface[];
    is_in_wishlist: boolean;
    child_cat_id: string;
    price: number;
    brand?: BrandInterface;
    discount: number;
    status: string;
    size: string;
    stock: number;
    is_featured: boolean;
    condition: string;
    [key: string]: unknown;
}

export type FormProductType = {
    id: number;
    title: string;
    summary: string;
    description: string;
    photo: string;
    cat_id: string;
    child_cat_id: string;
    price: number;
    brand_id: string;
    discount: number;
    status: string;
    size: string;
    stock: number;
    is_featured: boolean;
    condition: string;
};
