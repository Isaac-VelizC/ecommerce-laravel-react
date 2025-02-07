export interface ShippingInterface {
    id: number;
    type: string;
    price: string;
    status: string;
    [key: string]: unknown;
}
