# Tranquil Waters - Interactive Boats & Nature

A quick test project letting a friend try vibecoding an interactive THREE.js site.

A dreamy, interactive art piece featuring a boat floating on water surrounded by nature. Built with Three.js and featuring a soft, ethereal aesthetic with pastel colors and gentle animations.

## Features

- **Dreamy Water Surface**: Custom shader-based water with gentle wave animations
- **Artistic Boat**: Low-poly sailboat with realistic floating motion
- **Ethereal Environment**: Gradient sky, abstract trees, and atmospheric islands
- **Interactive Camera**: Smooth orbit controls with auto-rotate
- **Post-Processing**: Bloom effects for soft, glowing highlights
- **Responsive Design**: Adapts to any screen size

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist` folder.

## Controls

- **Click and drag**: Rotate camera around the scene
- **Scroll**: Zoom in and out
- **Auto-rotate**: Scene rotates automatically when idle

## Technology

- Three.js - 3D graphics library
- Vite - Build tool and dev server
- Custom GLSL shaders for water effects
- Post-processing with bloom effects

## Project Structure

```
conproject/
├── src/
│   ├── main.js           # Main scene setup and animation loop
│   ├── styles.css        # Global styles and UI
│   └── objects/
│       ├── water.js      # Water surface with custom shader
│       ├── boat.js       # Sailboat geometry
│       └── environment.js # Sky, islands, and trees
├── index.html
├── package.json
└── vite.config.js
```

## Customization

### Colors

The pastel color palette can be customized in each object file:
- Water colors: [water.js](src/objects/water.js)
- Boat colors: [boat.js](src/objects/boat.js)
- Environment colors: [environment.js](src/objects/environment.js)

### Animation Speed

Adjust animation speeds in [main.js](src/main.js):
- Water wave speed: `uTime` multiplier
- Boat floating: Change the multipliers in `Math.sin(elapsedTime * ...)`
- Auto-rotate speed: `controls.autoRotateSpeed`

Enjoy your tranquil journey!
