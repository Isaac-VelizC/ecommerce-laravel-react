export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: string;
    photo: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
    flash: {
        message: FlashMessagesType;
    };
};

interface FlashMessagesType {
    error?: string;
    success?: string;
}
