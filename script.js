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
window.addEventListener(
"click",
()=>{

bgMusic.play();

},
{ once:true }
);

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

let firstCard = null;
let secondCard = null;

let lockBoard = false;

let moves = 0;
let matches = 0;
let timer = 0;

let interval;

let muted = false;
let paused = false;

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
function startMusic(){

bgMusic.volume = 0.25;

bgMusic.play().catch(()=>{

console.log(
"Autoplay blocked"
);

});

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

const goBackBtn =
document.getElementById("goBackBtn");

goBackBtn.addEventListener("click",()=>{

popup.classList.remove("show");

gameScreen.classList.remove("active");

setupScreen.classList.add("active");

clearInterval(interval);

});

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

const cursor =
document.querySelector(".cursor-glow");

const homeScreen =
document.getElementById("homeScreen");

const setupScreen =
document.getElementById("setupScreen");

const gameScreen =
document.getElementById("gameScreen");

document.addEventListener(
"mousemove",
(e)=>{

cursor.style.left =
`${e.clientX}px`;

cursor.style.top =
`${e.clientY}px`;

});

bgMusic.volume = 0.25;

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

function startGame(){

clearInterval(interval);

moves = 0;
matches = 0;
timer = 0;

paused = false;

timerElement.innerText = 0;
movesElement.innerText = 0;

progressBar.style.width =
"0%";

board.innerHTML = "";

popup.classList.remove(
"show"
);

/* HARD MODE */

if(difficultySelect.value === "hard"){

document.body.classList.add(
"hard-mode"
);

document.body.style.filter =
"contrast(1.08) brightness(0.92)";

}else{

document.body.classList.remove(
"hard-mode"
);

document.body.style.filter =
"none";

}

/* GAME SETTINGS */

const settings =
difficultySettings[
difficultySelect.value
];

board.style.gridTemplateColumns =
settings.grid;

/* CREATE CARDS */

const cards =
generateCards();

cards.forEach(emoji=>{

board.appendChild(
createCard(emoji)
);

});

/* START */

startCountdown();

loadBestScore();

}

/* HARD MODE MOBILE FIX */

if(difficultySelect.value === "hard"){

document.body.classList.add(
"hard-mode"
);

document.body.style.filter =
"contrast(1.08) brightness(0.92)";

}else{

document.body.classList.remove(
"hard-mode"
);

document.body.style.filter =
"none";

}

/* GAME SETTINGS */

const settings =
difficultySettings[
difficultySelect.value
];

board.style.gridTemplateColumns =
settings.grid;

/* CREATE CARDS */

const cards =
generateCards();

cards.forEach(emoji=>{

board.appendChild(
createCard(emoji)
);

});

/* START GAME */

startCountdown();

loadBestScore();




function startCountdown(){
countdown.style.display =
"block";
let count = 3;

countdown.innerText = count;

countdown.classList.add(
"show"
);

const countdownInterval =
setInterval(()=>{

count--;

if(count > 0){

countdown.innerText =
count;

countdown.classList.remove(
"show"
);

void countdown.offsetWidth;

countdown.classList.add(
"show"
);

}else{

clearInterval(
countdownInterval
);

countdown.innerText =
"GO!";
gameStarted = true;
setTimeout(()=>{

countdown.style.display =
"none";

},1000);

countdown.classList.remove(
"show"
);

void countdown.offsetWidth;

countdown.classList.add(
"show"
);

setTimeout(()=>{

countdown.classList.remove(
"show"
);

previewCards();

interval = setInterval(()=>{

timer++;

timerElement.innerText =
timer;

},1000);

},800);

}

},1000);

}

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

},
difficultySettings[
difficultySelect.value
].preview);

}

function flipCard(){

if(paused || !gameStarted)
return;

if(lockBoard) return;

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

function checkMatch(){

const matched =

firstCard.dataset.emoji ===
secondCard.dataset.emoji;

if(matched){

play(matchSound);

matches++;

updateProgress();

createParticles();

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

confetti({

particleCount:200,
spread:100,
origin:{y:0.6}

});

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

firstCard.classList.remove("flip");
secondCard.classList.remove("flip");

resetBoard();

}, difficultySettings[difficultySelect.value].flipBack);

}


}

function createParticles(){

for(let i=0;i<12;i++){

const particle =
document.createElement("div");

particle.style.position =
"fixed";

particle.style.width =
"10px";

particle.style.height =
"10px";

particle.style.borderRadius =
"50%";

particle.style.background =
"cyan";

particle.style.left =
`${Math.random()*100}%`;

particle.style.top =
`${Math.random()*100}%`;

particle.style.boxShadow =
"0 0 20px cyan";

particle.style.zIndex =
"999";

document.body.appendChild(
particle
);

particle.animate([

{
transform:"scale(1)",
opacity:1
},

{
transform:
"translateY(-120px) scale(0)",

opacity:0
}

],{

duration:1000

});

setTimeout(()=>{

particle.remove();

},1000);

}

}

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

function resetBoard(){

firstCard = null;
secondCard = null;
lockBoard = false;

}

function saveBestScore(){

const level =
difficultySelect.value;

const key =
"best_" + level;

const best =
localStorage.getItem(key);

if(best === null || moves < best){

localStorage.setItem(key, moves);

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