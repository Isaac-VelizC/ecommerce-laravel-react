import { PostCategoryInterface } from "./PostCategory";
import { UserInterface } from "./User";

export interface PostInterface {
    id: number;
    title: string;
    slug: string;
    summary: string;
    description: string;
    photo: string;
    tags: string;
    status: string;
    post_cat_id: number;
    cat_info: PostCategoryInterface;
    added_by: number;
    author_info: UserInterface;
    [key: string]: unknown;
}


export type FormPostType = {
    id: number;
    title: string;
    summary: string;
    description: string;
    photo: string;
    status: string;
    post_cat_id: number;
    tags: string;
}