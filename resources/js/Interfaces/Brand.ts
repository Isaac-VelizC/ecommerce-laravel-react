export interface BrandInterface {
    id: number;
    title: string;
    slug: string;
    status: string;
    [key: string]: unknown;
}

export type formBrandType = {
    id: number | null;
    title: string;
    status: string;
}