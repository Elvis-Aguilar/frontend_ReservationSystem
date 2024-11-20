export interface BusinessHour {
  id: number;
  dayOfWeek: string;
  openingTime: string;
  closingTime: string;
  status: string;
  specificDate?: string;
}

export interface UserHoursDto {
  id: number,
  name: string,
  email: string
}

export interface UpdateUserBusinessHours{
  users:Array<number> 
}