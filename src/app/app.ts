import { isPlatformBrowser } from '@angular/common';
import { Component, DOCUMENT, inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IconField } from '@openng/optimus-ui/iconfield';
import { InputIcon } from '@openng/optimus-ui/inputicon';
import { InputText } from '@openng/optimus-ui/inputtext';

import { ProductFilterService } from './features/products/product-filter.service';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, IconField, InputIcon, InputText],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly filters = inject(ProductFilterService);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly searchQuery = this.filters.searchQuery;
  protected readonly selectedCategory = this.filters.selectedCategory;
  protected readonly basket = this.filters.basket;
  protected readonly sidebarOpen = signal(false);
  protected readonly darkMode = signal(false);
  protected readonly rtl = signal(false);
  protected readonly navigation = [
    { label: 'Home & best deals', category: 'all', icon: '⌂' },
    { label: 'Fresh produce', category: 'Produce', icon: '🥬' },
    { label: 'Dairy & eggs', category: 'Dairy', icon: '🥛' },
    { label: 'Meat & seafood', category: 'Meat', icon: '🍗' },
    { label: 'Rice, grains & pantry', category: 'Pantry', icon: '🌾' },
    { label: 'Bakery', category: 'Bakery', icon: '🍞' },
    { label: 'Frozen foods', category: 'Frozen', icon: '❄️' },
    { label: 'Snacks & drinks', category: 'Snacks', icon: '🍪' },
    { label: 'Household', category: 'Household', icon: '🧼' },
  ];

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const storedTheme = localStorage.getItem('cc-theme');
      this.darkMode.set(storedTheme ? storedTheme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
      this.rtl.set(localStorage.getItem('cc-direction') === 'rtl');
      this.applyPreferences();
    }
  }

  onSearch(event: Event): void { this.filters.setSearchQuery((event.target as HTMLInputElement).value); }
  selectCategory(category: string): void { this.filters.setCategory(category); this.sidebarOpen.set(false); }
  toggleTheme(): void { this.darkMode.update((value) => !value); this.applyPreferences(); localStorage.setItem('cc-theme', this.darkMode() ? 'dark' : 'light'); }
  toggleDirection(): void { this.rtl.update((value) => !value); this.applyPreferences(); localStorage.setItem('cc-direction', this.rtl() ? 'rtl' : 'ltr'); }

  private applyPreferences(): void {
    this.document.documentElement.dataset['theme'] = this.darkMode() ? 'dark' : 'light';
    this.document.documentElement.dir = this.rtl() ? 'rtl' : 'ltr';
  }
}
