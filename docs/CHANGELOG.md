# Changelog

All notable changes to Worrzle will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Multi-language support (English and Portuguese)
- Language-specific board generation with optimized letter frequency
- Portuguese word validation with accent normalization
- Language selection modal
- Separate leaderboards by language

### Changed
- Updated project name from "Word Hustle 3C" to "Worrzle"
- Migrated from Firebase to Supabase for backend services
- Reorganized file structure for better maintainability
- Improved scoring system with board-based multipliers

### Fixed
- Board generation now uses proper 5x5 grid
- Improved word validation accuracy
- Fixed leaderboard real-time updates

## [1.0.2] - 2024-10-29

### Added
- Portuguese language support
- Brazilian Portuguese word list with 50,000+ words
- Language-specific letter frequency optimization
- Accent normalization for Portuguese input

### Changed
- Updated UI to support language switching
- Improved board generation algorithm
- Enhanced scoring system documentation

### Fixed
- Memory optimization for large word lists
- Improved game performance on lower-end devices

## [1.0.1] - 2024-09-12

### Added
- Responsive design improvements
- Better tablet support
- Enhanced error handling

### Fixed
- Build preparation script improvements
- Unused file cleanup
- Performance optimizations

## [1.0.0] - 2024-07-26

### Added
- Initial release of Worrzle
- 5x5 letter grid gameplay
- User authentication system
- Real-time leaderboards
- Monthly competition system
- Star-based achievement system
- Cross-platform support (iOS/Android)

### Features
- Supabase backend integration
- React Native Paper UI components
- Zustand state management
- React Navigation
- Expo development platform

---

## Release Types

- **Major** (X.0.0): Breaking changes, major new features
- **Minor** (1.X.0): New features, backwards compatible
- **Patch** (1.0.X): Bug fixes, small improvements
