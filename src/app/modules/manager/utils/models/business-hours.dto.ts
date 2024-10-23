export interface BusinessHour {
    id: number;
    dayOfWeek: string;
    openingTime: string;
    closingTime: string;
    status: string;
    specificDate?: string;
  }