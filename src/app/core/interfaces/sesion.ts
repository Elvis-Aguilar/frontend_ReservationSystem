export interface SignInModel {
    email: string,
    password: string
}

export interface SignInMFAModel {
    email: string,
    code: number
}

export interface RecoverPasswordModel {
    email: string,
}