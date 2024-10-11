import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent {
  products: Product[] = []; 
  filteredProducts: Product[] = []; 
  categories: Category[] = [];

  ngOnInit() {
    // Datos falsos de categorías
    this.categories = [
      { id: 1, name: 'Tecnología' },
      { id: 2, name: 'Hogar' },
      { id: 3, name: 'Ropa' },
    ];

    // Datos falsos de productos
    this.products = [
      {
        id: 1,
        name: 'Servicio 1',
        description: 'Descripción del Servicio 1',
        price: 100,
        state: 'Disponible',
        categoryId: 1,
        imageUrls: ['https://static.nationalgeographic.es/files/styles/image_3200/public/75552.ngsversion.1422285553360.jpg?w=1900&h=1267']
      },
      {
        id: 2,
        name: 'Servicio 2',
        description: 'Descripción del Servicio 2',
        price: 200,
        state: 'Disponible',
        categoryId: 2,
        imageUrls: ['https://static.nationalgeographic.es/files/styles/image_3200/public/75552.ngsversion.1422285553360.jpg?w=1900&h=1267']
      },
      {
        id: 3,
        name: 'Servicio 3',
        description: 'Descripción del Servicio 3',
        price: 300,
        state: 'No disponible',
        categoryId: 3,
        imageUrls: ['https://static.nationalgeographic.es/files/styles/image_3200/public/75552.ngsversion.1422285553360.jpg?w=1900&h=1267']
      }
    ];

    this.filteredProducts = this.products;
  }

  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredProducts = this.products.filter(product => product.name.toLowerCase().includes(query));
  }

  onFilterChange(filter: string) {
    if (filter === 'available') {
      this.filteredProducts = this.products.filter(product => product.state === 'Disponible');
    } else if (filter === 'popular') {
      this.filteredProducts = this.products.filter(product => product.price > 150);
    } else {
      this.filteredProducts = this.products;
    }
  }

  onCategoryChange(categoryId: number) {
    this.filteredProducts = this.products.filter(product => product.categoryId === categoryId);
  }

  addToCart(product: Product) {

    console.log('Servicio agregado al carrito:', product);
  }

  trackByIndex(index: number, item: Product): number {
    return index;
  }  
}
