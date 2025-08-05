# Nutrient DWS Word Add-in

A Microsoft Word Add-in that integrates with the Nutrient Document Web Service (DWS) API to provide powerful document processing capabilities directly within Word.

## Features

- **Document Conversion**: Convert Word documents to PDF, DOCX, PNG, JPEG, and WebP formats
- **Digital Signing**: Add PAdES standards-compliant digital signatures to documents
- **Document Processing**: Apply various processing operations like watermarking, redaction, OCR, and more
- **API Integration**: Seamless integration with Nutrient DWS API
- **Modern UI**: Clean, responsive interface designed for Word

## Prerequisites

- Microsoft Word (desktop or online)
- Node.js (version 18 or higher)
- A Nutrient DWS API key (get one at [nutrient.io/api](https://dashboard.nutrient.io/sign_up/))

## Installation

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd word-addin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Generate SSL certificates for development**
   ```bash
   mkdir certs
   openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout certs/server.key -out certs/server.crt
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Sideload the add-in in Word**
   ```bash
   npm run sideload
   ```

## Development

### Project Structure

```
word-addin/
├── src/
│   ├── api/
│   │   └── nutrient-dws-api.ts    # DWS API integration
│   ├── services/
│   │   └── document-processor.ts  # Document processing logic
│   ├── utils/
│   │   └── ui-helper.ts          # UI utilities
│   ├── index.html                # Main taskpane HTML
│   ├── commands.html             # Commands HTML
│   ├── index.ts                  # Main TypeScript entry point
│   └── commands.ts               # Commands TypeScript
├── manifest.xml                  # Office Add-in manifest
├── package.json                  # Project dependencies
├── tsconfig.json                # TypeScript configuration
├── webpack.config.js            # Webpack configuration
└── README.md                    # This file
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run validate` - Validate the manifest file
- `npm run sideload` - Sideload the add-in in Word

### Configuration

1. **API Key**: Enter your Nutrient DWS API key in the add-in interface
2. **SSL Certificates**: Required for development (see installation steps)
3. **Manifest**: Configure the manifest.xml file for your specific needs

## Usage

### Getting Started

1. Open Microsoft Word
2. Load the add-in (see installation steps)
3. Click the "Document Processor" button in the Home tab
4. Enter your Nutrient DWS API key and click "Save"
5. Start processing documents!

### Document Conversion

1. Open a Word document
2. In the add-in taskpane, select the desired output format
3. Click "Convert Document"
4. The converted file will be available for download

### Digital Signing

1. Open a Word document
2. In the add-in taskpane, fill in the signing details:
   - Signer Name (required)
   - Reason (optional)
   - Location (optional)
3. Click "Sign Document"
4. The signed document will be available for download

### Document Processing

1. Open a Word document
2. In the add-in taskpane, enter processing instructions
3. Click "Process Document"
4. The processed document will be available for download

## API Integration

The add-in integrates with the Nutrient DWS API using the following endpoints:

- **Document Processing**: `/build` - For conversion and general processing
- **Digital Signing**: `/sign` - For adding digital signatures

### Supported Operations

- Document format conversion (PDF, DOCX, images)
- Digital signing with PAdES compliance
- Watermarking and redaction
- OCR processing
- Page rotation and manipulation
- Text extraction
- And more...

## Troubleshooting

### Common Issues

1. **SSL Certificate Errors**
   - Ensure you've generated valid SSL certificates
   - Check that the certificate paths in webpack.config.js are correct

2. **API Key Issues**
   - Verify your API key is valid
   - Check that you have sufficient API credits
   - Ensure the API key has the required permissions

3. **Add-in Not Loading**
   - Check that the development server is running
   - Verify the manifest.xml file is valid
   - Try clearing Word's add-in cache

4. **Document Processing Failures**
   - Ensure the document is not corrupted
   - Check that the document format is supported
   - Verify your processing instructions are clear

### Debug Mode

Enable debug mode by adding `?debug=true` to the add-in URL in the manifest.xml file.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support with the Nutrient DWS API, visit [nutrient.io/api](https://www.nutrient.io/api).

For add-in-specific issues, please open an issue in this repository.

## Changelog

### Version 1.0.0
- Initial release
- Document conversion support
- Digital signing capabilities
- Document processing features
- Modern UI design 