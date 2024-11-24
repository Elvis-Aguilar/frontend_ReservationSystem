import { Component, Input, SimpleChanges } from "@angular/core";
import { AppointmentDto } from "../../../common-user/utils/models/appointment.dto";
import { employeDto } from "../../../common-user/utils/models/employes.dto";

interface ServicesCount {
  name: string;
  count: number
}

@Component({
  selector: 'app-compare-empleados-chart',
  standalone: true,
  imports: [],
  templateUrl: './compare-empleados-chart.component.html',
  styleUrl: './compare-empleados-chart.component.scss'
})
export class CompareEmpleadosChartComponent {


  @Input() appointments!: AppointmentDto[];
  @Input() employee: employeDto[] = []
  @Input() mesReport!: string

  months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  mostrarHtml = false
  totalReservaciones = 0
  servicesCount: ServicesCount[] = []
  percentages!: any
  segments!: any
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  cumulativePercentage = 0;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.mostrarHtml = false;

      const filterFechas = this.getMonthStartAndEnd();
      this.servicesCount = this.calcularResevacionesPorServicio(filterFechas);

      const percentages = this.servicesCount.map((service) => ({
        ...service,
        percentage: Math.round((service.count / this.totalReservaciones) * 100),
      }));

      this.segments = percentages.map((service, index) => {
        const dashArray = `${(service.percentage / 100) * 251.3} 251.3`;
        const rotation = this.cumulativePercentage * 360 / 100 - 90;
        this.cumulativePercentage += service.percentage;

        return {
          ...service,
          dashArray,
          rotation,
          color: this.colors[index % this.colors.length],
        };
      });

      this.mostrarHtml = true;
    }
  }

  calcularResevacionesPorServicio(filterFechas: [string, string]): ServicesCount[] {
    this.totalReservaciones = 0
    const [startFilterDate, endFilterDate] = filterFechas.map(date => new Date(date)); // Convertir fechas a objetos Date

    const serviceCount: Record<number, number> = {}; // Objeto para contar la frecuencia de cada servicio

    for (const appoint of this.appointments) {

      // Convertir startDate del appointment a objeto Date
      const appointDate = new Date(appoint.startDate.split("T")[0]);

      // Validar si la fecha está dentro del rango
      if (appointDate >= startFilterDate && appointDate <= endFilterDate) {

        const serviceId = appoint.employeeId;

        serviceCount[serviceId] = (serviceCount[serviceId] || 0) + 1;
      }
    }

    const servicesCont: ServicesCount[] = []

    for (const [serviceId, count] of Object.entries(serviceCount)) {
      const idService = Number(serviceId);
      const servi = this.employee.find(ser => ser.id === idService)?.name
      const tmp = {
        name: servi || '',
        count: count
      }
      servicesCont.push(tmp)
      this.totalReservaciones += count;
    }

    return servicesCont;

  }

  getMonthStartAndEnd(): [string, string] {

    // Buscar el índice del mes
    const monthIndex = this.months.indexOf(this.mesReport);
    if (monthIndex === -1) {
      throw new Error("El mes proporcionado no es válido.");
    }

    const year = new Date().getFullYear(); // Año actual
    const startDate = new Date(year, monthIndex, 1); // Primer día del mes
    const endDate = new Date(year, monthIndex + 1, 0); // Último día del mes

    // Convertir a formato YYYY-MM-DD
    const formatDate = (date: Date): string =>
      `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

    return [formatDate(startDate), formatDate(endDate)];
  }


}
