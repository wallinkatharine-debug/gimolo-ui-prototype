
const container = document.getElementById('screen-container');

function showScreen(screen) {
  if (screen === 'spin') {
    container.innerHTML = `
      <button class="spin-button" onclick="showScreen('activity')">SPIN</button>
    `;
  }

  if (screen === 'activity') {
    container.innerHTML = `
      <div class="card">
        <h2>Nature Color Hunt</h2>
        <p>Find 3 colors outdoors in 5 minutes.</p>
        <p><strong>Supplies:</strong> None</p>
        <button class="primary-btn" onclick="showScreen('progress')">Start</button>
        <button class="secondary-btn" onclick="showScreen('spin')">Spin Again</button>
      </div>
    `;
  }

  if (screen === 'progress') {
    container.innerHTML = `
      <div class="card">
        <h2>In Progress</h2>
        <p>2 of 3 colors found</p>
        <div class="progress">
          <div class="progress-bar"></div>
        </div>
        <button class="primary-btn" onclick="showScreen('spin')">Mark as Done</button>
      </div>
    `;
  }

  if (screen === 'profile') {
    let dots = '';
    for (let i = 0; i < 32; i++) {
      dots += '<div class="dot"></div>';
    }
    container.innerHTML = `
      <div class="card">
        <h2>Your Dot World</h2>
        <p>Recent activity reflections.</p>
      </div>
      <div class="dot-grid">${dots}</div>
    `;
  }
}

showScreen('spin');
