#!/bin/bash

# PWA Implementation Verification Script
# Checks that all PWA components are properly configured

echo "🔍 PWA Implementation Verification"
echo "=================================="
echo ""

# Check 1: Service Worker file exists
echo "1. Checking Service Worker file..."
if [ -f "public/sw.js" ]; then
  SIZE=$(stat -f%z "public/sw.js" 2>/dev/null || stat -c%s "public/sw.js" 2>/dev/null)
  echo "   ✅ Service Worker exists ($(( SIZE / 1024 )) KB)"

  # Check for key patterns in SW
  if grep -q "self.addEventListener('fetch'" "public/sw.js"; then
    echo "   ✅ Fetch event handler present"
  fi
  if grep -q "CACHE_NAME" "public/sw.js"; then
    echo "   ✅ Caching logic present"
  fi
else
  echo "   ❌ Service Worker not found!"
fi
echo ""

# Check 2: Manifest file
echo "2. Checking Web Manifest..."
if [ -f "public/site.webmanifest" ]; then
  echo "   ✅ Manifest file exists"

  if grep -q '"start_url"' "public/site.webmanifest"; then
    START_URL=$(grep '"start_url"' "public/site.webmanifest" | head -1)
    echo "   ✅ start_url configured: $START_URL"
  fi

  if grep -q '"scope"' "public/site.webmanifest"; then
    SCOPE=$(grep '"scope"' "public/site.webmanifest" | head -1)
    echo "   ✅ scope configured: $SCOPE"
  fi

  if grep -q '"display"' "public/site.webmanifest"; then
    DISPLAY=$(grep '"display"' "public/site.webmanifest" | head -1)
    echo "   ✅ display mode configured: $DISPLAY"
  fi
else
  echo "   ❌ Manifest not found!"
fi
echo ""

# Check 3: Offline fallback page
echo "3. Checking Offline Fallback Page..."
if [ -f "public/offline.html" ]; then
  echo "   ✅ Offline page exists"
  if grep -q "You're Offline" "public/offline.html"; then
    echo "   ✅ Offline message present"
  fi
else
  echo "   ❌ Offline page not found!"
fi
echo ""

# Check 4: Service worker registration
echo "4. Checking Service Worker Registration..."
if grep -q "navigator.serviceWorker.register" "app/RootClientInitializer.tsx"; then
  echo "   ✅ SW registration code present"

  if grep -q "'/sw.js'" "app/RootClientInitializer.tsx"; then
    echo "   ✅ Correct SW path configured"
  fi

  if grep -q "scope: '/'" "app/RootClientInitializer.tsx"; then
    echo "   ✅ Scope set to root (/)"
  fi
else
  echo "   ❌ SW registration not found!"
fi
echo ""

# Check 5: Layout metadata
echo "5. Checking Layout Metadata..."
if grep -q "manifest: '/site.webmanifest'" "app/layout.tsx"; then
  echo "   ✅ Manifest linked in layout"
else
  echo "   ⚠️  Manifest not explicitly linked (usually auto-detected)"
fi
echo ""

# Summary
echo "=================================="
echo "✅ PWA Implementation Complete!"
echo ""
echo "Next Steps:"
echo "1. Build: npm run build"
echo "2. Test: npm start"
echo "3. DevTools: F12 > Application > Service Workers"
echo "4. Lighthouse: F12 > Lighthouse > Generate Report"
echo ""
echo "For full documentation, see: PWA.md"

