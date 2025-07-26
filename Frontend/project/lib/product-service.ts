const API_BASE_URL = 'http://172.16.195.225:8080';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  farmerId: number;
  farmerName: string;
  location: string;
  imageUrl?: string;
  inStock: boolean;
  stockQuantity: number;
  dateAdded: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  imageUrl?: string;
  stockQuantity: number;
}

class ProductService {
  // For now, use localStorage to store products since backend endpoints aren't available yet
  // This structure allows easy migration to backend endpoints later
  private getStorageKey(farmerId: number): string {
    return `farmer_products_${farmerId}`;
  }

  private getProducts(farmerId: number): Product[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.getStorageKey(farmerId));
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveProducts(farmerId: number, products: Product[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getStorageKey(farmerId), JSON.stringify(products));
    }
  }

  async getFarmerProducts(farmerId: number, farmerName: string): Promise<Product[]> {
    // TODO: Replace with actual API call when backend endpoints are available
    // const response = await fetch(`${API_BASE_URL}/api/farmers/${farmerId}/products`);
    // return response.json();
    
    return this.getProducts(farmerId);
  }

  async createProduct(farmerId: number, farmerName: string, farmerLocation: string, productData: CreateProductData): Promise<Product> {
    // TODO: Replace with actual API call when backend endpoints are available
    // const response = await fetch(`${API_BASE_URL}/api/farmers/${farmerId}/products`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(productData)
    // });
    // return response.json();

    const newProduct: Product = {
      id: Date.now().toString(),
      ...productData,
      farmerId,
      farmerName,
      location: farmerLocation,
      inStock: productData.stockQuantity > 0,
      dateAdded: new Date().toISOString(),
    };

    const products = this.getProducts(farmerId);
    products.push(newProduct);
    this.saveProducts(farmerId, products);

    return newProduct;
  }

  async updateProduct(farmerId: number, productId: string, updates: Partial<CreateProductData>): Promise<Product> {
    // TODO: Replace with actual API call when backend endpoints are available
    // const response = await fetch(`${API_BASE_URL}/api/farmers/${farmerId}/products/${productId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updates)
    // });
    // return response.json();

    const products = this.getProducts(farmerId);
    const index = products.findIndex(p => p.id === productId);
    
    if (index === -1) {
      throw new Error('Product not found');
    }

    const updatedProduct = {
      ...products[index],
      ...updates,
      inStock: (updates.stockQuantity ?? products[index].stockQuantity) > 0
    };

    products[index] = updatedProduct;
    this.saveProducts(farmerId, products);

    return updatedProduct;
  }

  async deleteProduct(farmerId: number, productId: string): Promise<void> {
    // TODO: Replace with actual API call when backend endpoints are available
    // await fetch(`${API_BASE_URL}/api/farmers/${farmerId}/products/${productId}`, {
    //   method: 'DELETE'
    // });

    const products = this.getProducts(farmerId);
    const filteredProducts = products.filter(p => p.id !== productId);
    this.saveProducts(farmerId, filteredProducts);
  }

  // Get all products for the marketplace (from all farmers)
  async getAllProducts(): Promise<Product[]> {
    // TODO: Replace with actual API call when backend endpoints are available
    // const response = await fetch(`${API_BASE_URL}/api/products`);
    // return response.json();

    // For now, aggregate products from all farmers stored locally
    if (typeof window === 'undefined') return [];

    const allProducts: Product[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('farmer_products_')) {
        try {
          const products = JSON.parse(localStorage.getItem(key) || '[]');
          allProducts.push(...products);
        } catch {
          // Ignore invalid data
        }
      }
    }

    return allProducts.filter(p => p.inStock);
  }
}

export const productService = new ProductService(); 