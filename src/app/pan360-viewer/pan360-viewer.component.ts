// src/app/pan360-viewer/pan360-viewer.component.ts
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  inject
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HOME_TOUR, SceneNode, Link } from '../tour.data';

declare const pannellum: any;

// فرق الزاوية بين اتجاهين (0–180 درجة)
function degDiff(a: number, b: number): number {
  let d = (a - b) % 360;
  if (d < -180) d += 360;
  if (d > 180) d -= 360;
  return Math.abs(d);
}

@Component({
  selector: 'app-pan360-viewer',
  standalone: true,
  templateUrl: './pan360-viewer.component.html',
  styleUrls: ['./pan360-viewer.component.css'],
})
export class Pan360ViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('pano', { static: true }) panoEl!: ElementRef<HTMLDivElement>;

  private route = inject(ActivatedRoute);
  private viewer: any;
  private sceneMap = new Map<string, SceneNode>();
  private cleanupFn?: () => void;

  ngAfterViewInit(): void {
    // نحط كل المشاهد في map علشان نوصل لها بسهولة
    this.sceneMap = new Map(HOME_TOUR.map((s) => [s.id, s]));

    // أول مشهد: من /view/:id أو أول عنصر في HOME_TOUR
    const startId =
      this.route.snapshot.paramMap.get('id') || HOME_TOUR[0]?.id;

    if (!startId) {
      console.error('No starting scene id found.');
      return;
    }

    // إعداد المشاهد لـ pannellum
    const scenesConfig: Record<string, any> = {};
    for (const s of HOME_TOUR) {
      scenesConfig[s.id] = {
        type: 'equirectangular',
        panorama: s.imageUrl,
        yaw: s.yaw ?? 0,
        pitch: s.pitch ?? 0,
        hfov: s.hfov ?? 110,
        northOffset: s.northOffset ?? 0,
        showControls: true,
        autoLoad: true,
        doubleClickZoom: false,
        hotSpots: [], // إحنا هنستخدم click-anywhere بدل hotspots
      };
    }

    // إنشاء الـ viewer
    this.viewer = pannellum.viewer(this.panoEl.nativeElement, {
      default: {
        firstScene: startId,
        sceneFadeDuration: 1000,
      },
      scenes: scenesConfig,
    });

    // لو حد غيّر /view/:id (مثلاً من لينك في الجاليري) نحمّل المشهد الجديد
    this.route.paramMap.subscribe((pm) => {
      const id = pm.get('id');
      if (!id || !this.viewer) return;

      if (id !== this.viewer.getScene()) {
        this.viewer.loadScene(id, 0, 0, { transitionDuration: 800 });
      }
    });

    // ------- ➊ ميزة click-to-change-room -------

    const container = this.panoEl.nativeElement;

    const onClick = (ev: MouseEvent) => {
      if (!this.viewer) return;

      // نحول مكان الكليك → (pitch, yaw)
      const coords = this.viewer.mouseEventToCoords(ev);
      if (!coords) {
        return;
      }
      const [, clickYaw] = coords;

      const currentId: string = this.viewer.getScene();
      const scene = this.sceneMap.get(currentId);
      const links: Link[] = scene?.links || [];
      if (!links.length) {
        // مفيش links من الغرفة دي
        return;
      }

      // ندور على الـ link اللي اتجاهه أقرب لاتجاه الكليك
      let best: Link | undefined;
      let bestDiff = Infinity;

      for (const link of links) {
        const diff = degDiff(clickYaw, link.yaw);
        if (diff < bestDiff) {
          bestDiff = diff;
          best = link;
        }
      }

      // خلّيها 180 علشان أي كليك يروح لأقرب غرفة (للاختبار)
      const THRESHOLD = 180;

      if (best && bestDiff <= THRESHOLD) {
        this.viewer.loadScene(best.targetId, 0, 0, {
          transitionDuration: 600,
        });
      }
    };

    container.addEventListener('click', onClick);
    this.cleanupFn = () => container.removeEventListener('click', onClick);
  }

  ngOnDestroy(): void {
    try {
      this.cleanupFn?.();
    } catch {}
    try {
      this.viewer?.destroy?.();
    } catch {}
  }
}
