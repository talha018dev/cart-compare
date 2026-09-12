export interface StoreProduct {
  id: string;
  storeId: string;
  storeName: string;
  storeSlug: string;
  externalProductId: string;
  storeProductName: string;
  price: number;
  originalPrice: number | null;
  inStock: boolean;
  productUrl: string;
  imageUrl: string | null;
}

export interface Product {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  quantity: number;
  unit: string;
  imageUrl: string | null;
  storeProducts: StoreProduct[];
}

export type SortOption = 'recommended' | 'discount' | 'price';

export interface ProductViewModel {
  product: Product;
  bestOffer: StoreProduct;
  compareOffer: StoreProduct | null;
  discount: number | null;
  savings: number | null;
  sizeLabel: string;
}
