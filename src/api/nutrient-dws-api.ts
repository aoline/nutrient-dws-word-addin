import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';

export interface SignatureOptions {
    signerName: string;
    reason?: string;
    location?: string;
    visible?: boolean;
    page?: number;
    x?: number;
    y?: number;
}

export interface ProcessingResult {
    success: boolean;
    fileUrl?: string;
    error?: string;
    data?: any;
}

export class NutrientDWSAPI {
    private apiKey: string = '';
    private baseUrl: string = 'https://api.nutrient.io';
    private userAgent: string = 'NutrientDWSWordAddin/1.0.0';

    constructor() {
        // Try to load API key from environment variables first
        if (typeof process !== 'undefined' && process.env && process.env.NUTRIENT_DWS_API_KEY) {
            this.apiKey = process.env.NUTRIENT_DWS_API_KEY;
        }
    }

    setApiKey(apiKey: string): void {
        this.apiKey = apiKey;
    }

    hasApiKey(): boolean {
        return !!this.apiKey;
    }

    async testConnection(): Promise<boolean> {
        if (!this.apiKey) {
            return false;
        }

        try {
            // Make a simple API call to test the connection
            const response = await axios.get(`${this.baseUrl}/health`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'User-Agent': this.userAgent
                },
                timeout: 5000
            });
            
            return response.status === 200;
        } catch (error) {
            console.error('API connection test failed:', error);
            return false;
        }
    }

    async convertDocument(documentBuffer: Buffer, outputFormat: string): Promise<ProcessingResult> {
        try {
            const formData = new FormData();
            formData.append('file', documentBuffer, 'document.docx');
            formData.append('instructions', `convert to ${outputFormat}`);

            const response = await this.makeApiCall('build', formData);
            
            if (response.success) {
                return {
                    success: true,
                    fileUrl: response.data?.url,
                    data: response.data
                };
            } else {
                return {
                    success: false,
                    error: response.error || 'Conversion failed'
                };
            }
        } catch (error) {
            return {
                success: false,
                error: `Conversion error: ${error}`
            };
        }
    }

    async signDocument(documentBuffer: Buffer, signatureOptions: SignatureOptions): Promise<ProcessingResult> {
        try {
            const formData = new FormData();
            formData.append('file', documentBuffer, 'document.docx');
            formData.append('signerName', signatureOptions.signerName);
            
            if (signatureOptions.reason) {
                formData.append('reason', signatureOptions.reason);
            }
            if (signatureOptions.location) {
                formData.append('location', signatureOptions.location);
            }
            if (signatureOptions.visible !== undefined) {
                formData.append('visible', signatureOptions.visible.toString());
            }
            if (signatureOptions.page) {
                formData.append('page', signatureOptions.page.toString());
            }
            if (signatureOptions.x !== undefined) {
                formData.append('x', signatureOptions.x.toString());
            }
            if (signatureOptions.y !== undefined) {
                formData.append('y', signatureOptions.y.toString());
            }

            const response = await this.makeApiCall('sign', formData);
            
            if (response.success) {
                return {
                    success: true,
                    fileUrl: response.data?.url,
                    data: response.data
                };
            } else {
                return {
                    success: false,
                    error: response.error || 'Signing failed'
                };
            }
        } catch (error) {
            return {
                success: false,
                error: `Signing error: ${error}`
            };
        }
    }

    async processDocument(documentBuffer: Buffer, instructions: string): Promise<ProcessingResult> {
        try {
            const formData = new FormData();
            formData.append('file', documentBuffer, 'document.docx');
            formData.append('instructions', instructions);

            const response = await this.makeApiCall('build', formData);
            
            if (response.success) {
                return {
                    success: true,
                    fileUrl: response.data?.url,
                    data: response.data
                };
            } else {
                return {
                    success: false,
                    error: response.error || 'Processing failed'
                };
            }
        } catch (error) {
            return {
                success: false,
                error: `Processing error: ${error}`
            };
        }
    }

    private async makeApiCall(endpoint: string, data: FormData | Record<string, any>): Promise<{ success: boolean; data?: any; error?: string }> {
        if (!this.apiKey) {
            throw new Error('API key not set');
        }

        const isFormData = data instanceof FormData;
        
        const headers: Record<string, string> = {
            'Authorization': `Bearer ${this.apiKey}`,
            'User-Agent': this.userAgent
        };

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        try {
            const response: AxiosResponse = await axios.post(`${this.baseUrl}/${endpoint}`, data, {
                headers,
                responseType: 'stream',
                timeout: 30000
            });

            // Handle streaming response
            if (response.status === 200) {
                // For now, we'll assume success if status is 200
                // In a real implementation, you'd need to handle the stream properly
                return {
                    success: true,
                    data: { url: `https://api.nutrient.io/download/${Date.now()}` } // Placeholder
                };
            } else {
                return {
                    success: false,
                    error: `API returned status ${response.status}`
                };
            }
        } catch (error: any) {
            console.error(`API call to ${endpoint} failed:`, error);
            
            if (error.response) {
                return {
                    success: false,
                    error: `API error: ${error.response.status} - ${error.response.statusText}`
                };
            } else if (error.request) {
                return {
                    success: false,
                    error: 'Network error: No response received'
                };
            } else {
                return {
                    success: false,
                    error: `Request error: ${error.message}`
                };
            }
        }
    }
} 