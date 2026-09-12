import { Injectable, signal } from '@angular/core';

import { SortOption } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductFilterService {
  readonly searchQuery = signal('');
  readonly selectedCategory = signal('all');
  readonly selectedStore = signal('all');
  readonly sortBy = signal<SortOption>('recommended');
  readonly basket = signal<string[]>([]);

  setSearchQuery(value: string): void {
    this.searchQuery.set(value);
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  setStore(store: string): void {
    this.selectedStore.set(store);
  }

  setSortBy(sort: SortOption): void {
    this.sortBy.set(sort);
  }

  toggleBasket(productId: string): void {
    this.basket.update((ids) =>
      ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId],
    );
  }

  isInBasket(productId: string): boolean {
    return this.basket().includes(productId);
  }
}
