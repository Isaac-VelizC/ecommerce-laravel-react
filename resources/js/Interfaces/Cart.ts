import { ProductInterface, ProductInventaryInterface } from "./Product";

export interface CartInterface {
    id: number;
    //inventario: ProductInventaryInterface;
    product: ProductInterface;
    order_id: number;
    user_id: number;
    price: number
    status: string;
    quantity: number;
    amount: number;
    inventario_con_detalles: ProductInventaryInterface;
}