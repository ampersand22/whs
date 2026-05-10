# API Reference

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  high_score INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  stars_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Scores Table
```sql
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('english', 'portuguese')),
  words_found JSONB,
  board_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Monthly Winners Table
```sql
CREATE TABLE monthly_winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  score INTEGER NOT NULL,
  language TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month, year, language)
);
```

## API Endpoints (Supabase)

### Authentication

#### Sign Up
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})
```

#### Sign In
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com', 
  password: 'password123'
})
```

### User Management

#### Create User Profile
```javascript
const { data, error } = await supabase
  .from('users')
  .insert([{
    username: 'player123',
    email: 'user@example.com'
  }])
```

#### Update User Stats
```javascript
const { data, error } = await supabase
  .from('users')
  .update({
    high_score: newScore,
    games_played: gamesPlayed + 1
  })
  .eq('id', userId)
```

### Score Management

#### Submit Score
```javascript
const { data, error } = await supabase
  .from('scores')
  .insert([{
    user_id: userId,
    score: finalScore,
    language: 'english',
    words_found: foundWords,
    board_data: boardState
  }])
```

#### Get Leaderboard
```javascript
const { data, error } = await supabase
  .from('scores')
  .select(`
    score,
    language,
    created_at,
    users!inner(username)
  `)
  .eq('language', language)
  .order('score', { ascending: false })
  .limit(10)
```

### Real-time Subscriptions

#### Leaderboard Updates
```javascript
const subscription = supabase
  .channel('leaderboard')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'scores'
  }, (payload) => {
    // Update leaderboard in real-time
    updateLeaderboard(payload.new)
  })
  .subscribe()
```

## Row Level Security (RLS) Policies

### Users Table
```sql
-- Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users  
  FOR UPDATE USING (auth.uid() = id);
```

### Scores Table
```sql
-- Anyone can read scores (for leaderboards)
CREATE POLICY "Scores are publicly readable" ON scores
  FOR SELECT USING (true);

-- Users can only insert their own scores
CREATE POLICY "Users can insert own scores" ON scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Error Handling

### Common Error Responses
```javascript
// Username already exists
{
  error: {
    code: '23505',
    message: 'duplicate key value violates unique constraint'
  }
}

// Invalid language
{
  error: {
    code: '23514', 
    message: 'new row violates check constraint'
  }
}

// Unauthorized access
{
  error: {
    code: 'PGRST301',
    message: 'JWT expired'
  }
}
```

## Rate Limiting

### Score Submission
- Maximum 1 score per minute per user
- Implemented via database triggers
- Prevents score manipulation

### Leaderboard Queries
- Cached for 30 seconds
- Reduces database load
- Maintains real-time feel
