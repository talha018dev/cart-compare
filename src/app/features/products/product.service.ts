import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Product } from './product.model';

const PRODUCTS_API_URL = 'http://localhost:5000/api/v1/products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(PRODUCTS_API_URL);
  }

  readonly products = httpResource<Product[]>(() => PRODUCTS_API_URL);
}
