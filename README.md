# Sketchbook

Generate mp4 for sketches

```
ffmpeg -framerate 2 -pattern_type glob -i './*.png' -c:v libx264 -r 30 -pix_fmt yuv420p -movflags +faststart -profile:v high -level 4.2 output.mp4
```

## Sacred Geometry

[Egg of life](./stories/sacred-geometry)
