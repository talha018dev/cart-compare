import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '@openng/optimus-ui/button';
import { Select, SelectModule } from '@openng/optimus-ui/select';
import { Skeleton } from '@openng/optimus-ui/skeleton';
import { Tag } from '@openng/optimus-ui/tag';

import { ProductFilterService } from './product-filter.service';
import { Product, ProductViewModel, SortOption } from './product.model';
import { ProductService } from './product.service';

@Component({
  selector: 'app-products-page',
  imports: [NgOptimizedImage, FormsModule, Button, Select, Skeleton, Tag, SelectModule],
  templateUrl: './products.page.html',
  styleUrl: './products.page.css',
})
export class ProductsPage {
  private readonly productService = inject(ProductService);
  private readonly filters = inject(ProductFilterService);

  protected readonly products = this.productService.products;
  protected readonly searchQuery = this.filters.searchQuery;
  protected readonly selectedCategory = this.filters.selectedCategory;
  protected readonly selectedStore = this.filters.selectedStore;
  protected readonly sortBy = this.filters.sortBy;
  protected readonly basket = this.filters.basket;
  protected readonly basketOpen = signal(false);
  protected readonly sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Recommended', value: 'recommended' },
    { label: 'Biggest discount', value: 'discount' },
    { label: 'Lowest price', value: 'price' },
  ];

  protected readonly categories = computed(() => {
    const items = this.products.value() ?? [];
    return [...new Set(items.map((product) => product.category))].sort();
  });

  protected readonly stores = computed(() => {
    const items = this.products.value() ?? [];
    const storeMap = new Map<string, string>();

    for (const product of items) {
      for (const storeProduct of product.storeProducts) {
        storeMap.set(storeProduct.storeSlug, storeProduct.storeName);
      }
    }

    return [...storeMap.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  });

  protected readonly productViewModels = computed(() =>
    (this.products.value() ?? []).map((product) => this.toViewModel(product)),
  );

  protected readonly filteredProducts = computed(() => {
    let items = this.productViewModels().filter((item) => {
      const matchesCategory =
        this.selectedCategory() === 'all' ||
        item.product.category.toLowerCase() === this.selectedCategory().toLowerCase();
      const matchesStore =
        this.selectedStore() === 'all' ||
        item.product.storeProducts.some((storeProduct) => storeProduct.storeSlug === this.selectedStore());
      const query = this.searchQuery().trim().toLowerCase();
      const matchesQuery =
        !query ||
        item.product.name.toLowerCase().includes(query) ||
        item.product.category.toLowerCase().includes(query) ||
        (item.product.brand?.toLowerCase().includes(query) ?? false);

      return matchesCategory && matchesStore && matchesQuery;
    });

    const sort = this.sortBy();
    if (sort === 'discount') {
      items = [...items].sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0));
    } else if (sort === 'price') {
      items = [...items].sort((a, b) => a.bestOffer.price - b.bestOffer.price);
    }

    return items;
  });

  protected readonly totalSavings = computed(() =>
    this.filteredProducts().reduce((sum, item) => sum + (item.savings ?? 0), 0),
  );

  protected readonly basketItems = computed(() => {
    const selectedIds = new Set(this.basket());
    return this.productViewModels().filter((item) => selectedIds.has(item.product.id));
  });

  protected readonly shwapnoTotal = computed(() => this.calculateStoreTotal('shwapno'));
  protected readonly agoraTotal = computed(() => this.calculateStoreTotal('agora'));

  protected readonly bestStoreLabel = computed(() => {
    const shwapno = this.shwapnoTotal();
    const agora = this.agoraTotal();

    if (shwapno === agora) {
      return 'Both stores tie';
    }

    const winner = shwapno < agora ? 'Shwapno' : 'Agora';
    return `${winner} saves ৳${Math.abs(shwapno - agora).toLocaleString('en-BD')}`;
  });

  setCategory(category: string): void {
    this.filters.setCategory(category);
  }

  setStore(store: string): void {
    this.filters.setStore(store);
  }

  setSort(sort: SortOption): void {
    this.filters.setSortBy(sort);
  }

  toggleBasket(productId: string): void {
    this.filters.toggleBasket(productId);
  }

  isInBasket(productId: string): boolean {
    return this.filters.isInBasket(productId);
  }

  openBasket(): void {
    this.basketOpen.set(true);
  }

  closeBasket(): void {
    this.basketOpen.set(false);
  }

  formatPrice(value: number): string {
    return `৳${value.toLocaleString('en-BD')}`;
  }

  storeTone(storeSlug: string): { text: string; dot: string } {
    return storeSlug === 'shwapno'
      ? { text: 'text-store-shwapno', dot: 'bg-store-shwapno' }
      : { text: 'text-store-agora', dot: 'bg-store-agora' };
  }

  oppositeStoreName(storeSlug: string): string {
    return storeSlug === 'shwapno' ? 'Agora' : 'Shwapno';
  }

  private toViewModel(product: Product): ProductViewModel {
    const sortedOffers = [...product.storeProducts].sort((a, b) => a.price - b.price);
    const bestOffer = sortedOffers[0];
    const compareOffer = sortedOffers[1] ?? null;
    const originalPrice = bestOffer.originalPrice;
    const discount =
      originalPrice && originalPrice > bestOffer.price
        ? Math.round((1 - bestOffer.price / originalPrice) * 100)
        : null;
    const savings = originalPrice ? originalPrice - bestOffer.price : null;

    return {
      product,
      bestOffer,
      compareOffer,
      discount,
      savings,
      sizeLabel: `${product.quantity} ${product.unit}`,
    };
  }

  private calculateStoreTotal(storeSlug: string): number {
    return this.basketItems().reduce((sum, item) => {
      const storeOffer = item.product.storeProducts.find((offer) => offer.storeSlug === storeSlug);
      if (storeOffer) {
        return sum + storeOffer.price;
      }

      const fallback = item.product.storeProducts.find((offer) => offer.storeSlug !== storeSlug);
      return sum + (fallback?.price ?? item.bestOffer.price);
    }, 0);
  }
}
