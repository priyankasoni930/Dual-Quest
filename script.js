"use strict";

// Selecting elements
const player0El = document.querySelector(".player--0");
const player1El = document.querySelector(".player--1");
const score0El = document.querySelector("#score--0");
const score1El = document.getElementById("score--1");
const current0El = document.getElementById("current--0");
const current1El = document.getElementById("current--1");
// Select win/lose images
const winImage0El = document.getElementById("win-image--0");
const loseImage0El = document.getElementById("lose-image--0");
const winImage1El = document.getElementById("win-image--1");
const loseImage1El = document.getElementById("lose-image--1");
// Select win message element
const winMessageEl = document.getElementById("win-message");
const timerEl = document.getElementById("timer"); // Select timer element
const arrow0El = document.getElementById("arrow--0"); // Select arrow 0
const arrow1El = document.getElementById("arrow--1"); // Select arrow 1

const diceEl = document.querySelector(".dice");
const btnNew = document.querySelector(".btn--new");
const btnRoll = document.querySelector(".btn--roll");
const btnHold = document.querySelector(".btn--hold");

let scores, currentScore, activePlayer, playing;
let timeRemaining; // Variable for time
let timerInterval; // Variable for interval ID

// Format time helper
const formatTime = function (seconds) {
  const mins = String(Math.trunc(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
};

// Function to handle game end (common logic)
const endGame = function () {
  playing = false;
  diceEl.classList.add("hidden");
  btnRoll.classList.add("hidden");
  btnHold.classList.add("hidden");
  clearInterval(timerInterval); // Stop the timer
  // Hide arrows on game end
  arrow0El.classList.add("hidden");
  arrow1El.classList.add("hidden");
};

// Function to handle timer expiration
const handleTimerEnd = function () {
  endGame(); // Use common end game logic

  const score0 = scores[0];
  const score1 = scores[1];

  // Determine winner based on timer end conditions
  if (score0 < 75 && score1 < 75) {
    // Both lose
    loseImage0El.classList.remove("hidden");
    loseImage1El.classList.remove("hidden");
    winMessageEl.textContent = "Time's Up! Both Lose!";
    winMessageEl.classList.remove("hidden");
    player0El.classList.add("player--winner"); // Use winner style for visual cue
    player1El.classList.add("player--winner"); // Use winner style for visual cue
  } else if (score0 >= 75 && score1 >= 75) {
    // Both >= 75, higher score wins, or draw
    if (score0 > score1) {
      // Player 0 wins
      winImage0El.classList.remove("hidden");
      loseImage1El.classList.remove("hidden");
      winMessageEl.textContent = "Time's Up! Player 1 Wins!";
      player0El.classList.add("player--winner");
    } else if (score1 > score0) {
      // Player 1 wins
      winImage1El.classList.remove("hidden");
      loseImage0El.classList.remove("hidden");
      winMessageEl.textContent = "Time's Up! Player 2 Wins!";
      player1El.classList.add("player--winner");
    } else {
      // Draw
      loseImage0El.classList.remove("hidden"); // Show lose for both on draw
      loseImage1El.classList.remove("hidden");
      winMessageEl.textContent = "Time's Up! It's a Draw!";
      player0El.classList.add("player--winner");
      player1El.classList.add("player--winner");
    }
    winMessageEl.classList.remove("hidden");
  } else if (score0 >= 75) {
    // Only Player 0 >= 75
    winImage0El.classList.remove("hidden");
    loseImage1El.classList.remove("hidden");
    winMessageEl.textContent = "Time's Up! Player 1 Wins!";
    player0El.classList.add("player--winner");
    winMessageEl.classList.remove("hidden");
  } else {
    // Only Player 1 >= 75
    winImage1El.classList.remove("hidden");
    loseImage0El.classList.remove("hidden");
    winMessageEl.textContent = "Time's Up! Player 2 Wins!";
    player1El.classList.add("player--winner");
    winMessageEl.classList.remove("hidden");
  }

  // Hide scores/current when timer ends as well
  score0El.classList.add("hidden");
  score1El.classList.add("hidden");
  current0El.closest(".current").classList.add("hidden");
  current1El.closest(".current").classList.add("hidden");
};

// Function to start the timer
const startTimer = function () {
  timeRemaining = 60; // 1 minute
  timerEl.textContent = formatTime(timeRemaining);

  // Clear any existing timer first
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeRemaining--;
    timerEl.textContent = formatTime(timeRemaining);

    if (timeRemaining <= 0) {
      handleTimerEnd();
    }
  }, 1000);
};

// Starting conditions
const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;

  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;

  // Ensure scores and current divs are visible initially
  score0El.classList.remove("hidden");
  score1El.classList.remove("hidden");
  current0El.closest(".current").classList.remove("hidden");
  current1El.closest(".current").classList.remove("hidden");

  diceEl.classList.add("hidden");
  player0El.classList.remove("player--winner");
  player1El.classList.remove("player--winner");
  player0El.classList.add("player--active");
  player1El.classList.remove("player--active");

  // Hide win/lose images, message, buttons, timer
  winImage0El.classList.add("hidden");
  loseImage0El.classList.add("hidden");
  winImage1El.classList.add("hidden");
  loseImage1El.classList.add("hidden");
  winMessageEl.classList.add("hidden");
  btnRoll.classList.add("hidden");
  btnHold.classList.add("hidden");
  timerEl.classList.add("hidden");
  timerEl.textContent = formatTime(60);

  // Hide both arrows initially
  arrow0El.classList.add("hidden");
  arrow1El.classList.add("hidden");

  // Stop any previous timer
  if (timerInterval) clearInterval(timerInterval);
};

// Initial setup on page load
init();
playing = false; // Game is not active initially

const switchPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0El.classList.toggle("player--active");
  player1El.classList.toggle("player--active");

  // Toggle arrows based on active player
  arrow0El.classList.toggle("hidden");
  arrow1El.classList.toggle("hidden");
};

// Rolling dice functionality
btnRoll.addEventListener("click", function () {
  if (playing) {
    // 1. Generating a random dice roll
    const dice = Math.trunc(Math.random() * 6) + 1;

    // 2. Display dice
    diceEl.classList.remove("hidden");
    diceEl.src = `dice-${dice}.png`;

    // 3. Check for rolled 1
    if (dice !== 1) {
      // Add dice to current score
      currentScore += dice;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      // Switch to next player
      switchPlayer();
    }
  }
});

btnHold.addEventListener("click", function () {
  if (playing) {
    // 1. Add current score to active player's score
    scores[activePlayer] += currentScore;
    // scores[1] = scores[1] + currentScore

    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];

    // 2. Check if player's score is >= 100 (Normal Win)
    if (scores[activePlayer] >= 100) {
      endGame(); // Use common end game logic (stops timer too)

      // Apply winner style
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add("player--winner");
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove("player--active");

      // Show win/lose images and hide scores/current
      const winner = activePlayer;
      const loser = 1 - activePlayer;

      document
        .getElementById(`win-image--${winner}`)
        .classList.remove("hidden");
      document
        .getElementById(`lose-image--${loser}`)
        .classList.remove("hidden");

      // Hide scores and current score displays
      document.getElementById(`score--0`).classList.add("hidden");
      document.getElementById(`score--1`).classList.add("hidden");
      document
        .getElementById(`current--0`)
        .closest(".current")
        .classList.add("hidden");
      document
        .getElementById(`current--1`)
        .closest(".current")
        .classList.add("hidden");

      // Display Win Message
      winMessageEl.textContent = `Player ${winner + 1} Won!`; // Standard win message
      winMessageEl.classList.remove("hidden");
    } else {
      // Switch to the next player if game hasn't ended
      switchPlayer();
    }
  }
});

btnNew.addEventListener("click", function () {
  init(); // Reset the board and variables
  playing = true; // Start the game

  // Show the game elements
  btnRoll.classList.remove("hidden");
  btnHold.classList.remove("hidden");
  timerEl.classList.remove("hidden");
  // Show the arrow for the starting player (Player 0)
  arrow0El.classList.remove("hidden");
  arrow1El.classList.add("hidden"); // Ensure other arrow is hidden

  // Start the timer
  startTimer();
});
