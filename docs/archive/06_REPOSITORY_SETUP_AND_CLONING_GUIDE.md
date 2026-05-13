# Word Hustle 3C - Repository Setup and Cloning Guide

## Repository Information

- **Repository URL**: `git@github.com:ampersand22/wordhustle.git`
- **HTTPS URL**: `https://github.com/ampersand22/wordhustle.git`
- **Main Branch**: `main`
- **Repository Owner**: ampersand22
- **Project Name**: wordhustle

## Prerequisites for Repository Access

### 1. GitHub Account Setup
1. **Create GitHub Account** (if you don't have one):
   - Go to https://github.com/
   - Click "Sign up"
   - Choose a username, email, and password
   - Verify your email address

2. **Send Your GitHub Username**:
   - **IMPORTANT**: Send me your GitHub username so I can add you as a collaborator
   - You won't be able to clone the repository until I add you

### 2. Git Installation (Windows)
Follow the Git installation steps from the main installation guide:
1. Download from https://git-scm.com/download/win
2. Install with default settings
3. Verify with `git --version` in Command Prompt

## Repository Access Methods

### Method 1: HTTPS (Recommended for Beginners)
**Pros**: Easier setup, works with username/password
**Cons**: Need to enter credentials each time (can be cached)

### Method 2: SSH (Advanced)
**Pros**: More secure, no password prompts after setup
**Cons**: Requires SSH key setup

**For beginners, use HTTPS method below.**

## Step-by-Step Cloning Process (HTTPS)

### Step 1: Prepare Your Development Environment

1. **Open Command Prompt**:
   - Press `Windows Key + R`
   - Type `cmd` and press Enter

2. **Navigate to Your Development Folder**:
   ```cmd
   cd C:\Development
   ```
   
   If the Development folder doesn't exist:
   ```cmd
   mkdir C:\Development
   cd C:\Development
   ```

### Step 2: Configure Git (First Time Only)

Set up your Git identity (replace with your actual information):

```cmd
git config --global user.name "Your Full Name"
git config --global user.email "your.email@example.com"
```

**Important**: Use the same email address as your GitHub account.

### Step 3: Clone the Repository

1. **Clone using HTTPS**:
   ```cmd
   git clone https://github.com/ampersand22/wordhustle.git
   ```

2. **If prompted for credentials**:
   - Username: Your GitHub username
   - Password: Your GitHub password (or personal access token)

3. **Wait for download**:
   - This will take 1-3 minutes depending on your internet speed
   - You'll see progress messages

4. **Navigate into the project**:
   ```cmd
   cd wordhustle
   ```

### Step 4: Verify Successful Clone

1. **Check project contents**:
   ```cmd
   dir
   ```
   You should see folders like: `src`, `assets`, `docs`, and files like `App.js`, `package.json`

2. **Check Git status**:
   ```cmd
   git status
   ```
   Should show: "On branch main" and "nothing to commit, working tree clean"

3. **Check remote connection**:
   ```cmd
   git remote -v
   ```
   Should show the GitHub repository URLs

## Troubleshooting Common Issues

### Issue: "Repository not found" or "Permission denied"

**Cause**: You don't have access to the repository yet

**Solution**:
1. Make sure you sent me your GitHub username
2. Wait for me to add you as a collaborator
3. Check your email for a GitHub invitation and accept it
4. Try cloning again

### Issue: "Authentication failed"

**Cause**: Incorrect GitHub credentials

**Solutions**:
1. **Double-check your username and password**
2. **If using 2FA (Two-Factor Authentication)**:
   - You need a Personal Access Token instead of your password
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Generate a new token with "repo" permissions
   - Use the token as your password when cloning

### Issue: "SSL certificate problem"

**Cause**: Corporate firewall or network issues

**Solution**:
```cmd
git config --global http.sslverify false
```
**Note**: Only use this as a last resort and in development environments

### Issue: Clone is very slow

**Cause**: Large repository or slow internet

**Solutions**:
1. **Use shallow clone** (downloads less history):
   ```cmd
   git clone --depth 1 https://github.com/ampersand22/wordhustle.git
   ```

2. **Try during off-peak hours**

## Setting Up SSH (Optional - Advanced Users)

If you want to use SSH instead of HTTPS:

### Step 1: Generate SSH Key

```cmd
ssh-keygen -t ed25519 -C "your.email@example.com"
```

Press Enter for all prompts (uses default locations and no passphrase).

### Step 2: Add SSH Key to GitHub

1. **Copy your public key**:
   ```cmd
   type %USERPROFILE%\.ssh\id_ed25519.pub
   ```

2. **Add to GitHub**:
   - Go to GitHub → Settings → SSH and GPG keys
   - Click "New SSH key"
   - Paste the key content
   - Give it a title like "Windows Development Machine"

### Step 3: Clone with SSH

```cmd
git clone git@github.com:ampersand22/wordhustle.git
```

## Working with the Repository

### Daily Workflow Commands

1. **Start your work session**:
   ```cmd
   cd C:\Development\wordhustle
   git pull origin main
   ```

2. **Check what's changed**:
   ```cmd
   git status
   ```

3. **Add your changes**:
   ```cmd
   git add .
   ```

4. **Commit your changes**:
   ```cmd
   git commit -m "Describe what you changed"
   ```

5. **Push to GitHub**:
   ```cmd
   git push origin main
   ```

### Branch Management (Future Use)

When we start using feature branches:

1. **Create a new branch**:
   ```cmd
   git checkout -b feature/your-feature-name
   ```

2. **Switch between branches**:
   ```cmd
   git checkout main
   git checkout feature/your-feature-name
   ```

3. **Push a new branch**:
   ```cmd
   git push origin feature/your-feature-name
   ```

## Repository Structure After Cloning

After successful cloning, your folder structure should look like:

```
C:\Development\wordhustle\
├── .git\                 # Git repository data (hidden)
├── .expo\               # Expo configuration
├── assets\              # Images, fonts, static files
├── docs\                # Documentation files
├── node_modules\        # Dependencies (after npm install)
├── src\                 # Source code
│   ├── auth\           # Authentication
│   ├── components\     # UI components
│   ├── firebase\       # Firebase config
│   ├── screens\        # App screens
│   └── utils\          # Utility functions
├── App.js              # Main app file
├── package.json        # Project dependencies
├── .gitignore         # Files to ignore in Git
└── README.md          # Project readme (if exists)
```

## Next Steps After Cloning

1. **Install dependencies**:
   ```cmd
   npm install
   ```

2. **Set up environment variables**:
   - I'll provide you with the `.env` file content separately
   - Create `.env` file in the root directory

3. **Start development**:
   ```cmd
   npm start
   ```

4. **Test the app**:
   - Use Android emulator or Expo Go on your phone

## Git Best Practices for Our Team

### Commit Message Guidelines

**Good commit messages**:
```
Add user authentication validation
Fix scoring calculation for bonus words
Update leaderboard display styling
```

**Bad commit messages**:
```
fixed stuff
update
changes
```

### Before Committing

1. **Test your changes**:
   - Make sure the app runs without errors
   - Test the features you modified

2. **Check what you're committing**:
   ```cmd
   git status
   git diff
   ```

3. **Don't commit sensitive data**:
   - Never commit `.env` files with real API keys
   - Don't commit personal information

### Staying Up to Date

**Pull changes regularly**:
```cmd
git pull origin main
```

**Before starting work each day**:
```cmd
cd C:\Development\wordhustle
git pull origin main
npm start
```

## Getting Help

### If You Get Stuck

1. **Take a screenshot** of any error messages
2. **Note the exact command** you were trying to run
3. **Check your internet connection**
4. **Ask for help** in our team chat with:
   - What you were trying to do
   - The exact error message
   - Screenshot if helpful

### Useful Git Commands Reference

```cmd
git status              # Check current status
git log --oneline       # See recent commits
git pull origin main    # Get latest changes
git add .              # Stage all changes
git commit -m "message" # Commit with message
git push origin main    # Push to GitHub
git diff               # See what changed
git checkout -- file   # Undo changes to a file
```

## Repository Maintenance

### Keeping Your Fork Updated

If you fork the repository later:

```cmd
git remote add upstream https://github.com/ampersand22/wordhustle.git
git fetch upstream
git checkout main
git merge upstream/main
```

### Cleaning Up

If your repository gets messy:

```cmd
git clean -fd          # Remove untracked files
git reset --hard HEAD  # Reset to last commit (CAREFUL!)
```

---

**Remember**: The repository is the central source of truth for our project. Always pull before starting work and push your changes when they're ready. If you're ever unsure about a Git command, ask before running it!
