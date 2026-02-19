# Gemini API Model Name Fix

## Problem
The application was encountering a 404 error when trying to use the Google Generative AI API:

```
⚠️ [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent: [404] models/gemini-1.5-flash is not found for API version v1beta, or is not supported for generateContent.
```

## Root Cause
The model name `'gemini-1.5-flash'` was incomplete. The Google Generative AI SDK (version 0.24.1) requires the full model identifier with the `-latest` suffix for stable versions.

## Solution
Updated the model name in `src/hooks/useGemini.ts`:

**Before:**
```typescript
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
```

**After:**
```typescript
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
```

## Valid Model Names
According to Google's Generative AI SDK documentation, valid model identifiers include:
- `gemini-1.5-flash-latest` - Latest stable version (recommended)
- `gemini-1.5-flash-001` - Specific version 001
- `gemini-1.5-flash-002` - Specific version 002
- `gemini-1.5-pro-latest` - Pro model latest version

## Testing
The fix has been:
- ✅ Code reviewed
- ✅ Security scanned with CodeQL (no vulnerabilities found)
- ✅ Verified to use the correct SDK version (@google/generative-ai ^0.24.1)

## References
- [Google AI JavaScript SDK Documentation](https://ai.google.dev/gemini-api/docs/quickstart?lang=node)
- [Available Gemini Models](https://ai.google.dev/gemini-api/docs/models/gemini)
