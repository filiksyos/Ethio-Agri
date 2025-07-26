'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Sprout, ShoppingCart, TrendingUp } from 'lucide-react';
import { authService, type FarmerSignupData, type FarmerLoginData } from '@/lib/auth-service';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [userType, setUserType] = useState<'farmer' | 'customer' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const renderLanding = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sprout className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">EthioAgri</h1>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => setCurrentPage('login')}>
                Login
              </Button>
              <Button onClick={() => setCurrentPage('signup')} className="bg-green-600 hover:bg-green-700">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connecting Ethiopian
            <span className="text-green-600 block">Farmers & Customers</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Bridge the gap between local farmers and customers. Fresh produce, 
            fair prices, and sustainable agriculture for a better Ethiopia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setCurrentPage('signup')}
              className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => setCurrentPage('login')}
              className="px-8 py-3 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">For Farmers</h2>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <TrendingUp className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Market Insights</h3>
                  <p className="text-gray-600">See trending products and market demands</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <ShoppingCart className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Direct Sales</h3>
                  <p className="text-gray-600">Sell directly to customers without middlemen</p>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">For Customers</h2>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Users className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Meet Farmers</h3>
                  <p className="text-gray-600">Connect with local farmers and their stories</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Sprout className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Fresh Produce</h3>
                  <p className="text-gray-600">Access fresh, locally grown agricultural products</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer with test link */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Sprout className="h-6 w-6 text-green-600" />
              <span className="text-gray-600">© 2024 EthioAgri. Connecting farmers and customers.</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="link" 
                onClick={() => router.push('/test-connection')}
                className="text-gray-500 text-sm"
              >
                Test Backend Connection
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

  const renderUserTypeSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <Sprout className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Join EthioAgri</h1>
          <p className="text-lg text-gray-600">Choose your role to get started</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card 
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-green-500"
            onClick={() => {
              setUserType('farmer');
              setCurrentPage('signupForm');
            }}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sprout className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl">I'm a Farmer</CardTitle>
              <CardDescription className="text-lg">
                Sell your agricultural products directly to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Upload product photos and descriptions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>View trending products and market insights</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Connect directly with customers</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-500"
            onClick={() => {
              setUserType('customer');
              setCurrentPage('signupForm');
            }}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">I'm a Customer</CardTitle>
              <CardDescription className="text-lg">
                Discover fresh, local agricultural products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Browse fresh products from local farmers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>View farmer profiles and their stories</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Support local agriculture</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => setCurrentPage('landing')}
            className="text-gray-600"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    if (userType === 'farmer') {
      try {
        const phoneNumber = formData.get('phone') as string;
        const fullPhone = phoneNumber.startsWith('+251') ? phoneNumber : `+251${phoneNumber}`;
        
        const signupData: FarmerSignupData = {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          password: formData.get('password') as string,
          phone: fullPhone,
        };

        await authService.signupFarmer(signupData);
        router.push('/farmers');
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Signup failed');
      }
    } else {
      // Customer signup - keep as mock for now since no backend endpoint
      router.push('/products');
    }
    
    setIsLoading(false);
  };

  const renderSignupForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`w-16 h-16 ${userType === 'farmer' ? 'bg-green-100' : 'bg-blue-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {userType === 'farmer' ? (
              <Sprout className={`h-8 w-8 text-green-600`} />
            ) : userType === 'customer' ? (
              <Users className={`h-8 w-8 text-blue-600`} />
            ) : null}
          </div>
          <CardTitle className="text-2xl">
            Sign Up as {userType === 'farmer' ? 'Farmer' : 'Customer'}
          </CardTitle>
          <CardDescription>
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your full name"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  +251
                </span>
                <input
                  name="phone"
                  type="tel"
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-green-500 focus:border-green-500"
                  placeholder="9XXXXXXXX"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="your@email.com"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className={`w-full ${userType === 'farmer' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentPage('signup')}
              className="text-sm text-gray-600"
              disabled={isLoading}
            >
              Back to user type selection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const loginData: FarmerLoginData = { email, password };
      await authService.loginFarmer(loginData);
      router.push('/farmers');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    }

    setIsLoading(false);
  };

  const renderLogin = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Sprout className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your EthioAgri account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="your@email.com"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Button variant="link" onClick={() => setCurrentPage('signup')} className="p-0 text-green-600" disabled={isLoading}>
                Sign up
              </Button>
            </p>
            <Button 
              variant="ghost" 
              onClick={() => setCurrentPage('landing')}
              className="text-sm text-gray-600 mt-2"
              disabled={isLoading}
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render current page
  switch (currentPage) {
    case 'signup':
      return renderUserTypeSelection();
    case 'signupForm':
      return renderSignupForm();
    case 'login':
      return renderLogin();
    default:
      return renderLanding();
  }
}