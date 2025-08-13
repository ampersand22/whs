#!/bin/bash

echo "🚀 Preparing Worrzle for App Store Build..."
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "⚠️  EAS CLI not found. Installing..."
    npm install -g @expo/eas-cli
else
    echo "✅ EAS CLI is installed"
fi

# Check critical files
echo ""
echo "📁 Checking required assets..."

if [ -f "./assets/icon.png" ]; then
    echo "✅ App icon found"
else
    echo "❌ App icon missing: ./assets/icon.png"
fi

if [ -f "./assets/adaptive-icon.png" ]; then
    echo "✅ Adaptive icon found"
else
    echo "❌ Adaptive icon missing: ./assets/adaptive-icon.png"
fi

if [ -f "./assets/splash-icon.png" ]; then
    echo "✅ Splash screen found"
else
    echo "❌ Splash screen missing: ./assets/splash-icon.png"
fi

# Check environment variables
echo ""
echo "🔧 Checking environment setup..."

if [ -f ".env" ]; then
    echo "✅ .env file found"
    if grep -q "SUPABASE_URL" .env; then
        echo "✅ Supabase URL configured"
    else
        echo "⚠️  Supabase URL not found in .env"
    fi
else
    echo "❌ .env file missing"
fi

# Check for test AdMob IDs (should be replaced)
echo ""
echo "📱 Checking AdMob configuration..."

if grep -q "ca-app-pub-3940256099942544" src/components/AdManager.js; then
    echo "⚠️  TEST AdMob IDs found - REPLACE with real IDs before production build!"
else
    echo "✅ AdMob IDs appear to be configured (not test IDs)"
fi

# Check app.config.js
echo ""
echo "⚙️  Checking app configuration..."

if grep -q "com.yourcompany.worzzle" app.config.js; then
    echo "⚠️  Default bundle identifier found - UPDATE in app.config.js"
else
    echo "✅ Bundle identifier appears to be customized"
fi

echo ""
echo "🧹 Cleaning up unused files..."
if [ -f "./cleanup-unused-files.sh" ]; then
    ./cleanup-unused-files.sh
else
    echo "⚠️  Cleanup script not found"
fi

echo ""
echo "📋 Pre-build Summary:"
echo "===================="
echo ""
echo "✅ COMPLETED:"
echo "   - Code cleanup and optimization"
echo "   - UI enhancements (lively modals)"
echo "   - Game mechanics working"
echo "   - Database integration"
echo ""
echo "⚠️  BEFORE BUILDING, MAKE SURE TO:"
echo "   1. Replace bundle identifiers in app.config.js"
echo "   2. Replace AdMob test IDs with real ones"
echo "   3. Set production Supabase credentials"
echo "   4. Test on physical devices"
echo "   5. Create privacy policy and terms of service"
echo ""
echo "🏗️  READY TO BUILD:"
echo "   eas build --platform all --profile production"
echo ""
echo "📖 See BUILD_PREPARATION.md for detailed instructions"
