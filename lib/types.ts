// app/lib/types.ts

export interface ProductItem {
  id: string;
  name: string;
  sku: string;
  description: string;
  type: 'PRODUCT' | 'SERVICE';
  price: number;
  cost: number;
  unit: string;
  stock: number;
  minStock: number;
  categoryId: string;
  categoryName: string;
  status: 'ACTIVE' | 'INACTIVE';
  imageUrl?: string;
  slug: string; // ADD THIS
  isActive: boolean; // ADD THIS
  profitMargin: number; // ADD THIS
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  createdByName?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  order?: number;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  color?: string;
  itemCount?: number;
}