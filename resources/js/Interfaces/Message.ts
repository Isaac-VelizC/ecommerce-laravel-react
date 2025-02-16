export interface MessageInterface {
    id: number;
    name: string;
    subject: string;
    email: string;
    photo: string;
    phone: string;
    message: string;
    read_at: string;
    created_at: string;
    [key: string]: unknown;
}