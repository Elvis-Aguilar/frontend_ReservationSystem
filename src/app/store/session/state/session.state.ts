export interface SessionState {
    accessToken: string,
    id: number,
    name: string,
    email: string,
    role: string
    paymentMethod: string
}

export const initialSessionState: SessionState = {
    accessToken: "",
    id: 0,
    name: "",
    email: "",
    role: "",
    paymentMethod: ""
}