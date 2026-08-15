import { Component, inject, signal } from '@angular/core';

import { Product } from './product.model';
import { ProductService } from './product.service';

@Component({
  selector: 'app-products-page',
  templateUrl: './products.page.html',
  styleUrl: './products.page.css',
})
export class ProductsPage {
  private readonly productService = inject(ProductService);
  
  protected readonly products = this.productService.products;
  // protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  
  constructor() {
    console.log("🚀 ~ ProductsPage ~ products:", this.products)
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load products. Please try again later.');
        this.loading.set(false);
      },
    });
  }
}
