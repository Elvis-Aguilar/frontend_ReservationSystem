import { PermissionDTO } from "../../../manager/utils/models/collaborators"

export interface employeDto{
    id: number,
    name: string,
    email: string,
    nit: string,
    cui: string,
    phone: string,
    imageUrl:string
}

export interface employe{
    id: number,
    name: string,
    email: string,
    nit: string,
    cui: string,
    phone: string,
    imageUrl:string,
    permissions: PermissionDTO[]
}