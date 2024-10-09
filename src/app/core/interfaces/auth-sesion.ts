export interface SignUpDto {
    name: string;
    cui: string;
    email: string;
    phone: string;
    nit: string;
    password: string;
}

export interface UserDto {
    id: number;
    name: string;
    email: string;
    nit: string;
    phone: string;
    createdAt: string;
    hasMultiFactorAuth: boolean;
    role: string;
    permissions: Array<string>
}

export interface TokenDto {
    accessToken: string;
    id: number;
    name: string;
    email: string;
    temporal: boolean;
    role: string;
}

