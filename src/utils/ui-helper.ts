export type StatusType = 'success' | 'error' | 'info' | 'warning';

export class UIHelper {
    private statusMessagesContainer: HTMLElement | null = null;

    constructor() {
        this.statusMessagesContainer = document.getElementById('status-messages');
    }

    showStatus(message: string, type: StatusType = 'info'): void {
        // Show status in the main status area
        const statusElement = document.getElementById('api-status');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `status ${type}`;
            
            // Clear the status after 5 seconds for success/info messages
            if (type === 'success' || type === 'info') {
                setTimeout(() => {
                    statusElement.textContent = '';
                    statusElement.className = 'status';
                }, 5000);
            }
        }

        // Add to status messages history
        this.addStatusMessage(message, type);
    }

    addStatusMessage(message: string, type: StatusType = 'info'): void {
        if (!this.statusMessagesContainer) {
            return;
        }

        const messageElement = document.createElement('div');
        messageElement.className = `status-message ${type}`;
        
        const timestamp = new Date().toLocaleTimeString();
        messageElement.innerHTML = `<strong>${timestamp}:</strong> ${message}`;
        
        this.statusMessagesContainer.appendChild(messageElement);
        
        // Scroll to bottom
        this.statusMessagesContainer.scrollTop = this.statusMessagesContainer.scrollHeight;
        
        // Limit the number of messages to 50
        const messages = this.statusMessagesContainer.children;
        if (messages.length > 50) {
            this.statusMessagesContainer.removeChild(messages[0]);
        }
    }

    setButtonLoading(buttonId: string, isLoading: boolean): void {
        const button = document.getElementById(buttonId) as HTMLButtonElement;
        if (!button) {
            return;
        }

        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<span class="loading"></span>Processing...';
        } else {
            button.disabled = false;
            // Restore original button text based on ID
            switch (buttonId) {
                case 'convert-doc':
                    button.textContent = 'Convert Document';
                    break;
                case 'sign-doc':
                    button.textContent = 'Sign Document';
                    break;
                case 'process-doc':
                    button.textContent = 'Process Document';
                    break;
                default:
                    button.textContent = 'Submit';
            }
        }
    }

    showLoading(show: boolean): void {
        const loadingElement = document.getElementById('loading-overlay');
        if (loadingElement) {
            loadingElement.style.display = show ? 'flex' : 'none';
        }
    }

    updateDocumentInfo(info: { title: string; author: string; pageCount: number }): void {
        // Update document information in the UI if there's a dedicated section
        const titleElement = document.getElementById('document-title');
        if (titleElement) {
            titleElement.textContent = info.title;
        }

        const authorElement = document.getElementById('document-author');
        if (authorElement) {
            authorElement.textContent = info.author;
        }

        const pageCountElement = document.getElementById('document-pages');
        if (pageCountElement) {
            pageCountElement.textContent = `${info.pageCount} page(s)`;
        }
    }

    clearStatusMessages(): void {
        if (this.statusMessagesContainer) {
            this.statusMessagesContainer.innerHTML = '';
        }
    }

    showErrorDialog(message: string): void {
        // Show a modal error dialog
        const dialog = document.createElement('div');
        dialog.className = 'error-dialog';
        dialog.innerHTML = `
            <div class="error-dialog-content">
                <h3>Error</h3>
                <p>${message}</p>
                <button onclick="this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Add styles for the dialog
        const style = document.createElement('style');
        style.textContent = `
            .error-dialog {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .error-dialog-content {
                background: white;
                padding: 20px;
                border-radius: 8px;
                max-width: 300px;
                text-align: center;
            }
            .error-dialog-content h3 {
                margin-top: 0;
                color: #721c24;
            }
            .error-dialog-content button {
                background: #0078d4;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
            }
        `;
        
        if (!document.querySelector('#error-dialog-styles')) {
            style.id = 'error-dialog-styles';
            document.head.appendChild(style);
        }
    }

    showSuccessDialog(message: string): void {
        // Show a modal success dialog
        const dialog = document.createElement('div');
        dialog.className = 'success-dialog';
        dialog.innerHTML = `
            <div class="success-dialog-content">
                <h3>Success</h3>
                <p>${message}</p>
                <button onclick="this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (dialog.parentElement) {
                dialog.remove();
            }
        }, 3000);
        
        // Add styles for the dialog
        const style = document.createElement('style');
        style.textContent = `
            .success-dialog {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .success-dialog-content {
                background: white;
                padding: 20px;
                border-radius: 8px;
                max-width: 300px;
                text-align: center;
            }
            .success-dialog-content h3 {
                margin-top: 0;
                color: #155724;
            }
            .success-dialog-content button {
                background: #28a745;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
            }
        `;
        
        if (!document.querySelector('#success-dialog-styles')) {
            style.id = 'success-dialog-styles';
            document.head.appendChild(style);
        }
    }
} 