# Getting Started

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (Mac) or Android Studio

## Installation

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
   # Edit .env with your Supabase credentials
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

## Environment Setup

Create a `.env` file with:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Running the App

- **iOS**: Press `i` in the terminal or scan QR code with Camera app
- **Android**: Press `a` in the terminal or scan QR code with Expo Go app
- **Web**: Press `w` in the terminal

## Troubleshooting

### Common Issues

1. **Metro bundler cache issues**
   ```bash
   npx expo start --clear
   ```

2. **Node modules issues**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **iOS build issues**
   ```bash
   cd ios && pod install && cd ..
   ```

## Next Steps

- Read [Architecture](ARCHITECTURE.md) to understand the codebase
- Check [Game Mechanics](features/game-mechanics.md) to understand gameplay
- See [Contributing](CONTRIBUTING.md) for development guidelines
