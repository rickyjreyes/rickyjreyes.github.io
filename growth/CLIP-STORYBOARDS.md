# Short video / image production storyboards
Native MP4s already exist at /assets/psi_ring.mp4 and /assets/self_emergent_cavity.mp4. This document prepares overlays and edit decisions. It does **not** claim freshly rendered exports or automated publication.

## Clip A: Can a wave organize itself? (10-15 s)
Source: assets/psi_ring.mp4
0-2s: Begin on strongest existing ring motion. Overlay “CAN A WAVE ORGANIZE ITSELF?”
2-7s: Continue original footage; no slow zoom required unless quality permits. Overlay “Numerical wave visualization”
7-11s: Overlay “What would make it stable?”
11-15s: End card “Watch, read, verify | rickyjreyes.github.io/discover/”
Sound-off captions always. Avoid implying a scientific observation.

## Clip B: A cavity without walls? (10-15 s)
Source: assets/self_emergent_cavity.mp4
0-3s: Start with visible cavity-like structure. Overlay “A CAVITY WITHOUT WALLS?”
3-8s: Use uncluttered motion, label “Computational model”
8-12s: Overlay “Energy minimizers can exist on unbounded ℝ² in a related mathematical model”
12-15s: CTA “Read the Lean-verified theorem | /discover/”
Do not call the video a simulation of the proved Hamiltonian unless independently confirmed.

## Clip C: From image to theorem (12-20 s)
Sources: psi_ring.mp4; a genuine screenshot of OrbitalStability.lean
0-5s: ring simulation; “What does stability actually mean?”
5-12s: code screenshot; highlight quantified stability theorem, not a random lemma
12-20s: “For a specified nonlinear PDE, solutions near the minimizing set remain near it for all time.” + exact repo link

## Clip D: Real apparatus, real controls (15-25 s)
Sources: laser_experiment.jpg and documented photodiode control figures
0-4s: actual laboratory image: “THIS IS AN EXPERIMENT.”
4-10s: baseline waveform and post waveform side by side, label conditions
10-18s: PSD plot or harmonic analysis with axes kept visible
18-25s: “Controls, spectra, and null tests in the public repository.”
Don't imply causation from harmonic peaks without exclusion of mains/pickup.

## Clip E: The gravitational-wave holdout (15-25 s)
Source: GWTC figures/publication/publication_evidence_summary.svg
0-4s: “Can a fixed residual pattern predict new catalog data?”
4-13s: frozen fit plus declared holdout statistic; distinguish training and test
13-20s: show V4 structured null summary and p-values
20-25s: “Candidate pattern. Source and null-model checks still matter.”
Do not use the historical 8.0522-sigma aggregate as calibrated discovery significance.

## Clip F: Wavelength selected by an equation (15-25 s)
Source: a plot reproduced from exact-positive-wavenumber-minimum paper, with real-pole domain labeled
0-5s: question “Why would a wave prefer one wavelength?”
5-14s: plot of lower real dispersion branch with q*>0 minimum marked
14-20s: “The uniqueness condition is formally proved in Lean 4.”
20-25s: source and Substack path
A minimizer of real oscillation frequency is not itself a nonlinear stability result.

## Production/export
- 1080x1920, 9:16, 24 or 30fps, H.264 + AAC (or muted), MP4; only if source quality permits
- Keep essential wave action away from top/bottom UI-safe areas, leave margins for captions
- Title overlay 6–10 words; readable in 2 seconds
- Export each clip in one question-led variant, one result-led variant
- For claims in source videos, supply a link to exact source in caption and first comment
- Respect reduced-motion users on web; do not autoplay sound
