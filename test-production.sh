#!/bin/bash

echo "🧪 Testing Production Build..."
echo ""

# Check if we're in the right directory
if [ ! -f "app.config.js" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "1️⃣ Building production-debug version for testing..."
eas build --profile production-debug --platform ios --local

echo ""
echo "2️⃣ Alternative: Build locally with release configuration..."
echo "Run: npx expo run:ios --configuration Release"

echo ""
echo "3️⃣ To test with development build (recommended):"
echo "Run: eas build --profile development --platform ios"
echo "Then install via TestFlight or direct install"

echo ""
echo "🔍 Common production issues to check:"
echo "   - App crashes on startup"
echo "   - Environment variables not loading"
echo "   - Supabase connection issues"
echo "   - Navigation problems"
echo "   - Missing assets or fonts"
echo ""
echo "📱 Test on actual device, not just simulator!"
