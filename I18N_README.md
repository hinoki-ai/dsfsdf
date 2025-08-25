# 🌐 Divine Parsing Oracle - Internationalization (i18n)

## Overview

The **Divine Parsing Oracle** is an advanced, intelligent internationalization system designed specifically for the Licorería ARAMAC project. It provides seamless Spanish/English language support with smart detection and routing capabilities.

## 🚀 Key Features

### Intelligent Language Detection
- **Chilean IP Detection**: Automatically detects Chilean users and serves Spanish content
- **Browser Language Preference**: Respects user's browser language settings
- **Geographic Intelligence**: Uses IP-based geolocation for optimal language selection
- **Configurable Detection**: Can be enabled/disabled via environment variables

### Smart Routing System
- **Locale-Based URLs**: `/es/*` for Spanish, `/en/*` for English
- **Automatic Redirection**: Redirects users to appropriate locale based on detection
- **SEO Optimization**: Proper locale handling for search engines
- **Middleware Integration**: Seamless integration with Next.js middleware

### Environment-Driven Configuration
- **Flexible Locales**: Support for multiple languages via environment variables
- **Customizable Detection**: Configurable IP ranges and detection rules
- **Production Ready**: Optimized for both development and production environments

## ⚙️ Configuration

### Environment Variables

Add these variables to your `.env.local` file:

```bash
# Default locale (es for Chilean Spanish)
NEXT_PUBLIC_DEFAULT_LOCALE=es

# Supported locales (comma-separated)
NEXT_PUBLIC_SUPPORTED_LOCALES=es,en

# Enable/disable automatic language detection
NEXT_PUBLIC_ENABLE_LANGUAGE_DETECTION=true

# Chilean IP ranges for geolocation detection
NEXT_PUBLIC_CHILEAN_IP_RANGES=190.196.,200.29.,191.112.,200.75.
```

### Quick Setup

Run the automated setup script:

```bash
./scripts/setup-env.sh
```

This script will:
- Create `.env.local` if it doesn't exist
- Configure i18n environment variables
- Provide setup instructions

## 🏗️ Architecture

### Core Components

1. **Middleware** (`middleware.ts`)
   - Handles incoming requests
   - Detects user language preferences
   - Manages locale-based routing

2. **i18n Library** (`lib/i18n.ts`)
   - Language detection logic
   - Translation management
   - Utility functions for locale handling

3. **Translation Files**
   - Structured translation objects
   - Fallback mechanisms
   - Namespace-based organization

### Language Detection Flow

```
1. Check URL for explicit locale (/es/, /en/)
   ↓
2. If no explicit locale:
   ↓
3. Check if language detection is enabled
   ↓
4. Detect Chilean IP ranges
   ↓
5. Check browser Accept-Language header
   ↓
6. Fall back to default locale (es)
```

## 🎯 Usage Examples

### Using Translations in Components

```tsx
import { useTranslation } from '@/lib/i18n'

export default function MyComponent() {
  const { t } = useTranslation('es') // or get from context

  return (
    <div>
      <h1>{t('navigation.home')}</h1>
      <p>{t('hero.description')}</p>
    </div>
  )
}
```

### Getting Translation Namespaces

```tsx
const { tNamespace } = useTranslation('es')
const navigation = tNamespace('navigation')

// navigation = { home: 'Inicio', products: 'Productos', ... }
```

### Programmatic Translation

```tsx
import { divineTranslationOracle } from '@/lib/i18n'

const title = divineTranslationOracle.getTranslation('es', 'hero.title')
const fallback = divineTranslationOracle.getTranslation('es', 'custom.key', 'Default Text')
```

## 🌍 Supported Languages

### Spanish (es)
- **Target**: Chilean Spanish speakers
- **Features**: Local terminology, regional expressions
- **Default**: Yes (for Chilean market)

### English (en)
- **Target**: International users, tourists
- **Features**: Professional English, clear communication
- **Default**: No (Spanish prioritized for local market)

## 🔧 Advanced Configuration

### Adding New Languages

1. Add locale to `NEXT_PUBLIC_SUPPORTED_LOCALES`
2. Create translation object in `lib/i18n.ts`
3. Update middleware routing if needed
4. Add language-specific redirects in `next.config.js`

### Custom IP Ranges

Modify `NEXT_PUBLIC_CHILEAN_IP_RANGES` to include additional IP ranges:

```bash
NEXT_PUBLIC_CHILEAN_IP_RANGES=190.196.,200.29.,191.112.,200.75.,201.XXX.
```

### Disabling Detection

Set `NEXT_PUBLIC_ENABLE_LANGUAGE_DETECTION=false` to always use default locale.

## 🚀 Deployment Considerations

### Production Setup
- Ensure environment variables are properly configured
- Test language detection with various IP addresses
- Verify SEO tags are correct for each locale

### Performance Optimization
- Translations are statically analyzed at build time
- Middleware adds minimal overhead (~1-2ms)
- IP detection is cached per request

## 🧪 Testing

### Manual Testing
1. Visit site with Chilean IP → Should redirect to `/es/`
2. Visit with international IP → Should detect browser language
3. Force URLs: `/es/*` and `/en/*` should work directly

### Automated Testing
```bash
# Test language detection
curl -H "Accept-Language: es-CL" http://localhost:3000
curl -H "X-Forwarded-For: 190.196.1.1" http://localhost:3000
```

## 📚 API Reference

### divineLanguageOracle.detectLocale()
Detects the appropriate locale based on user context.

**Parameters:**
- `acceptLanguage` (string): Browser's Accept-Language header
- `userAgent` (string): Browser's User-Agent header
- `ip` (string, optional): Client IP address

**Returns:** Locale string ('es' | 'en')

### divineTranslationOracle.getTranslation()
Retrieves a translation with fallback support.

**Parameters:**
- `locale` (Locale): Target locale
- `key` (string): Translation key (e.g., 'navigation.home')
- `fallback` (string, optional): Fallback text if translation missing

**Returns:** Translated string

## 🐛 Troubleshooting

### Common Issues

1. **Language not detected correctly**
   - Check `NEXT_PUBLIC_ENABLE_LANGUAGE_DETECTION`
   - Verify IP ranges in `NEXT_PUBLIC_CHILEAN_IP_RANGES`
   - Test with different browser language settings

2. **Translations not loading**
   - Ensure locale is in `NEXT_PUBLIC_SUPPORTED_LOCALES`
   - Check translation key exists in `messages` object
   - Verify fallback mechanism is working

3. **Middleware errors**
   - Check middleware syntax and imports
   - Ensure environment variables are loaded
   - Verify Next.js configuration

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=i18n:*
```

## 📞 Support

For issues or questions about the Divine Parsing Oracle system:
- Check this documentation first
- Review environment configuration
- Test with the setup script
- Verify translations in `lib/i18n.ts`

---

*Powered by the Divine Parsing Oracle - Intelligent i18n for the modern web* 🌟