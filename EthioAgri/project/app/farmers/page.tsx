'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, TrendingUp, Package, LogOut, Plus } from 'lucide-react';
import { authService, type AuthState } from '@/lib/auth-service';

export default function FarmersPage() {
  const [authState, setAuthState] = useState<AuthState>({ isAuthenticated: false, user: null, userType: null });
  const router = useRouter();

  useEffect(() => {
    const currentAuthState = authService.getCurrentUser();
    setAuthState(currentAuthState);

    // Redirect to home if not authenticated or not a farmer
    if (!currentAuthState.isAuthenticated || currentAuthState.userType !== 'farmer') {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  // Show loading state while checking authentication
  if (!authState.isAuthenticated || authState.userType !== 'farmer') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="h-8 w-8 inline-block bg-green-600 rounded-full mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">EthioAgri</h1>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Farmer</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Welcome, {authState.user?.name}</span>
              <Link href="/farmers/analyze">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Camera className="h-4 w-4 mr-2" />
                  Analyze Crop
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Farmer Dashboard</h2>
          <p className="text-gray-600">Manage your crops, analyze diseases, and connect with customers</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/farmers/analyze">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-500">
              <CardContent className="p-6 text-center">
                <Camera className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyze Crop</h3>
                <p className="text-sm text-gray-600">Use AI to detect diseases and assess crop health</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/farmers/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500">
              <CardContent className="p-6 text-center">
                <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">My Products</h3>
                <p className="text-sm text-gray-600">Manage your product listings and inventory</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/farmers/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-500">
              <CardContent className="p-6 text-center">
                <Plus className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Products</h3>
                <p className="text-sm text-gray-600">Quickly add new products to your inventory</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Featured Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Your latest farming activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Camera className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium">Welcome to EthioAgri!</p>
                    <p className="text-sm text-gray-600">Start by analyzing your crops with our AI-powered tool</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Package className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium">Product Management</p>
                    <p className="text-sm text-gray-600">Add your products to start selling to customers</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Crop Analysis</CardTitle>
              <CardDescription>Detect diseases and improve crop health with AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <Camera className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your First Analysis</h3>
                  <p className="text-gray-600 mb-4">
                    Upload a photo of your crop to get instant AI-powered disease detection and health assessment.
                  </p>
                  <Link href="/farmers/analyze">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Camera className="h-4 w-4 mr-2" />
                      Analyze Now
                    </Button>
                  </Link>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>✓ Disease identification and severity assessment</p>
                  <p>✓ Crop type recognition</p>
                  <p>✓ Affected area percentage calculation</p>
                  <p>✓ Instant results with detailed analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 