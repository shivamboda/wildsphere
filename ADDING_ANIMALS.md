# How to Add New Animals to Wild Sphere

This guide explains how to add new animals to the Wild Sphere application.

## 1. Prepare the Data

Open `src/data/animals.json` and add a new entry to the array. The format is as follows:

```json
{
  "id": 123, // Use a unique ID (increment the last one)
  "name": "Animal Name",
  "scientific": "Scientific Name",
  "fact": "A short, interesting fact about the animal.",
  "lat": 20.5937, // Latitude
  "lng": 78.9629, // Longitude
  "country": "Country Name", // Must match the country name returned by 'which-country' library
  "image_url": "optional_image_url.jpg" // Optional
}
```

### Finding Coordinates
You can use Google Maps to find the latitude and longitude of a specific location (e.g., a national park or habitat). Right-click on the map and select the coordinates to copy them.

### Country Name
Ensure the `country` field exactly matches the standard English name of the country. This is used for the regional proximity feature.

## 2. Adding Images (Optional)

If you have a specific image for the animal:
1. Place the image file in the `public/images/animals/` directory (create it if it doesn't exist).
2. Add the `image_url` field to the JSON entry, pointing to the file (e.g., `/images/animals/lion.jpg`).

## 3. Verify

1. Start the application (`npm run dev`).
2. Navigate to the location on the globe.
3. Click on the region. The new animal should appear!
