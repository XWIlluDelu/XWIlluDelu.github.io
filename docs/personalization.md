# Personalization Changes

This repository is a fork of [L4Ph/huwari](https://github.com/L4Ph/huwari), with personalization commits based directly on upstream commit `89a27da`. It retains Huwari's Git history rather than importing a source snapshot.

The former repository and its Fuwari history are preserved in [XWIlluDelu.github.io-archive](https://github.com/XWIlluDelu/XWIlluDelu.github.io-archive).

## General Changes

These use Huwari's existing configuration and content interfaces without extending blog functionality.

| Change | Location |
| --- | --- |
| Site title and profile name: `虚妄IlluDelu`; subtitle: `My Blog` | `site.config.json` |
| Bio: `不实为虚，非分为妄。` | `site.config.json` |
| Personal GitHub, BiliBili, and Steam links | `profile.links` |
| Default avatar (1024×1024 PNG) | `profile.avatar`, `public/images/avatar.png` |
| Personal introduction and links on the About page | `src/content/about.md` |
| Matching light/dark pixel-art icons across all bundled sizes | `public/favicon/favicon-{light,dark}-{32,128,180,192}.png`; existing declarations unchanged |

## Special Changes

These extend configuration or components to support personalization. The added capabilities are optional and do not replace existing upstream functionality.

| Change | Configuration and implementation |
| --- | --- |
| External navigation links | Optional `navigation`; appends the personal GitHub link to desktop and mobile navigation while retaining Home/Archive/About |
| Profile link icons | Optional `profile.links[].icon`; adds BiliBili and Steam icons, retaining the upstream GitHub icon as the default |
| Seasonal banners, avatars, and hues | Optional `seasonalThemes`; `src/lib/seasons.ts` selects the season once at build time, and `site-theme.ts` resolves the banner, optional avatar, and hue for all components |
| Artwork credits | Optional `banner.credit`, rendered by `Banner.astro` |
| Hue adjustment | Optional `colorPicker`; `HuePicker.astro` keeps the selection in memory across client-side navigation and resets it on reload, without changing light/dark theme storage |
| Self-hosted fonts | `fonts: "noto"`; `NotoFonts.astro` and `public/fonts/` cover body text, controls, and code; upstream fonts remain in use when this option is omitted |
| Per-post authors | Optional frontmatter `author`; falls back to the profile owner when omitted and does not assign the owner's URL to other authors |
| Article attribution | Optional `postAttribution`, with optional `license`; `PostAttribution.astro` displays author and license information, using the same author data for JSON-LD |

### Seasonal Configuration

| Season | Months | Hue | Banner |
| --- | --- | --- | --- |
| Spring | March–May | 150 | `spring-banner.jpg` |
| Summer | June–August | 250 | `summer-banner.jpg` |
| Autumn | September–November | 290 | `autumn-banner.jpg` |
| Winter | December–February | 20 | `winter-banner.jpg` |

Banners retain Huwari's native centered positioning, height, and responsive layout. The former positioning logic is not carried over. Each season supports an optional `avatar`. The shared theme resolver uses `seasonalThemes[currentSeason].avatar` when configured, otherwise falling back to `profile.avatar`. All four seasons currently explicitly reference `/images/avatar.png`, so they look identical while retaining independent configuration. To change a season's avatar, update only that season's path; duplicating identical image files is unnecessary. This fallback handles omitted configuration, not image-loading failures. Season selection uses the build machine's date; changing seasons requires rebuilding the site.

## Boundaries

- Retain Huwari's default language, light/dark theme behavior, dependencies, and lockfile.
- Do not migrate the former RSS, canonical URL, component-fix, or type-annotation patches.
- Do not carry temporary migration tests, preview tools, or their history into this fork. Upstream tests remain unchanged.
- Keep deployment configuration separate from personalization.

## Semantic Commit Groups

- Configure site identity, the default avatar, and About content.
- Add external navigation links and profile icons.
- Add seasonal banners, avatars, hues, credits, and the hue picker, including mobile panel positioning.
- Add self-hosted Noto fonts, including type-safe handling of the optional configuration.
- Add per-post authors and article attribution.
- Configure GitHub Pages separately from personalization.

## Pixel-Art Icon Assets

All icon assets are regenerated from the current 1024×1024 `public/images/avatar.png`, using its complete square composition without a face crop and a palette limit of 12 colors. Icon regeneration is an explicit offline step, not an automatic effect of changing the avatar. Both browser color schemes use identical artwork. All eight bundled 32px, 128px, 180px, and 192px PNG assets are replaced, including sizes not currently referenced by the page. The existing 32px/192px declarations remain unchanged; no additional declarations or PWA configuration are introduced.

`scripts/pixel-art.py` is an offline asset-generation tool, not part of the site's runtime or deployment build. It combines edge-preserving filtering, perceptual Lab palette clustering, discrete region voting with controlled ink retention, and cleanup of isolated near-color pixels. It does not use dithering. The 32px icon is generated on its own grid with a less aggressive ink threshold to avoid merging small facial features. Larger assets use nearest-neighbor integer scaling: 128px comes from the 32px grid at 4×, 180px from an independently generated 36px grid at 5×, and 192px from the 48px master at 4×. This keeps every pixel block the same size within each asset, without inventing extra detail.

To regenerate the icons from the current avatar, install the optional Python dependencies in an isolated environment, then run from the repository root:

```sh
python -m pip install -r scripts/requirements-pixel-art.txt
python scripts/pixel-art.py public/images/avatar.png \
  --output .astro/pixel-icon/final \
  --sizes 32 36 48 --colors 12 \
  --small-ink-threshold 0.5 \
  --favicon-dir public/favicon
```

The explicit `--favicon-dir` option exports the production PNGs. Without it, the script only produces local candidates. Intermediate images, palette metadata, and the comparison sheet stay in the ignored `.astro/` directory.

## GitHub Pages

The public site is `https://xwilludelu.github.io/`. `astro.config.ts` uses this URL and the root base path `/`, since this is an account-level Pages repository rather than the upstream `/huwari` project site.

GitHub Pages uses the Actions build source and Huwari's existing `.github/workflows/deploy.yml`, triggered by pushes to `main` or manual dispatch. The workflow builds and uploads the Astro site, then deploys the Pages artifact. No custom domain or former server/OSS credentials are used.
