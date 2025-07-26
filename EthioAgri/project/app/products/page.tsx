'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { authService, type AuthState } from '@/lib/auth-service';
import { productService, type Product } from '@/lib/product-service';

export default function ProductsPage() {
  const [authState, setAuthState] = useState<AuthState>({ isAuthenticated: false, user: null, userType: null });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentAuthState = authService.getCurrentUser();
    setAuthState(currentAuthState);

    // Load products from all farmers
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const allProducts = await productService.getAllProducts();
      setProducts(allProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
      // Fallback to sample data if no products found
      setProducts([
        {
          id: 'sample-1',
          name: "Fresh Teff",
          farmerName: "Sample Farmer",
          location: "Addis Ababa",
          price: 120,
          unit: "kg",
          category: "grains",
          farmerId: 0,
          imageUrl: "/images/products/teff.jpg",
          description: "Premium quality teff grain, freshly harvested",
          inStock: true,
          stockQuantity: 50,
          dateAdded: new Date().toISOString()
        },
        {
          id: 'sample-2',
          name: "Organic Injera",
          farmerName: "Sample Farmer",
          location: "Bahir Dar",
          price: 25,
          unit: "piece",
          category: "grains",
          farmerId: 0,
          imageUrl: "/images/products/2148332214.jpg",
          description: "Traditional injera made from organic teff",
          inStock: true,
          stockQuantity: 30,
          dateAdded: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setAuthState({ isAuthenticated: false, user: null, userType: null });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="h-8 w-8 inline-block bg-blue-600 rounded-full mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">EthioAgri</h1>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Customer</span>
            </div>
            <div className="flex items-center space-x-3">
              {authState.isAuthenticated && authState.userType === 'customer' ? (
                <>
                  <span className="text-sm text-gray-600">Welcome back!</span>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => router.push('/')}>
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                  <Button onClick={() => router.push('/')} className="bg-blue-600 hover:bg-blue-700">
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Fresh Products from Local Farmers</h2>
          <p className="text-gray-600">Discover quality agricultural products directly from Ethiopian farmers</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products available</h3>
            <p className="text-gray-600 mb-6">Check back later for fresh products from local farmers.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <img 
                    src={product.imageUrl || "/images/products/teff.jpg"} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Badge variant={product.inStock ? "default" : "secondary"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  <CardDescription>
                    By {product.farmerName} • {product.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">(5.0)</span>
                  </div>
                  <p className="text-xl font-bold text-green-600">{product.price} ETB/{product.unit}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {!authState.isAuthenticated && (
          <div className="mt-12 text-center bg-blue-50 border border-blue-200 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Want to start buying?</h3>
            <p className="text-gray-600 mb-4">
              Sign up as a customer to connect with farmers and purchase fresh products.
            </p>
            <Button onClick={() => router.push('/')} className="bg-blue-600 hover:bg-blue-700">
              Sign Up Now
            </Button>
          </div>
        )}
      </main>
    </div>
  );
} 