#!/bin/bash

# Script to toggle between normal and debug AdManager for testing

ORIGINAL_FILE="src/components/AdManager.js"
DEBUG_FILE="src/components/AdManager.debug.js"
BACKUP_FILE="src/components/AdManager.original.js"

if [ "$1" = "disable" ]; then
    echo "🔧 Disabling AdMob for debugging..."
    
    # Backup original if not already backed up
    if [ ! -f "$BACKUP_FILE" ]; then
        cp "$ORIGINAL_FILE" "$BACKUP_FILE"
        echo "✅ Original AdManager backed up"
    fi
    
    # Replace with debug version
    cp "$DEBUG_FILE" "$ORIGINAL_FILE"
    echo "✅ AdMob disabled - using debug version"
    echo "📱 You can now test the app without AdMob crashes"
    
elif [ "$1" = "enable" ]; then
    echo "🔧 Re-enabling AdMob..."
    
    if [ -f "$BACKUP_FILE" ]; then
        cp "$BACKUP_FILE" "$ORIGINAL_FILE"
        echo "✅ Original AdManager restored"
        echo "📱 AdMob is now enabled again"
    else
        echo "❌ No backup found - cannot restore original"
    fi
    
else
    echo "Usage: $0 [disable|enable]"
    echo "  disable - Replace AdManager with debug version (no AdMob)"
    echo "  enable  - Restore original AdManager (with AdMob)"
    echo ""
    echo "Current status:"
    if [ -f "$BACKUP_FILE" ]; then
        echo "  🔴 AdMob is currently DISABLED (debug mode)"
    else
        echo "  🟢 AdMob is currently ENABLED (normal mode)"
    fi
fi
