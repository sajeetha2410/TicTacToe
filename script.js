/**
 * Tic-Tac-Toe Game Engine
 * Includes 2-Player mode, AI with Minimax Algorithm, Sound synthesis,
 * Winning line visualization, and Confetti celebration.
 */

// --- Game State ---
const state = {
  board: Array(9).fill(''),
  currentPlayer: 'X',
  gameActive: true,
  mode: 'pvp', // 'pvp' or 'ai'
  difficulty: 'hard', // 'easy' or 'hard'
  soundEnabled: true,
  scores: {
    X: 0,
    O: 0,
    ties: 0,
  }
};

// Winning lines definition with strike-line style class
const WINNING_COMBOS = [
  { combo: [0, 1, 2], strikeClass: 'strike-row-0' },
  { combo: [3, 4, 5], strikeClass: 'strike-row-1' },
  { combo: [6, 7, 8], strikeClass: 'strike-row-2' },
  { combo: [0, 3, 6], strikeClass: 'strike-col-0' },
  { combo: [1, 4, 7], strikeClass: 'strike-col-1' },
  { combo: [2, 5, 8], strikeClass: 'strike-col-2' },
  { combo: [0, 4, 8], strikeClass: 'strike-diag-main' },
  { combo: [2, 4, 6], strikeClass: 'strike-diag-anti' }
];

// --- DOM Elements ---
const cells = document.querySelectorAll('.cell');
const statusMessage = document.getElementById('statusMessage');
const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const scoreTiesEl = document.getElementById('scoreTies');
const scoreCardX = document.getElementById('scoreCardX');
const scoreCardO = document.getElementById('scoreCardO');
const nameOEl = document.getElementById('nameO');
const strikeLine = document.getElementById('strikeLine');

const modePvpBtn = document.getElementById('modePvp');
const modeAiBtn = document.getElementById('modeAi');
const difficultyWrapper = document.getElementById('difficultyWrapper');
const difficultySelect = document.getElementById('difficultySelect');
const soundToggle = document.getElementById('soundToggle');
const restartBtn = document.getElementById('restartBtn');
const resetScoreBtn = document.getElementById('resetScoreBtn');
const confettiCanvas = document.getElementById('confettiCanvas');

// --- Web Audio API (Synthesizer sounds) ---
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(type) {
  if (!state.soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === 'moveX') {
    // Crisp chime for X
    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(720, now + 0.08);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc.start(now);
    osc.stop(now + 0.08);
  } else if (type === 'moveO') {
    // Lower mellow chime for O
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc.start(now);
    osc.stop(now + 0.08);
  } else if (type === 'win') {
    // Victory fanfare (3 rapid notes)
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.type = 'triangle';
      o.frequency.setValueAtTime(freq, now + i * 0.1);
      g.gain.setValueAtTime(0.2, now + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.01, now + (i + 1) * 0.12);
      o.start(now + i * 0.1);
      o.stop(now + (i + 1) * 0.12);
    });
  } else if (type === 'tie') {
    // Sad draw tones
    [320, 290, 260].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(freq, now + i * 0.12);
      g.gain.setValueAtTime(0.12, now + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.01, now + (i + 1) * 0.14);
      o.start(now + i * 0.12);
      o.stop(now + (i + 1) * 0.14);
    });
  } else if (type === 'click') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
    osc.start(now);
    osc.stop(now + 0.04);
  }
}

// --- Confetti Particles ---
const confettiCtx = confettiCanvas.getContext('2d');
let particles = [];
let confettiAnimationId = null;

function resizeConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfetti);
resizeConfetti();

function triggerConfetti() {
  cancelAnimationFrame(confettiAnimationId);
  particles = [];
  const colors = ['#38bdf8', '#f43f5e', '#6366f1', '#eab308', '#22c55e'];
  
  for (let i = 0; i < 90; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  function render() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let aliveCount = 0;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.012;

      if (p.opacity > 0) {
        aliveCount++;
        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate((p.rotation * Math.PI) / 180);
        confettiCtx.fillStyle = p.color;
        confettiCtx.globalAlpha = Math.max(0, p.opacity);
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        confettiCtx.restore();
      }
    });

    if (aliveCount > 0) {
      confettiAnimationId = requestAnimationFrame(render);
    } else {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  render();
}

// --- Game Logic ---
function updateTurnIndicator() {
  if (!state.gameActive) return;
  const isX = state.currentPlayer === 'X';
  const name = isX ? 'Player X' : (state.mode === 'ai' ? 'Computer' : 'Player O');
  const colorClass = isX ? 'x-color' : 'o-color';
  
  statusMessage.innerHTML = `<span class="turn-symbol ${colorClass}">${state.currentPlayer}</span>'s Turn (${name})`;
  
  if (isX) {
    scoreCardX.classList.add('active-turn');
    scoreCardO.classList.remove('active-turn');
  } else {
    scoreCardO.classList.add('active-turn');
    scoreCardX.classList.remove('active-turn');
  }
}

function handleCellClick(e) {
  const index = parseInt(e.target.dataset.index, 10);

  if (state.board[index] !== '' || !state.gameActive) {
    return;
  }

  makeMove(index, state.currentPlayer);

  // If in AI mode and game is still active, schedule AI turn
  if (state.mode === 'ai' && state.gameActive && state.currentPlayer === 'O') {
    // Disable board clicks during AI turn
    cells.forEach(c => c.disabled = true);
    setTimeout(handleAiMove, 350);
  }
}

function makeMove(index, player) {
  state.board[index] = player;
  const cell = cells[index];
  cell.textContent = player;
  cell.classList.add(player.toLowerCase());
  cell.disabled = true;

  playSound(player === 'X' ? 'moveX' : 'moveO');

  const winInfo = checkWinner(state.board);

  if (winInfo) {
    endGame(winInfo);
  } else if (state.board.every(cell => cell !== '')) {
    endGame(null); // Draw
  } else {
    state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
    updateTurnIndicator();
  }
}

function checkWinner(board) {
  for (const item of WINNING_COMBOS) {
    const [a, b, c] = item.combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo: item.combo, strikeClass: item.strikeClass };
    }
  }
  return null;
}

function endGame(winInfo) {
  state.gameActive = false;
  scoreCardX.classList.remove('active-turn');
  scoreCardO.classList.remove('active-turn');

  if (winInfo) {
    const { winner, combo, strikeClass } = winInfo;
    state.scores[winner]++;
    
    // Highlight winning cells
    combo.forEach(idx => cells[idx].classList.add('win-highlight'));
    
    // Draw strike line
    strikeLine.className = 'strike-line show ' + strikeClass;
    
    const winnerName = winner === 'X' 
      ? 'Player X' 
      : (state.mode === 'ai' ? 'Computer' : 'Player O');
    const colorClass = winner === 'X' ? 'x-color' : 'o-color';

    statusMessage.innerHTML = `🎉 <span class="${colorClass}">${winnerName}</span> Wins!`;
    playSound('win');
    triggerConfetti();
  } else {
    state.scores.ties++;
    statusMessage.innerHTML = `🤝 It's a Tie!`;
    playSound('tie');
  }

  updateScoreDisplay();
  cells.forEach(c => c.disabled = true);
}

function updateScoreDisplay() {
  scoreXEl.textContent = state.scores.X;
  scoreOEl.textContent = state.scores.O;
  scoreTiesEl.textContent = state.scores.ties;
}

// --- AI Opponent (Minimax & Easy) ---
function handleAiMove() {
  if (!state.gameActive) return;

  let moveIndex;
  if (state.difficulty === 'easy') {
    // Random move
    const emptyIndices = state.board
      .map((val, idx) => (val === '' ? idx : null))
      .filter(val => val !== null);
    moveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  } else {
    // Minimax (Optimal)
    moveIndex = getBestMoveMinimax(state.board);
  }

  // Re-enable cells that are still free
  cells.forEach((c, idx) => {
    if (state.board[idx] === '') c.disabled = false;
  });

  if (moveIndex !== undefined && moveIndex !== -1) {
    makeMove(moveIndex, 'O');
  }
}

function getBestMoveMinimax(board) {
  // If center is available as first or second move, take it for speed & solid strategy
  if (board[4] === '') return 4;

  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i] === '') {
      board[i] = 'O'; // AI is O
      let score = minimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

function minimax(board, depth, isMaximizing) {
  const winInfo = checkWinner(board);
  if (winInfo) {
    return winInfo.winner === 'O' ? 10 - depth : depth - 10;
  }
  if (board.every(cell => cell !== '')) {
    return 0; // Draw
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        let evaluation = minimax(board, depth + 1, false);
        board[i] = '';
        maxEval = Math.max(maxEval, evaluation);
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        let evaluation = minimax(board, depth + 1, true);
        board[i] = '';
        minEval = Math.min(minEval, evaluation);
      }
    }
    return minEval;
  }
}

// --- Controls & Reset ---
function restartRound() {
  playSound('click');
  state.board = Array(9).fill('');
  state.currentPlayer = 'X';
  state.gameActive = true;

  strikeLine.className = 'strike-line';
  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
    cell.disabled = false;
  });

  updateTurnIndicator();
}

function resetAllScores() {
  playSound('click');
  state.scores = { X: 0, O: 0, ties: 0 };
  updateScoreDisplay();
  restartRound();
}

function switchMode(newMode) {
  if (state.mode === newMode) return;
  playSound('click');
  state.mode = newMode;

  if (newMode === 'ai') {
    modeAiBtn.classList.add('active');
    modePvpBtn.classList.remove('active');
    difficultyWrapper.classList.remove('hidden');
    nameOEl.textContent = 'Computer';
  } else {
    modePvpBtn.classList.add('active');
    modeAiBtn.classList.remove('active');
    difficultyWrapper.classList.add('hidden');
    nameOEl.textContent = 'Player O';
  }

  resetAllScores();
}

// --- Event Listeners ---
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartRound);
resetScoreBtn.addEventListener('click', resetAllScores);

modePvpBtn.addEventListener('click', () => switchMode('pvp'));
modeAiBtn.addEventListener('click', () => switchMode('ai'));

difficultySelect.addEventListener('change', (e) => {
  playSound('click');
  state.difficulty = e.target.value;
  restartRound();
});

soundToggle.addEventListener('click', () => {
  state.soundEnabled = !state.soundEnabled;
  soundToggle.textContent = state.soundEnabled ? '🔊' : '🔇';
  soundToggle.style.opacity = state.soundEnabled ? '1' : '0.6';
  playSound('click');
});

// Initialize display
updateTurnIndicator();
updateScoreDisplay();
