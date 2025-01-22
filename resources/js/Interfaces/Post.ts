export interface Post {
    id: number;
    title: string;
    slug: string;
    summary: string;
    description: string;
    quote: string;
    photo: string;
    tags: string;
    status: string;
    post_cat_id: number;
    post_tag_id: number;
    added_by: number;
}