# 🎮 Tic-Tac-Toe Master

A modern, responsive, and feature-packed Tic-Tac-Toe web game built with vanilla HTML5, CSS3, and JavaScript. Zero external dependencies!

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=github&logoColor=white)

---

## ✨ Features

- 👥 **2-Player Local Mode**: Classic pass-and-play against friends.
- 🤖 **Smart AI Opponent**:
  - **Casual**: Fun and easy random moves.
  - **Unbeatable (Minimax)**: Advanced Minimax decision algorithm that never loses!
- 🔊 **Built-in Sound Effects**: Procedurally generated with the Web Audio API (no missing sound files).
- 🏆 **Scoreboard Tracker**: Live counter for Player X wins, Player O wins, and Ties.
- 🎨 **Modern Cyber/Neon Aesthetic**: Smooth glassmorphism, responsive grid, dynamic glow indicators, and winning strike line animations.
- 🎊 **Confetti Celebration**: Canvas-powered victory confetti.
- 📱 **Mobile & Desktop Responsive**: Scales smoothly on screens of any size.

---

## 🚀 How to Run Locally

Simply double-click the `index.html` file to open it directly in any web browser (Chrome, Edge, Firefox, Safari).

---

## 🌐 How to Host on GitHub Pages (Free)

### Option 1: Via GitHub Web (Easiest & Fastest - No Git Installation Needed)

1. Go to [GitHub](https://github.com/) and log in to your account.
2. Click the **+** (plus icon) in the top-right corner and select **New repository**.
3. Name your repository (e.g., `tic-tac-toe`), choose **Public**, and click **Create repository**.
4. On the new repository page, click the link that says **"uploading an existing file"**.
5. Drag and drop these files from your computer into the box:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
6. Click **Commit changes**.
7. Now enable GitHub Pages:
   - Go to **Settings** (tab at the top of your repo).
   - In the left sidebar, click **Pages**.
   - Under **Build and deployment** > **Branch**, select `main` (or `master`) and leave folder as `/ (root)`.
   - Click **Save**.
8. Wait ~30–60 seconds, and refresh the page. Your live game URL will appear at the top:
   > `https://<your-username>.github.io/tic-tac-toe/`

---

### Option 2: Using Git CLI (if you have Git installed)

```bash
# Initialize git repository
git init

# Add all files and make initial commit
git add .
git commit -m "Initial commit: Tic Tac Toe game"

# Link to your remote GitHub repository
git branch -M main
git remote add origin https://github.com/<your-username>/tic-tac-toe.git

# Push files to GitHub
git push -u origin main
```

After pushing, go to **Repository Settings** > **Pages** > Select `main` branch > **Save**.
