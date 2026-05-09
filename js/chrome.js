/* ==========================================================================
   Site Chrome — Universal Header & Footer
   Injects shared header and footer into every page
   ========================================================================== */

const HEADER_HTML = `
<header class="site-header">
  <div class="nav-container">
    <a href="index.html" class="brand" aria-label="Montana Wizard Podcast — Home">
      <img src="images/logo.png" alt="" class="brand-mark-img" aria-hidden="true">
      <span class="brand-text">
        Montana Wizard
        <small>Podcast · Est. 2025</small>
      </span>
    </a>

    <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>

    <ul class="nav-links" id="navLinks">
      <li><a href="index.html" data-page="index">Home</a></li>
      <li><a href="episodes.html" data-page="episodes">Episodes</a></li>
      <li><a href="about.html" data-page="about">About</a></li>
      <li><a href="affiliates.html" data-page="affiliates">Affiliates</a></li>
      <li><a href="contact.html" data-page="contact">Contact</a></li>
      <li><a href="https://www.youtube.com/@MontanaWizard" class="nav-cta" target="_blank" rel="noopener">Watch ▸</a></li>
    </ul>
  </div>
</header>
`;

const FOOTER_HTML = `
<footer class="site-footer">
  <div class="footer-container">
    <div class="footer-brand-col">
      <div class="footer-brand">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 20l5-9 4 6 4-12 5 15"/>
        </svg>
        Montana Wizard
      </div>
      <p class="footer-tagline">Tales, talk, and a little magic from Big Sky Country.</p>

      <div class="social-row" aria-label="Follow Montana Wizard on social media">
        <a href="https://www.youtube.com/@MontanaWizard" target="_blank" rel="noopener" class="social-link" aria-label="YouTube">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 7.4a3 3 0 0 0-2-2C19 5 12 5 12 5s-7 0-9 .4a3 3 0 0 0-2 2A31 31 0 0 0 .5 12 31 31 0 0 0 1 16.6a3 3 0 0 0 2 2C5 19 12 19 12 19s7 0 9-.4a3 3 0 0 0 2-2 31 31 0 0 0 .5-4.6 31 31 0 0 0-.5-4.6zM10 15.5v-7l6 3.5z"/></svg>
        </a>
        <a href="https://www.instagram.com/MontanaWizard" target="_blank" rel="noopener" class="social-link" aria-label="Instagram">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
        </a>
        <a href="https://www.facebook.com/MontanaWizard" target="_blank" rel="noopener" class="social-link" aria-label="Facebook">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z"/></svg>
        </a>
        <a href="https://x.com/MontanaWizard" target="_blank" rel="noopener" class="social-link" aria-label="X (Twitter)">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        <a href="https://www.tiktok.com/@MontanaWizard" target="_blank" rel="noopener" class="social-link" aria-label="TikTok">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.65a8.16 8.16 0 0 0 4.77 1.52V6.72a4.85 4.85 0 0 1-1.84-.03z"/></svg>
        </a>
        <a href="https://www.threads.net/@MontanaWizard" target="_blank" rel="noopener" class="social-link" aria-label="Threads">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.19 2C6.39 2 2 6.39 2 12.19v.02C2 17.81 6.49 22 12.18 22h.02c5.4 0 9.62-3.7 9.78-8.5.13-3.94-2.3-6.8-5.6-7.6-.55-3.06-2.97-4.6-6.05-4.6h-.04c-2.4 0-4.4 1.04-5.55 2.94l1.93 1.3c.78-1.27 2-1.93 3.62-1.94h.03c1.78 0 3.07.7 3.62 2.13-.7-.1-1.43-.16-2.18-.16-3.4 0-5.66 1.66-5.66 4.18 0 2.34 1.95 3.92 4.55 3.92 3.13 0 5.13-1.74 5.46-4.85 1.4.66 2.42 2.04 2.34 4.13-.1 2.93-2.85 5.4-6.83 5.4h-.02C7.45 19.99 4 16.6 4 12.2v-.02C4 7.7 7.7 4 12.18 4h.01zm.42 8.96c.6 0 1.18.04 1.74.13-.16 1.95-1.16 2.95-3.04 2.95-1.4 0-2.36-.7-2.36-1.7 0-.94.96-1.38 3.66-1.38z"/></svg>
        </a>
      </div>
    </div>

    <div class="footer-col">
      <h4>Explore</h4>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="episodes.html">Episodes</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="affiliates.html">Affiliates</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h4>Listen</h4>
      <ul>
        <li><a href="https://podcasts.apple.com/us/podcast/montana-wizard-podcast/id1858617765" target="_blank" rel="noopener">Apple Podcasts</a></li>
        <li><a href="https://www.youtube.com/@MontanaWizard" target="_blank" rel="noopener">YouTube</a></li>
        <li><a href="episodes.html">All Episodes</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h4>Connect</h4>
      <ul>
        <li><a href="mailto:contact@montanawizard.com">contact@montanawizard.com</a></li>
        <li><a href="https://www.montanawizard.com" target="_blank" rel="noopener">Montana Wizard</a></li>
      </ul>
    </div>
  </div>

  <div class="footer-bottom">
    <span>© <span id="currentYear"></span> Montana Wizard Podcast · All Rights Reserved</span>
    <span>Recorded under the Big Sky · <a href="https://www.youtube.com/@MontanaWizard" target="_blank" rel="noopener">@MontanaWizard</a></span>
  </div>
</footer>
`;

function initChrome() {
  // Inject header
  const headerSlot = document.getElementById('site-header');
  if (headerSlot) headerSlot.innerHTML = HEADER_HTML;

  // Inject footer
  const footerSlot = document.getElementById('site-footer');
  if (footerSlot) footerSlot.innerHTML = FOOTER_HTML;

  // Set current year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mark active nav link based on body data-page or filename
  const currentPage = document.body.dataset.page ||
    (window.location.pathname.split('/').pop().replace('.html', '') || 'index');

  document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
    if (link.dataset.page === currentPage) link.classList.add('active');
  });

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
    // Close on link click (mobile)
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      });
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChrome);
} else {
  initChrome();
}
