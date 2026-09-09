#!/usr/bin/env python3
"""Palette- and cluster-aware pixel-art study, not a resize filter.

Dependencies (install in an isolated environment):
    python -m pip install -r scripts/requirements-pixel-art.txt

Example:
    python scripts/pixel-art.py public/images/avatar.png \
        --output .astro/pixel-icon --sizes 32 48 64 --colors 12 20

Outputs are experiments unless --favicon-dir is explicitly supplied. Exporting
favicons requires a single palette limit and 32, 36, and 48 in --sizes. The 32px
art is generated independently; larger icons use integer nearest-neighbor scaling
(128 = 32 x 4, 180 = 36 x 5, 192 = 48 x 4). Light/dark assets are identical. See docs/personalization.md for the recipe.

Each native-resolution PNG is indexed to a bounded palette; its enlarged preview
uses nearest-neighbor scaling. Automatic conversion cannot replace an artist's
manual pixel placement.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageOps


FAVICON_GRIDS = {32: 32, 128: 32, 180: 36, 192: 48}


def load_image(path: Path, crop: list[float] | None) -> Image.Image:
    image = ImageOps.exif_transpose(Image.open(path)).convert("RGBA")
    background = Image.new("RGBA", image.size, "white")
    image = Image.alpha_composite(background, image).convert("RGB")
    if crop:
        left, top, right, bottom = crop
        if not (0 <= left < right <= 1 and 0 <= top < bottom <= 1):
            raise ValueError("Crop must satisfy 0 <= left < right <= 1 and 0 <= top < bottom <= 1")
        width, height = image.size
        image = image.crop((round(left * width), round(top * height),
                            round(right * width), round(bottom * height)))
    # A square icon needs an explicit composition. Default: centered square crop.
    side = min(image.size)
    left, top = (image.width - side) // 2, (image.height - side) // 2
    return image.crop((left, top, left + side, top + side))


def to_lab(rgb: np.ndarray) -> np.ndarray:
    return cv2.cvtColor(np.ascontiguousarray(rgb, dtype=np.float32) / 255, cv2.COLOR_RGB2LAB)


def prepare(image: Image.Image, maximum: int = 768) -> np.ndarray:
    # This only bounds working resolution. Final pixels come from discrete region
    # voting below, not from resampling this image down to the requested grid.
    image = image.copy()
    image.thumbnail((maximum, maximum), Image.Resampling.LANCZOS)
    rgb = np.asarray(image)
    # Remove painted micro-gradients/antialias noise while retaining strong edges.
    for _ in range(2):
        rgb = cv2.bilateralFilter(rgb, d=9, sigmaColor=35, sigmaSpace=5)
    return rgb


def make_palette(rgb: np.ndarray, colors: int) -> np.ndarray:
    lab = to_lab(rgb)
    flat = lab.reshape(-1, 3)
    rng = np.random.default_rng(7)
    sample = flat[rng.choice(len(flat), min(40000, len(flat)), replace=False)].copy()
    cv2.setRNGSeed(7)
    _, assignments, centers = cv2.kmeans(
        sample, colors, None,
        (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_MAX_ITER, 60, 0.15),
        3, cv2.KMEANS_PP_CENTERS,
    )
    # Use each region's median tone, not an antialiased average or a global
    # extreme. A tiny white eye highlight must not turn all cream skin white.
    assignments = assignments.ravel()
    for index in range(colors):
        members = sample[assignments == index]
        if len(members):
            centers[index] = np.median(members, axis=0)
    centers = centers[np.argsort(centers[:, 0])]
    palette = cv2.cvtColor(centers[None].astype(np.float32), cv2.COLOR_LAB2RGB)[0]
    return np.clip(np.rint(palette * 255), 0, 255).astype(np.uint8)


def assign_palette(rgb: np.ndarray, palette: np.ndarray) -> np.ndarray:
    lab, palette_lab = to_lab(rgb), to_lab(palette[None])[0]
    distances = np.full(lab.shape[:2], np.inf, dtype=np.float32)
    labels = np.zeros(lab.shape[:2], dtype=np.uint8)
    for index, color in enumerate(palette_lab):
        distance = np.sum((lab - color) ** 2, axis=2)
        closer = distance < distances
        labels[closer], distances[closer] = index, distance[closer]
    return labels


def pixel_grid(labels: np.ndarray, palette: np.ndarray, size: int, ink_threshold: float) -> np.ndarray:
    height, width = labels.shape
    xs, ys = np.linspace(0, width, size + 1, dtype=int), np.linspace(0, height, size + 1, dtype=int)
    luminance = to_lab(palette[None])[0, :, 0]
    dark = luminance < 24
    result = np.empty((size, size), dtype=np.uint8)
    for y in range(size):
        for x in range(size):
            block = labels[ys[y]:ys[y + 1], xs[x]:xs[x + 1]]
            counts = np.bincount(block.ravel(), minlength=len(palette))
            winner = int(counts.argmax())
            # Dominant region voting avoids inventing muddy blended colors at
            # boundaries. Ink gets a controlled occupancy threshold so narrow
            # high-contrast contours are not erased by the majority color.
            dark_counts = counts * dark
            if dark_counts.sum() / block.size >= ink_threshold and luminance[winner] > 45:
                winner = int(dark_counts.argmax())
            result[y, x] = winner
    return result


def clean_clusters(grid: np.ndarray, palette: np.ndarray) -> np.ndarray:
    """Merge isolated near-color noise; preserve high-contrast eyes/highlights."""
    result = grid.copy()
    lab = to_lab(palette[None])[0]
    height, width = grid.shape
    # Decisions use the original grid: no scan-direction-dependent cascade.
    for y in range(height):
        for x in range(width):
            color = int(grid[y, x])
            neighbors = [int(grid[ny, nx])
                         for ny in range(max(0, y - 1), min(height, y + 2))
                         for nx in range(max(0, x - 1), min(width, x + 2))
                         if (ny, nx) != (y, x)]
            if color in neighbors:
                continue
            counts = np.bincount(neighbors, minlength=len(palette))
            candidates = np.flatnonzero(counts >= 2)
            if not len(candidates):
                continue
            distances = np.linalg.norm(lab[candidates] - lab[color], axis=1)
            nearest = int(np.argmin(distances))
            if distances[nearest] < 22:
                result[y, x] = candidates[nearest]
    return result


def save_indexed(grid: np.ndarray, palette: np.ndarray, path: Path) -> Image.Image:
    image = Image.fromarray(grid).convert("P")
    image.putpalette(palette.ravel().tolist() + [0] * (768 - palette.size))
    image.save(path, optimize=True)
    return image.convert("RGB")


def comparison_sheet(source: Image.Image, variants: list[dict], path: Path) -> None:
    tile, header, footer, gap = 256, 32, 44, 16
    cards = [("Source composition", source, None)] + [
        (f"{v['size']} x {v['size']} / {v['colors']} color limit", v["image"], v["palette"])
        for v in variants
    ]
    columns = min(4, len(cards))
    rows = (len(cards) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * (tile + gap) + gap,
                              rows * (tile + header + footer + gap) + gap), "#20232b")
    draw = ImageDraw.Draw(sheet)
    for index, (title, image, palette) in enumerate(cards):
        x = gap + (index % columns) * (tile + gap)
        y = gap + (index // columns) * (tile + header + footer + gap)
        draw.text((x, y + 8), title, fill="white")
        # Integer scaling: every displayed art pixel has equal width/height.
        if palette is None:
            enlarged = image.resize((tile, tile), Image.Resampling.LANCZOS)
        else:
            scale = max(1, tile // image.width)
            enlarged = image.resize((image.width * scale, image.height * scale), Image.Resampling.NEAREST)
        sheet.paste(enlarged, (x + (tile - enlarged.width) // 2, y + header + (tile - enlarged.height) // 2))
        if palette is not None:
            for i, color in enumerate(palette):
                start, end = x + i * tile // len(palette), x + (i + 1) * tile // len(palette)
                draw.rectangle((start, y + header + tile + 8, end - 1, y + header + tile + 20), fill=tuple(color))
            used = len(image.getcolors(maxcolors=256) or [])
            draw.text((x, y + header + tile + 25), f"{used} colors used; no dithering", fill="#b6bdca")
    sheet.save(path)


def export_favicons(variants: list[dict], directory: Path) -> None:
    directory.mkdir(parents=True, exist_ok=True)
    by_size = {variant["size"]: variant["image"] for variant in variants}
    for size, grid in FAVICON_GRIDS.items():
        image = by_size[grid].resize((size, size), Image.Resampling.NEAREST)
        # Replace the complete upstream asset set, including undeclared sizes.
        for theme in ("light", "dark"):
            image.save(directory / f"favicon-{theme}-{size}.png", optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("source", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--sizes", nargs="+", type=int, default=[32, 48, 64])
    parser.add_argument("--colors", nargs="+", type=int, default=[12, 20])
    parser.add_argument("--crop", nargs=4, type=float, metavar=("LEFT", "TOP", "RIGHT", "BOTTOM"))
    parser.add_argument("--ink-threshold", type=float, default=0.32,
                        help="Cell fraction required to retain dark ink against a light region")
    parser.add_argument("--small-ink-threshold", type=float,
                        help="Override ink occupancy threshold for grids of 32px or smaller")
    parser.add_argument("--favicon-dir", type=Path,
                        help="Explicitly overwrite all eight upstream 32/128/180/192px favicon PNGs")
    args = parser.parse_args()
    if not all(8 <= size <= 256 for size in args.sizes):
        parser.error("Sizes must be between 8 and 256")
    if not all(4 <= colors <= 64 for colors in args.colors):
        parser.error("Palette limits must be between 4 and 64")
    if not 0 < args.ink_threshold <= 1:
        parser.error("Ink threshold must be greater than 0 and at most 1")
    if args.small_ink_threshold is not None and not 0 < args.small_ink_threshold <= 1:
        parser.error("Small-grid ink threshold must be greater than 0 and at most 1")
    if args.favicon_dir and (len(args.colors) != 1 or not set(FAVICON_GRIDS.values()).issubset(args.sizes)):
        parser.error("Favicon export requires a single color limit and 32, 36, and 48 in --sizes")
    source = load_image(args.source, args.crop)
    rgb = prepare(source)
    if max(args.sizes) > min(rgb.shape[:2]):
        parser.error("Source crop must be at least as large as the largest pixel grid")
    if max(args.colors) > len(np.unique(rgb.reshape(-1, 3), axis=0)):
        parser.error("Source has fewer unique colors than the requested palette")
    args.output.mkdir(parents=True, exist_ok=True)
    variants, manifest = [], []
    for colors in args.colors:
        palette = make_palette(rgb, colors)
        labels = assign_palette(rgb, palette)
        for size in args.sizes:
            threshold = (args.small_ink_threshold
                         if size <= 32 and args.small_ink_threshold is not None else args.ink_threshold)
            grid = clean_clusters(pixel_grid(labels, palette, size, threshold), palette)
            stem = f"avatar-{size}px-{colors}colors"
            image = save_indexed(grid, palette, args.output / f"{stem}.png")
            image.resize((size * 8, size * 8), Image.Resampling.NEAREST).save(args.output / f"{stem}-8x.png")
            variants.append(dict(size=size, colors=colors, image=image, palette=palette))
            manifest.append(dict(file=f"{stem}.png", size=size, color_limit=colors,
                                 ink_threshold=threshold, palette=["#%02x%02x%02x" % tuple(c) for c in palette]))
    comparison_sheet(source, variants, args.output / "comparison.png")
    (args.output / "palette.json").write_text(json.dumps({
        "source": str(args.source), "crop": args.crop,
        "ink_threshold": args.ink_threshold, "variants": manifest,
    }, indent=2) + "\n", encoding="utf-8")
    if args.favicon_dir:
        export_favicons(variants, args.favicon_dir)
        print(f"Exported matching light/dark 32/128/180/192px icons to {args.favicon_dir}")
    print(args.output / "comparison.png")


if __name__ == "__main__":
    main()
