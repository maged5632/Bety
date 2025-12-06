// src/app/virtual-tour/virtual-tour.ts
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
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

  // جاي من صفحة العقار عشان نحدد أي صورة تبدأ
  @Input() panoIndex: number | null = null;

  // handlers عشان نفصل الـ events في ngOnDestroy
  private mouseDownHandler?: (ev: MouseEvent) => void;
  private mouseMoveHandler?: (ev: MouseEvent) => void;
  private mouseUpHandler?: (ev: MouseEvent) => void;

  // بيانات للـ overlay
  private manifest: PanoManifestItem[] = [];
  currentIndex = 0;
  totalScenes = 0;
  currentName = '';

  constructor(private route: ActivatedRoute) {}

  private updateSceneInfo(sceneId: string) {
    const idx = parseInt(sceneId.replace('p', ''), 10) - 1;
    if (isNaN(idx) || idx < 0 || idx >= this.manifest.length) {
      return;
    }
    this.currentIndex = idx;
    this.totalScenes = this.manifest.length;
    this.currentName = this.manifest[idx]?.name || '';
  }

  async ngOnInit(): Promise<void> {
    try {
      // 1) نحمّل manifest.json
      const response = await fetch('assets/panos/manifest.json');
      const manifest = (await response.json()) as PanoManifestItem[];

      console.log('Manifest loaded successfully:', manifest);

      if (!manifest || !manifest.length) {
        console.error('Manifest is empty or missing');
        return;
      }

      this.manifest = manifest;
      this.totalScenes = manifest.length;

      // 2) نبني scenesConfig لـ pannellum
      const scenesConfig: Record<string, any> = {};

      manifest.forEach((item, index) => {
        const id = `p${index + 1}`;

        const hotSpots: any[] = [];

        if (index > 0) {
          hotSpots.push({
            pitch: 0,
            yaw: 180,
            type: 'scene',
            sceneId: `p${index}`,
            cssClass: 'nav-hotspot',
          });
        }

        if (index < manifest.length - 1) {
          hotSpots.push({
            pitch: 0,
            yaw: 0,
            type: 'scene',
            sceneId: `p${index + 2}`,
            cssClass: 'nav-hotspot',
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

      // 3) نحدد أول مشهد:
      //    - لو /view/:id موجودة → نستخدمها
      //    - لو جاي من صفحة العقار وعامل [panoIndex] → نستخدمه
      let firstSceneId = 'p1';

      const routeId = this.route.snapshot.paramMap.get('id');
      if (routeId && scenesConfig[routeId]) {
        firstSceneId = routeId;
      } else if (this.panoIndex != null) {
        const idx = Math.max(0, Math.min(manifest.length - 1, this.panoIndex));
        firstSceneId = `p${idx + 1}`;
      }

      this.updateSceneInfo(firstSceneId);

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

      // لما المشهد يتغير من جوه pannellum (مثلاً hotSpot)
      this.viewer.on('scenechange', (sceneId: string) => {
        this.updateSceneInfo(sceneId);
      });

      // 5) لو اتغير /view/:id من الراوتر
      this.route.paramMap.subscribe((pm) => {
        const id = pm.get('id');
        if (!id || !this.viewer) return;
        if (id !== this.viewer.getScene() && scenesConfig[id]) {
          this.viewer.loadScene(id, 0, 0, { transitionDuration: 800 });
          this.updateSceneInfo(id);
        }
      });

      // 6) click-anywhere مع تمييز drag vs click
      const container = this.viewer.getContainer();

      let isDragging = false;
      let startX = 0;
      let startY = 0;

      this.mouseDownHandler = (ev: MouseEvent) => {
        isDragging = false;
        startX = ev.clientX;
        startY = ev.clientY;
      };

      this.mouseMoveHandler = (ev: MouseEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
          isDragging = true;
        }
      };

      this.mouseUpHandler = (ev: MouseEvent) => {
        if (!this.viewer) return;

        // drag لتدوير الكاميرا → ما ننقلش
        if (isDragging) {
          return;
        }

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

        // تقدر تقللها لـ 80 لو عايز يبقى أدق
        const THRESHOLD = 120;

        if (best && best.sceneId && bestDiff <= THRESHOLD) {
          this.viewer.loadScene(best.sceneId, best.pitch, best.yaw, {
            transitionDuration: 600,
          });
          this.updateSceneInfo(best.sceneId);
        }
      };

      container.addEventListener('mousedown', this.mouseDownHandler);
      container.addEventListener('mousemove', this.mouseMoveHandler);
      container.addEventListener('mouseup', this.mouseUpHandler);
    } catch (err) {
      console.error('Error loading manifest.json', err);
    }
  }

  ngOnDestroy(): void {
    try {
      if (
        this.viewer &&
        this.mouseDownHandler &&
        this.mouseMoveHandler &&
        this.mouseUpHandler
      ) {
        const container = this.viewer.getContainer();
        container.removeEventListener('mousedown', this.mouseDownHandler);
        container.removeEventListener('mousemove', this.mouseMoveHandler);
        container.removeEventListener('mouseup', this.mouseUpHandler);
      }
    } catch {}

    try {
      this.viewer?.destroy?.();
    } catch {}
  }
}
