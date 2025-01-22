export interface BannerInterface {
    id: number;
    title: string;
    slug: string;
    photo: string;
    description: string;
    status: string;
    [key: string]: unknown;
}