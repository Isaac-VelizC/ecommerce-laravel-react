export interface CategoryInterface {
    id: number;
    title: string;
    slug: string;
    summary: string;
    photo: string;
    is_parent: boolean;
    added_by: number;
    status: string;
}