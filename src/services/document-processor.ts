import { NutrientDWSAPI, SignatureOptions, ProcessingResult } from '../api/nutrient-dws-api';

export class DocumentProcessor {
    constructor(private nutrientAPI: NutrientDWSAPI) {}

    async convertDocument(outputFormat: string): Promise<ProcessingResult> {
        try {
            // Get the current document as a buffer
            const documentBuffer = await this.getDocumentAsBuffer();
            
            if (!documentBuffer) {
                return {
                    success: false,
                    error: 'Failed to get document content'
                };
            }

            return await this.nutrientAPI.convertDocument(documentBuffer, outputFormat);
        } catch (error) {
            return {
                success: false,
                error: `Conversion error: ${error}`
            };
        }
    }

    async signDocument(signatureOptions: SignatureOptions): Promise<ProcessingResult> {
        try {
            // Get the current document as a buffer
            const documentBuffer = await this.getDocumentAsBuffer();
            
            if (!documentBuffer) {
                return {
                    success: false,
                    error: 'Failed to get document content'
                };
            }

            return await this.nutrientAPI.signDocument(documentBuffer, signatureOptions);
        } catch (error) {
            return {
                success: false,
                error: `Signing error: ${error}`
            };
        }
    }

    async processDocument(instructions: string): Promise<ProcessingResult> {
        try {
            // Get the current document as a buffer
            const documentBuffer = await this.getDocumentAsBuffer();
            
            if (!documentBuffer) {
                return {
                    success: false,
                    error: 'Failed to get document content'
                };
            }

            return await this.nutrientAPI.processDocument(documentBuffer, instructions);
        } catch (error) {
            return {
                success: false,
                error: `Processing error: ${error}`
            };
        }
    }

    private async getDocumentAsBuffer(): Promise<Buffer | null> {
        return new Promise((resolve) => {
            // Get the document content as OOXML (Office Open XML)
            Office.context.document.getFileAsync(Office.FileType.Compressed, (result) => {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    const file = result.value;
                    
                    file.getSliceAsync(0, (sliceResult) => {
                        if (sliceResult.status === Office.AsyncResultStatus.Succeeded) {
                            const slice = sliceResult.value;
                            const data = slice.data;
                            
                            // Convert the data to a Buffer
                            // Note: This is a simplified approach. In a real implementation,
                            // you'd need to handle the OOXML format properly
                            const buffer = Buffer.from(data, 'base64');
                            
                            file.closeAsync(() => {
                                resolve(buffer);
                            });
                        } else {
                            file.closeAsync(() => {
                                resolve(null);
                            });
                        }
                    });
                } else {
                    resolve(null);
                }
            });
        });
    }

    async saveDocumentToFile(fileName: string, content: Buffer): Promise<boolean> {
        return new Promise((resolve) => {
            // This is a placeholder for saving the processed document
            // In a real implementation, you'd need to handle file saving properly
            // For now, we'll just return true to indicate success
            console.log(`Would save document as ${fileName}`);
            resolve(true);
        });
    }

    async getDocumentInfo(): Promise<{ title: string; author: string; pageCount: number } | null> {
        return new Promise((resolve) => {
            Office.context.document.getSelectedDataAsync(Office.CoercionType.Text, (result) => {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    // Get basic document information
                    const title = Office.context.document.url || 'Untitled Document';
                    const author = 'Unknown Author'; // Would need to extract from document properties
                    const pageCount = 1; // Would need to calculate actual page count
                    
                    resolve({
                        title,
                        author,
                        pageCount
                    });
                } else {
                    resolve(null);
                }
            });
        });
    }
} 