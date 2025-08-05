#!/bin/bash

# Generate SSL certificates for development
echo "Generating SSL certificates for development..."

# Create certs directory if it doesn't exist
mkdir -p certs

# Generate self-signed certificate
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 \
    -keyout certs/server.key \
    -out certs/server.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

echo "SSL certificates generated successfully!"
echo "Certificate files:"
echo "  - certs/server.key (private key)"
echo "  - certs/server.crt (certificate)"
echo ""
echo "You can now run 'npm run dev' to start the development server." 