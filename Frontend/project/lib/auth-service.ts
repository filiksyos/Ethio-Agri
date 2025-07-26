const API_BASE_URL = 'http://172.16.195.225:8080';

export interface FarmerSignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface FarmerLoginData {
  email: string;
  password: string;
}

export interface Farmer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: Farmer | null;
  userType: 'farmer' | 'customer' | null;
}

class AuthService {
  private getAuthState(): AuthState {
    if (typeof window === 'undefined') {
      return { isAuthenticated: false, user: null, userType: null };
    }
    
    try {
      const state = localStorage.getItem('authState');
      return state ? JSON.parse(state) : { isAuthenticated: false, user: null, userType: null };
    } catch {
      return { isAuthenticated: false, user: null, userType: null };
    }
  }

  private setAuthState(state: AuthState): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authState', JSON.stringify(state));
    }
  }

  private async makeRequest(endpoint: string, data: any): Promise<Response> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
        mode: 'cors', // Explicitly set CORS mode
      });
      return response;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the server. Please check your network connection and ensure the backend is running.');
      }
      throw error;
    }
  }

  async signupFarmer(data: FarmerSignupData): Promise<Farmer> {
    const response = await this.makeRequest('/api/farmers/signup', data);

    if (!response.ok) {
      let errorMessage = `Signup failed with status ${response.status}`;
      try {
        const errorData = await response.text();
        if (errorData) {
          errorMessage = errorData;
        }
      } catch {
        // Ignore error parsing response body
      }
      throw new Error(errorMessage);
    }

    const farmer = await response.json();
    
    // Auto-login after successful signup
    const authState: AuthState = {
      isAuthenticated: true,
      user: farmer,
      userType: 'farmer'
    };
    
    this.setAuthState(authState);
    return farmer;
  }

  async loginFarmer(data: FarmerLoginData): Promise<Farmer> {
    const response = await this.makeRequest('/api/farmers/login', data);

    if (!response.ok) {
      let errorMessage = `Login failed with status ${response.status}`;
      try {
        const errorData = await response.text();
        if (errorData) {
          errorMessage = errorData;
        }
      } catch {
        // Ignore error parsing response body
      }
      throw new Error(errorMessage);
    }

    const farmer = await response.json();
    
    const authState: AuthState = {
      isAuthenticated: true,
      user: farmer,
      userType: 'farmer'
    };
    
    this.setAuthState(authState);
    return farmer;
  }

  // Mock customer login for now since no backend endpoint exists
  loginCustomer(email: string): Promise<any> {
    return new Promise((resolve) => {
      const mockCustomer = {
        id: 1,
        name: email.split('@')[0],
        email: email,
      };

      const authState: AuthState = {
        isAuthenticated: true,
        user: mockCustomer as any,
        userType: 'customer'
      };

      this.setAuthState(authState);
      resolve(mockCustomer);
    });
  }

  logout(): void {
    const authState: AuthState = {
      isAuthenticated: false,
      user: null,
      userType: null
    };
    
    this.setAuthState(authState);
  }

  getCurrentUser(): AuthState {
    return this.getAuthState();
  }

  isAuthenticated(): boolean {
    return this.getAuthState().isAuthenticated;
  }

  // Health check to test backend connectivity
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/farmers/signup`, {
        method: 'OPTIONS',
        mode: 'cors',
      });
      return true;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService(); 