const API_BASE_URL = process.env.NEXT_PUBLIC_CROP_ANALYZER_URL || 'http://localhost:5000';

export interface CropAnalysisResult {
  disease_type: string;
  severity_level: number;
  affected_area_percentage: number;
  crop_type: string;
  filename: string;
  response_time_ms: number;
}

export interface HealthCheckResult {
  status: string;
  message: string;
  openrouter_configured: boolean;
  max_file_size_mb: number;
}

export class CropAnalyzerError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'CropAnalyzerError';
  }
}

export class CropAnalyzerClient {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || API_BASE_URL;
  }

  /**
   * Analyze a crop image for diseases and other information
   */
  async analyzeCrop(file: File): Promise<CropAnalysisResult> {
    if (!file) {
      throw new CropAnalyzerError('No file provided');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new CropAnalyzerError('File must be an image');
    }

    // Validate file size (10MB limit)
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeBytes) {
      throw new CropAnalyzerError('File size must be less than 10MB');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${this.baseURL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || `Analysis failed with status ${response.status}`;
        throw new CropAnalyzerError(errorMessage, response.status);
      }

      const result = await response.json();
      return result as CropAnalysisResult;
    } catch (error) {
      if (error instanceof CropAnalyzerError) {
        throw error;
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new CropAnalyzerError('Unable to connect to crop analyzer service. Please ensure the backend is running.');
      }
      
      throw new CropAnalyzerError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  }

  /**
   * Check if the crop analyzer service is healthy and properly configured
   */
  async healthCheck(): Promise<HealthCheckResult> {
    try {
      const response = await fetch(`${this.baseURL}/api/health`);
      
      if (!response.ok) {
        throw new CropAnalyzerError(`Health check failed with status ${response.status}`, response.status);
      }

      const result = await response.json();
      return result as HealthCheckResult;
    } catch (error) {
      if (error instanceof CropAnalyzerError) {
        throw error;
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new CropAnalyzerError('Unable to connect to crop analyzer service');
      }
      
      throw new CropAnalyzerError(error instanceof Error ? error.message : 'Health check failed');
    }
  }
}

// Export a default instance
export const cropAnalyzer = new CropAnalyzerClient();

// Utility functions for formatting results
export const formatSeverityLevel = (severity: number): string => {
  if (severity <= 2) return 'Very Mild';
  if (severity <= 4) return 'Mild';
  if (severity <= 6) return 'Moderate';
  if (severity <= 8) return 'Severe';
  return 'Very Severe';
};

export const getSeverityColor = (severity: number): string => {
  if (severity <= 2) return 'text-green-600';
  if (severity <= 4) return 'text-yellow-600';
  if (severity <= 6) return 'text-orange-600';
  if (severity <= 8) return 'text-red-600';
  return 'text-red-800';
};

export const getSeverityBgColor = (severity: number): string => {
  if (severity <= 2) return 'bg-green-500';
  if (severity <= 4) return 'bg-yellow-500';
  if (severity <= 6) return 'bg-orange-500';
  if (severity <= 8) return 'bg-red-500';
  return 'bg-red-700';
}; 