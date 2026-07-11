const PASSWORD = "Nigger";

function makeBlobs() {
  const holder = document.getElementById("dapBlobs");
  if (!holder) return;
  const specs = [
    { top: '-60px', left: '-40px', size: 220, color: 'var(--blush-mid)' },
    { top: '120px', left: '78%', size: 260, color: 'var(--lavender)' },
    { top: '55%', left: '-60px', size: 200, color: 'var(--peach)' },
    { top: '80%', left: '70%', size: 240, color: 'var(--blush)' }
  ];
  holder.innerHTML = specs.map((s, i) =>
    `<div class="dap-blob" style="top:${s.top};left:${s.left};width:${s.size}px;height:${s.size}px;background:${s.color};animation-delay:${(i * 1.3).toFixed(1)}s;"></div>`
  ).join('');
}

function makePetals() {
  const holder = document.getElementById("dapPetals");
  if (!holder) return;
  let html = '';
  const hearts = ['#ff9fb2', '#f3bcc9', '#e9c3ec'];
  for (let i = 0; i < 14; i++) {
    const left = Math.random() * 100;
    const size = Math.random() * 10 + 10;
    const duration = (Math.random() * 10 + 14).toFixed(1);
    const delay = (Math.random() * 14).toFixed(1);
    const drift = (Math.random() * 60 - 30).toFixed(0);
    const color = hearts[i % hearts.length];
    html += `<svg class="dap-petal" viewBox="0 0 32 28" style="left:${left}%;width:${size}px;height:${size}px;animation-duration:${duration}s;animation-delay:${delay}s;--dap-drift:${drift}px;">
      <path fill="${color}" d="M16 26C7 20 1 15 1 9 1 4 5 1 9 1c3 0 6 2 7 5 1-3 4-5 7-5 4 0 8 3 8 8 0 6-6 11-15 17z"/>
    </svg>`;
  }
  holder.innerHTML = html;
}

makeBlobs();
makePetals();

const password = document.getElementById("password");
const unlock = document.getElementById("unlock");
const error = document.getElementById("error");
const toggle = document.getElementById("togglePassword");

toggle.onclick = () => {

password.type =
password.type==="password"
?"text":"password";

};

async function openMemory(){

if(password.value===PASSWORD){

sessionStorage.setItem("loveUnlocked","true");

document.body.classList.add("opening");

setTimeout(()=>{

window.location="app.html";

},1200);

}

else{

error.innerHTML="Hmm... that's not our special word ❤️";

password.value="";

password.classList.add("shake");

setTimeout(()=>{

password.classList.remove("shake");

},500);

}

}

unlock.onclick=openMemory;

password.addEventListener("keydown",e=>{

if(e.key==="Enter"){

openMemory();

}

});