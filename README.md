# Reasked Node SDK

[![npm version](https://badge.fury.io/js/%40reasked%2Fnode.svg)](https://badge.fury.io/js/%40reasked%2Fnode)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The official Node.js SDK for the Reasked API - a powerful FAQ management platform.

## Installation

```bash
npm install @reasked/node
```

```bash
yarn add @reasked/node
```

```bash
pnpm add @reasked/node
```

## Quick Start

```javascript
import { Reasked } from "@reasked/node";

const reasked = new Reasked("your-api-key");

// Get FAQ group by slug
const faqGroup = await reasked.faq.getFaqGroupBySlug("getting-started");

if (faqGroup.status === "success") {
  console.log(faqGroup.data);
}
```

## Configuration

### Basic Configuration

```javascript
const reasked = new Reasked("your-api-key", {
  timeout: 30000, // Request timeout in ms (default: 30000)
  retries: 3, // Number of retries (default: 3)
  debug: false, // Enable debug logging (default: false)
});
```

### Environment Variables

You can also configure the SDK using environment variables:

```bash
REASKED_API_KEY=your-api-key
```

## API Reference

### FAQ Service

#### `getFaqGroupBySlug(slug, options?)`

Retrieve an FAQ group by its slug.

```javascript
const response = await reasked.faq.getFaqGroupBySlug("getting-started", {
  status: "published", // 'all' | 'draft' | 'published'
  langs: ["en", "es"], // Array of language codes
});
```

#### `getFaqGroupById(id, options?)`

Retrieve an FAQ group by its ID.

```javascript
const response = await reasked.faq.getFaqGroupById("00000000-0000-0000-0000-000000000000",
  status: "published",
  langs: ["en"],
});
```

### Response Format

All API methods return a standardized response:

```javascript
{
  status: 'success' | 'error',
  data?: FaqGroupData,
  message?: string
}
```

### Data Types

#### FaqGroupData

```typescript
interface FaqGroupData {
  id: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  translations: FaqGroupTranslation[];
  faqs: Faq[];
}
```

#### Faq

```typescript
interface Faq {
  id: string;
  status: "draft" | "published";
  position: number;
  createdAt: string;
  updatedAt: string;
  translations: FaqTranslation[];
}
```

#### FaqTranslation

```typescript
interface FaqTranslation {
  question: string;
  answer: string;
  lang: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}
```

## Advanced Usage

### Error Handling

```javascript
try {
  const response = await reasked.faq.getFaqGroupBySlug("non-existent");

  if (response.status === "error") {
    console.error("API Error:", response.message);
    return;
  }

  // Handle success
  console.log(response.data);
} catch (error) {
  console.error("Network Error:", error.message);
}
```

## TypeScript Support

The SDK is written in TypeScript and includes full type definitions:

```typescript
import { Reasked, FaqGroupData, ReaskedResponse } from "@reasked/node";

const reasked = new Reasked("your-api-key");

const response: ReaskedResponse<FaqGroupData> =
  await reasked.faq.getFaqGroupBySlug("getting-started");
```

## Development

### Building

```bash
pnpm run build
```

### Testing

```bash
pnpm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: support@reasked.com
- 🐛 Issues: [GitHub Issues](https://github.com/reaskedlabs/reasked-node/issues)
- 📖 Documentation: [API Documentation](https://docs.reasked.com)

---

Made with ❤️ by the [Reasked](https://reasked.com) team
