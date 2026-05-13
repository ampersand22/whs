# Contributing Guide

## Development Setup

1. **Fork and clone the repository**
2. **Install dependencies**: `npm install`
3. **Set up environment**: Copy `.env.example` to `.env`
4. **Start development server**: `npx expo start`

## Code Standards

### File Organization
```
src/
├── components/        # Reusable UI components
│   ├── auth/         # Authentication components
│   ├── game/         # Game-specific components
│   └── ui/           # Generic UI components
├── screens/          # Screen components
├── modals/           # Modal components
├── stores/           # State management (Zustand)
├── services/         # API services
├── utils/            # Utility functions
└── constants/        # App constants
```

### Naming Conventions
- **Components**: PascalCase (`GameScreen.js`)
- **Files**: camelCase (`userService.js`)
- **Constants**: UPPER_SNAKE_CASE (`SCORING_MULTIPLIERS`)
- **Functions**: camelCase (`calculateScore`)

### Code Style
```javascript
// Use functional components with hooks
const GameScreen = () => {
  const [score, setScore] = useState(0)
  
  // Early returns for better readability
  if (!user) {
    return <LoginPrompt />
  }
  
  return (
    <View>
      {/* Component JSX */}
    </View>
  )
}
```

## Git Workflow

### Branch Naming
- `feature/add-spanish-support`
- `fix/leaderboard-crash`
- `refactor/scoring-system`

### Commit Messages
```
feat: add Portuguese language support
fix: resolve leaderboard loading issue
docs: update API documentation
refactor: simplify scoring calculation
```

### Pull Request Process
1. Create feature branch from `main`
2. Make changes with clear commit messages
3. Test thoroughly on both platforms
4. Update documentation if needed
5. Submit PR with description of changes

## Testing Guidelines

### Manual Testing
- Test on both iOS and Android
- Verify offline functionality
- Test with different screen sizes
- Validate all user flows

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] No hardcoded values or secrets
- [ ] Error handling implemented
- [ ] Performance considerations addressed
- [ ] Documentation updated

## Adding New Features

### New Language Support
1. Create language-specific board generator
2. Add word list validation
3. Update UI translations
4. Add database language support
5. Test thoroughly with native speakers

### New Game Modes
1. Design game mechanics
2. Create new screen components
3. Update scoring system
4. Add database schema changes
5. Update documentation

## Bug Reports

### Required Information
- Device and OS version
- App version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or videos if applicable

### Bug Fix Process
1. Reproduce the issue locally
2. Identify root cause
3. Implement minimal fix
4. Test fix thoroughly
5. Update tests if needed

## Performance Guidelines

### Optimization Checklist
- [ ] Use React.memo for expensive components
- [ ] Implement lazy loading where appropriate
- [ ] Optimize image sizes and formats
- [ ] Minimize bundle size
- [ ] Profile performance on low-end devices

### Memory Management
- Clean up subscriptions in useEffect cleanup
- Avoid memory leaks in async operations
- Use FlatList for large lists
- Optimize image loading and caching

## Documentation

### Code Documentation
```javascript
/**
 * Calculate score based on word length and board number
 * @param {string} word - The found word
 * @param {number} boardNumber - Current board (1-5)
 * @returns {number} Calculated score
 */
const calculateScore = (word, boardNumber) => {
  // Implementation
}
```

### README Updates
- Keep feature list current
- Update version numbers
- Maintain accurate setup instructions
- Include relevant screenshots

## Release Process

### Version Numbering
- Major: Breaking changes (2.0.0)
- Minor: New features (1.1.0)
- Patch: Bug fixes (1.0.1)

### Release Checklist
- [ ] Update version in package.json
- [ ] Update CHANGELOG.md
- [ ] Test on physical devices
- [ ] Build and test production builds
- [ ] Update documentation
- [ ] Create release notes
