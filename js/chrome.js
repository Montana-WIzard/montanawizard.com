/* ==========================================================================
   Site Chrome — Universal Header & Footer
   Injects shared header and footer into every page
   ========================================================================== */

const HEADER_HTML = `
<header class="site-header">
  <div class="nav-container">
    <a href="index.html" class="brand" aria-label="Montana Wizard Podcast — Home">
      <span class="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 21l4-7 4 5 3-9 4 11h3"/>
          <circle cx="18" cy="5" r="2" fill="currentColor"/>
        </svg>
      </span>
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
        <li><a href="https://www.mountainwizardllc.com" target="_blank" rel="noopener">Mountain Wizard LLC</a></li>
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
