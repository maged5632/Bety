/**
 * Property interface
 * -------------------
 * Defines the structure of a real-estate property object
 * used throughout the app.
 *
 * When you add new attributes (e.g. "yearBuilt", "agentName"),
 * add them here and update the UI components that use them.
 */
export interface Property {
  id: string;         // unique identifier (good for routing / database IDs)
  title: string;      // short marketing title for cards
  address: string;    // street address
  city: string;       // city name
  price: number;      // asking price
  beds: number;       // number of bedrooms
  baths: number;      // number of bathrooms
  area: number;       // property area (m² or ft²)
  thumbnail: string;  // URL/path to thumbnail image
  panoId: string;     // ID of the 360 scene to open (matches your HOME_TOUR ids)
}

/**
 * PROPERTIES
 * ----------
 * Demo data used for the gallery.
 *
 * Later you can:
 *  - Load this list from an API (HTTP GET),
 *  - Replace it with data from a database,
 *  - Or store it in a JSON file under /assets and load via HttpClient.
 */
export const PROPERTIES: Property[] = [
  {
    id: 'prop1',
    title: 'Modern Family Kitchen',
    address: '123 Maple Street',
    city: 'Cairo',
    price: 250000,
    beds: 3,
    baths: 2,
    area: 140,
    thumbnail: 'assets/panos/pano1.jpg',
    panoId: 'p1' // connects to HOME_TOUR[0] / manifest pano1
  },
  {
    id: 'prop2',
    title: 'Bright Hallway A',
    address: '45 Nile View Road',
    city: 'Cairo',
    price: 190000,
    beds: 2,
    baths: 1,
    area: 95,
    thumbnail: 'assets/panos/pano2.jpg',
    panoId: 'p2'
  },
  {
    id: 'prop3',
    title: 'Cozy Hallway B',
    address: '8 Garden Lane',
    city: 'Cairo',
    price: 210000,
    beds: 3,
    baths: 2,
    area: 120,
    thumbnail: 'assets/panos/pano3.jpg',
    panoId: 'p3'
  },
  {
    id: 'prop4',
    title: 'Spacious Living Area',
    address: '10 Corniche Road',
    city: 'Cairo',
    price: 320000,
    beds: 4,
    baths: 3,
    area: 180,
    thumbnail: 'assets/panos/pano4.jpg',
    panoId: 'p4'
  }
];
