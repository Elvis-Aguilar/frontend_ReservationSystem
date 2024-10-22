import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ServiceDto } from '../utils/models/service.dto';
import { ServiceService } from '../utils/services/service.service';
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  state: string;
  categoryId: number;
  imageUrls: string[];
}

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent {

  products: ServiceDto[] = [];
  filteredProducts: ServiceDto[] = [];
  categories: Category[] = [];


  private readonly serviceService = inject(ServiceService)


  ngOnInit() {
    // Datos falsos de categorías
    this.categories = [
      { id: 1, name: 'Tecnología' },
      { id: 2, name: 'Hogar' },
      { id: 3, name: 'Ropa' },
    ];
    this.getServices()
  }

  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredProducts = this.products.filter(product => product.name.toLowerCase().includes(query));
  }

  /**
  onFilterChange(filter: string) {
    if (filter === 'available') {
      this.filteredProducts = this.products.filter(product => product.status === 'Disponible');
    } else if (filter === 'popular') {
      this.filteredProducts = this.products.filter(product => product.price > 150);
    } else {
      this.filteredProducts = this.products;
    }
  }
   */


  addToCart(product: Product) {

    console.log('Servicio agregado al carrito:', product);
  }

  trackByIndex(index: number, item: Product): number {
    return index;
  }

  getServices() {
    // Obtener los servicios disponibles
    this.serviceService.getServicesAvailable().subscribe({
      next: value => {
        this.filteredProducts = [...this.filteredProducts, ...value];
      }
    });

    // Obtener los servicios no disponibles
    this.serviceService.getServicesUnAvailable().subscribe({
      next: value => {
        this.filteredProducts = [...this.filteredProducts, ...value];
      }
    });
  }

  getStatus(estate: string): string {
    switch (estate) {
      case 'AVAILABLE':
        return 'DISPONIBLE'
      case 'UNAVAILABLE':
        return 'NO DISPONIBLE'
      default:
        return 'NO DISPONIBLE'
    }
  }

}
