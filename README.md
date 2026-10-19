# Joe Travels on Points

A personal travel website about seeing the world with credit card points and airline miles.

The header features an animated plane (with a contrail) flying across a sky of drifting clouds.
The animation respects the visitor's "reduce motion" setting.

## Files

- `index.html` – page content (about, map, trips, Points 101, contact)
- `style.css` – styles and the header animations
- `map.js` – interactive trip map (Leaflet + CARTO tiles). Pins come from each trip card's `data-lat`/`data-lng`, so a new card with coordinates shows up on the map automatically

## Run locally

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000.
