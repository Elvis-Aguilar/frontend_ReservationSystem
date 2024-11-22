export interface AppointmentDto{
    id:number;
    customer:number;
    service:number;
    employeeId:number;
    startDate:string;
    endDate:string;
    status:string;
    paymentMethod:string;
    fine?:boolean;
}

export interface AppointmentCreateDto{
    customer?:number;
    service?:number;
    employeeId?:number;
    startDate?:string;
    endDate?:string;
    status?:string;
    paymentMethod?:string;
    day?:string;
    hoursId?:number;
}

export interface SendAppointmentCreateDto{
    customer:number;
    service:number;
    employeeId:number;
    startDate:string;
    endDate:string;
    status:string;
    paymentMethod:string;
}