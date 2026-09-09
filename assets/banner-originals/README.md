# Seasonal banner assets

Original images are stored in this directory and are not tracked by Git.

| File | Artist | Source and download |
| --- | --- | --- |
| `spring.png` | こむぎこ2000 | [Wallhaven](https://wallhaven.cc/w/p9x93m) · [Original](https://w.wallhaven.cc/full/p9/wallhaven-p9x93m.png) |
| `summer.jpg` | 萩森じあ | [Pixiv](https://www.pixiv.net/artworks/96670916) · [Original](https://i.pximg.net/img-original/img/2022/03/04/17/30/04/96670916_p0.jpg) |
| `autumn.jpg` | 荻pote | [X](https://x.com/ogipote/status/1819688411780763945) · [Original](https://pbs.twimg.com/media/GT-JNIQa0AA5ErX.jpg?name=orig) |
| `winter.jpg` | Crisalys | [Pixiv](https://www.pixiv.net/artworks/80152632) · [Original](https://i.pximg.net/img-original/img/2020/03/16/04/34/48/80152632_p0.jpg) |

Pixiv downloads require the header `Referer: https://www.pixiv.net/`. The [artist](https://x.com/ogipote) of `autumn.jpg` prohibits unauthorized reposting and editing.

## Generate banners

Run from the repository root:

```sh
uv run scripts/banner-images.py
```

The [script](../../scripts/banner-images.py) rotates `autumn.jpg` 90° counterclockwise and `winter.jpg` 90° clockwise, then crops all images to 16:9 using the positions in `CROPS`.

It generates WebP files at quality 85 in widths of 640 / 1280 / 1920 / 2560 / 3840px. Output files in `public/images/banners/` are tracked by Git.
