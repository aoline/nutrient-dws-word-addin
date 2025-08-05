import { NutrientDWSAPI } from './api/nutrient-dws-api';
import { DocumentProcessor } from './services/document-processor';
import { UIHelper } from './utils/ui-helper';

// Global variables
let nutrientAPI: NutrientDWSAPI;
let documentProcessor: DocumentProcessor;
let uiHelper: UIHelper;

// Initialize the add-in when Office.js is ready
Office.onReady((info) => {
    if (info.host === Office.HostType.Word) {
        initializeAddin();
    }
});

function initializeAddin() {
    console.log('Initializing Nutrient DWS Word Add-in...');
    
    // Initialize services
    nutrientAPI = new NutrientDWSAPI();
    documentProcessor = new DocumentProcessor(nutrientAPI);
    uiHelper = new UIHelper();
    
    // Load saved API key
    loadSavedApiKey();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update UI based on Office document state
    updateUIState();
    
    console.log('Add-in initialized successfully');
}

function loadSavedApiKey() {
    const savedApiKey = localStorage.getItem('nutrient-dws-api-key');
    if (savedApiKey) {
        const apiKeyInput = document.getElementById('api-key') as HTMLInputElement;
        if (apiKeyInput) {
            apiKeyInput.value = savedApiKey;
            nutrientAPI.setApiKey(savedApiKey);
            uiHelper.showStatus('API key loaded from storage', 'success');
        }
    }
}

function setupEventListeners() {
    // API Key management
    const saveApiKeyBtn = document.getElementById('save-api-key');
    if (saveApiKeyBtn) {
        saveApiKeyBtn.addEventListener('click', handleSaveApiKey);
    }
    
    // Document actions
    const convertDocBtn = document.getElementById('convert-doc');
    if (convertDocBtn) {
        convertDocBtn.addEventListener('click', handleConvertDocument);
    }
    
    const signDocBtn = document.getElementById('sign-doc');
    if (signDocBtn) {
        signDocBtn.addEventListener('click', handleSignDocument);
    }
    
    const processDocBtn = document.getElementById('process-doc');
    if (processDocBtn) {
        processDocBtn.addEventListener('click', handleProcessDocument);
    }
}

async function handleSaveApiKey() {
    const apiKeyInput = document.getElementById('api-key') as HTMLInputElement;
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
        uiHelper.showStatus('Please enter a valid API key', 'error');
        return;
    }
    
    try {
        // Test the API key
        nutrientAPI.setApiKey(apiKey);
        const isValid = await nutrientAPI.testConnection();
        
        if (isValid) {
            localStorage.setItem('nutrient-dws-api-key', apiKey);
            uiHelper.showStatus('API key saved and validated successfully', 'success');
        } else {
            uiHelper.showStatus('Invalid API key. Please check and try again.', 'error');
        }
    } catch (error) {
        uiHelper.showStatus(`Error validating API key: ${error}`, 'error');
    }
}

async function handleConvertDocument() {
    if (!await validateApiKey()) return;
    
    const outputFormat = (document.getElementById('output-format') as HTMLSelectElement).value;
    
    try {
        uiHelper.showStatus('Converting document...', 'info');
        uiHelper.setButtonLoading('convert-doc', true);
        
        const result = await documentProcessor.convertDocument(outputFormat);
        
        if (result.success) {
            uiHelper.showStatus(`Document converted successfully to ${outputFormat.toUpperCase()}`, 'success');
            // Optionally open the converted file
            if (result.fileUrl) {
                window.open(result.fileUrl, '_blank');
            }
        } else {
            uiHelper.showStatus(`Conversion failed: ${result.error}`, 'error');
        }
    } catch (error) {
        uiHelper.showStatus(`Error converting document: ${error}`, 'error');
    } finally {
        uiHelper.setButtonLoading('convert-doc', false);
    }
}

async function handleSignDocument() {
    if (!await validateApiKey()) return;
    
    const signerName = (document.getElementById('signer-name') as HTMLInputElement).value.trim();
    const reason = (document.getElementById('sign-reason') as HTMLInputElement).value.trim();
    const location = (document.getElementById('sign-location') as HTMLInputElement).value.trim();
    
    if (!signerName) {
        uiHelper.showStatus('Please enter a signer name', 'error');
        return;
    }
    
    try {
        uiHelper.showStatus('Signing document...', 'info');
        uiHelper.setButtonLoading('sign-doc', true);
        
        const signatureOptions = {
            signerName,
            reason: reason || undefined,
            location: location || undefined
        };
        
        const result = await documentProcessor.signDocument(signatureOptions);
        
        if (result.success) {
            uiHelper.showStatus('Document signed successfully', 'success');
            if (result.fileUrl) {
                window.open(result.fileUrl, '_blank');
            }
        } else {
            uiHelper.showStatus(`Signing failed: ${result.error}`, 'error');
        }
    } catch (error) {
        uiHelper.showStatus(`Error signing document: ${error}`, 'error');
    } finally {
        uiHelper.setButtonLoading('sign-doc', false);
    }
}

async function handleProcessDocument() {
    if (!await validateApiKey()) return;
    
    const instructions = (document.getElementById('processing-instructions') as HTMLTextAreaElement).value.trim();
    
    if (!instructions) {
        uiHelper.showStatus('Please enter processing instructions', 'error');
        return;
    }
    
    try {
        uiHelper.showStatus('Processing document...', 'info');
        uiHelper.setButtonLoading('process-doc', true);
        
        const result = await documentProcessor.processDocument(instructions);
        
        if (result.success) {
            uiHelper.showStatus('Document processed successfully', 'success');
            if (result.fileUrl) {
                window.open(result.fileUrl, '_blank');
            }
        } else {
            uiHelper.showStatus(`Processing failed: ${result.error}`, 'error');
        }
    } catch (error) {
        uiHelper.showStatus(`Error processing document: ${error}`, 'error');
    } finally {
        uiHelper.setButtonLoading('process-doc', false);
    }
}

async function validateApiKey(): Promise<boolean> {
    if (!nutrientAPI.hasApiKey()) {
        uiHelper.showStatus('Please save a valid API key first', 'error');
        return false;
    }
    
    try {
        const isValid = await nutrientAPI.testConnection();
        if (!isValid) {
            uiHelper.showStatus('API key is invalid. Please check and save again.', 'error');
            return false;
        }
        return true;
    } catch (error) {
        uiHelper.showStatus(`Error validating API key: ${error}`, 'error');
        return false;
    }
}

function updateUIState() {
    // Check if there's an active document
    Office.context.document.getSelectedDataAsync(Office.CoercionType.Text, (result) => {
        const hasDocument = !result.status || result.status === Office.AsyncResultStatus.Succeeded;
        
        // Enable/disable buttons based on document state
        const buttons = ['convert-doc', 'sign-doc', 'process-doc'];
        buttons.forEach(buttonId => {
            const button = document.getElementById(buttonId) as HTMLButtonElement;
            if (button) {
                button.disabled = !hasDocument;
            }
        });
        
        if (!hasDocument) {
            uiHelper.showStatus('No active document detected', 'info');
        }
    });
}

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeAddin,
        handleSaveApiKey,
        handleConvertDocument,
        handleSignDocument,
        handleProcessDocument
    };
} 