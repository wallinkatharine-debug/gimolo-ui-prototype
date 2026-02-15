
const stage = document.getElementById('stage');
const toast = document.getElementById('toast');
const navBtns = [...document.querySelectorAll('.navbtn')];
const profileBtn = document.getElementById('profileBtn');
const soundToggle = document.getElementById('soundToggle');
const civicToggleEl = document.getElementById('civicToggle');
const backBtn = document.getElementById('backBtn');
const body = document.body;
const mscrim = document.getElementById('mscrim');
const modal = document.getElementById('modal');

let audioCtx=null;
let soundOn=true;

let current='spin';
let lastNonProfile='spin';
let currentActivity=null;

const state = {
  day: 1,
  completions: 0,
  tier: 1,
  scope: 1,
  pinnedLane: null,
  lastLane: null,
  vibeIndex: 1,
  randomness: 0.55,
  civicOn: false,
  recent: [],
  recentEmo: [],
  civicSince: 0,
};

const vibeNames = {1:"Playful",2:"Neon",3:"Fresh",4:"Bold"};
function setVibe(i){
  state.vibeIndex=i;
  body.classList.remove('v1','v2','v3','v4');
  body.classList.add('v'+i);
}

const LANES = [
  {id:"energy-reset", name:"Energy Reset", blurb:"micro calm + easy wins"},
  {id:"meaning-lite", name:"Meaning-Light", blurb:"kindness + connection"},
  {id:"creative-spike", name:"Creative Spike", blurb:"visual + playful making"},
  {id:"weekend-depth", name:"Weekend Depth", blurb:"bigger ‘mini quests’"},
];

const A = [{"id": "energy-reset-001", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🧺 Soft Micro Tidy", "desc": "Set a 8-minute timer. Clear one small surface only.", "time": "0-5", "energy": "med", "where": "outside", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-002", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🫧 Reset Reset", "desc": "Do a 90-second reset: breathe in 4s, out 6s × 3.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-003", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🌿 Quiet Notice", "desc": "Notice 3 small details around you. No fixing, just noticing.", "time": "0-5", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-004", "lane": "energy-reset", "tier": 2, "scope": 1, "title": "🧘 Stretch Pulse", "desc": "Do 3 stretches. Hold each for 30s.", "time": "0-5", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-005", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🧘 Stretch Ritual", "desc": "Do 4 stretches. Hold each for 45s.", "time": "0-5", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-006", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🧺 Quick Micro Tidy", "desc": "Set a 8-minute timer. Clear one small surface only.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-007", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🌿 Quiet Notice", "desc": "Notice 6 small details around you. No fixing, just noticing.", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-008", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🧘 Stretch Spark", "desc": "Do 2 stretches. Hold each for 30s.", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-009", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🧘 Stretch Spark", "desc": "Do 2 stretches. Hold each for 60s.", "time": "0-5", "energy": "med", "where": "outside", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-010", "lane": "energy-reset", "tier": 2, "scope": 2, "title": "🫧 Tiny Reset", "desc": "Do a 60-second reset: breathe in 4s, out 6s × 2.", "time": "5-10", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-011", "lane": "energy-reset", "tier": 3, "scope": 1, "title": "🌿 Quiet Notice", "desc": "Notice 2 small details around you. No fixing, just noticing.", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-012", "lane": "energy-reset", "tier": 2, "scope": 2, "title": "🫧 Quick Reset", "desc": "Do a 60-second reset: breathe in 4s, out 7s × 3.", "time": "5-10", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-013", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🧘 Stretch Drift", "desc": "Do 4 stretches. Hold each for 90s.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-014", "lane": "energy-reset", "tier": 3, "scope": 1, "title": "🧺 Fresh Micro Tidy", "desc": "Set a 12-minute timer. Clear one small surface only.", "time": "0-5", "energy": "high", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-015", "lane": "energy-reset", "tier": 3, "scope": 2, "title": "🧺 Bright Micro Tidy", "desc": "Set a 5-minute timer. Clear one small surface only.", "time": "5-10", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-016", "lane": "energy-reset", "tier": 2, "scope": 2, "title": "🧺 Mini Micro Tidy", "desc": "Set a 6-minute timer. Clear one small surface only.", "time": "5-10", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-017", "lane": "energy-reset", "tier": 2, "scope": 1, "title": "🧘 Stretch Drift", "desc": "Do 4 stretches. Hold each for 30s.", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-018", "lane": "energy-reset", "tier": 3, "scope": 3, "title": "🧺 Quick Micro Tidy", "desc": "Set a 8-minute timer. Clear one small surface only.", "time": "20-40", "energy": "high", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-019", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🧘 Stretch Move", "desc": "Do 3 stretches. Hold each for 45s.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-020", "lane": "energy-reset", "tier": 3, "scope": 3, "title": "🧘 Stretch Boost", "desc": "Do 3 stretches. Hold each for 30s.", "time": "10-20", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-021", "lane": "energy-reset", "tier": 2, "scope": 2, "title": "🧘 Stretch Lift", "desc": "Do 3 stretches. Hold each for 60s.", "time": "5-10", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-022", "lane": "energy-reset", "tier": 2, "scope": 2, "title": "🧘 Stretch Moment", "desc": "Do 3 stretches. Hold each for 90s.", "time": "5-10", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-023", "lane": "energy-reset", "tier": 2, "scope": 2, "title": "🧘 Stretch Switch", "desc": "Do 4 stretches. Hold each for 60s.", "time": "5-10", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-024", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🫧 Fresh Reset", "desc": "Do a 45-second reset: breathe in 4s, out 5s × 2.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-025", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🧺 Micro Micro Tidy", "desc": "Set a 12-minute timer. Clear one small surface only.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-026", "lane": "energy-reset", "tier": 3, "scope": 3, "title": "🧺 Mini Micro Tidy", "desc": "Set a 8-minute timer. Clear one small surface only.", "time": "10-20", "energy": "med", "where": "outside", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-027", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🧺 Micro Micro Tidy", "desc": "Set a 3-minute timer. Clear one small surface only.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-028", "lane": "energy-reset", "tier": 2, "scope": 2, "title": "🫧 Fresh Reset", "desc": "Do a 45-second reset: breathe in 3s, out 6s × 4.", "time": "5-10", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-029", "lane": "energy-reset", "tier": 3, "scope": 2, "title": "🌿 Quiet Notice", "desc": "Notice 10 small details around you. No fixing, just noticing.", "time": "5-10", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-030", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🫧 Mini Reset", "desc": "Do a 45-second reset: breathe in 3s, out 6s × 4.", "time": "0-5", "energy": "med", "where": "errands", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-031", "lane": "energy-reset", "tier": 2, "scope": 1, "title": "🧘 Stretch Moment", "desc": "Do 3 stretches. Hold each for 30s.", "time": "0-5", "energy": "low", "where": "errands", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-032", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🧺 Micro Micro Tidy", "desc": "Set a 6-minute timer. Clear one small surface only.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-033", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🫧 Soft Reset", "desc": "Do a 45-second reset: breathe in 4s, out 7s × 4.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-034", "lane": "energy-reset", "tier": 2, "scope": 1, "title": "🫧 Mini Reset", "desc": "Do a 30-second reset: breathe in 3s, out 5s × 3.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-035", "lane": "energy-reset", "tier": 2, "scope": 2, "title": "🧺 Fresh Micro Tidy", "desc": "Set a 10-minute timer. Clear one small surface only.", "time": "5-10", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-036", "lane": "energy-reset", "tier": 2, "scope": 1, "title": "🧘 Stretch Drift", "desc": "Do 2 stretches. Hold each for 45s.", "time": "0-5", "energy": "med", "where": "outside", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-037", "lane": "energy-reset", "tier": 3, "scope": 2, "title": "🧘 Stretch Drift", "desc": "Do 2 stretches. Hold each for 30s.", "time": "5-10", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-038", "lane": "energy-reset", "tier": 3, "scope": 1, "title": "🫧 Calm Reset", "desc": "Do a 90-second reset: breathe in 3s, out 7s × 3.", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-039", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🧺 Micro Micro Tidy", "desc": "Set a 3-minute timer. Clear one small surface only.", "time": "0-5", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-040", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🫧 Gentle Reset", "desc": "Do a 60-second reset: breathe in 4s, out 5s × 4.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-041", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🌿 Quiet Notice", "desc": "Notice 6 small details around you. No fixing, just noticing.", "time": "0-5", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-042", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🌿 Quiet Notice", "desc": "Notice 6 small details around you. No fixing, just noticing.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-043", "lane": "energy-reset", "tier": 2, "scope": 1, "title": "🧺 Micro Micro Tidy", "desc": "Set a 8-minute timer. Clear one small surface only.", "time": "0-5", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-044", "lane": "energy-reset", "tier": 2, "scope": 2, "title": "🫧 Quick Reset", "desc": "Do a 45-second reset: breathe in 4s, out 6s × 3.", "time": "5-10", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-045", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🫧 Reset Reset", "desc": "Do a 45-second reset: breathe in 5s, out 7s × 4.", "time": "0-5", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-046", "lane": "energy-reset", "tier": 2, "scope": 1, "title": "🫧 Reset Reset", "desc": "Do a 60-second reset: breathe in 5s, out 6s × 2.", "time": "0-5", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-047", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🧘 Stretch Boost", "desc": "Do 2 stretches. Hold each for 60s.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-048", "lane": "energy-reset", "tier": 3, "scope": 2, "title": "🫧 Tiny Reset", "desc": "Do a 60-second reset: breathe in 4s, out 6s × 2.", "time": "5-10", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-049", "lane": "energy-reset", "tier": 3, "scope": 2, "title": "🧘 Stretch Move", "desc": "Do 3 stretches. Hold each for 90s.", "time": "5-10", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-050", "lane": "energy-reset", "tier": 3, "scope": 1, "title": "🧺 Mini Micro Tidy", "desc": "Set a 8-minute timer. Clear one small surface only.", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-051", "lane": "energy-reset", "tier": 3, "scope": 1, "title": "🌿 Quiet Notice", "desc": "Notice 7 small details around you. No fixing, just noticing.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-052", "lane": "energy-reset", "tier": 2, "scope": 2, "title": "🧘 Stretch Pulse", "desc": "Do 4 stretches. Hold each for 60s.", "time": "5-10", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-053", "lane": "energy-reset", "tier": 2, "scope": 2, "title": "🌿 Quiet Notice", "desc": "Notice 3 small details around you. No fixing, just noticing.", "time": "5-10", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-054", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🌿 Quiet Notice", "desc": "Notice 5 small details around you. No fixing, just noticing.", "time": "0-5", "energy": "med", "where": "outside", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-055", "lane": "energy-reset", "tier": 2, "scope": 1, "title": "🫧 Soft Reset", "desc": "Do a 45-second reset: breathe in 5s, out 6s × 4.", "time": "0-5", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-056", "lane": "energy-reset", "tier": 3, "scope": 2, "title": "🫧 Quick Reset", "desc": "Do a 30-second reset: breathe in 4s, out 6s × 4.", "time": "5-10", "energy": "med", "where": "outside", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-057", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🫧 Bright Reset", "desc": "Do a 90-second reset: breathe in 5s, out 7s × 3.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-058", "lane": "energy-reset", "tier": 2, "scope": 2, "title": "🧺 Gentle Micro Tidy", "desc": "Set a 8-minute timer. Clear one small surface only.", "time": "5-10", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-059", "lane": "energy-reset", "tier": 2, "scope": 1, "title": "🌿 Quiet Notice", "desc": "Notice 10 small details around you. No fixing, just noticing.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-060", "lane": "energy-reset", "tier": 2, "scope": 2, "title": "🫧 Soft Reset", "desc": "Do a 45-second reset: breathe in 5s, out 6s × 3.", "time": "5-10", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-061", "lane": "energy-reset", "tier": 3, "scope": 2, "title": "🫧 Bright Reset", "desc": "Do a 45-second reset: breathe in 5s, out 6s × 3.", "time": "5-10", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-062", "lane": "energy-reset", "tier": 2, "scope": 1, "title": "🫧 Mini Reset", "desc": "Do a 60-second reset: breathe in 3s, out 7s × 2.", "time": "0-5", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-063", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🧺 Gentle Micro Tidy", "desc": "Set a 10-minute timer. Clear one small surface only.", "time": "0-5", "energy": "med", "where": "outside", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-064", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🫧 Bright Reset", "desc": "Do a 90-second reset: breathe in 3s, out 7s × 3.", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-065", "lane": "energy-reset", "tier": 3, "scope": 1, "title": "🧘 Stretch Pulse", "desc": "Do 2 stretches. Hold each for 30s.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-066", "lane": "energy-reset", "tier": 2, "scope": 1, "title": "🌿 Quiet Notice", "desc": "Notice 6 small details around you. No fixing, just noticing.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-067", "lane": "energy-reset", "tier": 3, "scope": 2, "title": "🧺 Tiny Micro Tidy", "desc": "Set a 6-minute timer. Clear one small surface only.", "time": "5-10", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-068", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🫧 Soft Reset", "desc": "Do a 90-second reset: breathe in 3s, out 7s × 4.", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-069", "lane": "energy-reset", "tier": 3, "scope": 2, "title": "🫧 Calm Reset", "desc": "Do a 60-second reset: breathe in 5s, out 5s × 4.", "time": "5-10", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-070", "lane": "energy-reset", "tier": 2, "scope": 1, "title": "🧺 Fresh Micro Tidy", "desc": "Set a 8-minute timer. Clear one small surface only.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-071", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🧘 Stretch Lift", "desc": "Do 4 stretches. Hold each for 60s.", "time": "0-5", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-072", "lane": "energy-reset", "tier": 2, "scope": 2, "title": "🧘 Stretch Pulse", "desc": "Do 2 stretches. Hold each for 45s.", "time": "5-10", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-073", "lane": "energy-reset", "tier": 3, "scope": 3, "title": "🫧 Gentle Reset", "desc": "Do a 60-second reset: breathe in 3s, out 6s × 4.", "time": "20-40", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-074", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🧺 Micro Micro Tidy", "desc": "Set a 8-minute timer. Clear one small surface only.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-075", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🧘 Stretch Spark", "desc": "Do 3 stretches. Hold each for 45s.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-076", "lane": "energy-reset", "tier": 2, "scope": 1, "title": "🧘 Stretch Move", "desc": "Do 2 stretches. Hold each for 30s.", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-077", "lane": "energy-reset", "tier": 3, "scope": 1, "title": "🫧 Micro Reset", "desc": "Do a 45-second reset: breathe in 4s, out 7s × 3.", "time": "0-5", "energy": "med", "where": "outside", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-078", "lane": "energy-reset", "tier": 2, "scope": 1, "title": "🧘 Stretch Spark", "desc": "Do 2 stretches. Hold each for 30s.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-079", "lane": "energy-reset", "tier": 2, "scope": 1, "title": "🌿 Quiet Notice", "desc": "Notice 5 small details around you. No fixing, just noticing.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-080", "lane": "energy-reset", "tier": 2, "scope": 2, "title": "🌿 Quiet Notice", "desc": "Notice 10 small details around you. No fixing, just noticing.", "time": "5-10", "energy": "high", "where": "outside", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-081", "lane": "energy-reset", "tier": 2, "scope": 1, "title": "🧘 Stretch Switch", "desc": "Do 3 stretches. Hold each for 90s.", "time": "0-5", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-082", "lane": "energy-reset", "tier": 3, "scope": 3, "title": "🧘 Stretch Move", "desc": "Do 4 stretches. Hold each for 30s.", "time": "10-20", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-083", "lane": "energy-reset", "tier": 3, "scope": 2, "title": "🧘 Stretch Switch", "desc": "Do 3 stretches. Hold each for 60s.", "time": "5-10", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-084", "lane": "energy-reset", "tier": 2, "scope": 1, "title": "🫧 Gentle Reset", "desc": "Do a 60-second reset: breathe in 4s, out 5s × 4.", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-085", "lane": "energy-reset", "tier": 2, "scope": 2, "title": "🧘 Stretch Move", "desc": "Do 3 stretches. Hold each for 60s.", "time": "5-10", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-086", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🧺 Micro Micro Tidy", "desc": "Set a 6-minute timer. Clear one small surface only.", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-087", "lane": "energy-reset", "tier": 3, "scope": 2, "title": "🌿 Quiet Notice", "desc": "Notice 8 small details around you. No fixing, just noticing.", "time": "5-10", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-088", "lane": "energy-reset", "tier": 2, "scope": 2, "title": "🧺 Gentle Micro Tidy", "desc": "Set a 6-minute timer. Clear one small surface only.", "time": "5-10", "energy": "high", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-089", "lane": "energy-reset", "tier": 2, "scope": 1, "title": "🧺 Calm Micro Tidy", "desc": "Set a 8-minute timer. Clear one small surface only.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-090", "lane": "energy-reset", "tier": 2, "scope": 2, "title": "🧘 Stretch Lift", "desc": "Do 2 stretches. Hold each for 60s.", "time": "5-10", "energy": "med", "where": "outside", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-091", "lane": "energy-reset", "tier": 3, "scope": 1, "title": "🧺 Quick Micro Tidy", "desc": "Set a 3-minute timer. Clear one small surface only.", "time": "0-5", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-092", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🧘 Stretch Drift", "desc": "Do 2 stretches. Hold each for 30s.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "energy-reset-093", "lane": "energy-reset", "tier": 1, "scope": 1, "title": "🧺 Tiny Micro Tidy", "desc": "Set a 3-minute timer. Clear one small surface only.", "time": "0-5", "energy": "med", "where": "outside", "emo": 1, "civic": false, "tags": ["reset", "calm"]}, {"id": "meaning-lite-094", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "🙏 Gratitude Moment", "desc": "Name 3 things you’re grateful for — specific, not broad.", "time": "0-5", "energy": "high", "where": "outside", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-095", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "✨ Compliment Move", "desc": "Give 5 specific compliments. No generalities.", "time": "0-5", "energy": "high", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-096", "lane": "meaning-lite", "tier": 2, "scope": 2, "title": "🙏 Gratitude Boost", "desc": "Name 5 things you’re grateful for — specific, not broad.", "time": "5-10", "energy": "med", "where": "any", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-097", "lane": "meaning-lite", "tier": 2, "scope": 2, "title": "🤝 Tiny Help", "desc": "Do one tiny helpful thing in under 8 minutes.", "time": "5-10", "energy": "low", "where": "outside", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-098", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "💌 Fresh Kind Note", "desc": "Send a 5-sentence message to a friend. Keep it simple.", "time": "0-5", "energy": "med", "where": "outside", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-099", "lane": "meaning-lite", "tier": 3, "scope": 1, "title": "✨ Compliment Moment", "desc": "Give 5 specific compliments. No generalities.", "time": "0-5", "energy": "low", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-100", "lane": "meaning-lite", "tier": 2, "scope": 1, "title": "✨ Compliment Wave", "desc": "Give 10 specific compliments. No generalities.", "time": "0-5", "energy": "low", "where": "home", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-101", "lane": "meaning-lite", "tier": 3, "scope": 1, "title": "✨ Compliment Ritual", "desc": "Give 10 specific compliments. No generalities.", "time": "0-5", "energy": "low", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-102", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "🙏 Gratitude Wave", "desc": "Name 5 things you’re grateful for — specific, not broad.", "time": "0-5", "energy": "low", "where": "home", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-103", "lane": "meaning-lite", "tier": 2, "scope": 2, "title": "🙏 Gratitude Switch", "desc": "Name 7 things you’re grateful for — specific, not broad.", "time": "5-10", "energy": "med", "where": "errands", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-104", "lane": "meaning-lite", "tier": 3, "scope": 2, "title": "🤝 Tiny Help", "desc": "Do one tiny helpful thing in under 6 minutes.", "time": "5-10", "energy": "low", "where": "outside", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-105", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "💌 Soft Kind Note", "desc": "Send a 8-sentence message to someone you like. Keep it simple.", "time": "0-5", "energy": "low", "where": "any", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-106", "lane": "meaning-lite", "tier": 2, "scope": 2, "title": "🤝 Tiny Help", "desc": "Do one tiny helpful thing in under 12 minutes.", "time": "5-10", "energy": "low", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-107", "lane": "meaning-lite", "tier": 3, "scope": 2, "title": "💌 Reset Kind Note", "desc": "Send a 10-sentence message to a neighbor. Keep it simple.", "time": "5-10", "energy": "low", "where": "home", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-108", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "🤝 Tiny Help", "desc": "Do one tiny helpful thing in under 4 minutes.", "time": "0-5", "energy": "med", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-109", "lane": "meaning-lite", "tier": 2, "scope": 2, "title": "💌 Quick Kind Note", "desc": "Send a 10-sentence message to a family member. Keep it simple.", "time": "5-10", "energy": "med", "where": "home", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-110", "lane": "meaning-lite", "tier": 2, "scope": 1, "title": "🙏 Gratitude Spark", "desc": "Name 3 things you’re grateful for — specific, not broad.", "time": "0-5", "energy": "low", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-111", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "✨ Compliment Boost", "desc": "Give 4 specific compliments. No generalities.", "time": "0-5", "energy": "med", "where": "home", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-112", "lane": "meaning-lite", "tier": 2, "scope": 1, "title": "🤝 Tiny Help", "desc": "Do one tiny helpful thing in under 4 minutes.", "time": "0-5", "energy": "low", "where": "home", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-113", "lane": "meaning-lite", "tier": 2, "scope": 1, "title": "💌 Gentle Kind Note", "desc": "Send a 2-sentence message to a teacher. Keep it simple.", "time": "0-5", "energy": "low", "where": "home", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-114", "lane": "meaning-lite", "tier": 2, "scope": 2, "title": "🤝 Tiny Help", "desc": "Do one tiny helpful thing in under 12 minutes.", "time": "5-10", "energy": "med", "where": "outside", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-115", "lane": "meaning-lite", "tier": 2, "scope": 2, "title": "💌 Reset Kind Note", "desc": "Send a 6-sentence message to someone you like. Keep it simple.", "time": "5-10", "energy": "high", "where": "home", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-116", "lane": "meaning-lite", "tier": 2, "scope": 1, "title": "🙏 Gratitude Move", "desc": "Name 8 things you’re grateful for — specific, not broad.", "time": "0-5", "energy": "low", "where": "home", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-117", "lane": "meaning-lite", "tier": 3, "scope": 3, "title": "🙏 Gratitude Ritual", "desc": "Name 3 things you’re grateful for — specific, not broad.", "time": "20-40", "energy": "med", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-118", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "🤝 Tiny Help", "desc": "Do one tiny helpful thing in under 4 minutes.", "time": "0-5", "energy": "low", "where": "home", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-119", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "💌 Fresh Kind Note", "desc": "Send a 10-sentence message to a family member. Keep it simple.", "time": "0-5", "energy": "med", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-120", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "🤝 Tiny Help", "desc": "Do one tiny helpful thing in under 5 minutes.", "time": "0-5", "energy": "med", "where": "home", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-121", "lane": "meaning-lite", "tier": 3, "scope": 2, "title": "🙏 Gratitude Pulse", "desc": "Name 7 things you’re grateful for — specific, not broad.", "time": "5-10", "energy": "high", "where": "outside", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-122", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "💌 Reset Kind Note", "desc": "Send a 3-sentence message to a family member. Keep it simple.", "time": "0-5", "energy": "med", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-123", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "🙏 Gratitude Pulse", "desc": "Name 10 things you’re grateful for — specific, not broad.", "time": "0-5", "energy": "low", "where": "home", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-124", "lane": "meaning-lite", "tier": 3, "scope": 1, "title": "🤝 Tiny Help", "desc": "Do one tiny helpful thing in under 6 minutes.", "time": "0-5", "energy": "high", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-125", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "✨ Compliment Wave", "desc": "Give 3 specific compliments. No generalities.", "time": "0-5", "energy": "high", "where": "any", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-126", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "✨ Compliment Move", "desc": "Give 7 specific compliments. No generalities.", "time": "0-5", "energy": "high", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-127", "lane": "meaning-lite", "tier": 2, "scope": 1, "title": "🤝 Tiny Help", "desc": "Do one tiny helpful thing in under 10 minutes.", "time": "0-5", "energy": "low", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-128", "lane": "meaning-lite", "tier": 3, "scope": 2, "title": "🤝 Tiny Help", "desc": "Do one tiny helpful thing in under 4 minutes.", "time": "5-10", "energy": "low", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-129", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "🤝 Tiny Help", "desc": "Do one tiny helpful thing in under 12 minutes.", "time": "0-5", "energy": "med", "where": "home", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-130", "lane": "meaning-lite", "tier": 2, "scope": 2, "title": "🤝 Tiny Help", "desc": "Do one tiny helpful thing in under 8 minutes.", "time": "5-10", "energy": "med", "where": "home", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-131", "lane": "meaning-lite", "tier": 2, "scope": 1, "title": "💌 Calm Kind Note", "desc": "Send a 2-sentence message to a friend. Keep it simple.", "time": "0-5", "energy": "med", "where": "home", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-132", "lane": "meaning-lite", "tier": 2, "scope": 2, "title": "💌 Gentle Kind Note", "desc": "Send a 8-sentence message to a neighbor. Keep it simple.", "time": "5-10", "energy": "med", "where": "home", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-133", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "💌 Tiny Kind Note", "desc": "Send a 5-sentence message to your future self. Keep it simple.", "time": "0-5", "energy": "high", "where": "outside", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-134", "lane": "meaning-lite", "tier": 2, "scope": 2, "title": "🙏 Gratitude Pulse", "desc": "Name 5 things you’re grateful for — specific, not broad.", "time": "5-10", "energy": "high", "where": "home", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-135", "lane": "meaning-lite", "tier": 2, "scope": 2, "title": "💌 Gentle Kind Note", "desc": "Send a 5-sentence message to your future self. Keep it simple.", "time": "5-10", "energy": "med", "where": "any", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-136", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "✨ Compliment Switch", "desc": "Give 7 specific compliments. No generalities.", "time": "0-5", "energy": "low", "where": "errands", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-137", "lane": "meaning-lite", "tier": 2, "scope": 1, "title": "✨ Compliment Wave", "desc": "Give 7 specific compliments. No generalities.", "time": "0-5", "energy": "low", "where": "any", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-138", "lane": "meaning-lite", "tier": 2, "scope": 1, "title": "🙏 Gratitude Boost", "desc": "Name 6 things you’re grateful for — specific, not broad.", "time": "0-5", "energy": "med", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-139", "lane": "meaning-lite", "tier": 2, "scope": 2, "title": "🤝 Tiny Help", "desc": "Do one tiny helpful thing in under 8 minutes.", "time": "5-10", "energy": "low", "where": "any", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-140", "lane": "meaning-lite", "tier": 2, "scope": 2, "title": "✨ Compliment Lift", "desc": "Give 7 specific compliments. No generalities.", "time": "5-10", "energy": "low", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-141", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "✨ Compliment Boost", "desc": "Give 7 specific compliments. No generalities.", "time": "0-5", "energy": "med", "where": "outside", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-142", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "🤝 Tiny Help", "desc": "Do one tiny helpful thing in under 12 minutes.", "time": "0-5", "energy": "high", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-143", "lane": "meaning-lite", "tier": 2, "scope": 2, "title": "💌 Reset Kind Note", "desc": "Send a 2-sentence message to a neighbor. Keep it simple.", "time": "5-10", "energy": "low", "where": "outside", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-144", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "💌 Micro Kind Note", "desc": "Send a 5-sentence message to a family member. Keep it simple.", "time": "0-5", "energy": "med", "where": "any", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-145", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "💌 Tiny Kind Note", "desc": "Send a 3-sentence message to your future self. Keep it simple.", "time": "0-5", "energy": "med", "where": "home", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-146", "lane": "meaning-lite", "tier": 2, "scope": 1, "title": "🙏 Gratitude Lift", "desc": "Name 2 things you’re grateful for — specific, not broad.", "time": "0-5", "energy": "low", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-147", "lane": "meaning-lite", "tier": 2, "scope": 1, "title": "🙏 Gratitude Pulse", "desc": "Name 2 things you’re grateful for — specific, not broad.", "time": "0-5", "energy": "low", "where": "outside", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-148", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "✨ Compliment Lift", "desc": "Give 7 specific compliments. No generalities.", "time": "0-5", "energy": "low", "where": "home", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-149", "lane": "meaning-lite", "tier": 2, "scope": 1, "title": "✨ Compliment Drift", "desc": "Give 7 specific compliments. No generalities.", "time": "0-5", "energy": "high", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-150", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "💌 Calm Kind Note", "desc": "Send a 5-sentence message to a teacher. Keep it simple.", "time": "0-5", "energy": "low", "where": "any", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-151", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "🙏 Gratitude Moment", "desc": "Name 5 things you’re grateful for — specific, not broad.", "time": "0-5", "energy": "low", "where": "outside", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-152", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "💌 Reset Kind Note", "desc": "Send a 10-sentence message to a family member. Keep it simple.", "time": "0-5", "energy": "low", "where": "any", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-153", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "🙏 Gratitude Pulse", "desc": "Name 4 things you’re grateful for — specific, not broad.", "time": "0-5", "energy": "med", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-154", "lane": "meaning-lite", "tier": 3, "scope": 3, "title": "🤝 Tiny Help", "desc": "Do one tiny helpful thing in under 3 minutes.", "time": "10-20", "energy": "low", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-155", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "🙏 Gratitude Boost", "desc": "Name 4 things you’re grateful for — specific, not broad.", "time": "0-5", "energy": "low", "where": "any", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-156", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "✨ Compliment Wave", "desc": "Give 5 specific compliments. No generalities.", "time": "0-5", "energy": "high", "where": "home", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-157", "lane": "meaning-lite", "tier": 2, "scope": 1, "title": "🤝 Tiny Help", "desc": "Do one tiny helpful thing in under 12 minutes.", "time": "0-5", "energy": "med", "where": "outside", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-158", "lane": "meaning-lite", "tier": 2, "scope": 1, "title": "🙏 Gratitude Moment", "desc": "Name 10 things you’re grateful for — specific, not broad.", "time": "0-5", "energy": "low", "where": "outside", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-159", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "🙏 Gratitude Move", "desc": "Name 7 things you’re grateful for — specific, not broad.", "time": "0-5", "energy": "low", "where": "home", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-160", "lane": "meaning-lite", "tier": 2, "scope": 2, "title": "🙏 Gratitude Wave", "desc": "Name 8 things you’re grateful for — specific, not broad.", "time": "5-10", "energy": "med", "where": "outside", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-161", "lane": "meaning-lite", "tier": 3, "scope": 2, "title": "🙏 Gratitude Move", "desc": "Name 6 things you’re grateful for — specific, not broad.", "time": "5-10", "energy": "med", "where": "errands", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-162", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "🙏 Gratitude Pulse", "desc": "Name 3 things you’re grateful for — specific, not broad.", "time": "0-5", "energy": "low", "where": "home", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-163", "lane": "meaning-lite", "tier": 2, "scope": 2, "title": "✨ Compliment Wave", "desc": "Give 10 specific compliments. No generalities.", "time": "5-10", "energy": "high", "where": "any", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-164", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "🤝 Tiny Help", "desc": "Do one tiny helpful thing in under 5 minutes.", "time": "0-5", "energy": "med", "where": "home", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-165", "lane": "meaning-lite", "tier": 2, "scope": 1, "title": "✨ Compliment Pulse", "desc": "Give 6 specific compliments. No generalities.", "time": "0-5", "energy": "med", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-166", "lane": "meaning-lite", "tier": 2, "scope": 1, "title": "🤝 Tiny Help", "desc": "Do one tiny helpful thing in under 5 minutes.", "time": "0-5", "energy": "low", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-167", "lane": "meaning-lite", "tier": 2, "scope": 2, "title": "🙏 Gratitude Drift", "desc": "Name 7 things you’re grateful for — specific, not broad.", "time": "5-10", "energy": "med", "where": "home", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-168", "lane": "meaning-lite", "tier": 3, "scope": 1, "title": "🙏 Gratitude Lift", "desc": "Name 3 things you’re grateful for — specific, not broad.", "time": "0-5", "energy": "low", "where": "errands", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-169", "lane": "meaning-lite", "tier": 3, "scope": 2, "title": "✨ Compliment Move", "desc": "Give 8 specific compliments. No generalities.", "time": "5-10", "energy": "low", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-170", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "🤝 Tiny Help", "desc": "Do one tiny helpful thing in under 12 minutes.", "time": "0-5", "energy": "low", "where": "home", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-171", "lane": "meaning-lite", "tier": 3, "scope": 2, "title": "✨ Compliment Moment", "desc": "Give 2 specific compliments. No generalities.", "time": "5-10", "energy": "high", "where": "any", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-172", "lane": "meaning-lite", "tier": 2, "scope": 2, "title": "💌 Mini Kind Note", "desc": "Send a 2-sentence message to a neighbor. Keep it simple.", "time": "5-10", "energy": "low", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-173", "lane": "meaning-lite", "tier": 3, "scope": 2, "title": "✨ Compliment Boost", "desc": "Give 3 specific compliments. No generalities.", "time": "5-10", "energy": "med", "where": "home", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-174", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "🙏 Gratitude Pulse", "desc": "Name 8 things you’re grateful for — specific, not broad.", "time": "0-5", "energy": "med", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-175", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "💌 Quick Kind Note", "desc": "Send a 4-sentence message to a neighbor. Keep it simple.", "time": "0-5", "energy": "low", "where": "home", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-176", "lane": "meaning-lite", "tier": 3, "scope": 3, "title": "✨ Compliment Pulse", "desc": "Give 4 specific compliments. No generalities.", "time": "10-20", "energy": "low", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-177", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "✨ Compliment Moment", "desc": "Give 5 specific compliments. No generalities.", "time": "0-5", "energy": "high", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-178", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "🤝 Tiny Help", "desc": "Do one tiny helpful thing in under 8 minutes.", "time": "0-5", "energy": "low", "where": "outside", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-179", "lane": "meaning-lite", "tier": 2, "scope": 2, "title": "💌 Mini Kind Note", "desc": "Send a 5-sentence message to a neighbor. Keep it simple.", "time": "5-10", "energy": "med", "where": "outside", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-180", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "🙏 Gratitude Ritual", "desc": "Name 2 things you’re grateful for — specific, not broad.", "time": "0-5", "energy": "low", "where": "errands", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-181", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "✨ Compliment Wave", "desc": "Give 3 specific compliments. No generalities.", "time": "0-5", "energy": "med", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-182", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "💌 Soft Kind Note", "desc": "Send a 10-sentence message to a family member. Keep it simple.", "time": "0-5", "energy": "low", "where": "home", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-183", "lane": "meaning-lite", "tier": 3, "scope": 2, "title": "🤝 Tiny Help", "desc": "Do one tiny helpful thing in under 3 minutes.", "time": "5-10", "energy": "low", "where": "outside", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-184", "lane": "meaning-lite", "tier": 2, "scope": 1, "title": "✨ Compliment Move", "desc": "Give 2 specific compliments. No generalities.", "time": "0-5", "energy": "med", "where": "any", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "meaning-lite-185", "lane": "meaning-lite", "tier": 2, "scope": 1, "title": "💌 Calm Kind Note", "desc": "Send a 2-sentence message to someone you like. Keep it simple.", "time": "0-5", "energy": "low", "where": "home", "emo": 2, "civic": true, "tags": ["kind", "civic"]}, {"id": "meaning-lite-186", "lane": "meaning-lite", "tier": 1, "scope": 1, "title": "💌 Calm Kind Note", "desc": "Send a 5-sentence message to a teacher. Keep it simple.", "time": "0-5", "energy": "low", "where": "home", "emo": 2, "civic": false, "tags": ["kind"]}, {"id": "creative-spike-187", "lane": "creative-spike", "tier": 2, "scope": 2, "title": "🎵 Theme Song Move", "desc": "Pick a theme song and play it for 60 seconds.", "time": "5-10", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-188", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "📸 Photo Quest: Pulse", "desc": "Capture 2 photos: a sign, a door, and a leaf.", "time": "0-5", "energy": "med", "where": "errands", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-189", "lane": "creative-spike", "tier": 2, "scope": 1, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 10 minutes. Rate it 1–10.", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-190", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "🍓 Snack Art: Switch", "desc": "Make a snack look like a monster.", "time": "0-5", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-191", "lane": "creative-spike", "tier": 2, "scope": 1, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 5 minutes. Rate it 1–10.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-192", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "📸 Photo Quest: Spark", "desc": "Capture 7 photos: something round, something shiny, and something tiny.", "time": "0-5", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-193", "lane": "creative-spike", "tier": 3, "scope": 3, "title": "🍓 Snack Art: Moment", "desc": "Make a snack look like a rainbow.", "time": "20-40", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-194", "lane": "creative-spike", "tier": 3, "scope": 2, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 8 minutes. Rate it 1–10.", "time": "5-10", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-195", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "📸 Photo Quest: Moment", "desc": "Capture 6 photos: a bright color, a texture, and a reflection.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-196", "lane": "creative-spike", "tier": 2, "scope": 2, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 4 minutes. Rate it 1–10.", "time": "5-10", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-197", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 6 minutes. Rate it 1–10.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-198", "lane": "creative-spike", "tier": 2, "scope": 2, "title": "🎵 Theme Song Move", "desc": "Pick a theme song and play it for 45 seconds.", "time": "5-10", "energy": "high", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-199", "lane": "creative-spike", "tier": 3, "scope": 3, "title": "🍓 Snack Art: Lift", "desc": "Make a snack look like a cat.", "time": "20-40", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-200", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "📸 Photo Quest: Wave", "desc": "Capture 5 photos: a sign, a door, and a leaf.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-201", "lane": "creative-spike", "tier": 2, "scope": 2, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 3 minutes. Rate it 1–10.", "time": "5-10", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-202", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 5 minutes. Rate it 1–10.", "time": "0-5", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-203", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 6 minutes. Rate it 1–10.", "time": "0-5", "energy": "med", "where": "outside", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-204", "lane": "creative-spike", "tier": 2, "scope": 1, "title": "🎵 Theme Song Boost", "desc": "Pick a theme song and play it for 90 seconds.", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-205", "lane": "creative-spike", "tier": 3, "scope": 1, "title": "🎵 Theme Song Drift", "desc": "Pick a theme song and play it for 45 seconds.", "time": "0-5", "energy": "high", "where": "outside", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-206", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "🎵 Theme Song Wave", "desc": "Pick a theme song and play it for 30 seconds.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-207", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "📸 Photo Quest: Ritual", "desc": "Capture 7 photos: a bright color, a texture, and a reflection.", "time": "0-5", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-208", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "📸 Photo Quest: Move", "desc": "Capture 8 photos: something round, something shiny, and something tiny.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-209", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "🎵 Theme Song Switch", "desc": "Pick a theme song and play it for 45 seconds.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-210", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "🎵 Theme Song Move", "desc": "Pick a theme song and play it for 30 seconds.", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-211", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "📸 Photo Quest: Drift", "desc": "Capture 6 photos: a sign, a door, and a leaf.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-212", "lane": "creative-spike", "tier": 2, "scope": 2, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 12 minutes. Rate it 1–10.", "time": "5-10", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-213", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "📸 Photo Quest: Boost", "desc": "Capture 7 photos: a bright color, a texture, and a reflection.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-214", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "🎵 Theme Song Pulse", "desc": "Pick a theme song and play it for 60 seconds.", "time": "0-5", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-215", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 4 minutes. Rate it 1–10.", "time": "0-5", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-216", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 4 minutes. Rate it 1–10.", "time": "0-5", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-217", "lane": "creative-spike", "tier": 2, "scope": 1, "title": "📸 Photo Quest: Moment", "desc": "Capture 3 photos: something round, something shiny, and something tiny.", "time": "0-5", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-218", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 6 minutes. Rate it 1–10.", "time": "0-5", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-219", "lane": "creative-spike", "tier": 2, "scope": 2, "title": "📸 Photo Quest: Drift", "desc": "Capture 10 photos: a pattern, a shadow, and a surprise.", "time": "5-10", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-220", "lane": "creative-spike", "tier": 2, "scope": 2, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 8 minutes. Rate it 1–10.", "time": "5-10", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-221", "lane": "creative-spike", "tier": 2, "scope": 2, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 5 minutes. Rate it 1–10.", "time": "5-10", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-222", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 8 minutes. Rate it 1–10.", "time": "0-5", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-223", "lane": "creative-spike", "tier": 2, "scope": 2, "title": "🍓 Snack Art: Lift", "desc": "Make a snack look like a dragon.", "time": "5-10", "energy": "med", "where": "outside", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-224", "lane": "creative-spike", "tier": 2, "scope": 1, "title": "🍓 Snack Art: Moment", "desc": "Make a snack look like a flower.", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-225", "lane": "creative-spike", "tier": 3, "scope": 3, "title": "🎵 Theme Song Switch", "desc": "Pick a theme song and play it for 45 seconds.", "time": "20-40", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-226", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "🎵 Theme Song Moment", "desc": "Pick a theme song and play it for 60 seconds.", "time": "0-5", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-227", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 4 minutes. Rate it 1–10.", "time": "0-5", "energy": "high", "where": "outside", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-228", "lane": "creative-spike", "tier": 2, "scope": 1, "title": "🎵 Theme Song Switch", "desc": "Pick a theme song and play it for 30 seconds.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-229", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "🍓 Snack Art: Switch", "desc": "Make a snack look like a alien.", "time": "0-5", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-230", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "📸 Photo Quest: Moment", "desc": "Capture 4 photos: a bright color, a texture, and a reflection.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-231", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "🎵 Theme Song Lift", "desc": "Pick a theme song and play it for 30 seconds.", "time": "0-5", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-232", "lane": "creative-spike", "tier": 3, "scope": 2, "title": "📸 Photo Quest: Pulse", "desc": "Capture 4 photos: something round, something shiny, and something tiny.", "time": "5-10", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-233", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "🍓 Snack Art: Ritual", "desc": "Make a snack look like a dragon.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-234", "lane": "creative-spike", "tier": 2, "scope": 2, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 3 minutes. Rate it 1–10.", "time": "5-10", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-235", "lane": "creative-spike", "tier": 2, "scope": 1, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 6 minutes. Rate it 1–10.", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-236", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 8 minutes. Rate it 1–10.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-237", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 3 minutes. Rate it 1–10.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-238", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 10 minutes. Rate it 1–10.", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-239", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 12 minutes. Rate it 1–10.", "time": "0-5", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-240", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "🍓 Snack Art: Ritual", "desc": "Make a snack look like a rainbow.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-241", "lane": "creative-spike", "tier": 2, "scope": 2, "title": "🎵 Theme Song Move", "desc": "Pick a theme song and play it for 60 seconds.", "time": "5-10", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-242", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "📸 Photo Quest: Drift", "desc": "Capture 10 photos: something round, something shiny, and something tiny.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-243", "lane": "creative-spike", "tier": 3, "scope": 2, "title": "🎵 Theme Song Pulse", "desc": "Pick a theme song and play it for 90 seconds.", "time": "5-10", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-244", "lane": "creative-spike", "tier": 2, "scope": 1, "title": "📸 Photo Quest: Wave", "desc": "Capture 6 photos: something round, something shiny, and something tiny.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-245", "lane": "creative-spike", "tier": 3, "scope": 3, "title": "🍓 Snack Art: Boost", "desc": "Make a snack look like a monster.", "time": "10-20", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-246", "lane": "creative-spike", "tier": 2, "scope": 2, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 3 minutes. Rate it 1–10.", "time": "5-10", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-247", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "🎵 Theme Song Moment", "desc": "Pick a theme song and play it for 90 seconds.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-248", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "📸 Photo Quest: Pulse", "desc": "Capture 10 photos: a pattern, a shadow, and a surprise.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-249", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "🍓 Snack Art: Drift", "desc": "Make a snack look like a dragon.", "time": "0-5", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-250", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "📸 Photo Quest: Boost", "desc": "Capture 4 photos: something round, something shiny, and something tiny.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-251", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 6 minutes. Rate it 1–10.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-252", "lane": "creative-spike", "tier": 2, "scope": 1, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 8 minutes. Rate it 1–10.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-253", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "🎵 Theme Song Drift", "desc": "Pick a theme song and play it for 60 seconds.", "time": "0-5", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-254", "lane": "creative-spike", "tier": 2, "scope": 1, "title": "🎵 Theme Song Ritual", "desc": "Pick a theme song and play it for 90 seconds.", "time": "0-5", "energy": "high", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-255", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 10 minutes. Rate it 1–10.", "time": "0-5", "energy": "high", "where": "outside", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-256", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "🎵 Theme Song Boost", "desc": "Pick a theme song and play it for 90 seconds.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-257", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "📸 Photo Quest: Moment", "desc": "Capture 8 photos: a bright color, a texture, and a reflection.", "time": "0-5", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-258", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "🎵 Theme Song Drift", "desc": "Pick a theme song and play it for 90 seconds.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-259", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 12 minutes. Rate it 1–10.", "time": "0-5", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-260", "lane": "creative-spike", "tier": 2, "scope": 1, "title": "🎵 Theme Song Drift", "desc": "Pick a theme song and play it for 60 seconds.", "time": "0-5", "energy": "high", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-261", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "📸 Photo Quest: Boost", "desc": "Capture 2 photos: a bright color, a texture, and a reflection.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-262", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 8 minutes. Rate it 1–10.", "time": "0-5", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-263", "lane": "creative-spike", "tier": 2, "scope": 1, "title": "🎵 Theme Song Drift", "desc": "Pick a theme song and play it for 60 seconds.", "time": "0-5", "energy": "med", "where": "errands", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-264", "lane": "creative-spike", "tier": 2, "scope": 2, "title": "🍓 Snack Art: Ritual", "desc": "Make a snack look like a cat.", "time": "5-10", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-265", "lane": "creative-spike", "tier": 2, "scope": 1, "title": "🍓 Snack Art: Wave", "desc": "Make a snack look like a monster.", "time": "0-5", "energy": "med", "where": "errands", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-266", "lane": "creative-spike", "tier": 2, "scope": 2, "title": "🍓 Snack Art: Spark", "desc": "Make a snack look like a robot.", "time": "5-10", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-267", "lane": "creative-spike", "tier": 3, "scope": 2, "title": "🎵 Theme Song Moment", "desc": "Pick a theme song and play it for 30 seconds.", "time": "5-10", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-268", "lane": "creative-spike", "tier": 3, "scope": 2, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 10 minutes. Rate it 1–10.", "time": "5-10", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-269", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "🎵 Theme Song Boost", "desc": "Pick a theme song and play it for 90 seconds.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-270", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "🍓 Snack Art: Switch", "desc": "Make a snack look like a dragon.", "time": "0-5", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-271", "lane": "creative-spike", "tier": 2, "scope": 2, "title": "🎵 Theme Song Moment", "desc": "Pick a theme song and play it for 90 seconds.", "time": "5-10", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-272", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "📸 Photo Quest: Ritual", "desc": "Capture 4 photos: something round, something shiny, and something tiny.", "time": "0-5", "energy": "high", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-273", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "🍓 Snack Art: Switch", "desc": "Make a snack look like a dragon.", "time": "0-5", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-274", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "😄 Joke Lab", "desc": "Invent a silly joke in 4 minutes. Rate it 1–10.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-275", "lane": "creative-spike", "tier": 2, "scope": 1, "title": "🍓 Snack Art: Spark", "desc": "Make a snack look like a flower.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-276", "lane": "creative-spike", "tier": 2, "scope": 2, "title": "📸 Photo Quest: Drift", "desc": "Capture 4 photos: a bright color, a texture, and a reflection.", "time": "5-10", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-277", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "🎵 Theme Song Moment", "desc": "Pick a theme song and play it for 45 seconds.", "time": "0-5", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "creative-spike-278", "lane": "creative-spike", "tier": 1, "scope": 1, "title": "🍓 Snack Art: Moment", "desc": "Make a snack look like a alien.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["play"]}, {"id": "weekend-depth-279", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🚪 Mini Escape", "desc": "Hide 6 clues that lead to a tiny treasure.", "time": "0-5", "energy": "med", "where": "errands", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-280", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🗺 Neighborhood Notice", "desc": "On a walk, spot 8 things your area needs (no action required).", "time": "0-5", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-281", "lane": "weekend-depth", "tier": 3, "scope": 3, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 8 pieces of litter or return a cart.", "time": "10-20", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-282", "lane": "weekend-depth", "tier": 2, "scope": 1, "title": "🗺 Neighborhood Notice", "desc": "On a walk, spot 7 things your area needs (no action required).", "time": "0-5", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-283", "lane": "weekend-depth", "tier": 2, "scope": 2, "title": "🚪 Mini Escape", "desc": "Hide 8 clues that lead to a tiny treasure.", "time": "5-10", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-284", "lane": "weekend-depth", "tier": 3, "scope": 2, "title": "🗺 Neighborhood Notice", "desc": "On a walk, spot 10 things your area needs (no action required).", "time": "5-10", "energy": "med", "where": "home", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-285", "lane": "weekend-depth", "tier": 3, "scope": 1, "title": "🚪 Mini Escape", "desc": "Hide 6 clues that lead to a tiny treasure.", "time": "0-5", "energy": "high", "where": "outside", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-286", "lane": "weekend-depth", "tier": 3, "scope": 2, "title": "🧱 Build Quest: Boost", "desc": "Build the tallest tower using 5 items. Take a photo.", "time": "5-10", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-287", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 8 pieces of litter or return a cart.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-288", "lane": "weekend-depth", "tier": 3, "scope": 3, "title": "🚪 Mini Escape", "desc": "Hide 5 clues that lead to a tiny treasure.", "time": "20-40", "energy": "low", "where": "home", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-289", "lane": "weekend-depth", "tier": 3, "scope": 1, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 8 pieces of litter or return a cart.", "time": "0-5", "energy": "high", "where": "outside", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-290", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🚪 Mini Escape", "desc": "Hide 7 clues that lead to a tiny treasure.", "time": "0-5", "energy": "high", "where": "any", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-291", "lane": "weekend-depth", "tier": 2, "scope": 2, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 6 pieces of litter or return a cart.", "time": "5-10", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-292", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🚪 Mini Escape", "desc": "Hide 4 clues that lead to a tiny treasure.", "time": "0-5", "energy": "high", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-293", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 3 pieces of litter or return a cart.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-294", "lane": "weekend-depth", "tier": 3, "scope": 1, "title": "🚪 Mini Escape", "desc": "Hide 4 clues that lead to a tiny treasure.", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-295", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🧱 Build Quest: Drift", "desc": "Build the tallest tower using 5 items. Take a photo.", "time": "0-5", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-296", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🗺 Neighborhood Notice", "desc": "On a walk, spot 6 things your area needs (no action required).", "time": "0-5", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-297", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🗺 Neighborhood Notice", "desc": "On a walk, spot 10 things your area needs (no action required).", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-298", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🗺 Neighborhood Notice", "desc": "On a walk, spot 3 things your area needs (no action required).", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-299", "lane": "weekend-depth", "tier": 2, "scope": 2, "title": "🚪 Mini Escape", "desc": "Hide 6 clues that lead to a tiny treasure.", "time": "5-10", "energy": "med", "where": "outside", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-300", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 6 pieces of litter or return a cart.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-301", "lane": "weekend-depth", "tier": 3, "scope": 2, "title": "🧱 Build Quest: Switch", "desc": "Build the tallest tower using 4 items. Take a photo.", "time": "5-10", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-302", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🚪 Mini Escape", "desc": "Hide 6 clues that lead to a tiny treasure.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-303", "lane": "weekend-depth", "tier": 3, "scope": 1, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 10 pieces of litter or return a cart.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-304", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🗺 Neighborhood Notice", "desc": "On a walk, spot 2 things your area needs (no action required).", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-305", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🚪 Mini Escape", "desc": "Hide 6 clues that lead to a tiny treasure.", "time": "0-5", "energy": "high", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-306", "lane": "weekend-depth", "tier": 3, "scope": 2, "title": "🚪 Mini Escape", "desc": "Hide 7 clues that lead to a tiny treasure.", "time": "5-10", "energy": "med", "where": "outside", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-307", "lane": "weekend-depth", "tier": 2, "scope": 1, "title": "🗺 Neighborhood Notice", "desc": "On a walk, spot 5 things your area needs (no action required).", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-308", "lane": "weekend-depth", "tier": 3, "scope": 2, "title": "🚪 Mini Escape", "desc": "Hide 6 clues that lead to a tiny treasure.", "time": "5-10", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-309", "lane": "weekend-depth", "tier": 3, "scope": 2, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 6 pieces of litter or return a cart.", "time": "5-10", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-310", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🧱 Build Quest: Lift", "desc": "Build the tallest tower using 6 items. Take a photo.", "time": "0-5", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-311", "lane": "weekend-depth", "tier": 3, "scope": 2, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 8 pieces of litter or return a cart.", "time": "5-10", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-312", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🧱 Build Quest: Moment", "desc": "Build the tallest tower using 4 items. Take a photo.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-313", "lane": "weekend-depth", "tier": 3, "scope": 3, "title": "🗺 Neighborhood Notice", "desc": "On a walk, spot 8 things your area needs (no action required).", "time": "10-20", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-314", "lane": "weekend-depth", "tier": 2, "scope": 1, "title": "🗺 Neighborhood Notice", "desc": "On a walk, spot 6 things your area needs (no action required).", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-315", "lane": "weekend-depth", "tier": 3, "scope": 1, "title": "🚪 Mini Escape", "desc": "Hide 7 clues that lead to a tiny treasure.", "time": "0-5", "energy": "low", "where": "outside", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-316", "lane": "weekend-depth", "tier": 3, "scope": 3, "title": "🧱 Build Quest: Switch", "desc": "Build the tallest tower using 5 items. Take a photo.", "time": "20-40", "energy": "high", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-317", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🚪 Mini Escape", "desc": "Hide 7 clues that lead to a tiny treasure.", "time": "0-5", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-318", "lane": "weekend-depth", "tier": 2, "scope": 2, "title": "🚪 Mini Escape", "desc": "Hide 3 clues that lead to a tiny treasure.", "time": "5-10", "energy": "high", "where": "outside", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-319", "lane": "weekend-depth", "tier": 2, "scope": 2, "title": "🗺 Neighborhood Notice", "desc": "On a walk, spot 7 things your area needs (no action required).", "time": "5-10", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-320", "lane": "weekend-depth", "tier": 2, "scope": 2, "title": "🧱 Build Quest: Moment", "desc": "Build the tallest tower using 10 items. Take a photo.", "time": "5-10", "energy": "med", "where": "outside", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-321", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🗺 Neighborhood Notice", "desc": "On a walk, spot 4 things your area needs (no action required).", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-322", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🗺 Neighborhood Notice", "desc": "On a walk, spot 5 things your area needs (no action required).", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-323", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🗺 Neighborhood Notice", "desc": "On a walk, spot 8 things your area needs (no action required).", "time": "0-5", "energy": "med", "where": "errands", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-324", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🚪 Mini Escape", "desc": "Hide 5 clues that lead to a tiny treasure.", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-325", "lane": "weekend-depth", "tier": 2, "scope": 2, "title": "🚪 Mini Escape", "desc": "Hide 6 clues that lead to a tiny treasure.", "time": "5-10", "energy": "med", "where": "any", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-326", "lane": "weekend-depth", "tier": 2, "scope": 2, "title": "🚪 Mini Escape", "desc": "Hide 7 clues that lead to a tiny treasure.", "time": "5-10", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-327", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🧱 Build Quest: Boost", "desc": "Build the tallest tower using 2 items. Take a photo.", "time": "0-5", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-328", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🚪 Mini Escape", "desc": "Hide 4 clues that lead to a tiny treasure.", "time": "0-5", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-329", "lane": "weekend-depth", "tier": 2, "scope": 2, "title": "🧱 Build Quest: Boost", "desc": "Build the tallest tower using 10 items. Take a photo.", "time": "5-10", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-330", "lane": "weekend-depth", "tier": 3, "scope": 3, "title": "🧱 Build Quest: Lift", "desc": "Build the tallest tower using 5 items. Take a photo.", "time": "20-40", "energy": "med", "where": "any", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-331", "lane": "weekend-depth", "tier": 2, "scope": 1, "title": "🗺 Neighborhood Notice", "desc": "On a walk, spot 2 things your area needs (no action required).", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-332", "lane": "weekend-depth", "tier": 2, "scope": 1, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 5 pieces of litter or return a cart.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-333", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🗺 Neighborhood Notice", "desc": "On a walk, spot 8 things your area needs (no action required).", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-334", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🗺 Neighborhood Notice", "desc": "On a walk, spot 7 things your area needs (no action required).", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-335", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🚪 Mini Escape", "desc": "Hide 8 clues that lead to a tiny treasure.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-336", "lane": "weekend-depth", "tier": 3, "scope": 2, "title": "🗺 Neighborhood Notice", "desc": "On a walk, spot 3 things your area needs (no action required).", "time": "5-10", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-337", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🚪 Mini Escape", "desc": "Hide 7 clues that lead to a tiny treasure.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-338", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 5 pieces of litter or return a cart.", "time": "0-5", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-339", "lane": "weekend-depth", "tier": 2, "scope": 2, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 10 pieces of litter or return a cart.", "time": "5-10", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-340", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🚪 Mini Escape", "desc": "Hide 8 clues that lead to a tiny treasure.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-341", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 6 pieces of litter or return a cart.", "time": "0-5", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-342", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🧱 Build Quest: Moment", "desc": "Build the tallest tower using 7 items. Take a photo.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-343", "lane": "weekend-depth", "tier": 2, "scope": 2, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 2 pieces of litter or return a cart.", "time": "5-10", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-344", "lane": "weekend-depth", "tier": 2, "scope": 1, "title": "🗺 Neighborhood Notice", "desc": "On a walk, spot 7 things your area needs (no action required).", "time": "0-5", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-345", "lane": "weekend-depth", "tier": 3, "scope": 1, "title": "🧱 Build Quest: Lift", "desc": "Build the tallest tower using 2 items. Take a photo.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-346", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🚪 Mini Escape", "desc": "Hide 4 clues that lead to a tiny treasure.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-347", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 8 pieces of litter or return a cart.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-348", "lane": "weekend-depth", "tier": 3, "scope": 2, "title": "🚪 Mini Escape", "desc": "Hide 4 clues that lead to a tiny treasure.", "time": "5-10", "energy": "med", "where": "home", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-349", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 6 pieces of litter or return a cart.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-350", "lane": "weekend-depth", "tier": 2, "scope": 2, "title": "🚪 Mini Escape", "desc": "Hide 7 clues that lead to a tiny treasure.", "time": "5-10", "energy": "low", "where": "outside", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-351", "lane": "weekend-depth", "tier": 3, "scope": 3, "title": "🧱 Build Quest: Boost", "desc": "Build the tallest tower using 3 items. Take a photo.", "time": "10-20", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-352", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🗺 Neighborhood Notice", "desc": "On a walk, spot 3 things your area needs (no action required).", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-353", "lane": "weekend-depth", "tier": 2, "scope": 1, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 7 pieces of litter or return a cart.", "time": "0-5", "energy": "med", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-354", "lane": "weekend-depth", "tier": 2, "scope": 1, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 4 pieces of litter or return a cart.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-355", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🧱 Build Quest: Moment", "desc": "Build the tallest tower using 4 items. Take a photo.", "time": "0-5", "energy": "low", "where": "outside", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-356", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🚪 Mini Escape", "desc": "Hide 4 clues that lead to a tiny treasure.", "time": "0-5", "energy": "high", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-357", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 8 pieces of litter or return a cart.", "time": "0-5", "energy": "high", "where": "outside", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-358", "lane": "weekend-depth", "tier": 2, "scope": 1, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 4 pieces of litter or return a cart.", "time": "0-5", "energy": "low", "where": "outside", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-359", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🧱 Build Quest: Ritual", "desc": "Build the tallest tower using 2 items. Take a photo.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-360", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 7 pieces of litter or return a cart.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-361", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🚪 Mini Escape", "desc": "Hide 10 clues that lead to a tiny treasure.", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-362", "lane": "weekend-depth", "tier": 3, "scope": 3, "title": "🚪 Mini Escape", "desc": "Hide 3 clues that lead to a tiny treasure.", "time": "20-40", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-363", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 5 pieces of litter or return a cart.", "time": "0-5", "energy": "high", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-364", "lane": "weekend-depth", "tier": 2, "scope": 1, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 7 pieces of litter or return a cart.", "time": "0-5", "energy": "med", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-365", "lane": "weekend-depth", "tier": 3, "scope": 2, "title": "🌱 Community Crumb", "desc": "Do a small community act: pick up 7 pieces of litter or return a cart.", "time": "5-10", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-366", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🗺 Neighborhood Notice", "desc": "On a walk, spot 10 things your area needs (no action required).", "time": "0-5", "energy": "low", "where": "any", "emo": 1, "civic": true, "tags": ["bold", "civic"]}, {"id": "weekend-depth-367", "lane": "weekend-depth", "tier": 3, "scope": 3, "title": "🗺 Neighborhood Notice", "desc": "On a walk, spot 2 things your area needs (no action required).", "time": "10-20", "energy": "low", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-368", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🚪 Mini Escape", "desc": "Hide 10 clues that lead to a tiny treasure.", "time": "0-5", "energy": "high", "where": "any", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-369", "lane": "weekend-depth", "tier": 1, "scope": 1, "title": "🧱 Build Quest: Ritual", "desc": "Build the tallest tower using 10 items. Take a photo.", "time": "0-5", "energy": "low", "where": "home", "emo": 1, "civic": false, "tags": ["bold"]}, {"id": "weekend-depth-370", "lane": "weekend-depth", "tier": 3, "scope": 3, "title": "🧱 Build Quest: Lift", "desc": "Build the tallest tower using 7 items. Take a photo.", "time": "20-40", "energy": "med", "where": "any", "emo": 1, "civic": true, "tags": ["bold", "civic"]}];

const filters = {
  time: new Set(),
  energy: new Set(),
  where: new Set(),
  lanes: new Set(),
};

function safeCap(n, lo, hi){ return Math.max(lo, Math.min(hi, n)); }
function updateRamp(){
  const c=state.completions;
  state.tier = (c<3) ? 1 : (c<8 ? 2 : 3);
  state.scope = safeCap(1 + Math.floor(c/4), 1, state.tier);
}

function recentSet(arr, n){ return new Set(arr.slice(-n)); }

function civicAllowed(a){
  if(!a.civic) return true;
  return state.civicOn;
}

function matchesFilters(a){
  if(filters.time.size>0 && !filters.time.has(a.time)) return false;
  if(filters.energy.size>0 && !filters.energy.has(a.energy)) return false;
  if(filters.where.size>0) {
    if(!(a.where==="any" || filters.where.has(a.where))) return false;
  }
  if(filters.lanes.size>0 && !filters.lanes.has(a.lane)) return false;
  return true;
}

function meetsEngineConstraints(a){
  if(a.tier > state.tier) return false;
  if(a.scope > state.scope) return false;

  const r=state.recentEmo;
  if(r.length>=2 && r[r.length-1]===3 && r[r.length-2]===3 && a.emo===3) return false;

  if(!civicAllowed(a)) return false;
  return true;
}

function eligiblePool(){
  updateRamp();
  let list = A.filter(a => meetsEngineConstraints(a) && matchesFilters(a));

  if(state.pinnedLane && filters.lanes.size===0) {
    const pinned = list.filter(a=>a.lane===state.pinnedLane);
    if(pinned.length>=8) list = pinned;
  }

  const avoid = recentSet(state.recent, 4);
  const cooled = list.filter(a=>!avoid.has(a.id));
  if(cooled.length>=10) list = cooled;

  if(state.lastLane) {
    const diff = list.filter(a=>a.lane!==state.lastLane);
    if(diff.length>=10) list = diff;
  }

  return list;
}

function vibeTag(){
  return (state.vibeIndex===1) ? "play"
    : (state.vibeIndex===2) ? "bold"
    : (state.vibeIndex===3) ? "fresh"
    : "bold";
}

function weightedPick(list){
  if(list.length===0) return null;
  const tag=vibeTag();
  const biasStrength = safeCap(1.2 - state.randomness, 0.2, 0.9);

  const forceCivic = state.civicOn && state.civicSince >= 2;
  const civicBoost = state.civicOn ? 1.1 : 0;

  const weights = list.map(a=>{
    let w=1;
    if(a.tags?.includes(tag)) w += 0.9*biasStrength;
    if(state.pinnedLane && a.lane===state.pinnedLane) w += 0.7*biasStrength;
    if(state.civicOn && a.civic) w += civicBoost;
    if(forceCivic && a.civic) w += 3.0;
    if(forceCivic && !a.civic) w *= 0.35;
    return w;
  });

  const total = weights.reduce((s,w)=>s+w,0);
  let r = Math.random()*total;
  for(let i=0;i<list.length;i++) {
    r -= weights[i];
    if(r<=0) return list[i];
  }
  return list[list.length-1];
}

function ensureAudio(){
  if(!audioCtx){ audioCtx=new (window.AudioContext||window.webkitAudioContext)(); }
  if(audioCtx && audioCtx.state==='suspended'){ audioCtx.resume(); }
}
function beep({freq=440,dur=0.06,type='sine',gain=0.08}={}){
  if(!soundOn) return;
  try{
    ensureAudio();
    const o=audioCtx.createOscillator();
    const g=audioCtx.createGain();
    o.type=type; o.frequency.value=freq;
    g.gain.value=0.0001;
    o.connect(g); g.connect(audioCtx.destination);
    const t=audioCtx.currentTime;
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(gain,t+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.start(t); o.stop(t+dur+0.02);
  }catch(e){}
}
function chime(){
  if(!soundOn) return;
  beep({freq:523,dur:0.07,type:'triangle',gain:0.06});
  setTimeout(()=>beep({freq:659,dur:0.08,type:'triangle',gain:0.06}),70);
  setTimeout(()=>beep({freq:784,dur:0.09,type:'triangle',gain:0.055}),140);
}
function haptic(ms=18){ try{ if(navigator.vibrate) navigator.vibrate(ms); }catch(e){} }
function showToast(msg){ toast.textContent=msg; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),950); }
function card(inner){ stage.innerHTML=`<div class="card enter">${inner}</div>`; }
function burstFrom(el){
  const r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  const colors=['#55ffb8','#2b8cff','#b65cff','#ffb23f','#ff4fa3'];
  for(let i=0;i<18;i++) {
    const p=document.createElement('div');
    p.className='burst';
    p.style.left=cx+'px'; p.style.top=cy+'px';
    p.style.background=colors[i%colors.length];
    const a=(Math.PI*2)*(i/18)+(Math.random()*.35);
    const rad=70+Math.random()*70;
    p.style.setProperty('--dx',(Math.cos(a)*rad)+'px');
    p.style.setProperty('--dy',(Math.sin(a)*rad)+'px');
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),740);
  }
}

function setSoundUI(){ soundToggle.classList.toggle('on',soundOn); soundToggle.setAttribute('aria-checked',soundOn?'true':'false'); }
soundToggle.addEventListener('click',()=>{ soundOn=!soundOn; setSoundUI(); haptic(12); if(soundOn) beep({freq:660,dur:0.05,type:'sine',gain:0.05}); showToast(soundOn?'Sound on':'Sound off'); });
soundToggle.addEventListener('keydown',(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); soundToggle.click(); } });
setSoundUI();

function setCivicUI(){ civicToggleEl.classList.toggle('on', state.civicOn); civicToggleEl.setAttribute('aria-checked', state.civicOn?'true':'false'); }
civicToggleEl.addEventListener('click',()=>{
  state.civicOn = !state.civicOn;
  state.civicSince = 0;
  setCivicUI(); haptic(12);
  showToast(state.civicOn ? 'Civic mixing ON (invisible)' : 'Civic mixing OFF');
  renderSpin();
});
civicToggleEl.addEventListener('keydown',(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); civicToggleEl.click(); } });
setCivicUI();

navBtns.forEach(b=>b.addEventListener('click',()=>show(b.dataset.screen)));
profileBtn.addEventListener('click',()=>show('profile'));
backBtn.addEventListener('click',()=>show(lastNonProfile));
function setActive(name){ navBtns.forEach(b=>b.classList.toggle('active',b.dataset.screen===name)); }
function setBackVisibility(){ backBtn.classList.toggle('show', current==='profile'); }

function openModal(renderFn){ mscrim.classList.add('show'); modal.classList.add('show'); renderFn(); }
function closeModal(){ mscrim.classList.remove('show'); modal.classList.remove('show'); modal.innerHTML=''; }
mscrim.addEventListener('click', closeModal);
function modalHead(title){ return `<div class="modalHead"><div class="modalTitle">${title}</div><button class="close" id="mclose">Close</button></div>`; }
function wireClose(){ const c=document.getElementById('mclose'); if(c) c.onclick=closeModal; }

function openFilterModal(type){
  const title = type==="time" ? "Time" : type==="energy" ? "Energy" : type==="where" ? "Where" : "Lane";
  const options = type==="time"
    ? [{k:"0-5",t:"0–5 min"},{k:"5-10",t:"5–10 min"},{k:"10-20",t:"10–20 min"},{k:"20-40",t:"20–40 min"}]
    : type==="energy"
    ? [{k:"low",t:"Low"},{k:"med",t:"Moderate"},{k:"high",t:"High"}]
    : type==="where"
    ? [{k:"home",t:"Home"},{k:"outside",t:"Outside"},{k:"errands",t:"Errands"}]
    : LANES.map(l=>({k:l.id,t:l.name}));
  const set = (type==="lanes") ? filters.lanes : filters[type];

  openModal(()=>{
    modal.innerHTML = `
      ${modalHead(title)}
      <div class="small">Select one or more. “Any” clears.</div>
      <div class="optgrid">
        ${options.map(o=>`<button class="opt ${set.has(o.k)?'on':''}" data-k="${o.k}">${o.t}</button>`).join('')}
      </div>
      <div class="foot">
        <button class="smallbtn reset" id="reset">Any</button>
        <button class="smallbtn apply" id="apply">Apply</button>
      </div>
    `;
    wireClose();

    modal.querySelectorAll('.opt').forEach(btn=>{
      btn.onclick=()=>{
        const k=btn.dataset.k;
        if(set.has(k)) set.delete(k); else set.add(k);
        btn.classList.toggle('on');
        haptic(8); beep({freq:520,dur:0.04,type:'sine',gain:0.03});
      };
    });

    document.getElementById('reset').onclick=()=>{ set.clear(); closeModal(); renderSpin(); showToast(title+': Any'); };
    document.getElementById('apply').onclick=()=>{ closeModal(); renderSpin(); showToast('Filters applied'); };
  });
}

function openAdjustModal(){
  openModal(()=>{
    modal.innerHTML = `
      ${modalHead("Adjust")}
      <div class="small">Vibe changes the look + gently steers the engine.</div>
      <div class="div"></div>
      <div class="small">Vibe</div>
      <div class="optgrid">
        ${[1,2,3,4].map(i=>`<button class="opt ${state.vibeIndex===i?'on':''}" data-v="${i}">${vibeNames[i]}</button>`).join('')}
      </div>

      <div class="div"></div>
      <div class="small">Perceived control</div>
      <div class="p" style="margin-top:8px">More control = more steering toward your vibe/lane.</div>
      <input id="rand" type="range" min="0.20" max="0.80" step="0.01" value="${state.randomness}" style="width:100%;margin-top:8px"/>
      <div class="small" style="margin-top:8px">Randomness: <span id="randVal">${state.randomness.toFixed(2)}</span></div>

      <div class="div"></div>
      <div class="small">Lane pin</div>
      <div class="laneGrid">
        ${LANES.map(l=>`
          <button class="lane ${state.pinnedLane===l.id?'on':''}" data-l="${l.id}">
            <strong>${l.name}</strong>
            <span>${l.blurb}</span>
          </button>`).join('')}
      </div>
      <button class="btn secondary" id="clearPin" style="margin-top:12px">Clear pin</button>
    `;
    wireClose();

    modal.querySelectorAll('.opt[data-v]').forEach(b=>{
      b.onclick=()=>{
        const v=Number(b.dataset.v);
        setVibe(v);
        modal.querySelectorAll('.opt[data-v]').forEach(x=>x.classList.toggle('on', Number(x.dataset.v)===v));
        haptic(10); chime(); renderSpin();
      };
    });

    const r=document.getElementById('rand');
    const rv=document.getElementById('randVal');
    r.oninput=()=>{ state.randomness=Number(r.value); rv.textContent=state.randomness.toFixed(2); haptic(6); };
    r.onchange=()=>{ showToast('Control updated'); renderSpin(); };

    modal.querySelectorAll('.lane').forEach(b=>{
      b.onclick=()=>{
        const id=b.dataset.l;
        state.pinnedLane = (state.pinnedLane===id) ? null : id;
        modal.querySelectorAll('.lane').forEach(x=>x.classList.toggle('on', x.dataset.l===state.pinnedLane));
        haptic(10); beep({freq:600,dur:0.05,type:'triangle',gain:0.04});
        renderSpin();
      };
    });

    document.getElementById('clearPin').onclick=()=>{
      state.pinnedLane=null;
      modal.querySelectorAll('.lane').forEach(x=>x.classList.remove('on'));
      haptic(10); showToast('Lane pin cleared'); renderSpin();
    };
  });
}

function filterLabel(set, anyLabel="Any"){ if(set.size===0) return anyLabel; const arr=[...set]; if(arr.length<=2) return arr.join(", "); return arr.slice(0,2).join(", ")+"…"; }
function countEligible(){ return eligiblePool().length; }

function renderSpin(){
  const timeVal = filterLabel(filters.time);
  const energyVal = filterLabel(filters.energy);
  const whereVal = filterLabel(filters.where);
  const laneVal = (filters.lanes.size===0) ? "Any" : `${filters.lanes.size} lane${filters.lanes.size>1?'s':''}`;
  const matches = countEligible();

  stage.innerHTML = `
    <div class="spinWrap enter">
      <div class="filters">
        <button class="chip" id="fTime"><span class="dot"></span>Time <span class="val">${timeVal}</span></button>
        <button class="chip" id="fEnergy"><span class="dot"></span>Energy <span class="val">${energyVal}</span></button>
        <button class="chip" id="fWhere"><span class="dot"></span>Where <span class="val">${whereVal}</span></button>
        <button class="chip" id="fLane"><span class="dot"></span>Lane <span class="val">${laneVal}</span></button>
        <button class="chip" id="fAdjust"><span class="dot"></span>Adjust <span class="count">(${vibeNames[state.vibeIndex]})</span></button>
      </div>

      <div class="orbWrap">
        <div class="orbHalo" aria-hidden="true"></div>
        <div class="orbRing" aria-hidden="true"></div>
        <button class="orb" id="spinOrb"><div class="shine"></div>SPIN</button>
      </div>

      <button class="subpill" id="meta">
        Matches: <strong>${matches}</strong> • Tier: <strong>${state.tier}</strong> • Scope: <strong>${state.scope}</strong>
        ${state.pinnedLane ? `<br/><small>Pinned: ${LANES.find(l=>l.id===state.pinnedLane)?.name || 'Lane'}</small>` : ''}
        <br/><small>Civic: ${state.civicOn ? 'ON (mixed)' : 'OFF'}</small>
      </button>
    </div>
  `;

  document.getElementById('fTime').onclick=()=>openFilterModal('time');
  document.getElementById('fEnergy').onclick=()=>openFilterModal('energy');
  document.getElementById('fWhere').onclick=()=>openFilterModal('where');
  document.getElementById('fLane').onclick=()=>openFilterModal('lanes');
  document.getElementById('fAdjust').onclick=openAdjustModal;

  document.getElementById('spinOrb').onclick=(e)=>{
    haptic(22);
    beep({freq:220,dur:0.05,type:'sine',gain:0.05});
    setTimeout(()=>beep({freq:330,dur:0.05,type:'sine',gain:0.05}),45);
    setTimeout(()=>beep({freq:440,dur:0.06,type:'sine',gain:0.06}),95);

    const pool=eligiblePool();
    const pick=weightedPick(pool);
    if(!pick){ showToast('No matches — clear a filter'); haptic(18); return; }

    burstFrom(e.currentTarget);
    currentActivity=pick;

    if(state.civicOn) {
      state.civicSince = pick.civic ? 0 : (state.civicSince + 1);
    }

    show('activity');
  };
}

function renderLanes(){
  card(`
    <div class="revealHead">
      <div>
        <div class="kicker">Lane Browser</div>
        <div class="small">Pin a lane to bias the engine.</div>
      </div>
      <div class="revealChip">LANES</div>
    </div>

    <div class="laneGrid">
      ${LANES.map(l=>`
        <button class="lane ${state.pinnedLane===l.id?'on':''}" data-l="${l.id}">
          <strong>${l.name}</strong>
          <span>${l.blurb}</span>
        </button>`).join('')}
    </div>

    <button class="btn primary" id="backSpin" style="margin-top:14px">Back to Spin</button>
    <button class="btn secondary" id="clear" style="margin-top:10px">Clear pin</button>
  `);

  stage.querySelectorAll('.lane').forEach(b=>{
    b.onclick=()=>{
      const id=b.dataset.l;
      state.pinnedLane = (state.pinnedLane===id) ? null : id;
      stage.querySelectorAll('.lane').forEach(x=>x.classList.toggle('on', x.dataset.l===state.pinnedLane));
      haptic(10); beep({freq:600,dur:0.05,type:'triangle',gain:0.04});
      renderSpin();
    };
  });
  document.getElementById('backSpin').onclick=()=>show('spin');
  document.getElementById('clear').onclick=()=>{ state.pinnedLane=null; showToast('Lane pin cleared'); renderSpin(); };
}

function renderActivity(){
  const a=currentActivity || A[0];
  const laneName = LANES.find(l=>l.id===a.lane)?.name || "Lane";
  const timeLabel = a.time==='0-5'?'0–5 min':a.time.replace('-','–')+' min';
  const energyLabel = (a.energy==='med') ? 'Moderate' : a.energy[0].toUpperCase()+a.energy.slice(1);
  const civicHidden = state.civicOn && a.civic;

  card(`
    <div class="revealHead">
      <div>
        <div class="kicker">Your next move</div>
        <div class="small">Lane: <strong>${laneName}</strong> • Vibe: <strong>${vibeNames[state.vibeIndex]}</strong></div>
      </div>
      <div class="revealChip">REVEAL ✨</div>
    </div>

    <h1 class="h1">${a.title}</h1>
    <p class="p">${a.desc}</p>

    <div class="tagrow">
      <span class="tag"><i>⏱</i> ${timeLabel}</span>
      <span class="tag"><i>⚡</i> ${energyLabel}</span>
      <span class="tag"><i>📍</i> ${a.where==='any'?'Anywhere':a.where[0].toUpperCase()+a.where.slice(1)}</span>
      <span class="tag"><i>🎚</i> Tier ${a.tier} • Scope ${a.scope}</span>
    </div>

    <div class="div"></div>

    <div class="btnStack">
      <button class="btn primary" id="start">Start →</button>
      <button class="btn ghost" id="spinAgain">Spin again</button>
      <button class="btn ghost" id="adjust">Adjust choice</button>
    </div>

  `);

  chime(); haptic(10);

  document.getElementById('start').onclick=(e)=>{ haptic(18); beep({freq:520,dur:0.06,type:'triangle',gain:0.06}); burstFrom(e.currentTarget); show('progress'); };
  document.getElementById('spinAgain').onclick=()=>{ haptic(12); beep({freq:420,dur:0.05,type:'sine',gain:0.04}); show('spin'); };
  document.getElementById('adjust').onclick=openAdjustModal;
}

function fmt(secs){ const m=Math.floor(secs/60), s=secs%60; return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0'); }

function renderProgress(){
  const a=currentActivity || A[0];
  const seconds = (a.scope===1) ? 120 : (a.scope===2 ? 240 : 480);
  let secs=seconds;

  card(`
    <div class="metaLine">
      <div class="h2">In Progress</div>
      <div class="small">⏱ <span id="timer">${fmt(secs)}</span></div>
    </div>
    <p class="p"><strong>${a.title}</strong><br/>Try it now — keep it lightweight.</p>
    <div class="progress"><div class="bar" id="bar"></div></div>
    <button class="btn primary" id="done">Mark as Done</button>
    <button class="btn secondary" id="skip">Spin again</button>
    <button class="btn ghost" id="profileGo">Profile</button>
  `);

  requestAnimationFrame(()=>document.getElementById('bar').style.width='66%');

  const t=document.getElementById('timer');
  const iv=setInterval(()=>{
    secs=Math.max(0,secs-1);
    t.textContent=fmt(secs);
    if(secs===0) clearInterval(iv);
  },1000);

  document.getElementById('done').onclick=(e)=>{
    clearInterval(iv);
    haptic(30); chime(); burstFrom(e.currentTarget);
    applyCompletion(a);
    show('complete');
  };
  document.getElementById('skip').onclick=()=>{ clearInterval(iv); haptic(12); beep({freq:420,dur:0.05,type:'sine',gain:0.04}); show('spin'); };
  document.getElementById('profileGo').onclick=()=>{ clearInterval(iv); show('profile'); };
}

function applyCompletion(a){
  state.completions += 1;
  state.day = 1 + Math.floor(state.completions/2);
  state.recent.push(a.id);
  state.recent = state.recent.slice(-14);
  state.recentEmo.push(a.emo);
  state.recentEmo = state.recentEmo.slice(-6);
  state.lastLane = a.lane;
  updateRamp();
}

function suggestNextLane(laneId){
  const idx = LANES.findIndex(l=>l.id===laneId);
  const step = (Math.random()<0.5) ? 1 : 2;
  return LANES[(idx+step) % LANES.length].id;
}

function renderComplete(){
  const a=currentActivity || A[0];
  const lane = LANES.find(l=>l.id===a.lane)?.name || "Lane";
  const civicReveal = state.civicOn && a.civic;
  const nextLane = suggestNextLane(a.lane);
  const nextLaneName = LANES.find(l=>l.id===nextLane)?.name || "Next";

  card(`
    <div class="revealHead">
      <div>
        <div class="kicker">Complete</div>
        <div class="small">Dot added • Tier <strong>${state.tier}</strong> • Scope <strong>${state.scope}</strong></div>
      </div>
      <div class="revealChip">DONE ✨</div>
    </div>

    <h2 class="h2">${a.title}</h2>
    <p class="p">Lane: <strong>${lane}</strong></p>

    ${civicReveal ? `
      <div class="div"></div>
      <div class="tagrow">
        <span class="tag"><i>🌎</i> Community ripple revealed</span>
        <span class="tag"><i>🙈</i> It was invisible until now</span>
      </div>
      <p class="p">This was a civic-mode activity, blended into your normal spins.</p>
    ` : ``}

    <div class="div"></div>

    <button class="btn primary" id="spinNext">Spin again</button>
    <button class="btn secondary" id="keepLane">Keep lane: ${lane}</button>
    <button class="btn ghost" id="shiftLane">Shift lane: ${nextLaneName}</button>
  `);

  document.getElementById('spinNext').onclick=()=>{ haptic(12); beep({freq:420,dur:0.05,type:'sine',gain:0.04}); show('spin'); };
  document.getElementById('keepLane').onclick=()=>{ state.pinnedLane = a.lane; haptic(10); showToast('Pinned: '+lane); renderSpin(); show('spin'); };
  document.getElementById('shiftLane').onclick=()=>{ state.pinnedLane = nextLane; haptic(10); showToast('Pinned: '+nextLaneName); renderSpin(); show('spin'); };
}

function renderProfile(){
  let dots='';
  for(let i=0;i<45;i++){ dots+=`<div class="dwDot ${(i===6||i===19||i===33)?'halo':''}"></div>`; }

  const recent = state.recent.slice(-4).reverse().map(id=>A.find(x=>x.id===id)).filter(Boolean);

  stage.innerHTML=`
    <div class="dotworld enter">
      <h2 class="h2">Your Dot World</h2>
      <p class="p">Momentum, not stats. (Prototype)</p>

      <div class="tagrow" style="margin-top:10px;">
        <span class="tag"><i>🧠</i> Tier ${state.tier} • Scope ${state.scope}</span>
        <span class="tag"><i>🎨</i> Vibe: ${vibeNames[state.vibeIndex]}</span>
        <span class="tag"><i>📚</i> Library: 370</span>
      </div>

      <div class="dotgrid">${dots}</div>

      <div class="div"></div>

      <div class="small"><strong>Recent</strong></div>
      <div class="list">
        ${recent.length ? recent.map(a=>`
          <div class="item">
            <div class="left"><span class="badge"></span>${a.title}</div>
            <span style="opacity:.7">${LANES.find(l=>l.id===a.lane)?.name || ''}</span>
          </div>`).join('') : `
          <div class="item"><div class="left"><span class="badge"></span>No history yet</div><span>›</span></div>
        `}
      </div>

      <div class="chipline">
        <button class="miniChip" id="resetFilters">Reset filters</button>
        <button class="miniChip" id="adjust">Adjust</button>
        <button class="miniChip" id="backToPrev">Back</button>
      </div>
    </div>
  `;
  document.getElementById('resetFilters').onclick=()=>{ filters.time.clear(); filters.energy.clear(); filters.where.clear(); filters.lanes.clear(); showToast('Filters reset'); renderSpin(); };
  document.getElementById('adjust').onclick=openAdjustModal;
  document.getElementById('backToPrev').onclick=()=>show(lastNonProfile);
}

function show(screen){
  current=screen;
  setActive(screen);
  setBackVisibility();
  if(screen!=='profile') lastNonProfile=screen;

  if(screen==='spin') return renderSpin();
  if(screen==='lanes') return renderLanes();
  if(screen==='activity') return renderActivity();
  if(screen==='progress') return renderProgress();
  if(screen==='complete') return renderComplete();
  if(screen==='profile') return renderProfile();
}

setVibe(state.vibeIndex);
show('spin');
