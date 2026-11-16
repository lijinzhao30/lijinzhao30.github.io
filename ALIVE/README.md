# ALIVE project website

Static, dependency-free website for **ALIVE: Making Streaming Video Models Interactive**.

Public path: https://lijinzhao30.github.io/ALIVE/

This directory is deployed as `ALIVE/` in `lijinzhao30/lijinzhao30.github.io`. It does not replace the personal homepage or `IPIBench/`.

## Content and behavior

- The full 4:38 research demo is at the top, with clickable chapter navigation. Its web encode is 1600 × 900 H.264 with AAC audio, approximately 49 MB, and supports progressive playback.
- Paper, Model, and Dataset are intentionally disabled until their release URLs are available. Code links to https://github.com/lijinzhao30/ALIVE. Demo scrolls to the player. Model and Dataset use the Hugging Face organization icon.
- Three static capability cards use blue, purple, and orange. They have no selected state or illustrative animation panel.
- The five benchmark charts reproduce the approved demo's model order, metrics, values, icons, and colors. FSI-Bench shows EDP only. All charts use the same zero baseline and 0–80 scale, with an accessible numeric table and a replay button.
- `teaser`, `method`, and `dataset` figures come from the local `ALIVE_Arxiv/figs` PDFs. Figures open in a zoomable dialog with PDF access.
- The 16-author list includes Panwang Pan immediately after Honglei Yan, affiliated with ByteDance.
- The page has responsive layouts, keyboard-accessible controls, and reduced-motion support. It contains no analytics, external scripts, or runtime font downloads.

## Updating release links

Replace the corresponding disabled buttons in `index.html` with anchors when URLs are available. The paper button in the closing section should be updated at the same time. The original manuscript and `.bib` files are not part of this website and were not modified.

## Local preview

Serve this directory with a static server that supports HTTP Range requests, so video seeking works. Relative asset paths allow the same files to work at the GitHub Pages `/ALIVE/` path.

## Provenance and credits

Research content and figures: the author's ALIVE manuscript, inspected November 16, 2026. Chart values: its main benchmark comparisons and FSI-Bench EDP macro accuracy. This is a static snapshot of reported comparisons, not a live leaderboard.

Music: “Life of Riley” by Kevin MacLeod (incompetech.com), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Manrope: SIL Open Font License; see `assets/fonts/OFL.txt`.

Model icons: ALIVE supplied logo; [JoyAI-VL-Interaction](https://joyai-vl-video-future-academy-jd.github.io/JoyAI-VL-Interaction/); [AURA](https://aurateam2026.github.io/); [VideoChat3](https://mcg-nju.github.io/VideoChat3/). Hugging Face icon: [official GitHub organization](https://github.com/huggingface). Institutional logos were supplied by the authors.
