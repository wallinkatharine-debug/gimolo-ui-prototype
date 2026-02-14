const screen = document.getElementById('screen');
const app = document.getElementById('app');

const navBtns = [...document.querySelectorAll('.nav-btn')];
navBtns.forEach(b => b.addEventListener('click', () => show(b.dataset.screen)));

document.getElementById('profileBtn').addEventListener('click', () => show('profile'));

function setActive(screenName){
  navBtns.forEach(b => b.classList.toggle('active', b.dataset.screen===screenName));
}

function confettiHTML(){
  const colors = ['#7de3b2','#4aa3ff','#b57bff','#ffb86b','#ff6fb1'];
  let out = '<div class="confetti" aria-hidden="true">';
  for(let i=0;i<26;i++){
    const c = colors[i%colors.length];
    const x = Math.random()*100;
    const y = Math.random()*60;
    const s = 6 + Math.random()*10;
    out += `<span style="left:${x}%; top:${y}%; width:${s}px; height:${s}px; background:${c}; opacity:${0.4+Math.random()*0.6}"></span>`;
  }
  out += '</div>';
  return out;
}

function show(name){
  setActive(name);

  if(name==='spin'){
    screen.innerHTML = `
      <div class="spin-wrap">
        <button class="spin-orb" id="spinOrb">SPIN</button>
        <button class="subpill" id="adjustBtn">Adjust choice</button>
      </div>
      ${confettiHTML()}
    `;
    document.getElementById('spinOrb').addEventListener('click', () => show('activity'));
    document.getElementById('adjustBtn').addEventListener('click', () => alert('Prototype: adjust choice'));
    return;
  }

  if(name==='activity'){
    screen.innerHTML = `
      <div class="card">
        <div class="tagrow">
          <span class="tag">8 min</span>
          <span class="tag">Play</span>
          <span class="tag">Moderate</span>
          <span class="tag">Anywhere</span>
        </div>
        <div class="h1">🌿 Nature Color Hunt</div>
        <div class="p">Find 3 colors outdoors in 5 minutes.<br/>Bonus: Make one of them surprising.</div>
        <div class="p"><strong>Supplies:</strong> None</div>
        <div class="actions">
          <button class="btn btn-primary" id="startBtn">Start the Hunt →</button>
          <button class="btn btn-secondary" id="againBtn">Spin again</button>
        </div>
      </div>
    `;
    document.getElementById('startBtn').addEventListener('click', () => show('progress'));
    document.getElementById('againBtn').addEventListener('click', () => show('spin'));
    return;
  }

  if(name==='progress'){
    screen.innerHTML = `
      <div class="card">
        <div class="meta-line">
          <div><strong>In Progress</strong></div>
          <div class="small">⏱ 03:29</div>
        </div>
        <div class="p">2 of 3 colors found</div>
        <div class="progress"><div class="bar"></div></div>
        <button class="btn btn-primary" id="doneBtn">Mark as Done</button>
        <button class="btn btn-secondary" id="againBtn">Spin again</button>
      </div>
    `;
    document.getElementById('doneBtn').addEventListener('click', () => {
      alert('Nice! (Prototype) Dot added.');
      show('profile');
    });
    document.getElementById('againBtn').addEventListener('click', () => show('spin'));
    return;
  }

  if(name==='profile'){
    // build dots with a few halo dots
    let dots='';
    for(let i=0;i<32;i++){
      const halo = (i===5 || i===14) ? 'halo' : '';
      dots += `<div class="dot ${halo}"></div>`;
    }
    screen.innerHTML = `
      <div class="dotworld">
        <div class="h2">Your Dot World</div>
        <div class="p">No counters. Just visible momentum.</div>
        <div class="dotgrid">${dots}</div>

        <div class="divider"></div>

        <div class="small"><strong>Recent Dots</strong> (placeholder)</div>
        <div class="list">
          <div class="item"><div class="left"><span class="badge"></span>Kind Card</div><span>›</span></div>
          <div class="item"><div class="left"><span class="badge" style="background:#4aa3ff; box-shadow:0 0 0 4px rgba(74,163,255,.18)"></span>Donation Pickup</div><span>›</span></div>
          <div class="item"><div class="left"><span class="badge" style="background:#b57bff; box-shadow:0 0 0 4px rgba(181,123,255,.18)"></span>Theme Music Time</div><span>›</span></div>
        </div>
      </div>
    `;
    return;
  }
}

show('spin');
