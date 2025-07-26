'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Upload, Image as ImageIcon, AlertCircle, CheckCircle2, Camera } from 'lucide-react';
import { cropAnalyzer, CropAnalysisResult, CropAnalyzerError, formatSeverityLevel, getSeverityColor, getSeverityBgColor } from '@/lib/crop-analyzer';

export default function CropAnalyzePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CropAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setAnalysisResult(null);
    setError(null);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await cropAnalyzer.analyzeCrop(selectedFile);
      setAnalysisResult(result);
    } catch (err) {
      if (err instanceof CropAnalyzerError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during analysis');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/farmers')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <Camera className="h-6 w-6 text-green-600" />
                <h1 className="text-xl font-semibold text-gray-900">Crop Analysis</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-8 w-8 inline-block bg-green-600 rounded-full mr-2" />
              <span className="text-lg font-bold text-gray-900">EthioAgri</span>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Farmer</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Crop Disease Analyzer</h2>
          <p className="text-gray-600">
            Upload a clear image of your crop to analyze for diseases, identify crop type, and assess severity levels.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Crop Image</span>
              </CardTitle>
              <CardDescription>
                Select a clear, well-lit image of your crop showing any affected areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver
                    ? 'border-green-500 bg-green-50'
                    : selectedFile
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {previewUrl ? (
                  <div className="space-y-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="mx-auto max-h-48 rounded-lg shadow-md"
                    />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{selectedFile?.name}</p>
                      <p>{selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div>
                      <p className="text-lg font-medium text-gray-900">Drop your crop image here</p>
                      <p className="text-sm text-gray-600">or click to browse files</p>
                    </div>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                
                <div className="mt-4 space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    Choose File
                  </Button>
                  
                  {selectedFile && (
                    <Button
                      variant="ghost"
                      onClick={resetAnalysis}
                      className="w-full text-sm"
                    >
                      Remove Image
                    </Button>
                  )}
                </div>
              </div>

              {/* Analyze Button */}
              <div className="mt-6">
                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || isAnalyzing}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Analyze Crop
                    </>
                  )}
                </Button>
              </div>

              {/* File Requirements */}
              <div className="mt-4 text-xs text-gray-500 space-y-1">
                <p>• Supported formats: JPEG, PNG, GIF, WebP</p>
                <p>• Maximum file size: 10MB</p>
                <p>• Best results: Clear, well-lit images showing affected areas</p>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Analysis Results</span>
              </CardTitle>
              <CardDescription>
                AI-powered disease detection and crop assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isAnalyzing && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">Analyzing your crop image...</p>
                  </div>
                  <Progress value={60} className="w-full" />
                </div>
              )}

              {analysisResult && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    {/* Disease Type */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="text-sm font-medium text-gray-600">Disease Type</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {analysisResult.disease_type}
                      </p>
                    </div>

                    {/* Crop Type */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="text-sm font-medium text-gray-600">Crop Type</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {analysisResult.crop_type}
                      </p>
                    </div>

                    {/* Severity Level */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="text-sm font-medium text-gray-600">Severity Level</label>
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-lg font-semibold ${getSeverityColor(analysisResult.severity_level)}`}>
                            {analysisResult.severity_level}/10 - {formatSeverityLevel(analysisResult.severity_level)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-300 ${getSeverityBgColor(analysisResult.severity_level)}`}
                            style={{ width: `${(analysisResult.severity_level / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Affected Area */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="text-sm font-medium text-gray-600">Affected Area</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {analysisResult.affected_area_percentage}%
                      </p>
                    </div>
                  </div>

                  {/* Analysis Info */}
                  <div className="text-sm text-gray-500 pt-4 border-t">
                    <p>Analysis completed in {analysisResult.response_time_ms}ms</p>
                    <p>File: {analysisResult.filename}</p>
                  </div>

                  {/* New Analysis Button */}
                  <Button
                    onClick={resetAnalysis}
                    variant="outline"
                    className="w-full"
                  >
                    Analyze Another Image
                  </Button>
                </div>
              )}

              {!analysisResult && !isAnalyzing && !error && (
                <div className="text-center py-8">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500">Upload an image to see analysis results here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 