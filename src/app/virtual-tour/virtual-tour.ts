// src/app/virtual-tour/virtual-tour.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare const pannellum: any;

interface PanoManifestItem {
  name: string;
  src: string;
  width?: number;
  height?: number;
}

// فرق الزاوية بين اتجاهين (0–180 درجة)
function yawDiff(a: number, b: number): number {
  let d = (a - b) % 360;
  if (d < -180) d += 360;
  if (d > 180) d -= 360;
  return Math.abs(d);
}

@Component({
  selector: 'app-virtual-tour',
  standalone: true,
  templateUrl: './virtual-tour.html',
  styleUrls: ['./virtual-tour.css'],
})
export class VirtualTourComponent implements OnInit, OnDestroy {
  private viewer: any;
  private clickHandler?: (ev: MouseEvent) => void;

  constructor(private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    try {
      // 1) نحمّل ملف المانيفست القديم من assets/panos/manifest.json
      const response = await fetch('assets/panos/manifest.json');
      const manifest = (await response.json()) as PanoManifestItem[];

      console.log('Manifest loaded successfully:', manifest);

      if (!manifest || !manifest.length) {
        console.error('Manifest is empty or missing');
        return;
      }

      // 2) نبني إعدادات المشاهد لـ pannellum
      // هنستخدم ids: p1, p2, p3, p4 ...
      const scenesConfig: Record<string, any> = {};

      manifest.forEach((item, index) => {
        const id = `p${index + 1}`;

        const hotSpots: any[] = [];

        // رابط للمشهد السابق
        if (index > 0) {
          hotSpots.push({
            pitch: 0,
            yaw: 180,
            type: 'scene',
            sceneId: `p${index}`,
            text: 'Back',
          });
        }

        // رابط للمشهد التالي
        if (index < manifest.length - 1) {
          hotSpots.push({
            pitch: 0,
            yaw: 0,
            type: 'scene',
            sceneId: `p${index + 2}`,
            text: 'Next',
          });
        }

        scenesConfig[id] = {
          type: 'equirectangular',
          panorama: item.src,
          autoLoad: true,
          showControls: true,
          doubleClickZoom: false,
          hfov: 110,
          pitch: 0,
          yaw: 0,
          hotSpots,
        };
      });

      // 3) نحدد المشهد الأول من الـ Route (/view/:id) أو p1
      const routeId = this.route.snapshot.paramMap.get('id');
      const firstSceneId =
        routeId && scenesConfig[routeId] ? routeId : 'p1';

      // 4) إنشاء pannellum viewer
      this.viewer = pannellum.viewer('panorama', {
        default: {
          firstScene: firstSceneId,
          sceneFadeDuration: 1000,
        },
        scenes: scenesConfig,
      });

      console.log(
        'Pannellum viewer initialised with',
        scenesConfig[firstSceneId].panorama
      );

      // 5) لو الـ Route اتغيّر (مثلاً /view/p3) نحمل المشهد المناسب
      this.route.paramMap.subscribe((pm) => {
        const id = pm.get('id');
        if (!id || !this.viewer) return;
        if (id !== this.viewer.getScene() && scenesConfig[id]) {
          this.viewer.loadScene(id, 0, 0, { transitionDuration: 800 });
        }
      });

      // 6) click-anywhere → نروح لأقرب hotspot من نوع scene
      const container = this.viewer.getContainer();

      this.clickHandler = (ev: MouseEvent) => {
        if (!this.viewer) return;

        const coords = this.viewer.mouseEventToCoords(ev);
        if (!coords) return;

        const [, clickYaw] = coords;

        const config: any = this.viewer.getConfig();
        const currentSceneId: string = this.viewer.getScene();
        const sceneCfg = config.scenes?.[currentSceneId];

        if (!sceneCfg) return;

        const hotspots: any[] = (sceneCfg.hotSpots || []).filter(
          (h: any) => h.type === 'scene' && h.sceneId
        );

        if (!hotspots.length) return;

        let best: any | undefined;
        let bestDiff = Infinity;

        for (const h of hotspots) {
          const diff = yawDiff(clickYaw, h.yaw ?? 0);
          if (diff < bestDiff) {
            bestDiff = diff;
            best = h;
          }
        }

        // نخليها واسعة في الأول علشان أي كليك تقريباً يشتغل
        const THRESHOLD = 180;

        if (best && best.sceneId && bestDiff <= THRESHOLD) {
          this.viewer.loadScene(best.sceneId, best.pitch, best.yaw, {
            transitionDuration: 600,
          });
        }
      };

      container.addEventListener('click', this.clickHandler);
    } catch (err) {
      console.error('Error loading manifest.json', err);
    }
  }

  ngOnDestroy(): void {
    try {
      if (this.clickHandler && this.viewer) {
        const container = this.viewer.getContainer();
        container.removeEventListener('click', this.clickHandler);
      }
    } catch {}

    try {
      this.viewer?.destroy?.();
    } catch {}
  }
}
