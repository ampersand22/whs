# Word Hustle 3C - Windows Installation Step-by-Step Guide

## IMPORTANT: Read This First!

This guide is for **complete beginners** on Windows. Follow every step exactly as written. If you get stuck, take a screenshot and ask for help.

## What You'll Need

- Windows 10 or Windows 11
- Good internet connection
- About 1-2 hours for complete setup
- Access to the GitHub repository (I'll help you get this)

## Step 1: Install Node.js

### 1.1 Download Node.js
1. Open your web browser (Chrome, Edge, Firefox)
2. Go to: https://nodejs.org/
3. Click the **green button** that says "LTS" (it will show a version number like "20.x.x LTS")
4. The file will download (it's about 50MB)

### 1.2 Install Node.js
1. Find the downloaded file (usually in your Downloads folder)
2. Double-click the file (it ends with `.msi`)
3. Click "Next" on every screen
4. Click "Install" when asked
5. Click "Finish" when done

### 1.3 Verify Node.js Installation
1. Press `Windows Key + R`
2. Type `cmd` and press Enter
3. A black window opens (this is Command Prompt)
4. Type this command and press Enter:
   ```
   node --version
   ```
5. You should see something like `v20.10.0`
6. Type this command and press Enter:
   ```
   npm --version
   ```
7. You should see something like `10.2.3`
8. If both commands show version numbers, Node.js is installed correctly!

## Step 2: Install Git

### 2.1 Download Git
1. Go to: https://git-scm.com/download/win
2. Click "64-bit Git for Windows Setup" (the download starts automatically)

### 2.2 Install Git
1. Find the downloaded file and double-click it
2. Click "Next" on every screen (the default settings are fine)
3. **IMPORTANT**: When you see "Choosing the default editor", select "Use Visual Studio Code as Git's default editor" if you plan to use VS Code
4. Keep clicking "Next" until you see "Install"
5. Click "Install"
6. Click "Finish"

### 2.3 Verify Git Installation
1. Open Command Prompt again (`Windows Key + R`, type `cmd`, press Enter)
2. Type this command and press Enter:
   ```
   git --version
   ```
3. You should see something like `git version 2.42.0.windows.1`

## Step 3: Set Up GitHub Access

### 3.1 Create GitHub Account (if you don't have one)
1. Go to: https://github.com/
2. Click "Sign up" and create an account
3. **Tell me your GitHub username so I can add you to the repository**

### 3.2 Set Up Git with Your Information
1. Open Command Prompt (`Windows Key + R`, type `cmd`, press Enter)
2. Set your name (replace "Your Name" with your actual name):
   ```
   git config --global user.name "Your Name"
   ```
3. Set your email (use the same email as your GitHub account):
   ```
   git config --global user.email "your.email@example.com"
   ```

## Step 4: Install Visual Studio Code (Recommended Code Editor)

### 4.1 Download VS Code
1. Go to: https://code.visualstudio.com/
2. Click the blue "Download for Windows" button

### 4.2 Install VS Code
1. Find the downloaded file and double-click it
2. Accept the license agreement
3. **IMPORTANT**: Check the box "Add to PATH" (this is important!)
4. Check the box "Create a desktop icon" if you want
5. Click "Next" then "Install"
6. Click "Finish"

## Step 5: Install Android Studio (For Android Development)

### 5.1 Download Android Studio
1. Go to: https://developer.android.com/studio
2. Click "Download Android Studio"
3. Accept the terms and click "Download Android Studio for Windows"

### 5.2 Install Android Studio
1. Find the downloaded file and double-click it
2. Click "Next" on every screen
3. **This will take a long time (30-60 minutes)** - be patient!
4. When it asks about importing settings, choose "Do not import settings"
5. Follow the setup wizard:
   - Choose "Standard" installation
   - Accept all licenses
   - Let it download everything (this takes a while)

### 5.3 Set Up Android Emulator
1. Open Android Studio
2. Click "More Actions" → "Virtual Device Manager"
3. Click "Create Device"
4. Choose "Phone" → "Pixel 4" → "Next"
5. Download a system image (choose the latest one)
6. Click "Next" → "Finish"

## Step 6: Install Expo CLI

### 6.1 Install Expo CLI Globally
1. Open Command Prompt (`Windows Key + R`, type `cmd`, press Enter)
2. Type this command and press Enter:
   ```
   npm install -g @expo/cli
   ```
3. Wait for it to finish (this takes a few minutes)
4. Verify installation by typing:
   ```
   expo --version
   ```
5. You should see a version number

## Step 7: Get the Project Code from GitHub

### 7.1 Create a Development Folder
1. Open File Explorer
2. Go to your C: drive
3. Create a new folder called "Development" (right-click → New → Folder)
4. Open the Development folder

### 7.2 Clone the Project Repository
1. Open Command Prompt
2. Navigate to your Development folder by typing:
   ```
   cd C:\Development
   ```
3. Clone the Word Hustle project:
   ```
   git clone https://github.com/ampersand22/wordhustle.git
   ```
4. Wait for it to download (this might take a few minutes)
5. Go into the project folder:
   ```
   cd wordhustle
   ```

**Note**: If you get a "Permission denied" error, it means you don't have access to the repository yet. Send me your GitHub username and I'll add you.

## Step 8: Install Project Dependencies

### 8.1 Install Node Modules
1. Make sure you're in the wordhustle folder in Command Prompt
2. Type this command and press Enter:
   ```
   npm install
   ```
3. **This will take 5-10 minutes** - be patient!
4. You'll see lots of text scrolling - this is normal
5. When it's done, you should see something like "added 1234 packages"

## Step 9: Set Up Environment Variables

### 9.1 Create Environment File
1. Open VS Code
2. Click "File" → "Open Folder"
3. Navigate to C:\Development\wordhustle and click "Select Folder"
4. Right-click in the file explorer panel and choose "New File"
5. Name the file `.env` (with the dot at the beginning)
6. **I'll provide you with the Firebase configuration content for this file separately**

## Step 10: Test Your Setup

### 10.1 Start the Development Server
1. Open Command Prompt
2. Navigate to your project:
   ```
   cd C:\Development\wordhustle
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Wait for it to start (you'll see a QR code and some options)
5. **The first time might take 2-3 minutes**

### 10.2 Test on Android Emulator
1. Make sure Android Studio is open with an emulator running
2. In the Command Prompt where Expo is running, press `a`
3. The app should open in the Android emulator
4. You should see the Word Hustle start screen

### 10.3 Test on Your Phone (Optional)
1. Install "Expo Go" app from Google Play Store (Android) or App Store (iPhone)
2. Scan the QR code shown in Command Prompt
3. The app should open on your phone

## Common Problems and Solutions

### Problem: "npm is not recognized"
**Solution**: Restart your computer and try again. Node.js needs a restart to work properly.

### Problem: Command Prompt says "Access Denied"
**Solution**: Right-click on Command Prompt and choose "Run as Administrator"

### Problem: "Permission denied" when cloning repository
**Solution**: 
1. Make sure you have a GitHub account
2. Send me your GitHub username
3. I'll add you to the repository
4. Try cloning again

### Problem: Android emulator won't start
**Solution**: 
1. Open Android Studio
2. Go to Tools → AVD Manager
3. Click the play button next to your virtual device

### Problem: Expo won't start
**Solution**: 
1. Close Command Prompt
2. Open a new Command Prompt
3. Navigate back to your project folder
4. Try `npm start` again

### Problem: "Module not found" errors
**Solution**:
1. Delete the node_modules folder
2. Run `npm install` again

## Daily Development Workflow

### Every time you want to work on the project:

1. Open Command Prompt
2. Navigate to project:
   ```
   cd C:\Development\wordhustle
   ```
3. Pull latest changes:
   ```
   git pull origin main
   ```
4. Start development server:
   ```
   npm start
   ```
5. Open Android emulator or use your phone with Expo Go

### When you make changes:

1. Save your files in VS Code
2. The app will automatically reload
3. When ready to share your changes:
   ```
   git add .
   git commit -m "Description of what you changed"
   git push origin main
   ```

## Repository Information

- **Repository URL**: https://github.com/ampersand22/wordhustle.git
- **Main Branch**: main
- **Project Folder**: wordhustle (after cloning)

## Getting Help

If you get stuck:
1. Take a screenshot of the error
2. Note which step you were on
3. Copy the exact error message
4. Ask for help in our team chat

## What's Next?

After you complete this setup:
1. Read the Game Mechanics documentation
2. Look at the Tech Stack documentation
3. Start with small changes to get familiar with the code
4. Ask questions about any part of the code you don't understand

---

**Remember**: This setup only needs to be done once. After this, you'll just need to run `npm start` to begin development each day.

**Important**: Make sure to send me your GitHub username so I can give you access to the repository!
