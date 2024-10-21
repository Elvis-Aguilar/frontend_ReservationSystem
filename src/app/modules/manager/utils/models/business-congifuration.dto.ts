export interface BusinessConfigurationDto{
    id:number;
    name:string;
    logoUrl:string;
    admin:number;
    createdAt:string,
    description: string;
    businessType: string;
    maxDaysCancellation: number;
    maxHoursCancellation: number;
    cancellationSurcharge: number;
    maxDaysUpdate: number;
    maxHoursUpdate: number;
}