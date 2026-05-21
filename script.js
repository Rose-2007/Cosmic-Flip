const categories = {

animals:[
"🐶","🐱","🦊","🐼",
"🦁","🐸","🐨","🐯"
],

space:[
"🚀","🌙","🪐","⭐",
"☄️","🛰️","👨‍🚀","🌌"
],

vehicles:[
"🚗","🏎️","🚕","🛵",
"✈️","🚁","🚢","🚲"
],

shapes:[
"🔺","🔵","🟣","🟢",
"🟥","⬛","⭐","🔶"
],

sports:[
"⚽","🏀","🏈","🎾",
"🏓","🥊","🏸","🏆"
],

fruits:[
"🍎","🍉","🍓","🍍",
"🍒","🥝","🍇","🍌"
],

flowers:[
"🌸","🌹","🌻","🌷",
"💐","🪻","🌺","🍀"
],

emojis:[
"😎","🤖","👻","🔥",
"🥶","💀","👽","🎃"
]

};

let gameStarted = false;

let firstCard = null;
let secondCard = null;

let lockBoard = false;

let moves = 0;
let matches = 0;
let timer = 0;

let interval;

let muted = false;
let paused = false;

const difficultySettings = {

easy:{
pairs:4,
preview:1700,
flipBack:1200,
grid:"repeat(4,120px)"
},

medium:{
pairs:6,
preview:1200,
flipBack:850,
grid:"repeat(4,120px)"
},

hard:{
pairs:8,
preview:800,
flipBack:450,
grid:"repeat(4,100px)"
}

};

const board =
document.getElementById("gameBoard");

const timerElement =
document.getElementById("timer");

const movesElement =
document.getElementById("moves");

const bestScoreElement =
document.getElementById("bestScore");

const progressBar =
document.getElementById("progressBar");

const categorySelect =
document.getElementById("categorySelect");

const difficultySelect =
document.getElementById("difficultySelect");

const popup =
document.getElementById("winPopup");

const finalStats =
document.getElementById("finalStats");

const flipSound =
document.getElementById("flipSound");

const matchSound =
document.getElementById("matchSound");

const winSound =
document.getElementById("winSound");

const wrongSound =
document.getElementById("wrongSound");

const bgMusic =
document.getElementById("bgMusic");

const muteBtn =
document.getElementById("muteBtn");

const pauseBtn =
document.getElementById("pauseBtn");

const resumeBtn =
document.getElementById("resumeBtn");

const pauseOverlay =
document.getElementById("pauseOverlay");

const countdown =
document.getElementById("countdown");

const homeBtn =
document.getElementById("homeBtn");

const goBackBtn =
document.getElementById("goBackBtn");

const cursor =
document.querySelector(".cursor-glow");

const homeScreen =
document.getElementById("homeScreen");

const setupScreen =
document.getElementById("setupScreen");

const gameScreen =
document.getElementById("gameScreen");

/* MUSIC */

function startMusic(){

bgMusic.volume = 0.25;

bgMusic.play().catch(()=>{});

}

document.addEventListener(
"click",
startMusic,
{ once:true }
);

document.addEventListener(
"touchstart",
startMusic,
{ once:true }
);

/* CURSOR */

document.addEventListener(
"mousemove",
(e)=>{

if(cursor){

cursor.style.left =
`${e.clientX}px`;

cursor.style.top =
`${e.clientY}px`;

}

});

/* SOUND */

muteBtn.addEventListener(
"click",
()=>{

muted = !muted;

bgMusic.muted = muted;

muteBtn.innerText =
muted ?
"🔇 Muted" :
"🔊 Sound";

});

function play(sound){

if(!muted){

sound.currentTime = 0;

sound.play();

}

}

/* SCREEN NAVIGATION */

document
.getElementById("startBtn")
.addEventListener(
"click",
()=>{

homeScreen.classList.remove(
"active"
);

setupScreen.classList.add(
"active"
);

});

document
.getElementById("playBtn")
.addEventListener(
"click",
()=>{

setupScreen.classList.remove(
"active"
);

gameScreen.classList.add(
"active"
);

startGame();

});

homeBtn.addEventListener(
"click",
()=>{

clearInterval(interval);

gameScreen.classList.remove(
"active"
);

setupScreen.classList.add(
"active"
);

popup.classList.remove(
"show"
);

pauseOverlay.classList.remove(
"show"
);

});

goBackBtn.addEventListener(
"click",
()=>{

popup.classList.remove(
"show"
);

gameScreen.classList.remove(
"active"
);

setupScreen.classList.add(
"active"
);

clearInterval(interval);

});

/* PAUSE */

pauseBtn.addEventListener(
"click",
()=>{

paused = true;

clearInterval(interval);

pauseOverlay.classList.add(
"show"
);

});

resumeBtn.addEventListener(
"click",
()=>{

paused = false;

pauseOverlay.classList.remove(
"show"
);

interval = setInterval(()=>{

timer++;

timerElement.innerText =
timer;

},1000);

});

/* SHUFFLE */

function shuffle(array){

for(
let i=array.length-1;
i>0;
i--
){

const j =
Math.floor(
Math.random()*(i+1)
);

[array[i],array[j]] =
[array[j],array[i]];

}

return array;

}

/* GENERATE CARDS */

function generateCards(){

const category =
categories[
categorySelect.value
];

const settings =
difficultySettings[
difficultySelect.value
];

const chosen =
category.slice(
0,
settings.pairs
);

return shuffle([
...chosen,
...chosen
]);

}

/* CREATE CARD */

function createCard(emoji){

const card =
document.createElement("div");

card.classList.add("card");

card.dataset.emoji = emoji;

card.innerHTML = `

<div class="front"></div>

<div class="back">
${emoji}
</div>

`;

card.addEventListener(
"click",
flipCard
);

return card;

}

/* START GAME */

function startGame(){

clearInterval(interval);

moves = 0;
matches = 0;
timer = 0;

paused = false;
gameStarted = false;

timerElement.innerText = 0;
movesElement.innerText = 0;

progressBar.style.width =
"0%";

board.innerHTML = "";

popup.classList.remove(
"show"
);

if(difficultySelect.value === "hard"){

document.body.classList.add(
"hard-mode"
);

}else{

document.body.classList.remove(
"hard-mode"
);

}

const settings =
difficultySettings[
difficultySelect.value
];

board.style.gridTemplateColumns =
settings.grid;

const cards =
generateCards();

cards.forEach(emoji=>{

board.appendChild(
createCard(emoji)
);

});

loadBestScore();

startCountdown();

}

/* COUNTDOWN */


function startCountdown(){

countdown.style.display =
"flex";

let count = 3;

countdown.innerText = count;

const countdownInterval =
setInterval(()=>{

count--;

if(count > 0){

countdown.innerText =
count;

}else if(count === 0){

countdown.innerText =
"GO!";

}else{

clearInterval(
countdownInterval
);

countdown.style.display =
"none";

previewCards();

interval = setInterval(()=>{

timer++;

timerElement.innerText =
timer;

},1000);

}

},1000);

}
/* PREVIEW */

function previewCards(){

const cards =
document.querySelectorAll(".card");

cards.forEach(card=>{

card.classList.add("flip");

});

setTimeout(()=>{

cards.forEach(card=>{

card.classList.remove(
"flip"
);

});

gameStarted = true;

},
difficultySettings[
difficultySelect.value
].preview);

}

/* FLIP */

function flipCard(){

if(paused || !gameStarted)
return;

if(lockBoard)
return;

if(this === firstCard)
return;

this.classList.add("flip");

play(flipSound);

if(!firstCard){

firstCard = this;

return;

}

secondCard = this;

moves++;

movesElement.innerText =
moves;

checkMatch();

}

/* MATCH */

function checkMatch(){

const matched =

firstCard.dataset.emoji ===
secondCard.dataset.emoji;

if(matched){

play(matchSound);

matches++;

updateProgress();

showCombo();

firstCard.removeEventListener(
"click",
flipCard
);

secondCard.removeEventListener(
"click",
flipCard
);

resetBoard();

const total =
difficultySettings[
difficultySelect.value
].pairs;

if(matches === total){

clearInterval(interval);

play(winSound);

finalStats.innerHTML = `

⏱ Time: ${timer}s <br>
🎯 Moves: ${moves} <br>
🔥 Difficulty:
${difficultySelect.value}

`;

saveBestScore();

setTimeout(()=>{

popup.classList.add(
"show"
);

},700);

}

}else{

play(wrongSound);

lockBoard = true;

setTimeout(()=>{

firstCard.classList.remove(
"flip"
);

secondCard.classList.remove(
"flip"
);

resetBoard();

},
difficultySettings[
difficultySelect.value
].flipBack);

}

}

/* COMBO */

function showCombo(){

const text =
document.createElement("div");

text.classList.add(
"combo-text"
);

text.innerText =
"✨ MATCH ✨";

document.body.appendChild(
text
);

setTimeout(()=>{

text.remove();

},900);

}

/* PROGRESS */

function updateProgress(){

const total =
difficultySettings[
difficultySelect.value
].pairs;

const percent =
(matches/total)*100;

progressBar.style.width =
`${percent}%`;

}

/* RESET */

function resetBoard(){

firstCard = null;
secondCard = null;
lockBoard = false;

}

/* BEST SCORE */

function saveBestScore(){

const level =
difficultySelect.value;

const key =
"best_" + level;

const best =
localStorage.getItem(key);

if(best === null || moves < best){

localStorage.setItem(
key,
moves
);

}

loadBestScore();

}

function loadBestScore(){

const level =
difficultySelect.value;

const key =
"best_" + level;

const best =
localStorage.getItem(key);

bestScoreElement.innerText =
best ? best : 0;

}

difficultySelect.addEventListener(
"change",
loadBestScore
);