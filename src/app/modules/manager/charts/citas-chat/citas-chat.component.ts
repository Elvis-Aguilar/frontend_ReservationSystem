import { Component, Input, SimpleChanges, ViewChild } from "@angular/core";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  NgApexchartsModule
} from "ng-apexcharts";
import { AppointmentDto } from "../../../common-user/utils/models/appointment.dto";
import { ServiceDto } from "../../utils/models/service.dto";
import { BusinessConfigurationDto } from "../../utils/models/business-congifuration.dto";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};


@Component({
  selector: 'app-citas-chat',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './citas-chat.component.html',
  styleUrl: './citas-chat.component.scss'
})

export class CitasChatComponent {


  @ViewChild("chart") chart: ChartComponent | undefined;

  @Input() appointments!: AppointmentDto[];
  @Input() services!: ServiceDto[];
  @Input() mesReport!: string
  @Input() filterService!: number
  @Input() filterEmpleado!: number
  @Input() businessConfiguration!: BusinessConfigurationDto


  months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  mostrarHtml = false


  public chartOptions: ChartOptions = {
    series: [
      {
        name: "Ingresos",
        data: []
      }
    ],
    chart: {
      height: 350,
      type: "bar"
    },
    title: {
      text: "Ingresos en Quetzales"
    },
    xaxis: {
      categories: [],
      title: {
        text: "Dias"
      }
    }
  };

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.mostrarHtml = false;

      const filterFechas = this.getMonthStartAndEnd();
      const dateSumTotal: Record<string, number> = this.calcularIngresosPorDia(filterFechas);

      // Extraer claves y valores de dateSumTotal
      const categories = Object.keys(dateSumTotal).map(date => date.split("-")[2]); // Fechas (como string)
      const data = Object.values(dateSumTotal); // Totales (como number)

      // Crear una nueva referencia para chartOptions
      this.chartOptions = {
        ...this.chartOptions,
        xaxis: {
          ...this.chartOptions.xaxis,
          categories: categories,
        },
        series: [
          {
            ...this.chartOptions.series[0],
            data: data,
          },
        ],
      };

      // Habilitar la visualización del gráfico
      this.mostrarHtml = true;
    }
  }


  pasaFiltros(appointments: AppointmentDto): boolean {
    this.filterEmpleado = Number(this.filterEmpleado)
    this.filterService = Number(this.filterService)
    if (this.filterEmpleado > 0 && appointments.employeeId !== this.filterEmpleado) {
      return false
    }

    if (this.filterService > 0 && appointments.service !== this.filterService) {
      return false
    }

    return true
  }

  calcularIngresosPorDia(filterFechas: [string, string]): Record<string, number> {
    const [startFilterDate, endFilterDate] = filterFechas.map(date => new Date(date)); // Convertir fechas a objetos Date

    const dateSumTotal: Record<string, number> = {}; // Objeto para contar la frecuencia de cada servicio

    for (const appoint of this.appointments) {

      if (!this.pasaFiltros(appoint)) {
        continue
      }

      if (appoint.status !== 'COMPLETED') {
        continue
      }

      // Convertir startDate del appointment a objeto Date
      const appointDate = new Date(appoint.startDate.split("T")[0]);

      // Validar si la fecha está dentro del rango
      if (appointDate >= startFilterDate && appointDate <= endFilterDate) {

        //servicio
        const servicio = this.services.find(serv => serv.id === appoint.service)

        if (servicio) {
          let sum = 0
          if (appoint.fine) {
            sum += this.businessConfiguration.cancellationSurcharge
          }
          sum += servicio.price
          // Incrementar el contador del servicio
          dateSumTotal[appoint.startDate.split("T")[0]] = (dateSumTotal[appoint.startDate.split("T")[0]] || 0) + sum;
        }
      }
    }

    return dateSumTotal;

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

