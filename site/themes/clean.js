window.THEMES = window.THEMES || {};
window.THEMES.clean = {
  label: "Clean", css: "site/themes/clean.css",
  render: function (d, h) {
    var e = h.esc;
    var headline = e(d.headline).replace(/\bFIRMWARE\b/, "<strong><em>FIRMWARE</em></strong>");
    function tags(a) { return '<div class="tags">' + h.list(a).map(function(t){return '<span>'+e(t)+'</span>';}).join('')+'</div>'; }
    // Inline SVG keeps project links in the page's keyboard and navigation flow.
    function circuitNode(id, x, y, label, detail) {
      var project = h.list(d.projects).find(function (p) { return p.id === id; });
      if (!project) return "";
      return '<a class="diagram-link" href="#project-' + e(id) + '" aria-label="Explore ' + e(project.name) + '">' +
        '<rect x="' + x + '" y="' + y + '" width="260" height="95" rx="6"/>' +
        '<text class="node-label" x="' + (x + 130) + '" y="' + (y + 34) + '">' + e(label) + '</text>' +
        '<text class="node-detail" x="' + (x + 130) + '" y="' + (y + 56) + '">' + e(detail) + '</text>' +
        '<text class="node-action" x="' + (x + 130) + '" y="' + (y + 78) + '">EXPLORE ↓</text></a>';
    }
    var circuit = '<svg class="firmware-diagram" viewBox="0 0 1120 380" xmlns="http://www.w3.org/2000/svg" role="group" aria-labelledby="circuit-title circuit-desc">' +
      '<title id="circuit-title">Explore my projects through the circuit</title>' +
      '<desc id="circuit-desc">A circuit board with six project components connected from left to right. Select a component to reach its project. On smaller screens, scroll sideways to explore the board.</desc>' +
      '<defs><pattern id="project-grid" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.8" fill="var(--line)"/></pattern></defs>' +
      '<rect width="1120" height="380" fill="url(#project-grid)"/>' +
      '<g class="circuit-traces" aria-hidden="true">' +
      '<path d="M320 102h110 M690 102h110 M320 272h110 M690 272h110 M190 150v75 M930 150v75 M560 150v75"/>' +
      '<path class="secondary-trace" d="M320 84h34l18-18h40l18 18 M690 84h34l18-18h40l18 18 M320 290h34l18 18h40l18-18 M690 290h34l18 18h40l18-18 M170 150v24l-18 18v16l18 17 M580 150v24l18 18v16l-18 17 M950 150v24l18 18v16l-18 17 M60 78H30V28h1060v50h-30 M60 294H30v58h1060v-58h-30"/>' +
      '<path d="M320 122h16l8-8 8 16 8-16 8 16 8-8h54 M690 252h16l8-8 8 16 8-16 8 16 8-8h54"/>' +
      '<path class="chip-pins" d="M450 49V38m20 11V38m20 11V38m20 11V38m20 11V38m20 11V38m20 11V38m20 11V38m20 11V38m20 11V38m20 11V38m20 11V38 M450 156v11m20-11v11m20-11v11m20-11v11m20-11v11m20-11v11m20-11v11m20-11v11m20-11v11m20-11v11m20-11v11m20-11v11"/>' +
      '<circle cx="375" cy="102" r="3"/><circle cx="745" cy="102" r="3"/><circle cx="375" cy="272" r="3"/><circle cx="745" cy="272" r="3"/><circle cx="190" cy="187" r="3"/><circle cx="560" cy="187" r="3"/><circle cx="930" cy="187" r="3"/>' +
      '<path d="M365 96l8 6-8 6 M735 96l8 6-8 6 M365 266l8 6-8 6 M735 266l8 6-8 6"/>' +
      '</g><g class="board-labels" aria-hidden="true"><text x="62" y="22">U1 / COMPUTE</text><text x="432" y="22">U2 / FIRMWARE</text><text x="802" y="22">U3 / CONTROL</text><text x="62" y="211">U4 / SIGNALS</text><text x="432" y="211">U5 / TRANSFORM</text><text x="802" y="211">U6 / INTERFACE</text><text x="330" y="183">DATA →</text><text x="700" y="183">CLOCK →</text></g>' +
      circuitNode('lc3b-processor', 60, 55, 'LC-3b PROCESSOR', 'ASSEMBLER / PIPELINE') +
      circuitNode('rtos-kernel', 430, 55, 'RTOS / RACING ROBOT', 'C / ARM / CONTROL') +
      circuitNode('fpga-timer', 800, 55, 'FPGA TIMER', 'VERILOG / CONTROL') +
      circuitNode('fir-filter-bank', 60, 225, 'FIR FILTER BANK', 'MATLAB / MULTIRATE DSP') +
      circuitNode('audio-image-synthesis', 430, 225, 'AUDIO ↔ IMAGE', 'FFT / SIGNAL SYNTHESIS') +
      circuitNode('space-invaders', 800, 225, 'SPACE INVADERS', 'MCU / AUDIO / DISPLAY') + '</svg>';
    var projects = h.list(d.projects).map(function (p, i) {
      var photos = h.list(p.images).map(function (photo) {
        return '<figure><a href="' + h.url(photo.src) + '" aria-label="Open full-size image: ' + e(photo.alt) + '"><img src="' + h.url(photo.src) + '" alt="' + e(photo.alt) + '" loading="lazy" width="800" height="600"></a>' +
          (photo.caption ? '<figcaption>' + e(photo.caption) + '</figcaption>' : '') + '</figure>';
      }).join('');
      var gallery = photos ? '<div class="project-gallery">' + photos + '</div>' : '';
      var details = h.list(p.details).length ? '<ul class="project-details">' + p.details.map(function (detail) { return '<li>' + e(detail) + '</li>'; }).join('') + '</ul>' : '';
      return '<article class="project' + (photos ? ' project-with-photos' : '') + '" id="project-' + e(p.id) + '" tabindex="-1"><div class="project-top"><span class="number">0' + (i + 1) + '</span><span>' + e(p.category) + '</span></div><h3>' + e(p.name) + '</h3>' + gallery + '<p>' + e(p.summary) + '</p>' + details + '<p class="result">' + e(p.result) + '</p>' + tags(p.stack) + '<div class="project-bottom"><span>' + e(p.when) + '</span>' + (p.url ? '<a class="report-button" href="' + h.url(p.url) + '">Read team report <span aria-hidden="true">→</span></a>' : '') + '</div></article>';
    }).join('');
    var xp = h.list(d.experience).map(function (j) {
      var logo = j.logo ? '<img class="job-logo" src="' + h.url(j.logo) + '" alt="" width="64" height="64" loading="lazy">' : '';
      return '<article class="job"><div class="job-heading">' + logo + '<div><p class="eyebrow">' + e(j.dates) + '</p><h3>' + e(j.role) + '</h3><p class="organization">' + e(j.org) + '</p></div></div><div><p>' + e(j.summary) + '</p>' + tags(j.tags) + '</div></article>';
    }).join('');
    var skills=h.list(d.skills).map(function(s){return '<div class="skill-group"><h3>'+e(s.group)+'</h3>'+tags(s.items)+'</div>';}).join('');
    var links=h.list(d.links).map(function(l){return '<a class="button" href="'+h.url(l.url)+'"'+h.ext(l.url)+'>'+e(l.label)+' <span aria-hidden="true">→</span></a>';}).join('');
    return '<a class="skip" href="#main">Skip to content</a><div class="wrap"><header><a class="identity" href="#"><span class="monogram">OR<span>_</span></span><span>'+e(d.name)+'</span></a><nav aria-label="Main navigation"><a href="#work">Projects</a><a href="#experience">Experience</a><a href="#contact">Contact</a><a class="nav-resume" href="'+h.url(d.resume)+'">Resume →</a></nav></header>'+
    '<main id="main"><section class="hero"><div class="hero-copy"><p class="eyebrow"><span class="status-dot"></span> Electrical & Computer Engineering / UT Austin</p><h1>'+headline+'</h1>'+(d.tagline ? '<p class="hero-tagline">'+e(d.tagline)+'</p>' : '')+'<p class="intro">'+e(d.about)+'</p><div class="hero-actions"><a class="button primary" href="#work">Explore my work <span aria-hidden="true">↓</span></a><a class="text-link" href="'+h.url(d.resume)+'">View resume →</a></div><p class="hero-note">Austin, TX <span> / </span> Graduating May 2027</p></div>'+
    '<aside class="system" aria-label="Interactive project circuit"><div class="system-bar"><span>OSCAR / PROJECT CIRCUIT</span><span class="status-dot"></span></div><div class="circuit-viewport" tabindex="0" role="region" aria-label="Project circuit; scroll horizontally on small screens">'+circuit+'</div><div class="system-footer"><span>SELECT A COMPONENT TO EXPLORE <span class="circuit-scroll-hint"> / SWIPE →</span></span><span>06 PROJECTS</span></div></aside></section>'+
    '<div class="highlights" aria-label="Experience highlights"><div><strong>30+</strong><span>security triages performed</span></div><div><strong>75+</strong><span>students tutored in computing</span></div><div><strong>HW ↔ SW</strong><span>architecture to implementation</span></div></div>'+
    '<section id="work"><div class="section-heading"><div><p class="eyebrow">01 / Selected projects</p><h2>Ideas, implemented.</h2></div><p>Real-time kernels, processor pipelines,<br>and signals made tangible.</p></div><div class="projects">'+projects+'</div></section>'+
    '<section id="experience"><div class="section-heading"><div><p class="eyebrow">02 / Experience</p><h2>Technical work. Human impact.</h2></div></div><div class="experience">'+xp+'</div></section>'+
    '<section id="toolkit"><div class="section-heading"><div><p class="eyebrow">03 / Toolkit</p><h2>What I work with.</h2></div></div><div class="skill-grid">'+skills+'</div></section>'+
    '<section class="education"><div><p class="eyebrow">Education & community</p><h2>The University of Texas at Austin</h2><p>B.S. Electrical & Computer Engineering · May 2027<br>Track: Computer Architecture and Embedded Systems</p><p>Active member of UT SHPE and IEEE since August 2023.<br>English & Spanish · Eligible to work in the U.S. without restrictions.</p></div><div><h3>Recognition</h3><ul>'+h.list(d.awards).map(function(a){return '<li>'+e(a)+'</li>';}).join('')+'</ul></div></section>'+
    '<section id="contact" class="contact"><p class="eyebrow">04 / Get in touch</p><h2>Let’s build what’s next.</h2><p>I’m pursuing a career writing firmware. If your team builds embedded software, microcontroller applications, or real-time systems, I’d love to connect.</p><a class="contact-email" href="mailto:'+e(d.email)+'">'+e(d.email)+' <span aria-hidden="true">→</span></a><div class="contact-links">'+links+'<a class="button" href="'+h.url(d.resume)+'">View resume →</a></div></section></main><footer><span>© '+new Date().getFullYear()+' '+e(d.name)+'</span><a href="#">Back to top ↑</a></footer></div>';
  }
};
