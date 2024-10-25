import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ServiceService } from './../../manager/utils/services/service.service';
import { ServiceDto } from './../../manager/utils/models/service.dto';
import { RouterModule } from '@angular/router';interface Product {
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
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.scss'
})
export class ServiciosComponent {
  products: ServiceDto[] = [];
  filteredProducts: ServiceDto[] = [];
  searchQuery: string = '';
  maxPrice: number = 1000;
  selectedPrice: number = 1000;

  private readonly serviceService = inject(ServiceService)

  ngOnInit() {
    this.getServices();
  }

  onSearch(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
    this.filterProducts();
  }

  onPriceFilter(event: any) {
    this.selectedPrice = event.target.value;
    this.filterProducts();
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchQuery);
      const matchesPrice = product.price <= this.selectedPrice;
      return matchesSearch && matchesPrice;
    });
  }

  getServices() {
    this.serviceService.getServicesAvailable().subscribe({
      next: value => {
        this.products = value;
        this.filteredProducts = [...this.products];
      }
    });

    this.serviceService.getServicesUnAvailable().subscribe({
      next: value => {
        this.products = [...this.products, ...value];
        this.filteredProducts = [...this.products];
      }
    });
  }

  getStatus(estate: string): string {
    switch (estate) {
      case 'AVAILABLE':
        return 'DISPONIBLE';
      case 'UNAVAILABLE':
        return 'NO DISPONIBLE';
      default:
        return 'NO DISPONIBLE';
    }
  }

  addToCart(product: Product) {
    console.log('Servicio agregado al carrito:', product);
  }

  trackByIndex(index: number, item: Product): number {
    return index;
  }  
}
