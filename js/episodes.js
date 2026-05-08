/* ==========================================================================
   Episode Data — Single source of truth
   ========================================================================== */

const EPISODES = [
  {
    num: '00',
    title: 'Intro — What is this Podcast',
    description: 'A first dispatch from the wizard\'s desk. What you can expect, who\'s behind the mic, and why we\'re telling these stories from the foothills.',
    youtubeId: '', // Replace with real YouTube IDs
    audioUrl: '',  // Optional: drop MP3s into /audio and reference here
    duration: '12:30',
    date: '2025-09-01'
  },
  {
    num: '01',
    title: 'The Wizard Arrives',
    description: 'The pilot episode. The origin story behind Montana Wizard, the gear, and the first real conversation under the Big Sky.',
    youtubeId: '',
    audioUrl: '',
    duration: '34:22',
    date: '2025-09-15'
  },
  {
    num: '02',
    title: 'Relaxing in Montana',
    description: 'On slowing down, the geography of rest, and what a Tuesday afternoon looks like when the mountains are doing the talking.',
    youtubeId: '',
    audioUrl: '',
    duration: '41:08',
    date: '2025-10-01'
  },
  {
    num: '03',
    title: 'Basketball Tournaments',
    description: 'Small-town gymnasiums, long bus rides, and the social fabric that gets stitched together every March in Montana.',
    youtubeId: '',
    audioUrl: '',
    duration: '38:45',
    date: '2025-10-20'
  },
  {
    num: '04',
    title: 'Montana Scam',
    description: 'A field guide to spotting the schemes that rolled into Big Sky Country — and the locals who saw them coming a mile off.',
    youtubeId: '',
    audioUrl: '',
    duration: '45:17',
    date: '2025-11-10'
  }
];

/* ==========================================================================
   Audio Player
   ========================================================================== */

class PodcastPlayer {
  constructor(rootEl) {
    this.root = rootEl;
    if (!this.root) return;

    this.currentIndex = 0;
    this.audio = new Audio();
    this.isPlaying = false;

    this.render();
    this.bindEvents();
    this.loadEpisode(0);
  }

  render() {
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
                <span class="episode-time">${ep.duration}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  bindEvents() {
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
      const dur = this.formatTime(this.audio.duration);
      document.getElementById('duration').textContent = dur;
    });
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

    if (ep.audioUrl) {
      this.audio.src = ep.audioUrl;
    } else {
      this.audio.src = '';
    }
  }

  togglePlay() {
    if (!this.audio.src) {
      // No audio file — direct viewer to YouTube
      const ep = EPISODES[this.currentIndex];
      alert(`Audio file not yet uploaded for "${ep.title}".\n\nDrop your MP3 into the /audio folder and update audioUrl in js/episodes.js.\n\nFor now, watch on YouTube: youtube.com/@MontanaWizard`);
      return;
    }
    this.isPlaying ? this.pause() : this.play();
  }

  play() {
    if (!this.audio.src) {
      this.togglePlay();
      return;
    }
    this.audio.play();
    this.isPlaying = true;
    document.getElementById('playIcon').innerHTML =
      '<path d="M6 5h4v14H6zm8 0h4v14h-4z"/>';
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
    document.getElementById('currentTime').textContent = this.formatTime(this.audio.currentTime);
  }

  formatTime(s) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }
}

/* ==========================================================================
   Episodes Grid Renderer
   ========================================================================== */

function renderEpisodesGrid(rootSelector) {
  const root = document.querySelector(rootSelector);
  if (!root) return;

  root.innerHTML = EPISODES.slice().reverse().map(ep => `
    <article class="episode-card">
      <div class="episode-card-media">
        ${ep.youtubeId
          ? `<iframe src="https://www.youtube.com/embed/${ep.youtubeId}" title="${ep.title}" allowfullscreen loading="lazy"></iframe>`
          : `<a href="https://www.youtube.com/@MontanaWizard" target="_blank" rel="noopener" style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;color:var(--color-amber);background:linear-gradient(135deg,var(--color-pine-deep),var(--color-pine));font-family:var(--font-display);font-size:1.4rem;text-align:center;padding:1rem;">▸ Watch on YouTube</a>`
        }
      </div>
      <div class="episode-card-body">
        <div class="episode-card-meta">Episode ${ep.num} · ${ep.duration}</div>
        <h3>${ep.title}</h3>
        <p>${ep.description}</p>
      </div>
    </article>
  `).join('');
}

/* ==========================================================================
   Init on DOM ready
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('podcastPlayer')) {
    new PodcastPlayer(document.getElementById('podcastPlayer'));
  }
  renderEpisodesGrid('#episodesGrid');
});
