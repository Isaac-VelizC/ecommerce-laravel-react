export interface BannerInterface {
    id: number;
    title: string;
    slug: string;
    photo: string;
    description: string;
    status: string;
    [key: string]: unknown;
}

export type FormBannerType = {
    id: number;
    title: string;
    photo: string;
    description: string;
    status: string;
}