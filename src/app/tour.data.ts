// src/app/tour.data.ts
export interface Link {
  targetId: string;
  yaw: number;   // direction in degrees
  pitch?: number;
  text?: string;
}

export interface SceneNode {
  id: string;
  name: string;
  imageUrl: string;   // local asset path
  yaw?: number;
  pitch?: number;
  hfov?: number;
  northOffset?: number;
  links?: Link[];
}

export const HOME_TOUR: SceneNode[] = [
  {
    id: 'p1',
    name: 'Entrance',
    imageUrl: 'assets/panos/pano1.jpg',
    yaw: 0,
    links: [{ targetId: 'p2', yaw: 0 }]
  },
  {
    id: 'p2',
    name: 'Hallway A',
    imageUrl: 'assets/panos/pano2.jpg',
    yaw: 0,
    links: [
      { targetId: 'p1', yaw: 180 },
      { targetId: 'p3', yaw: 0 }
    ]
  },
  {
    id: 'p3',
    name: 'Hallway B',
    imageUrl: 'assets/panos/pano3.jpg',
    yaw: 0,
    links: [
      { targetId: 'p2', yaw: 180 },
      { targetId: 'p4', yaw: 0 }
    ]
  },
  {
    id: 'p4',
    name: 'Living Area',
    imageUrl: 'assets/panos/pano4.jpg',
    yaw: 0,
    links: [{ targetId: 'p3', yaw: 180 }]
  }
];
