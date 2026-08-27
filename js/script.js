import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAAFRcM9DUnLP9-XLOkKN_uIyKPYFRt29g",
  authDomain: "flash-cards-e2d12.firebaseapp.com",
  projectId: "flash-cards-e2d12",
  storageBucket: "flash-cards-e2d12.firebasestorage.app",
  messagingSenderId: "574035320421",
  appId: "1:574035320421:web:29668e878ccb377ca3b08c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const cardsCollection = collection(db, "cards");

const wordDisplay = document.getElementById('word-display');
const answerInput = document.getElementById('answer-input');
const checkBtn = document.getElementById('check-btn');
const idkBtn = document.getElementById('idk-btn');
const feedback = document.getElementById('feedback');
const card = document.getElementById('card');

const addViewBtn = document.getElementById('add-view-btn');
const deckViewBtn = document.getElementById('deck-view-btn');
const backBtn = document.getElementById('back-btn');

const studyView = document.getElementById('study-view');
const addView = document.getElementById('add-view');
const deckView = document.getElementById('deck-view');

const koInput = document.getElementById('ko-input');
const enInput = document.getElementById('en-input');
const doneBtn = document.getElementById('done-btn');
const addBackBtn = document.getElementById('add-back-btn');

const cardList = document.getElementById('card-list');

let cards = [];

let currentCard = null;
let currentDirection = "";

async function loadCards() {
  const querySnapshot = await getDocs(cardsCollection);
  cards = querySnapshot.docs.map(doc => doc.data());
  showRandomCard();
}

function showRandomCard() {
  if (cards.length === 0) {
    wordDisplay.textContent = "Add card";
    answerInput.style.display = 'none';
    return;
  }
  answerInput.style.display = 'block';

  const randomIndex = Math.floor(Math.random() * cards.length);
  currentCard = cards[randomIndex];

  currentDirection = Math.random() < 0.5 ? "ko-en" : "en-ko";

  if (currentDirection === "ko-en") {
    wordDisplay.textContent = currentCard.ko;
  } else {
    wordDisplay.textContent = currentCard.en;
  }

  answerInput.value = "";
  feedback.textContent = "";
}

function checkAnswer() {
  const userAnswer = answerInput.value.trim().toLowerCase();
  const correctAnswer = currentDirection === "ko-en" ? currentCard.en : currentCard.ko;

  if (userAnswer === correctAnswer.toLowerCase()) {
    card.classList.add('correct');
    setTimeout(() => {
      card.classList.remove('correct');
      showRandomCard();
    }, 800);
  } else {
    card.classList.add('wrong');
    setTimeout(() => {
      card.classList.remove('wrong');
    }, 400);
    // kein showRandomCard() hier -> Eingabefeld bleibt aktiv, man darf's nochmal probieren
  }
}

function showAnswer() {
  const correctAnswer = currentDirection === "ko-en" ? currentCard.en : currentCard.ko;
  wordDisplay.textContent = correctAnswer;
  card.classList.add('revealed');

  setTimeout(() => {
    card.classList.remove('revealed');
    showRandomCard();
  }, 3500);
}

function showView(viewToShow) {
  studyView.style.display = 'none';
  addView.style.display = 'none';
  deckView.style.display = 'none';
  viewToShow.style.display = 'block';
}

async function addNewCard() {
  const koValue = koInput.value.trim();
  const enValue = enInput.value.trim();

  if (koValue === "" || enValue === "") {
    return;
  }

  const newCard = { ko: koValue, en: enValue };
  await addDoc(cardsCollection, newCard);
  cards.push(newCard);

  koInput.value = "";
  enInput.value = "";

  showView(studyView);
  showRandomCard();
}

function renderDeck() {
  cardList.innerHTML = "";

  cards.forEach(function(card) {
    const li = document.createElement('li');
    li.textContent = card.ko + " — " + card.en;
    cardList.appendChild(li);
  });
}

deckViewBtn.addEventListener('click', () => {
  showView(deckView);
  renderDeck();
});

doneBtn.addEventListener('click', addNewCard);
addBackBtn.addEventListener('click', () => showView(studyView));

addViewBtn.addEventListener('click', () => showView(addView));
backBtn.addEventListener('click', () => showView(studyView));

idkBtn.addEventListener('click', showAnswer);

checkBtn.addEventListener('click', checkAnswer);

loadCards();
