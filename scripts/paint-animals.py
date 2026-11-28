#!/usr/bin/env python3
"""Paints the animals that wander through the meadow into
public/paint/animals-{light,dark}.webp.

Each animal is first blocked in as flat shapes, then painted over with short
thick brush strokes that take their colour from the shape under them, and
lit from the upper left like the rest of the page. One row of cells, every
animal facing right with its feet on the bottom of its cell.

Drawn from a fixed seed. Needs numpy and Pillow.

  python3 scripts/paint-animals.py
"""
import importlib.util
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "public" / "paint"
spec = importlib.util.spec_from_file_location("paper", HERE / "paint-paper.py")
paper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(paper)

W, H = 320, 220
SEED = 20261128


def sheep(d):
    wool, shade, dark = "#efe6d3", "#d3c6ab", "#3b332d"
    for x in (104, 128, 196, 220):
        d.rectangle([x, 140, x + 12, 212], fill=dark)
    d.ellipse([62, 62, 252, 168], fill=wool)
    d.ellipse([70, 112, 244, 170], fill=shade)
    d.ellipse([78, 58, 236, 150], fill=wool)
    d.ellipse([48, 84, 84, 120], fill=wool)
    d.ellipse([232, 70, 290, 126], fill=dark)
    d.ellipse([222, 62, 250, 84], fill=dark)
    d.ellipse([226, 52, 270, 86], fill=wool)


def cow(d):
    hide, shade, patch, dark, pink = "#eee7da", "#d2c8b6", "#7b4a2d", "#3a2a20", "#d9a79a"
    for x in (66, 96, 204, 232):
        d.rectangle([x, 132, x + 15, 204], fill=hide)
        d.rectangle([x, 200, x + 15, 212], fill=dark)
    d.line([52, 78, 40, 150], fill=hide, width=6)
    d.ellipse([33, 144, 47, 166], fill=dark)
    d.rounded_rectangle([46, 62, 256, 152], radius=38, fill=hide)
    d.ellipse([60, 118, 246, 156], fill=shade)
    d.ellipse([150, 138, 190, 164], fill=pink)
    d.ellipse([70, 58, 150, 122], fill=patch)
    d.ellipse([168, 80, 226, 140], fill=patch)
    d.ellipse([120, 100, 160, 132], fill=patch)
    d.rounded_rectangle([238, 40, 300, 104], radius=20, fill=patch)
    d.ellipse([268, 74, 310, 112], fill=hide)
    d.ellipse([226, 34, 250, 52], fill=patch)
    d.polygon([(256, 42), (262, 22), (270, 42)], fill="#e8dcc0")


def paint(rng, block):
    """Lay strokes over the blocked-in shapes; returns colour, alpha."""
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    block(ImageDraw.Draw(img))
    target = np.asarray(img).astype(float) / 255
    inside = target[..., 3] > 0.5
    pts = np.argwhere(inside)
    colour = np.zeros((H, W, 3))
    alpha = np.zeros((H, W))
    height = np.zeros((H, W))
    for count, (l0, l1), (w0, w1) in ((420, (26, 44), (12, 19)), (1500, (9, 18), (5, 9))):
        for _ in range(count):
            cy, cx = pts[rng.integers(len(pts))]
            c = target[cy, cx, :3] * rng.uniform(0.9, 1.08) + rng.normal(0, 0.012, 3)
            ang = rng.normal(0.2, 0.55)
            ys, xs, sh, cover = paper.stroke(
                rng, cx, cy, ang, rng.uniform(l0, l1), rng.uniform(w0, w1), rng.normal(0, 0.004)
            )
            ky, kx = (ys >= 0) & (ys < H), (xs >= 0) & (xs < W)
            win = np.ix_(ys[ky], xs[kx])
            cover = cover[np.ix_(ky, kx)]
            sh = sh[np.ix_(ky, kx)]
            colour[win] = colour[win] * (1 - cover[..., None]) + c * cover[..., None]
            height[win] = height[win] * (1 - cover) + (sh + rng.uniform(-0.1, 0.1)) * cover
            alpha[win] = np.maximum(alpha[win], cover)
    # Keep the paint close to the shape, so legs and heads stay readable
    near = np.asarray(img.getchannel("A").filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.GaussianBlur(1.5))) / 255
    alpha = np.clip(alpha * near, 0, 1)
    shade = paper.relief(height)
    shade = np.tanh(shade / (2.2 * shade.std())) * 0.3
    lit = np.clip(colour * (1 + shade[..., None]) + np.maximum(shade, 0)[..., None] * 0.12, 0, 1)
    return lit, alpha


def main():
    rng = np.random.default_rng(SEED)
    cells = [paint(rng, block) for block in (sheep, cow)]
    rgb = np.concatenate([c for c, _ in cells], axis=1)
    a = np.concatenate([a for _, a in cells], axis=1)
    for name, tint in (("light", None), ("dark", np.array([0.5, 0.52, 0.66]))):
        out = rgb if tint is None else rgb * tint
        sheet = np.dstack([out, a])
        Image.fromarray(np.round(sheet * 255).astype(np.uint8), "RGBA").save(
            OUT / f"animals-{name}.webp", quality=92, method=6
        )


if __name__ == "__main__":
    main()
