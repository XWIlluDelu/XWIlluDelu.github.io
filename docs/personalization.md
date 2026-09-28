# Personalization Guide

This blog forks [L4Ph/huwari](https://github.com/L4Ph/huwari) at commit `89a27da`, retaining its Git history. The former Fuwari-based site is preserved in [XWIlluDelu.github.io-archive](https://github.com/XWIlluDelu/XWIlluDelu.github.io-archive).

## Configuration

Edit [site.config.json](../site.config.json) for site identity, profile links and appearance; edit [About](../src/content/about.md) for the personal introduction. Images live in [public/images/](../public/images/).

The fork adds these optional settings, validated by [src/content.config.ts](../src/content.config.ts):

| Setting | Behavior |
| --- | --- |
| `navigation` | Append external links to the desktop and mobile navigation. Home, Archive and About remain available. |
| `profile.links[].icon` | Choose `github`, `bilibili` or `steam`; defaults to `github`. |
| `seasonalThemes` | Select a banner, hue and optional avatar at build time; see [Seasons and banners](#seasons-and-banners). |
| `banner.credit` | Display the artwork credit and source link on the banner. |
| `banner.position` | Set vertical image alignment as a percentage from `0` to `100`; defaults to `50`. |
| `banner.sources`, `banner.sizes` | Optional width-based image candidates (`src`, `width`) and the browser's source-size hint. Omission keeps a single-image banner. |
| `colorPicker` | Keep hue adjustments across client-side navigation; reload restores the built color. Light/dark preference is stored separately. |
| `fonts: "noto"` | Use the self-hosted Noto fonts in `public/fonts/` for text, controls and code. Omission uses upstream fonts. |
| Post frontmatter `author` | Use the named author, or the profile owner when omitted. Guest authors are listed by name; the owner's URL is attached only to the owner. |
| `postAttribution` | Display author information and matching JSON-LD; optional `license` adds a license link. The site currently uses CC BY-NC-SA 4.0. |

## Seasons and banners

[getSeason](../src/lib/seasons.ts) uses the build machine's date. [getSiteTheme](../src/lib/site-theme.ts) selects the season once at build time and supplies its banner, avatar and hue to the components. A new season takes effect when the site is rebuilt.

| Season | Months | Hue | Banner | Y position |
| --- | --- | --- | --- | --- |
| Spring | March–May | 150 | `banners/spring-*.webp` | 22% |
| Summer | June–August | 250 | `banners/summer-*.webp` | 72% |
| Autumn | September–November | 290 | `banners/autumn-*.webp` | 43% |
| Winter | December–February | 20 | `banners/winter-*.webp` | 34% |

Each seasonal `avatar` overrides `profile.avatar`. All four currently point to `/images/avatar.png`; replace that image for a shared avatar, or change a season's path for a distinct one. Omit a seasonal avatar to use the profile default.

Set `banner.position` on the default or seasonal banner: `0` aligns the top, `50` the center, and `100` the bottom; decimals are allowed. Horizontal alignment stays centered, and the setting applies at every screen size. When the image has no vertical overflow, changing Y has no visible effect.

The browser uses `banner.sources` and `banner.sizes` to choose an image for the screen size and pixel density. The banner loads eagerly with high priority. See [banner artwork](../assets/banner-originals/README.md) for file sources and generation instructions.

## Pixel-art icons

[scripts/pixel-art.py](../scripts/pixel-art.py) generates icons offline. The current recipe uses the full square avatar, a 12-color limit, region voting and no dithering. Light and dark variants share the same artwork. The 32px icon uses its own grid and ink threshold; larger icons use integer nearest-neighbor scaling: 128 = 32 × 4, 180 = 36 × 5, and 192 = 48 × 4.

After changing the avatar, regenerate the icons separately. From the repository root, with an isolated Python environment active:

```sh
python -m pip install -r scripts/requirements-pixel-art.txt
python scripts/pixel-art.py public/images/avatar.png \
  --output .astro/pixel-icon/final \
  --sizes 32 36 48 --colors 12 \
  --small-ink-threshold 0.5 \
  --favicon-dir public/favicon
```

`--favicon-dir` writes all eight light/dark 32px, 128px, 180px and 192px PNGs, including sizes retained from upstream but not currently declared by the page. Omit that option to generate candidates only. Previews, palette metadata and the comparison sheet stay in the ignored `.astro/` directory. Page declarations continue to use the 32px and 192px assets.

## GitHub Pages

GitHub Pages is currently unpublished and its deployment workflow is disabled. The configured site URL is `https://xwilludelu.github.io/`. [astro.config.ts](../astro.config.ts) sets that URL and the root base path `/`.

[deploy.yml](../.github/workflows/deploy.yml) builds and deploys through GitHub Actions on pushes to `main`, manual dispatch, and the first day of each month at 04:00 in `Asia/Shanghai` (`cron: "0 4 1 * *"` with `timezone: Asia/Shanghai`). The build also sets `TZ: Asia/Shanghai`, so season selection uses Shanghai time for every trigger.

For a missing seasonal update, check the Actions run and schedule status. GitHub can delay scheduled runs and [disables them after 60 days without repository activity](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule); re-enable the workflow if needed.

## Fork scope

Personalization retains the upstream language, light/dark behavior, dependencies, lockfile and tests. Former RSS, canonical URL, component-fix and type-annotation patches remain in the archived repository. One-off migration tests and preview tools stay outside this fork's history. Keep deployment changes separate from personalization.
