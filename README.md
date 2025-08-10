# Worzzle - React Native Expo Game

A competitive word-finding game built with React Native, Expo, and Supabase. Players compete monthly to find words on a 5x5 letter grid and earn stars for top performance.

## 🎮 Game Features

- **5x5 Letter Grid**: Swipe to connect letters and form words
- **Real Word Validation**: Uses comprehensive Scrabble word list
- **Advanced Scoring System**: Points vary by word length and board number
- **Monthly Competition**: Compete for monthly leaderboard rankings
- **Star System**: Monthly winners earn stars ⭐
- **Multiple Boards**: Up to 5 different boards per game
- **User Profiles**: Track high scores, games played, and achievements
- **Bonus Words**: Special words worth extra points (hidden feature)

## 🏗️ Tech Stack

- **Frontend**: React Native with Expo
- **UI Components**: React Native Paper (Material Design 3)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: Zustand
- **Navigation**: React Navigation

## 📱 Screenshots

*Screenshots coming soon...*

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/whs.git
   cd whs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL script in `sql/master.sql` in your Supabase SQL Editor
   - This creates all necessary tables, functions, and triggers

5. **Start the development server**
   ```bash
   npx expo start
   ```

## 🗄️ Database Schema

The game uses several key tables:

- **whs-users**: User profiles and statistics
- **whs-game_scores**: Individual game results
- **whs-monthly_leaderboards**: Monthly competition rankings
- **whs-monthly_winners**: Monthly champions
- **whs-user_stars**: Achievement tracking

See `sql/master.sql` for the complete schema and stored procedures.

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

### Gameplay

- **Time Limit**: 3 minutes per game
- **Board Resets**: Up to 5 different boards per game
- **Word Requirements**: Minimum 3 letters
- **Letter Connection**: Adjacent letters only (including diagonals)
- **No Repeats**: Each letter can only be used once per word

## 📁 Project Structure

```
whs/
├── App.js                 # Main app component
├── src/
│   ├── components/        # Reusable UI components
│   │   └── LetterGrid.js  # 5x5 letter grid component
│   ├── screens/           # App screens
│   │   ├── StartScreen.js # Authentication & main menu
│   │   └── GameScreen.js  # Game interface
│   ├── stores/            # State management
│   │   └── userStore.js   # User state & actions
│   ├── utils/             # Utility functions
│   │   ├── BoardGenerator.js  # Letter grid generation
│   │   ├── WordList.js        # Word validation
│   │   ├── scoringUtils.js    # Scoring calculations
│   │   └── userScores.js      # Database operations
│   └── config/
│       └── supabase.js    # Supabase client configuration
├── assets/                # Images and word lists
├── sql/                   # Database schema and setup
└── lib/                   # Additional configurations
```

## 🧪 Testing

The app includes comprehensive `data-testid` attributes for testing:

- Authentication flows
- Game mechanics
- Scoring system
- Leaderboard functionality

## 🚀 Deployment

### Expo Build

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

### Environment Setup

Make sure to configure your production environment variables in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Word lists sourced from official Scrabble dictionaries
- UI components from React Native Paper
- Database and authentication by Supabase

## 📞 Support

For support, email [your-email@example.com] or create an issue in this repository.

---

**Happy word hunting! 🎯**
