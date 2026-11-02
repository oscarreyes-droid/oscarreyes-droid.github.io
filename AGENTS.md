# Portfolio development guide

## Project

Oscar Reyes's static portfolio, published at https://oscarreyes-droid.github.io/.
There is no package installation or build step. Preview with
`python3 -m http.server 8000`.

## Design and content

- Preserve the black and light-blue theme and firmware focus.
- The headline is “Bringing circuits to life with FIRMWARE”; FIRMWARE is bold,
  italic, and uppercase in the rendered headline.
- The circuit diagram links to the project cards.
- Keep project visuals uncropped and accessible, with descriptive alt text.
- The LC-3b architecture diagram is `architecture.jpg`; the Space Invaders
  hardware photo is `IMG_2191.jpg`.
- The robot uses IR and TF-Luna sensors. Its Lab 7 report is not for publication.
- Use source documentation to support technical descriptions; ask when details
  are missing.

## Implementation

- `content.js` holds the portfolio data.
- `site/themes/clean.js` and `site/themes/clean.css` are the active theme.
- `site/demos/README.md` documents the Basys3 timer and its Verilog behavior.
- The board uses locally hosted Three.js and a CAD-based model. Preserve its
  working controls, rotation, and native-input fallback.
- Run `python3 scripts/version-assets.py` after changing versioned assets.
- For layout changes, check desktop and mobile for overflow and image loading.
- For timer behavior changes, run `node --test tests/basys-timer.test.cjs`;
  see the test's environment variables for optional original-Verilog comparison.

## Collaboration

- Keep commit messages factual and focused on technical changes.
- Preserve unrelated work. Do not rewrite history without explicit approval.
- Follow the current user's instructions about committing and publishing.
- A push is not proof of deployment: verify the corresponding GitHub Pages run
  succeeds before reporting deployment success.
