# Wildsphere: Globe Facts

An interactive 3D globe application that displays animal facts based on geographic proximity. Built with React, Three.js (react-globe.gl), and TypeScript.

## Features

- **Interactive 3D Globe**: Zoom, rotate, and explore the world.
- **Nearest Neighbor Lookup**: Click anywhere to find the nearest animals using a fast spatial index (kdbush/geokdbush).
- **Fact Cards**: View details about animals, including facts and images.
- **Cycling**: Navigate through multiple animals at the same location.
- **Clustering**: Markers cluster dynamically when zoomed out.
- **Lazy Loading**: Images load only when visible.

## Setup

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## Data

Animal data is located in `src/data/animals.json`.
Schema:
```json
{
  "id": number,
  "name": "string",
  "scientific_name": "string",
  "latitude": number,
  "longitude": number,
  "fact": "string",
  "image_url": "string (optional)"
}
```

To validate data:
```bash
npx ts-node scripts/validate-json.ts
```

## Testing

Run unit and integration tests:
```bash
npm test
```

## Deployment

Build for production:
```bash
./deploy.sh
```
Or manually:
```bash
npm run build
```
The `dist` folder contains the static assets ready for deployment.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **3D**: react-globe.gl, Three.js
- **Spatial Index**: kdbush, geokdbush
- **Clustering**: supercluster
- **Styling**: Tailwind CSS
- **Testing**: Vitest, React Testing Library
