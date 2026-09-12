import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { ProductFilterService } from './features/products/product-filter.service';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly filters = inject(ProductFilterService);

  protected readonly searchQuery = this.filters.searchQuery;

  onSearch(event: Event): void {
    this.filters.setSearchQuery((event.target as HTMLInputElement).value);
  }
}
