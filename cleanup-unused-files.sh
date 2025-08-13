#!/bin/bash

# Script to remove unused files from the Worrzle project
# Run this from the project root directory

echo "🧹 Cleaning up unused files..."

# Old/deprecated files
echo "Removing old/deprecated files..."
rm -f "./src/modals/FoundWordsModalOld.js"
rm -f "./src/modals/HowToPlayModalOld.js"
rm -f "./src/utils/scoringUtilsOld.js"
rm -f "./src/screens/GameScreenOld2.js"

# Old screen versions
echo "Removing old screen versions..."
rm -rf "./src/screens/old/"

# Unused utility files
echo "Removing unused utility files..."
rm -f "./src/utils/monthEndProcessor.js"
rm -f "./src/utils/gameUtils.js"
rm -f "./src/utils/passwordValidator.js"

# Unused component files
echo "Removing unused component files..."
rm -f "./src/components/GridHeader.js"
rm -f "./src/components/GameOverScreen.js"
rm -f "./src/components/ResponsiveText.js"
rm -f "./src/components/ResponsiveLayout.js"
rm -f "./src/components/ScoringDisplay.js"
rm -f "./src/components/FoundWordsList.js"
rm -f "./src/components/ResponsiveCard.js"
rm -f "./src/components/ActionButtons.js"
rm -f "./src/components/WordDisplay.js"

# Test files (optional - uncomment if you want to remove them)
echo "Removing test files..."
rm -f "./src/utils/contentModerator.test.js"
rm -f "./src/utils/passwordValidator.test.js"
rm -f "./src/utils/scoringUtils.test.js"

# Unused utility that's not imported
rm -f "./src/utils/contentModerator.js"

echo "✅ Cleanup complete!"
echo ""
echo "📊 Summary of removed files:"
echo "- 4 old/deprecated modal and screen files"
echo "- 2 old screen directories"
echo "- 3 unused utility files"
echo "- 9 unused component files"
echo "- 3 test files"
echo "- 1 unused content moderator"
echo ""
echo "Total: ~22 files removed"
