window.THEMES = window.THEMES || {};
window.THEMES.clean = {
  label: "Clean", css: "site/themes/clean.css",
  render: function (d, h) {
    var e = h.esc;
    var headline = e(d.headline).replace(/(\S+)$/, "<span>$1</span>");
    function tags(a) { return '<div class="tags">' + h.list(a).map(function(t){return '<span>'+e(t)+'</span>';}).join('')+'</div>'; }
    // Inline SVG keeps project links in the page's keyboard and navigation flow.
    function circuitNode(id, x, y, label, detail) {
      var project = h.list(d.projects).find(function (p) { return p.id === id; });
      if (!project) return "";
      return '<a class="diagram-link" href="#project-' + e(id) + '" aria-label="Explore ' + e(project.name) + '">' +
        '<rect x="' + x + '" y="' + y + '" width="180" height="76" rx="6"/>' +
        '<text class="node-label" x="' + (x + 90) + '" y="' + (y + 29) + '">' + e(label) + '</text>' +
        '<text class="node-detail" x="' + (x + 90) + '" y="' + (y + 49) + '">' + e(detail) + '</text>' +
        '<text class="node-action" x="' + (x + 90) + '" y="' + (y + 65) + '">EXPLORE ↓</text></a>';
    }
    var circuit = '<svg class="firmware-diagram" viewBox="0 0 460 490" xmlns="http://www.w3.org/2000/svg" role="group" aria-labelledby="circuit-title circuit-desc">' +
      '<title id="circuit-title">Explore my projects through the circuit</title>' +
      '<desc id="circuit-desc">Six connected components link to the corresponding project below. Use Tab and Enter, or select a component.</desc>' +
      '<defs><pattern id="project-grid" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.8" fill="#344037"/></pattern></defs>' +
      '<rect width="460" height="490" fill="url(#project-grid)"/>' +
      '<g class="circuit-traces"><path d="M120 114v22h110v28 M340 114v22H230 M230 240v23H120v25 M230 263h110v25 M120 364v18h110v16 M340 364v18H230"/>' +
      '<circle cx="230" cy="136" r="3"/><circle cx="230" cy="263" r="3"/><circle cx="230" cy="382" r="3"/>' +
      '<path class="chip-pins" d="M156 158v-9m16 9v-9m16 9v-9m16 9v-9m16 9v-9m16 9v-9m16 9v-9m16 9v-9m16 9v-9m16 9v-9 M156 246v9m16-9v9m16-9v9m16-9v9m16-9v9m16-9v9m16-9v9m16-9v9m16-9v9m16-9v9"/></g>' +
      circuitNode('lc3b-processor', 30, 38, 'LC-3b PROCESSOR', 'ASSEMBLER / PIPELINE') +
      circuitNode('fpga-timer', 250, 38, 'FPGA TIMER', 'VERILOG / CONTROL') +
      circuitNode('rtos-kernel', 140, 164, 'RTOS KERNEL', 'C / ARM / SCHEDULING') +
      circuitNode('fir-filter-bank', 30, 288, 'FIR FILTER BANK', 'MATLAB / MULTIRATE DSP') +
      circuitNode('space-invaders', 250, 288, 'SPACE INVADERS', 'MCU / AUDIO / DISPLAY') +
      circuitNode('audio-image-synthesis', 140, 398, 'AUDIO ↔ IMAGE', 'FFT / SIGNAL SYNTHESIS') + '</svg>';
    var projects = h.list(d.projects).map(function(p,i){
      return '<article class="project" id="project-'+e(p.id)+'" tabindex="-1"><div class="project-top"><span class="number">0'+(i+1)+'</span><span>'+e(p.category)+'</span></div><h3>'+e(p.name)+'</h3><p>'+e(p.summary)+'</p><p class="result">'+e(p.result)+'</p>'+tags(p.stack)+'<div class="project-bottom"><span>'+e(p.when)+'</span>'+(p.url?'<a href="'+h.url(p.url)+'">Read team report <span aria-hidden="true">→</span></a>':'')+'</div></article>';
    }).join('');
    var xp=h.list(d.experience).map(function(j){return '<article class="job"><div><p class="eyebrow">'+e(j.dates)+'</p><h3>'+e(j.role)+'</h3><p class="organization">'+e(j.org)+'</p></div><div><p>'+e(j.summary)+'</p>'+tags(j.tags)+'</div></article>';}).join('');
    var skills=h.list(d.skills).map(function(s){return '<div class="skill-group"><h3>'+e(s.group)+'</h3>'+tags(s.items)+'</div>';}).join('');
    var links=h.list(d.links).map(function(l){return '<a class="button" href="'+h.url(l.url)+'"'+h.ext(l.url)+'>'+e(l.label)+' <span aria-hidden="true">→</span></a>';}).join('');
    return '<a class="skip" href="#main">Skip to content</a><div class="wrap"><header><a class="identity" href="#"><span class="monogram">OR<span>_</span></span><span>'+e(d.name)+'</span></a><nav aria-label="Main navigation"><a href="#work">Projects</a><a href="#experience">Experience</a><a href="#contact">Contact</a><a class="nav-resume" href="'+h.url(d.resume)+'">Resume →</a></nav></header>'+
    '<main id="main"><section class="hero"><div class="hero-copy"><p class="eyebrow"><span class="status-dot"></span> Electrical & Computer Engineering / UT Austin</p><h1>'+headline+'</h1><p class="hero-tagline">'+e(d.tagline)+'</p><p class="intro">'+e(d.about)+'</p><div class="hero-actions"><a class="button primary" href="#work">Explore my work <span aria-hidden="true">↓</span></a><a class="text-link" href="'+h.url(d.resume)+'">View resume →</a></div><p class="hero-note">Austin, TX <span> / </span> Graduating May 2027</p></div>'+
    '<aside class="system" aria-label="Interactive project circuit"><div class="system-bar"><span>OSCAR / PROJECT CIRCUIT</span><span class="status-dot"></span></div>'+circuit+'<div class="system-footer"><span>SELECT A COMPONENT TO EXPLORE</span><span>06 PROJECTS</span></div></aside></section>'+
    '<div class="highlights" aria-label="Experience highlights"><div><strong>30+</strong><span>security triages performed</span></div><div><strong>75+</strong><span>students tutored in computing</span></div><div><strong>HW ↔ SW</strong><span>architecture to implementation</span></div></div>'+
    '<section id="work"><div class="section-heading"><div><p class="eyebrow">01 / Selected projects</p><h2>Ideas, implemented.</h2></div><p>Real-time kernels, processor pipelines,<br>and signals made tangible.</p></div><div class="projects">'+projects+'</div></section>'+
    '<section id="experience"><div class="section-heading"><div><p class="eyebrow">02 / Experience</p><h2>Technical work. Human impact.</h2></div></div><div class="experience">'+xp+'</div></section>'+
    '<section id="toolkit"><div class="section-heading"><div><p class="eyebrow">03 / Toolkit</p><h2>What I work with.</h2></div></div><div class="skill-grid">'+skills+'</div></section>'+
    '<section class="education"><div><p class="eyebrow">Education & community</p><h2>The University of Texas at Austin</h2><p>B.S. Electrical & Computer Engineering · May 2027<br>Track: Computer Architecture and Embedded Systems</p><p>Active member of UT SHPE and IEEE since August 2023.<br>English & Spanish · Eligible to work in the U.S. without restrictions.</p></div><div><h3>Recognition</h3><ul>'+h.list(d.awards).map(function(a){return '<li>'+e(a)+'</li>';}).join('')+'</ul></div></section>'+
    '<section id="contact" class="contact"><p class="eyebrow">04 / Get in touch</p><h2>Let’s build what’s next.</h2><p>I’m pursuing a career writing firmware. If your team builds embedded software, microcontroller applications, or real-time systems, I’d love to connect.</p><a class="contact-email" href="mailto:'+e(d.email)+'">'+e(d.email)+' <span aria-hidden="true">→</span></a><div class="contact-links">'+links+'<a class="button" href="'+h.url(d.resume)+'">View resume →</a></div></section></main><footer><span>© '+new Date().getFullYear()+' '+e(d.name)+'</span><a href="#">Back to top ↑</a></footer></div>';
  }
};
