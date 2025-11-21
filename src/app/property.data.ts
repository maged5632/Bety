// src/app/property.data.ts

/**
 * Property model shared by the whole app.
 *
 * NOTE:
 *  - Data now comes from /assets/properties.json via PropertyService.
 *  - We keep only the TypeScript interface here.
 */
export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;

  price: number;
  beds: number;
  baths: number;
  area: number;

  thumbnail: string;   // main thumbnail used in gallery / hero
  panoId: string;      // e.g. "p1" → links to 360 pano

  /**
   * Extra images for the photo gallery.
   * Right now we just put the same pano image,
   * but later you can add more URLs here.
   */
  images?: string[];
}
