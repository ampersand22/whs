# Changelog Automation Guide

## Amazon Q Prompt for Changelog Updates

Use this prompt with Amazon Q to maintain consistent changelog entries:

---

**PROMPT:**

```
Please update the CHANGELOG.md file for my Worrzle project. Here are the changes I made:

[DESCRIBE YOUR CHANGES HERE]

Follow these guidelines:
1. Use Keep a Changelog format (https://keepachangelog.com/)
2. Add entries to [Unreleased] section
3. Categorize changes as: Added, Changed, Deprecated, Removed, Fixed, Security
4. Use present tense, imperative mood ("Add feature" not "Added feature")
5. Be specific and user-focused
6. Include relevant technical details for developers
7. Maintain semantic versioning principles

Current version: [CURRENT_VERSION]
Target version: [NEW_VERSION if releasing]

Example format:
### Added
- New Portuguese language support with 50,000+ word dictionary
- Language selection modal in start screen

### Changed  
- Improved board generation algorithm for better letter distribution
- Updated scoring system to use board-based multipliers

### Fixed
- Resolved memory leak in word validation system
- Fixed leaderboard not updating in real-time

Please read the current CHANGELOG.md file and add the new entries appropriately.
```

---

## Usage Examples

### For New Features
```
Changes made:
- Added Spanish language support
- Created new SpanishBoardGenerator.js
- Added Spanish word list with 45,000 words
- Updated language selection modal

Current version: 1.0.2
Target version: 1.1.0 (minor release - new feature)
```

### For Bug Fixes
```
Changes made:
- Fixed crash when submitting score without internet
- Resolved issue where Portuguese accents weren't recognized
- Fixed leaderboard showing wrong scores after language switch

Current version: 1.0.2  
Target version: 1.0.3 (patch release - bug fixes)
```

### For Major Changes
```
Changes made:
- Complete UI redesign with new theme
- Migrated from Supabase to Firebase
- Added multiplayer real-time gameplay
- Breaking: Changed API endpoints and data structure

Current version: 1.0.2
Target version: 2.0.0 (major release - breaking changes)
```

## Automation Script

Create this script to streamline the process:

```bash
#!/bin/bash
# update-changelog.sh

echo "What type of changes did you make?"
echo "1. New features (minor version bump)"
echo "2. Bug fixes (patch version bump)" 
echo "3. Breaking changes (major version bump)"
read -p "Enter choice (1-3): " choice

echo "Describe your changes:"
read -p "> " changes

case $choice in
  1) version_type="minor" ;;
  2) version_type="patch" ;;
  3) version_type="major" ;;
esac

echo "Use this prompt with Amazon Q:"
echo "---"
echo "Please update the CHANGELOG.md file for my Worrzle project."
echo "Changes made: $changes"
echo "Version type: $version_type"
echo "Follow Keep a Changelog format and semantic versioning."
echo "---"
```

## Changelog Maintenance Rules

### When to Update
- **Every commit**: Add to [Unreleased] section
- **Before release**: Move [Unreleased] to versioned section
- **After release**: Create new [Unreleased] section

### What to Include
- **User-facing changes**: New features, UI changes, bug fixes
- **Developer changes**: API changes, dependency updates
- **Breaking changes**: Always highlight prominently

### What to Exclude
- Internal refactoring (unless it affects performance)
- Documentation updates (unless significant)
- Development tool changes
- Typo fixes in code comments

## Version Release Process

1. **Update changelog** with Amazon Q
2. **Bump version** in package.json
3. **Commit changes**: `git commit -m "chore: release v1.0.3"`
4. **Create tag**: `git tag v1.0.3`
5. **Push changes**: `git push origin main --tags`
6. **Build and deploy** using EAS

## Integration with Development Workflow

### Pre-commit Hook (Optional)
```bash
# .husky/pre-commit
#!/bin/sh
if git diff --cached --name-only | grep -q "src/"; then
  echo "⚠️  Remember to update CHANGELOG.md for your changes"
fi
```

### PR Template
```markdown
## Changes Made
- [ ] Added new feature
- [ ] Fixed bug
- [ ] Updated documentation

## Changelog Entry
<!-- Paste the changelog entry here -->

## Testing
- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] Updated tests if needed
```
