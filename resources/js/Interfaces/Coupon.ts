export interface CouponInterface {
    id: number;
    code: string;
    type: string;
    value: number;
    status: string;
    [key: string]: unknown;
}

export type FormCouponType = {
    id: number;
    code: string;
    type: string;
    value: number;
    status: string;
}