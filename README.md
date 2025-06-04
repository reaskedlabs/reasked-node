# Reasked SDK

Official SDK for the Reasked API.

## Installation

```bash
npm install reasked
```

## Usage

```typescript
import { Reasked } from "reasked";

// Initialize with your organization secret
const reasked = new Reasked("re_123456789");

// Fetch an FAQ
const faq = await reasked.faq.get({
  id: "my_faq_id",
});

console.log(faq.question, faq.answer);
```

## API Reference

### Initialization

```typescript
const reasked = new Reasked("re_123456789");
// or with config object
const reasked = new Reasked({
  orgSecret: "re_123456789",
  baseURL: "https://custom-api.reasked.com/v1", // optional
});
```

### FAQ API

#### Get FAQ

```typescript
const faq = await reasked.faq.get({
  id: "faq_id",
});
```

Returns:

```typescript
{
  id: string;
  question: string;
  answer: string;
}
```
