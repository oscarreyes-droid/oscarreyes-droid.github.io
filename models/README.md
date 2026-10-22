# Basys3 browser model

`basys3.glb` is converted from `Basys3.STEP` in the archive supplied by the site
owner, from this community CAD model:
https://grabcad.com/library/digilent-basys3-xilinx-artix-7-fpga-trainer-board-1

The STEP assembly supplies the actual geometry and component colors. OpenCascade
meshes it at a 0.12 mm linear deflection and 0.35 radian angular deflection. The
geometry is rotated to Y-up and scaled to 10 mm per browser scene unit. Faces are
merged by part/material and identical vertices are indexed to reduce draw calls;
no replacement board or connector shapes are generated. The source STEP file is
kept outside the public site.

`basys3-top.jpg` is the unchanged top photograph included in that same archive.
It is mapped onto the CAD's top PCB triangles for silkscreen and component
markings. The triangle mapping preserves the CAD's holes. Its board region in the
1282×804 source image is x=56, y=98, width=1175, height=690.

The model has 248 material/part meshes. Mesh extras identify 16 movable switch
caps, button caps for BTNU/BTNC, 28 digit segments, and the decimal points. The
source HDL determines their behavior. All original CAD parts are retained;
unwired controls remain decorative rather than gaining invented functionality.

## Reproduce conversion

Requires Python with OpenCascade (`OCP`, also distributed with CadQuery), Node.js,
and the vendored Three.js modules already in the repository:

```sh
python3 scripts/convert-basys3-step.py /path/to/Basys3.STEP
python3 scripts/version-assets.py
```

The part IDs and seven-segment-face mappings are specific to the supplied STEP
assembly. Conversion asserts that all 28 digit segments and 16 switch caps were
identified. Runtime validation repeats those checks before enabling CAD clicks.

Original STEP SHA-256:
649d1a5c03066b0497be98a9ff4545c69dfd61f5efe78f1b918cfb6407509137  Basys3.STEP
