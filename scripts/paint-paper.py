#!/usr/bin/env python3
"""Paints the page background into public/paint/paper-{light,dark}.webp.

One square tile of overlapping brush strokes, drawn on a torus so it repeats
without a seam, shaded from the upper left and baked into the page colour.
The colours are --background in src/styles/global.css, light and dark.
Drawn from a fixed seed. Needs numpy and Pillow.

  python3 scripts/paint-paper.py
"""
from pathlib import Path

import numpy as np
from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "public" / "paint"
SEED = 20261128
SIZE = 960
LIGHT, DARK = "#f3f0e7", "#131211"

def smooth1d(a, n):
    """Box-blur a periodic 1-D array n times."""
    for _ in range(n):
        a = (np.roll(a, 1) + a + np.roll(a, -1)) / 3
    return a


def blur(a, n=1):
    """Small periodic blur of a 2-D array."""
    for _ in range(n):
        a = (np.roll(a, 1, 0) + 2 * a + np.roll(a, -1, 0)) / 4
        a = (np.roll(a, 1, 1) + 2 * a + np.roll(a, -1, 1)) / 4
    return a


def smoothstep(x):
    x = np.clip(x, 0, 1)
    return x * x * (3 - 2 * x)


def stroke(rng, cx, cy, ang, length, width, curve):
    """One brush stroke in its own window: returns (ys, xs, height, cover).

    The paint is thick where the brush lands, runs thin and streaky toward the far end, and is pushed up into
    a ridge along both sides. Bristles leave furrows that run the length of the stroke."""
    r = int(length / 2 + width)
    ys = np.arange(-r, r + 1) + int(round(cy))
    xs = np.arange(-r, r + 1) + int(round(cx))
    dy, dx = np.meshgrid(ys - cy, xs - cx, indexing="ij")
    ca, sa = np.cos(ang), np.sin(ang)
    u = dx * ca + dy * sa
    v = -dx * sa + dy * ca - curve * u * u
    s = u / (length / 2)
    t = v / (width / 2)
    nb = max(8, int(width / 2.2))
    bristle = smooth1d(rng.normal(0, 1, nb), 1)
    bristle /= np.abs(bristle).max() + 1e-6
    ends = smooth1d(rng.uniform(0, 1, nb), 1)
    bi = np.clip(((t + 1) / 2 * (nb - 1)), 0, nb - 1)
    b0 = np.floor(bi).astype(int)
    b1 = np.minimum(b0 + 1, nb - 1)
    f = bi - b0
    br = bristle[b0] * (1 - f) + bristle[b1] * f
    en = ends[b0] * (1 - f) + ends[b1] * f
    run = (s + 1) / 2
    across = smoothstep((1 - np.abs(t)) / 0.16)
    start = smoothstep((s + 1 - 0.18 * t * t) / 0.10)
    end = smoothstep((1 - 0.42 * en - s) / 0.12)
    cover = across * start * end
    ridge = np.exp(-(((1 - np.abs(t)) / 0.2) ** 2))
    load = np.exp(-((run / 0.3) ** 2))
    height = 0.42 * br * (0.45 + 0.55 * run) + 0.55 * ridge + 0.5 * load
    return ys, xs, height, cover


def relief(height, light=(-0.62, -0.78), gain=1.0):
    """Shade a periodic height field from the upper left. 0 is flat."""
    h = blur(height, 1)
    gx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) / 2
    gy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) / 2
    return -(gx * light[0] + gy * light[1]) * gain


def impasto_height(rng, n=640, count=340, scale=1.0):
    """A field of overlapping strokes that follow a slowly turning direction, drawn on a torus so it tiles."""
    h = np.zeros((n, n))
    k = 2 * np.pi / n
    ph = rng.uniform(0, 2 * np.pi, 6)
    for _ in range(count):
        cx, cy = rng.uniform(0, n, 2)
        flow = (
            0.9 * np.sin(k * cx + ph[0]) * np.cos(k * cy + ph[1])
            + 0.7 * np.sin(2 * k * cy + ph[2])
            + 0.5 * np.cos(k * (cx + cy) + ph[3])
        )
        ang = -0.45 + 1.1 * flow + rng.normal(0, 0.45)
        length = rng.uniform(90, 230) * scale
        width = rng.uniform(26, 58) * scale
        curve = rng.normal(0, 0.0016) / scale
        ys, xs, sh, cover = stroke(rng, cx, cy, ang, length, width, curve)
        win = np.ix_(ys % n, xs % n)
        h[win] = h[win] * (1 - cover) + (sh + rng.uniform(-0.1, 0.1)) * cover
    return h


def rolled(a, amp):
    """Signed relief around zero, within -amp..amp, with the extremes rolled off."""
    a = a - a.mean()
    a = np.tanh(a / (2.2 * a.std())) * amp
    return a - a.mean()


def to_gray(a, amp):
    """Signed relief to an 8-bit tile whose mean is mid gray."""
    return np.clip(np.round(127.5 + 127.5 * rolled(a, amp)), 0, 255).astype(np.uint8)


def rgb(colour):
    return np.array([int(colour[i : i + 2], 16) for i in (1, 3, 5)]) / 255


def baked(a, amp, colour):
    """The relief laid over a flat colour the way soft-light would blend it, as an RGB tile whose mean is that colour."""
    cb = rgb(colour)[None, None, :]
    cs = (0.5 + 0.5 * rolled(a, amp))[..., None]
    d = np.where(cb <= 0.25, ((16 * cb - 12) * cb + 4) * cb, np.sqrt(cb))
    out = np.where(cs <= 0.5, cb - (1 - 2 * cs) * cb * (1 - cb), cb + (2 * cs - 1) * (d - cb))
    out += cb - out.mean(axis=(0, 1), keepdims=True)
    return Image.fromarray(np.clip(np.round(out * 255), 0, 255).astype(np.uint8), "RGB")


def main():
    rng = np.random.default_rng(SEED)
    shade = relief(impasto_height(rng, n=SIZE, count=760))
    baked(shade, 0.26, LIGHT).save(OUT / "paper-light.webp", quality=94, method=6)
    night = np.where(shade > 0, shade * 0.5, shade * 1.25)
    baked(night, 0.17, DARK).save(OUT / "paper-dark.webp", quality=94, method=6)


if __name__ == "__main__":
    main()
