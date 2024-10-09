import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  state: string;
  categoryId: number; // Asegúrate de incluir categoryId
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
export class ServiciosComponent implements OnInit {
  products: Product[] = []; // Define el tipo como Product[]
  filteredProducts: Product[] = []; // Define el tipo como Product[]
  categories: Category[] = []; // Define el tipo como Category[]

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
      // Lógica para productos populares (esto es solo un ejemplo)
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
