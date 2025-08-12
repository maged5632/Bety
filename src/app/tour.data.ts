// src/app/tour.data.ts
export interface Link {
  targetId: string;
  yaw: number;        // direction of the arrow in degrees
  pitch?: number;     // vertical angle (often ~0)
  text?: string;      // label shown on hotspot
}

export interface SceneNode {
  id: string;
  name: string;
  imageUrl: string;   // path under assets/ (equirectangular JPG/PNG)
  yaw?: number;
  pitch?: number;
  hfov?: number;
  northOffset?: number;
  links?: Link[];
}

// Example: update URLs to your real files under src/assets/360/
export const HOME_TOUR = [
  {
    id: 'living',
    name: 'Living',
    imageUrl:
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/kiara_interior.jpg',
    links: [{ targetId: 'empty', yaw: 45, text: 'To Empty House' }]
  },
  {
    id: 'empty',
    name: 'Empty House',
    imageUrl:
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/small_empty_house.jpg',
    links: [{ targetId: 'lounge', yaw: -120, text: 'To Lounge' }]
  },
  {
    id: 'lounge',
    name: 'Lounge',
    imageUrl:
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/wooden_lounge.jpg',
    links: [{ targetId: 'living', yaw: 160, text: 'Back to Living' }]
  }
];
