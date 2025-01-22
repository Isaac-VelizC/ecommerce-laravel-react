export interface PostComment {
    id: number;
    user_id: number;
    post_id: number;
    comment: string;
    status: string;
    replied_comment: string;
    parent_id: number;
}