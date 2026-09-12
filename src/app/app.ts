import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { InputText } from '@openng/optimus-ui/inputtext';

import { ProductFilterService } from './features/products/product-filter.service';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, ButtonDirective, InputText],
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
