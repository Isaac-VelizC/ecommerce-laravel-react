export interface CategoryInterface {
    id: number;
    title: string;
    slug: string;
    summary: string;
    photo: string;
    is_parent: boolean;
    children: CategoryInterface[];
    parent_info?: CategoryParentInterface;
    added_by: number;
    status: string;
    [key: string]: unknown;
}

export interface CategoryParentInterface {
    id: number;
    title: string;
    slug: string;
    summary: string;
    photo: string;
    is_parent: boolean;
    added_by: number;
    status: string;
}



export type FormCategoryType = {
    id: number;
    title: string;
    summary: string;
    photo: string;
    is_parent: boolean;
    parent_id: number;
    status: string;
}