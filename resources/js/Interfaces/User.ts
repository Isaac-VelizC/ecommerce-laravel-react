export interface UserInterface {
    id: number;
    name: string;
    email: string;
    photo: string;
    role: string;
    provider: string;
    provider_id: number;
    status: string;
    [key: string]: unknown;
}

export type FormUserType = {
    id: number;
    name: string;
    email: string;
    password: string;
    photo: string;
    photoFile?: File | null;
    role: string;
    status: string;
}