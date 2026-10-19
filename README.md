# Joe Travels on Points

A personal travel website about seeing the world with credit card points and airline miles.

The header features an animated plane (with a contrail) flying across a sky of drifting clouds.
The animation respects the visitor's "reduce motion" setting.

Website: https://mrios730.github.io/joe-travels-on-points/

## Files

- `index.html` – page content (about, map, trips, Points 101, contact)
- `style.css` – styles and the header animations
- `map.js` – interactive trip map (Leaflet + OpenStreetMap tiles). Pins come from each trip card's `data-lat`/`data-lng`, so a new card with coordinates shows up on the map automatically

## Trip map

The "Where I've been" map uses:

- **[Leaflet](https://leafletjs.com/) 1.9.4** for the map itself, loaded from the unpkg CDN.
- **[OpenStreetMap](https://www.openstreetmap.org/)'s standard tiles** for the map imagery (`tile.openstreetmap.org`). They are free and need no API key.

### Adding a trip to the map

Give the trip's card a latitude and longitude in decimal degrees. Use negative numbers for south and west:

```html
<article class="card" data-lat="-13.5320" data-lng="-71.9675">
```

The pin's popup reuses the card's title, description and "Flight/Hotel" and "Cost" rows, so nothing else needs editing.

### Caveats

- **OpenStreetMap's tiles are for light use only.** Their [tile usage policy](https://operations.osmfoundation.org/policies/tiles/) allows a small personal site like this one. It doesn't allow heavy traffic, bulk downloading or offline use. If the site gets popular, switch to a commercial provider such as MapTiler, Stadia Maps or Thunderforest. That means changing the tile URL and attribution in `map.js` and adding the provider's API key.
- **Keep the "© OpenStreetMap contributors" credit visible.** The policy requires it, so don't hide the attribution in the map's corner.
- **CARTO tiles no longer work without a key.** The map first used CARTO's tiles, which now show "API Key required" instead of the map. That's why it uses OpenStreetMap.
- **Upgrading Leaflet means updating its integrity hashes.** The Leaflet `<link>` and `<script>` tags in `index.html` have `integrity` hashes. If you change the version, update both hashes too, or the browser will refuse to load Leaflet and the map won't appear.
- **Browsers cache the CSS and JavaScript.** GitHub Pages lets browsers keep files for about 10 minutes, so changes may not show up right away. When you edit `style.css` or `map.js`, raise the `?v=` number on its link in `index.html` (for example `map.js?v=2` → `map.js?v=3`). A hard refresh (Ctrl+Shift+R, or Cmd+Shift+R on a Mac) also helps.
- **The map needs outside services.** Visitors' browsers load Leaflet from unpkg and map tiles from OpenStreetMap, so those services see visitors' IP addresses. If either service is down or blocked, the map area shows a short message and the trip cards still work.
- **The map needs JavaScript.** Without it, the trip cards are still listed, but their "Show on map" buttons don't appear.

## Run locally

Serve the folder with a local web server:

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000.

The page itself works if you open `index.html` directly. The map imagery may not, because OpenStreetMap can block tile requests that come without a website address, which is how pages opened from your computer make them. A local server avoids that.
