export interface SettingInterface {
    id: number;
    description: string;
    short_des: string;
    logo: string;
    logoFile: File | null;
    photo: string;
    photoFile: File | null;
    address: string;
    phone: string;
    email: string;
    [key: string]: string | number | File | null;
}
