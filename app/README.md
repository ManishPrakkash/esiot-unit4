# ESIOT Unit III: Teaching Deck

65-slide interactive deck for **Unit III: IoT Architecture & Embedded Hardware**, built for a smartboard. Works fully offline (fonts and icons are bundled).

## Run
- Double-click `start.bat`. It builds on first run and opens http://localhost:4173.
- Or: `npm install && npm run build && npm run preview`. Dev mode: `npm run dev`.

## Controls
- **One click per slide**: → / Space / PgDn goes to the next slide, ← / PgUp goes back. Everything on a slide animates in by itself.
- **G** topic menu · **F** fullscreen · **Home / End** first / last. On a touchscreen, swipe left/right on empty areas (not on a demo).

## Interactive demos (all by direct manipulation)
- PWM: drag the falling edge of the wave. IR sensor: drag the object toward the sensor.
- Potentiometer: grab the knob and turn it.
- Servo: turn the knob (or drag the yellow horn). Both turn clockwise together, and 90° points straight up.
- Accelerometer: drag the board to tilt it. Colour sensor: drag on the colour pad. Gyro: drag the slab to spin it, then add bias to see drift.
- Applications and the 12 development stages: tap an item to see its detail. Quiz: tap an answer.

## Edit content
Slides are plain data in `src/content/*.tsx` (`{ section, title, body }`). Layout pieces are in `src/components/ui.tsx`, demos in `src/demos/`.
Dev helpers: `?still` disables animations (for screenshots); `?audit` steps through every slide and writes any overflow into the page.
