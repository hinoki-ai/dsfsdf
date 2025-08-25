#!/bin/bash

# Divine Parsing Oracle - Environment Setup Script
# This script helps configure the environment files for the Liquor Store SaaS

echo "🔮 Divine Parsing Oracle - Environment Configuration"
echo "=================================================="

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ .env.local already exists"
else
    echo "📝 Creating .env.local from env.example..."
    cp env.example .env.local
    echo "✅ .env.local created successfully"
fi

# Check if i18n environment variables are configured
echo ""
echo "🌐 Checking i18n configuration..."

# Function to update or add environment variable
update_env_var() {
    local var_name="$1"
    local var_value="$2"
    local file_path="$3"

    if grep -q "^$var_name=" "$file_path"; then
        # Variable exists, update it
        sed -i.bak "s|^$var_name=.*|$var_name=$var_value|" "$file_path"
        echo "✅ Updated $var_name"
    else
        # Variable doesn't exist, add it
        echo "$var_name=$var_value" >> "$file_path"
        echo "✅ Added $var_name"
    fi
}

# Configure i18n environment variables
update_env_var "NEXT_PUBLIC_DEFAULT_LOCALE" "es" ".env.local"
update_env_var "NEXT_PUBLIC_SUPPORTED_LOCALES" "es,en" ".env.local"
update_env_var "NEXT_PUBLIC_ENABLE_LANGUAGE_DETECTION" "true" ".env.local"
update_env_var "NEXT_PUBLIC_CHILEAN_IP_RANGES" "190.196.,200.29.,191.112.,200.75." ".env.local"

echo ""
echo "🎯 i18n Configuration Summary:"
echo "   - Default Locale: es (Chilean Spanish)"
echo "   - Supported Locales: es, en"
echo "   - Language Detection: Enabled"
echo "   - Chilean IP Detection: Configured"

echo ""
echo "📋 Next Steps:"
echo "   1. Edit .env.local with your actual API keys and secrets"
echo "   2. Update service configurations (Clerk, Convex, etc.)"
echo "   3. Run 'npm install' if dependencies are missing"
echo "   4. Start development with 'npm run dev'"

echo ""
echo "🔮 Divine Parsing Oracle is ready to serve your multilingual needs!"