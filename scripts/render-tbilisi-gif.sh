#!/usr/bin/env bash
set -euo pipefail

background_image="assets/tbilisi-background-v2.png"
cat_sprite="assets/tbilisi-cat-sprite-v2.png"
output_dir=".tmp/tbilisi-gif-frames"
output_gif="assets/tbilisi-cat.gif"

rm -rf "$output_dir"
mkdir -p "$output_dir"

# Exact 8:2 (4:1) banner. The city plate never changes between frames.
magick "$background_image" -resize 1200x400^ -gravity center -crop 1200x300+0+18 +repage \
  "$output_dir/background.png"

# The supplied cat is a separate, completely static foreground sprite.
magick "$cat_sprite" -resize 145x167 "$output_dir/cat.png"

# A 64-frame seamless cycle with three rain depths. Each layer completes an
# integer number of vertical loops, so there is no visible jump at the seam.
for frame in $(seq 0 63); do
  far_rain=""
  middle_rain=""
  near_rain=""
  splashes=""

  # Fine, distant drizzle: short, dim strokes.
  for drop in $(seq 0 35); do
    rain_phase=$(((drop * 47 + frame * 6) % 384))
    rain_y=$((rain_phase - 64))
    rain_x=$(((drop * 83 - rain_phase / 10 + 2400) % 1200))
    far_rain+=" line ${rain_x},${rain_y} $((rain_x - 2)),$((rain_y + 7))"
  done

  # Mid-ground rain: faster and slightly longer.
  for drop in $(seq 0 23); do
    rain_phase=$(((drop * 71 + frame * 12) % 384))
    rain_y=$((rain_phase - 64))
    rain_x=$(((drop * 127 - rain_phase / 8 + 2400) % 1200))
    middle_rain+=" line ${rain_x},${rain_y} $((rain_x - 4)),$((rain_y + 15))"
  done

  # Rare foreground drops: bright, long and fast.
  for drop in $(seq 0 9); do
    rain_phase=$(((drop * 103 + frame * 24) % 384))
    rain_y=$((rain_phase - 64))
    rain_x=$(((drop * 211 - rain_phase / 6 + 2400) % 1200))
    near_rain+=" line ${rain_x},${rain_y} $((rain_x - 7)),$((rain_y + 29))"
  done

  # Small pixel splashes appear briefly on the foreground cobblestones.
  for splash in $(seq 0 9); do
    splash_age=$(((frame + splash * 11) % 32))
    if (( splash_age < 3 )); then
      splash_x=$((35 + splash * 113))
      splash_y=$((270 + (splash * 7) % 22))
      spread=$((2 + splash_age * 2))
      splashes+=" line $((splash_x - spread)),${splash_y} $((splash_x - 1)),$((splash_y - 2)) line $((splash_x + 1)),$((splash_y - 2)) $((splash_x + spread)),${splash_y} point ${splash_x},$((splash_y - 4 - splash_age))"
    fi
  done

  magick "$output_dir/background.png" \
    -fill 'rgba(0,0,0,0.30)' -stroke none -draw 'ellipse 600,290 55,6 0,360' \
    "$output_dir/cat.png" -geometry '+528+126' -compose over -composite \
    -stroke 'rgba(154,204,235,0.22)' -strokewidth 1 -draw "$far_rain" \
    -stroke 'rgba(174,218,246,0.38)' -strokewidth 1 -draw "$middle_rain" \
    -stroke 'rgba(201,232,250,0.58)' -strokewidth 2 -draw "$near_rain" \
    -stroke 'rgba(151,211,242,0.46)' -strokewidth 1 -draw "$splashes" \
    "$output_dir/frame-$(printf '%02d' "$frame").png"
done

magick -delay 6 -loop 0 "$output_dir"/frame-*.png -layers Optimize -colors 128 "$output_gif"
rm -rf "$output_dir"
