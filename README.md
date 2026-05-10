# Worrzle 🎯

> A competitive word-finding game with multi-language support

[![Version](https://img.shields.io/badge/version-1.0.2-blue.svg)]()
[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-green.svg)]()
[![Expo](https://img.shields.io/badge/Expo-54.0.10-black.svg)]()

## 🚀 Quick Start

```bash
git clone https://github.com/yourusername/whs.git
cd whs
npm install
npx expo start
```

## 🎮 Features

- 🌍 **Multi-language Support**: Play in English or Portuguese
- 🏆 **Monthly Competitions**: Compete for stars and leaderboard rankings
- 📱 **Cross-platform**: Works on iOS and Android
- ⚡ **Real-time Leaderboards**: Live rankings updated instantly
- 🎯 **Advanced Scoring**: Points vary by word length and board number
- 🔤 **5x5 Letter Grid**: Swipe to connect letters and form words
- 📊 **User Profiles**: Track high scores, games played, and achievements

## 🏗️ Tech Stack

- **Frontend**: React Native with Expo
- **UI Components**: React Native Paper (Material Design 3)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: Zustand
- **Navigation**: React Navigation

## 📖 Documentation

- [Getting Started](docs/GETTING_STARTED.md) - Setup and installation
- [Architecture](docs/ARCHITECTURE.md) - Technical overview
- [Game Mechanics](docs/features/game-mechanics.md) - How the game works
- [Multi-language Support](docs/features/multi-language.md) - Language implementation
- [API Reference](docs/API.md) - Database schema and endpoints
- [Deployment](docs/DEPLOYMENT.md) - Build and release process

## 🎯 Game Rules

### Scoring System

Points are awarded based on word length and current board:

| Word Length | Board 1 | Board 2 | Boards 3-5 |
|-------------|---------|---------|------------|
| 3-4 letters | 100     | 70      | 50         |
| 5 letters   | 150     | 110     | 75         |
| 6-7 letters | 180     | 130     | 100        |
| 8+ letters  | 225     | 175     | 125        |

### Monthly Competition

- Players compete each month for the highest score
- Monthly winners earn a star ⭐
- Leaderboards reset each month
- Stars accumulate over time

## 🚀 Development

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
├── screens/          # App screens
├── stores/           # State management
├── utils/            # Utility functions
├── services/         # API services
└── constants/        # App constants
```

## 🤝 Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for development guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Happy word hunting! 🎯**
