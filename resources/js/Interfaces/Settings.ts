export interface SettingInterface {
    id: number;
    description: string;
    short_des: string;
    logo: string;
    photo: string;
    address: string;
    phone: string;
    email: string;
    [key: string]: string | number;
}
