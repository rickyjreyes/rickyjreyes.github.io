# RCA AI Validation — review draft (2026-10-10)

This branch proposes a new `/ai-validation/` public research presentation and a link under **Verify** in the shared navigation. It does not replace or mutate the existing `/priority/`, `/overlap/`, 242-entry ledger, 42-item author audit, or publication chronology.

## What is new

- Evidence-first presentation separating the 2025 RCA origin, subsequent external work, an author-run numerical reconstruction, and proposed prospective multi-system tests.
- Transparent incident calculation using METR Figure 10: 53 cumulative posting agents by three hours, and 76 by six hours. Model proxy `lambda=ln(N)/t`; assumed `mu=1/72 h^-1`; `R=mu/(lambda+mu)`. It is not an independently measured correction rate.
- Six linked research comparators (March–September 2026) with precise mechanism classes and explicit limits.
- Three validation proposals: unseen cascade forecasting, memory/anchor survival, and intervention efficacy.
- `evidence.json` records links, assumptions, calculation inputs and exact unrounded values.

## Review gates before promotion

1. Verify the original dated source and exact wording for `R_pred≈0.0100` in a truly pre-incident version; do not rely on a later retrospective publication.
2. Obtain external, operational estimates of correction rates; the 72-hour parameter is a simplifying assumption and is **not** reported as an independently observed rate.
3. Decide whether cumulative participants are an admissible growth state; compare against new participants per interval, message trajectories, saturation, and changing agent-launch rates.
4. Obtain explicit independent original-version claim comparisons for each highlighted paper.
5. Preregister a train/test split and compare frozen RCA-based predictors against conventional stability/cascade models. Report failures.
6. Replace the `noindex,nofollow` robots directive and review-draft wording if/when the page is approved for public indexing.

## Local QA completed

- New index file has complete HTML scaffold.
- All fragment links referring to local IDs resolve; no duplicate IDs identified.
- Companion JSON parses, holds all six comparator records and maintains the 242-entry baseline counts.
- Numerical check: (53,3 h) yields R=0.010385617357095051; (76,6 h) yields R=0.018879038196538512 under the same 72-hour assumption.

No new scientific validation or historical-priority promotion is asserted.
