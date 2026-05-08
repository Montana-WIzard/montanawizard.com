/* ==========================================================================
   Montana Wizard Podcast — Episode Loader & Audio Player
   --------------------------------------------------------------------------
   Episode list is loaded from /audio/episodes.txt at runtime.
   Manifest format (one entry per line):
       filename.ext - "Episode Title"
   Lines starting with # are treated as comments and ignored.
   ========================================================================== */

const MANIFEST_URL = 'audio/episodes.txt';

/* Optional descriptions keyed by episode number ("00", "01", etc.).
   Add/edit freely — entries without a description fall back to a default. */
const EPISODE_DESCRIPTIONS = {
  '00': 'A first dispatch from the wizard\'s desk. What you can expect, who\'s behind the mic, and why we\'re telling these stories from the foothills.',
  '01': 'The pilot episode. The origin story behind Montana Wizard, the gear, and the first real conversation under the Big Sky.',
  '02': 'On slowing down, the geography of rest, and what a Tuesday afternoon looks like when the mountains are doing the talking.',
  '03': 'Small-town gymnasiums, long bus rides, and the social fabric that gets stitched together every March in Montana.',
  '04': 'A field guide to spotting the schemes that rolled into Big Sky Country — and the locals who saw them coming a mile off.'
};

let EPISODES = [];

/* ==========================================================================
   Manifest parsing
   ========================================================================== */

function parseManifest(text) {
  const episodes = [];
  const lines = text.split(/\r?\n/);

  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;

    // Match:  filename - "Title"   (tolerates straight or curly quotes,
    // and an em-dash / en-dash separator)
    const match = line.match(/^(\S+)\s*[-–—]\s*["“]?([^"”]+)["”]?\s*$/);
    if (!match) continue;

    const filename = match[1].trim();
    const title = match[2].trim();

    // Skip the header row if the file uses one
    if (filename.toLowerCase() === 'file') continue;

    // Pull the episode number out of the filename if present (ep00, ep01...)
    const numMatch = filename.match(/ep(\d+)/i);
    const num = numMatch
      ? numMatch[1].padStart(2, '0')
      : String(episodes.length).padStart(2, '0');

    episodes.push({
      num,
      title,
      description: EPISODE_DESCRIPTIONS[num] || 'Stream the episode below or watch the video version on YouTube.',
      audioUrl: `audio/${filename}`,
      duration: '—:—'
    });
  }

  return episodes;
}

async function loadEpisodes() {
  try {
    const res = await fetch(MANIFEST_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    EPISODES = parseManifest(text);
    if (EPISODES.length === 0) {
      console.warn('No episodes parsed from manifest. Check audio/episodes.txt formatting.');
    }
  } catch (err) {
    console.warn('Could not load audio/episodes.txt — using empty list.', err);
    EPISODES = [];
  }
}

/* ==========================================================================
   Audio Player
   ========================================================================== */

class PodcastPlayer {
  constructor(rootEl) {
    this.root = rootEl;
    if (!this.root) return;
    this.currentIndex = 0;
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.isPlaying = false;
    this.render();
    this.bindEvents();
    this.preloadDurations();
    if (EPISODES.length) this.loadEpisode(0);
  }

  render() {
    if (EPISODES.length === 0) {
      this.root.innerHTML = `
        <div class="player-wrap">
          <div class="player-header">
            <div>
              <div class="player-now">No Episodes Yet</div>
              <div class="player-title">Drop audio files into the /audio/ folder</div>
            </div>
          </div>
          <p style="color: var(--color-parchment-warm); margin-top: 1rem; font-size: 0.95rem;">
            Add a line to <code>audio/episodes.txt</code> for each episode in the format:
            <br><br>
            <code style="font-family: var(--font-mono); color: var(--color-amber);">ep01.m4a - "The Wizard Arrives"</code>
          </p>
        </div>
      `;
      return;
    }

    this.root.innerHTML = `
      <div class="player-wrap">
        <div class="player-header">
          <div>
            <div class="player-now"><span class="live-dot"></span>Now Playing</div>
            <div class="player-title" id="playerTitle">${EPISODES[0].title}</div>
          </div>
        </div>

        <div class="player-controls">
          <button class="player-btn" id="prevBtn" aria-label="Previous episode">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h2v16H6zm3.5 8L20 4v16z"/></svg>
          </button>
          <button class="player-btn player-play" id="playBtn" aria-label="Play / Pause">
            <svg viewBox="0 0 24 24" fill="currentColor" id="playIcon"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <button class="player-btn" id="nextBtn" aria-label="Next episode">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 4h2v16h-2zm-2.5 8L4 4v16z" transform="scale(-1,1) translate(-24,0)"/></svg>
          </button>

          <div class="player-progress">
            <div class="progress-bar" id="progressBar">
              <div class="progress-fill" id="progressFill"></div>
            </div>
            <div class="progress-times">
              <span id="currentTime">0:00</span>
              <span id="duration">${EPISODES[0].duration}</span>
            </div>
          </div>
        </div>

        <div class="player-episodes">
          <h4>Episode List</h4>
          <ul class="episode-list" id="episodeList">
            ${EPISODES.map((ep, i) => `
              <li class="episode-item ${i === 0 ? 'active' : ''}" data-index="${i}">
                <span class="episode-num">${ep.num}</span>
                <span class="episode-name">${ep.title}</span>
                <span class="episode-time" data-duration-for="${i}">${ep.duration}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  bindEvents() {
    if (EPISODES.length === 0) return;

    document.getElementById('playBtn').addEventListener('click', () => this.togglePlay());
    document.getElementById('prevBtn').addEventListener('click', () => this.prev());
    document.getElementById('nextBtn').addEventListener('click', () => this.next());

    document.querySelectorAll('.episode-item').forEach(item => {
      item.addEventListener('click', () => {
        this.loadEpisode(parseInt(item.dataset.index));
        this.play();
      });
    });

    const progressBar = document.getElementById('progressBar');
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      if (this.audio.duration) this.audio.currentTime = pct * this.audio.duration;
    });

    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('ended', () => this.next());
    this.audio.addEventListener('loadedmetadata', () => {
      const dur = formatTime(this.audio.duration);
      document.getElementById('duration').textContent = dur;
      EPISODES[this.currentIndex].duration = dur;
    });
    this.audio.addEventListener('error', () => {
      document.getElementById('duration').textContent = 'unavailable';
    });
  }

  /* Pre-fetch metadata for every track so durations show in the list
     without needing to click each one. Sequential to be polite. */
  preloadDurations() {
    let i = 0;
    const next = () => {
      if (i >= EPISODES.length) return;
      const ep = EPISODES[i];
      const probe = new Audio();
      probe.preload = 'metadata';
      probe.src = ep.audioUrl;
      const idx = i;
      probe.addEventListener('loadedmetadata', () => {
        const dur = formatTime(probe.duration);
        ep.duration = dur;
        const cell = document.querySelector(`[data-duration-for="${idx}"]`);
        if (cell) cell.textContent = dur;
        const cardCell = document.querySelector(`[data-card-duration="${ep.num}"]`);
        if (cardCell) cardCell.textContent = dur;
        if (idx === this.currentIndex) {
          document.getElementById('duration').textContent = dur;
        }
      }, { once: true });
      probe.addEventListener('error', () => {
        const cell = document.querySelector(`[data-duration-for="${idx}"]`);
        if (cell) cell.textContent = '—';
      }, { once: true });
      i++;
      setTimeout(next, 150);
    };
    next();
  }

  loadEpisode(index) {
    this.currentIndex = index;
    const ep = EPISODES[index];

    document.getElementById('playerTitle').textContent = ep.title;
    document.getElementById('duration').textContent = ep.duration;
    document.getElementById('currentTime').textContent = '0:00';
    document.getElementById('progressFill').style.width = '0%';

    document.querySelectorAll('.episode-item').forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });

    this.audio.src = ep.audioUrl;
  }

  togglePlay() {
    this.isPlaying ? this.pause() : this.play();
  }

  play() {
    const playPromise = this.audio.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(() => {
        alert('Could not play this episode. Check that the audio file exists in /audio/ and the filename in audio/episodes.txt matches exactly.');
      });
    }
    this.isPlaying = true;
    document.getElementById('playIcon').innerHTML = '<path d="M6 5h4v14H6zm8 0h4v14h-4z"/>';
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    document.getElementById('playIcon').innerHTML = '<path d="M8 5v14l11-7z"/>';
  }

  prev() {
    const idx = this.currentIndex > 0 ? this.currentIndex - 1 : EPISODES.length - 1;
    this.loadEpisode(idx);
    if (this.isPlaying) this.play();
  }

  next() {
    const idx = (this.currentIndex + 1) % EPISODES.length;
    this.loadEpisode(idx);
    if (this.isPlaying) this.play();
  }

  updateProgress() {
    if (!this.audio.duration) return;
    const pct = (this.audio.currentTime / this.audio.duration) * 100;
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('currentTime').textContent = formatTime(this.audio.currentTime);
  }
}

function formatTime(s) {
  if (!s || isNaN(s) || !isFinite(s)) return '—:—';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

/* ==========================================================================
   Episodes Grid (cards on /index and /episodes pages)
   ========================================================================== */

function renderEpisodesGrid(rootSelector) {
  const root = document.querySelector(rootSelector);
  if (!root) return;

  if (EPISODES.length === 0) {
    root.innerHTML = `
      <p style="color: var(--color-bark); font-style: italic; grid-column: 1 / -1;">
        No episodes loaded. Add entries to <code>audio/episodes.txt</code>.
      </p>
    `;
    return;
  }

  root.innerHTML = EPISODES.slice().reverse().map(ep => `
    <article class="episode-card">
      <div class="episode-card-media">
        <div style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;color:var(--color-amber);background:linear-gradient(135deg,var(--color-pine-deep),var(--color-pine));font-family:var(--font-display);font-size:1.4rem;text-align:center;padding:1rem;flex-direction:column;gap:0.5rem;">
          <span style="font-family:var(--font-mono);font-size:0.7rem;letter-spacing:0.3em;opacity:0.7;text-transform:uppercase;">Episode ${ep.num}</span>
          <span>${ep.title}</span>
        </div>
      </div>
      <div class="episode-card-body">
        <div class="episode-card-meta">Episode ${ep.num} · <span data-card-duration="${ep.num}">${ep.duration}</span></div>
        <h3>${ep.title}</h3>
        <p>${ep.description}</p>
        <p style="margin-top:1rem;">
          <a href="index.html#listen" style="font-family:var(--font-mono);font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--color-rust);border-bottom:1px solid var(--color-amber);padding-bottom:2px;">▸ Listen on Player</a>
        </p>
      </div>
    </article>
  `).join('');
}

/* ==========================================================================
   Init
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  await loadEpisodes();

  if (document.getElementById('podcastPlayer')) {
    new PodcastPlayer(document.getElementById('podcastPlayer'));
  }
  renderEpisodesGrid('#episodesGrid');
});
