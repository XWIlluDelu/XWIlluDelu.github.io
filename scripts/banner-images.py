# /// script
# requires-python = ">=3.10"
# dependencies = ["Pillow==12.3.0"]
# ///
"""Generate the selected 16:9 banners offline: uv run scripts/banner-images.py."""
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageCms

ROOT = Path(__file__).resolve().parent.parent
SOURCES = ROOT / "assets/banner-originals"
OUTPUT = ROOT / "public/images/banners"
WIDTHS = (640, 1280, 1920, 2560, 3840)
# Source coordinates AFTER rotation: left, top, right. Height follows from 16:9.
CROPS = {
    "spring": ("spring.png", None, (0, 37, 4144)),
    "summer": ("summer.jpg", None, (0, 2576, 4969)),
    "autumn": ("autumn.jpg", Image.Transpose.ROTATE_90, (0, 350, 4096)),
    # White frame outer edges: x=382 and x=4091. Trim 73px from the left
    # to leave 309px on both sides; the vertical crop removes horizontal lines.
    "winter": ("winter.jpg", Image.Transpose.ROTATE_270, (73, 430, 4400)),
}


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    srgb = ImageCms.createProfile("sRGB")
    for season, (filename, rotation, (left, top, right)) in CROPS.items():
        with Image.open(SOURCES / filename) as original:
            profile = original.info.get("icc_profile")
            image = (
                ImageCms.profileToProfile(
                    original, ImageCms.ImageCmsProfile(BytesIO(profile)), srgb,
                    outputMode="RGB",
                ) if profile else original.convert("RGB")
            )
        if rotation is not None:
            image = image.transpose(rotation)
        bottom = top + (right - left) * 9 / 16
        box = (left, top, right, bottom)
        if not (0 <= left < right <= image.width and 0 <= top < bottom <= image.height):
            raise ValueError(f"{season}: crop {box} exceeds source {image.size}")
        if right - left < max(WIDTHS):
            raise ValueError(f"{season}: source crop is too narrow for 3840px output")
        for width in WIDTHS:
            path = OUTPUT / f"{season}-{width}.webp"
            # Fractional bounds preserve the same X/Y scale factor.
            image.resize(
                (width, width * 9 // 16), Image.Resampling.LANCZOS, box=box,
            ).save(path, format="WEBP", quality=85, method=4)
            print(f"{path.relative_to(ROOT)}: {path.stat().st_size / 1000:.0f} kB")


if __name__ == "__main__":
    main()
