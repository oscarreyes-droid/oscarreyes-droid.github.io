# Oscar Reyes | Firmware & Embedded Systems

**Bringing systems to life with _FIRMWARE_.**

I'm an Electrical and Computer Engineering student at The University of Texas at Austin, graduating May 2027. My interests center on firmware, real-time systems, and computer architecture.

**[Explore my portfolio →](https://oscarreyes-droid.github.io/)**

[Resume](resume.pdf) · [LinkedIn](https://www.linkedin.com/in/oscarreyes19/) · [Email](mailto:oscarreyes@utexas.edu)

## Featured projects

| Project | Focus |
| --- | --- |
| [RTOS Kernel & Autonomous Racing Robot](https://oscarreyes-droid.github.io/#project-rtos-kernel) | Real-time scheduling, synchronization, and microcontroller integration for autonomous racing. |
| [LC-3b Processor & Simulator](https://oscarreyes-droid.github.io/#project-lc3b-processor) | Two-pass assembler, instruction-level simulation, microarchitecture, and a five-stage pipeline. |
| [Programmable Stopwatch & Timer](https://oscarreyes-droid.github.io/#project-fpga-timer) | Verilog datapath and controller for a Basys3 FPGA, with an interactive 3D board demo. |
| [Space Invaders](https://oscarreyes-droid.github.io/#project-space-invaders) | Embedded game combining graphics, audio, and physical controls. |
| [Multirate FIR Filter Bank](https://oscarreyes-droid.github.io/#project-fir-filter-bank) | Audio subband analysis and reconstruction in MATLAB. |
| [Audio & Image Signal Processing](https://oscarreyes-droid.github.io/#project-audio-image-synthesis) | Signal synthesis and reconstruction, illustrated with report figures. |

The portfolio includes hardware photos, architecture diagrams, signal-processing plots, and selected project reports.

## Website

Built with HTML, CSS, and JavaScript and hosted on GitHub Pages. The interactive Basys3 demo uses Three.js, a CAD-based board model, and a browser simulation of the timer's Verilog logic. It runs entirely in the browser.

### Local preview

From the repository folder, run:

```sh
python3 -m http.server 8000
```

Open [localhost:8000](http://localhost:8000). No build step is required.

### Structure

- `content.js` — biography, experience, projects, and image captions.
- `site/themes/clean.js` and `clean.css` — active layout and styling.
- `site/demos/` — interactive Basys3 timer and simulation logic.
- `models/` — board model and related assets.
- `images/` and `documents/` — project visuals and selected reports.

After editing versioned website assets, run `python3 scripts/version-assets.py` to refresh their cache identifiers. Changes pushed to `main` deploy through GitHub Pages.

Adapted from the SHPE UT Austin portfolio workshop template.
