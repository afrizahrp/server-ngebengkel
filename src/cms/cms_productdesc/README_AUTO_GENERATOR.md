# Product Description Auto Generator Service

This service automatically generates product descriptions and benefits in both Indonesian and English based on product specifications from the `imc_ProductSpec` table.

## Features

- **Automatic Content Generation**: Generates professional product descriptions and benefits using OpenAI GPT-4o
- **Bilingual Support**: Creates content in both Indonesian and English
- **Medical Focus**: Specialized for hospital and medical equipment
- **Modular Design**: Separate service from the original manual input service
- **Bulk Processing**: Support for generating content for multiple products at once
- **Error Handling**: Comprehensive error handling with fallback responses

## API Endpoints

### 1. Generate Single Product Content

```http
POST /cms/product-desc/auto-generate/single
Content-Type: application/json

{
  "productId": "PROD001",
  "company_id": "COMP01",
  "createdBy": "user123",
  "updatedBy": "user123"
}
```

### 2. Generate Bulk Product Content

```http
POST /cms/product-desc/auto-generate/bulk
Content-Type: application/json

{
  "productIds": ["PROD001", "PROD002", "PROD003"],
  "company_id": "COMP01",
  "createdBy": "user123",
  "updatedBy": "user123"
}
```

### 3. Generate Content by Product ID

```http
POST /cms/product-desc/auto-generate/{id}/generate
Content-Type: application/json

{
  "company_id": "COMP01",
  "createdBy": "user123",
  "updatedBy": "user123"
}
```

### 4. Translate Existing Content to English

```http
POST /cms/product-desc/auto-generate/{id}/translate
Content-Type: application/json

{
  "company_id": "COMP01",
  "updatedBy": "user123"
}
```

### 5. Health Check

```http
GET /cms/product-desc/auto-generate/health
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "PROD001",
    "descriptions": "Deskripsi produk medis dalam bahasa Indonesia...",
    "descriptions_en": "Medical product description in English...",
    "benefits": "1. Kualitas medis yang tinggi\n2. Standar keamanan yang ketat...",
    "benefits_en": "1. High medical quality\n2. Strict safety standards...",
    "company_id": "COMP01",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Product specification with ID PROD001 not found"
}
```

## Configuration

The service requires the following environment variables:

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_BASE_URL=https://api.openai.com/v1  # Optional, defaults to OpenAI
```

## How It Works

1. **Fetch Specifications**: Retrieves product specifications from `imc_ProductSpec` table
2. **Convert to Text**: Converts all specification fields into a readable text format
3. **Generate Content**: Sends specifications to OpenAI GPT-4o with specialized prompts
4. **Parse Response**: Extracts JSON response with descriptions and benefits
5. **Save to Database**: Updates or creates records in `imc_ProductDesc` table

## Generated Content Fields

- **descriptions**: Product description in Indonesian
- **descriptions_en**: Product description in English
- **benefits**: Product benefits in Indonesian with bullet numbering
- **benefits_en**: Product benefits in English with bullet numbering

## Error Handling

- **Missing Specifications**: Returns error if no valid specifications found
- **OpenAI API Failures**: Falls back to mock responses for development
- **Database Errors**: Comprehensive error logging and user-friendly messages
- **JSON Parsing Errors**: Fallback extraction using regex patterns

## Usage Examples

### TypeScript/JavaScript

```typescript
// Generate single product content
const response = await fetch('/cms/product-desc/auto-generate/single', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: 'PROD001',
    company_id: 'COMP01',
    createdBy: 'admin',
  }),
});

const result = await response.json();
if (result.success) {
  console.log('Generated content:', result.data);
} else {
  console.error('Error:', result.error);
}
```

### cURL

```bash
# Generate single product
curl -X POST http://localhost:3000/cms/product-desc/auto-generate/single \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PROD001",
    "company_id": "COMP01",
    "createdBy": "admin"
  }'

# Generate multiple products
curl -X POST http://localhost:3000/cms/product-desc/auto-generate/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "productIds": ["PROD001", "PROD002"],
    "company_id": "COMP01",
    "createdBy": "admin"
  }'

# Translate existing content to English
curl -X POST http://localhost:3000/cms/product-desc/auto-generate/PROD001/translate \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": "COMP01",
    "updatedBy": "admin"
  }'
```

## Notes

- The service automatically handles both creating new descriptions and updating existing ones
- All generated content is optimized for medical/hospital equipment context
- The service includes comprehensive logging for debugging and monitoring
- Mock responses are provided when OpenAI API is not configured (useful for development)
