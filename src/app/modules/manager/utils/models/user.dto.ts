export interface UserDto {
    id: number;
    name: string;
    email: string;
    nit: string;
    cui:string;
    phone: string;
    hasMultiFactorAuth: boolean;
    role: string;
    imageUrl: string;
    permissions: Array<string>
}

export interface PasswordChangeDto{
    password:string;
    repeatedPassword:string;
}