export interface AppointmentDto{
    id:number;
    customer:number;
    service:number;
    employeeId:number;
    startDate:string;
    endDate:string;
    status:string;
    paymentMethod:string;
}