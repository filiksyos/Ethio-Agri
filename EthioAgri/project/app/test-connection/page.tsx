'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { authService } from '@/lib/auth-service';
import Link from 'next/link';

export default function TestConnectionPage() {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<boolean | null>(null);
  const [isTestingSignup, setIsTestingSignup] = useState(false);
  const [signupResult, setSignupResult] = useState<{ success: boolean; message: string } | null>(null);

  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionResult(null);
    
    try {
      const result = await authService.testConnection();
      setConnectionResult(result);
    } catch (error) {
      setConnectionResult(false);
    }
    
    setIsTestingConnection(false);
  };

  const testSignup = async () => {
    setIsTestingSignup(true);
    setSignupResult(null);

    const testData = {
      name: "Test Farmer",
      email: `test_${Date.now()}@example.com`, // Unique email to avoid conflicts
      password: "testpass123",
      phone: "+251912345678"
    };

    try {
      await authService.signupFarmer(testData);
      setSignupResult({ success: true, message: "Test signup successful! Backend is working correctly." });
      // Logout the test user
      authService.logout();
    } catch (error) {
      setSignupResult({ 
        success: false, 
        message: error instanceof Error ? error.message : "Test signup failed" 
      });
    }

    setIsTestingSignup(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Backend Connection Test</CardTitle>
            <CardDescription>
              Test the connection between the EthioAgri frontend and the backend at 172.16.195.225:8080
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Connection Test */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">1. Basic Connection Test</h3>
              <p className="text-gray-600 text-sm">
                Test if the backend server is reachable and accepting CORS requests.
              </p>
              
              <Button 
                onClick={testConnection} 
                disabled={isTestingConnection}
                className="w-full"
              >
                {isTestingConnection ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  'Test Connection'
                )}
              </Button>

              {connectionResult !== null && (
                <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                  connectionResult ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {connectionResult ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                  <span>
                    {connectionResult 
                      ? 'Connection successful! Backend is reachable.' 
                      : 'Connection failed. Check if backend is running on 172.16.195.225:8080'}
                  </span>
                </div>
              )}
            </div>

            {/* Signup Test */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-semibold">2. Farmer Signup Test</h3>
              <p className="text-gray-600 text-sm">
                Test the actual farmer signup endpoint with sample data.
              </p>
              
              <Button 
                onClick={testSignup} 
                disabled={isTestingSignup}
                className="w-full"
                variant="outline"
              >
                {isTestingSignup ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing Signup...
                  </>
                ) : (
                  'Test Farmer Signup'
                )}
              </Button>

              {signupResult && (
                <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                  signupResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {signupResult.success ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                  <span>{signupResult.message}</span>
                </div>
              )}
            </div>

            {/* Configuration Info */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-semibold">Configuration</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div><strong>Backend URL:</strong> http://172.16.195.225:8080</div>
                  <div><strong>Farmer Signup Endpoint:</strong> /api/farmers/signup</div>
                  <div><strong>Farmer Login Endpoint:</strong> /api/farmers/login</div>
                  <div><strong>CORS Mode:</strong> Enabled</div>
                  <div><strong>Authentication:</strong> localStorage</div>
                </div>
              </div>
            </div>

            {/* Troubleshooting */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-semibold">Troubleshooting</h3>
              <div className="text-sm space-y-2 text-gray-600">
                <p><strong>If connection fails:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Ensure the backend is running on 172.16.195.225:8080</li>
                  <li>Check that both devices are on the same network</li>
                  <li>Verify no firewall is blocking the connection</li>
                  <li>Ensure the backend has CORS enabled for your domain</li>
                </ul>
                
                <p className="pt-2"><strong>If signup fails:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Check backend logs for error details</li>
                  <li>Verify the database is properly configured</li>
                  <li>Ensure the endpoint accepts the correct data format</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 