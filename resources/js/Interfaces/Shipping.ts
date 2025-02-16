export interface ShippingInterface {
    id: number;
    type: string;
    price: string;
    status: string;
    [key: string]: unknown;
}

export type FormShippingType = {
    id: number;
    type: string;
    price: string;
    status: string;
}
