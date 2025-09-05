// src/app/pan360-viewer/pan360-viewer.component.ts
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HOME_TOUR, SceneNode, Link } from '../tour.data';

declare const pannellum: any;

function degDiff(a:number, b:number): number {
  let d = (a - b) % 360;
  if (d < -180) d += 360;
  if (d > 180) d -= 360;
  return Math.abs(d);
}

@Component({
  selector: 'app-pan360-viewer',
  standalone: true,
  template: `<div #pano class="pano" title="Click anywhere to move"></div>`,
  styles: [`
    :host { display:block; position:relative; height:100dvh; }
    .pano { position:absolute; inset:0; }
  `]
})
export class Pan360ViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('pano', { static: true }) panoEl!: ElementRef<HTMLDivElement>;
  private route = inject(ActivatedRoute);
  private viewer: any;
  private sceneMap = new Map<string, SceneNode>(HOME_TOUR.map(s => [s.id, s]));
  private _cleanup?: () => void;

  ngAfterViewInit(): void {
    const firstId = this.route.snapshot.paramMap.get('id') || HOME_TOUR[0]?.id;
    const scenesConfig: Record<string, any> = {};

    for (const s of HOME_TOUR) {
      scenesConfig[s.id] = {
        type: 'equirectangular',
        panorama: s.imageUrl,         // LOCAL assets -> no CORS
        yaw: s.yaw ?? 0,
        pitch: s.pitch ?? 0,
        hfov: s.hfov ?? 100,
        northOffset: s.northOffset ?? 0,
        showControls: true,
        autoLoad: true,
        doubleClickZoom: false,
        hotSpots: []                  // hide classic hotspots
      };
    }

    this.viewer = pannellum.viewer(this.panoEl.nativeElement, {
      default: {
        firstScene: firstId,
        sceneFadeDuration: 1000
      },
      scenes: scenesConfig
    });

    // React to /view/:id
    this.route.paramMap.subscribe(pm => {
      const id = pm.get('id');
      if (id && id !== this.viewer.getScene()) {
        this.viewer.loadScene(id, 0, 0, { transitionDuration: 800 });
      }
    });

    // Click-anywhere-to-move
    const container = this.panoEl.nativeElement;
    const onClick = (ev: MouseEvent) => {
      const coords = this.viewer.mouseEventToCoords(ev); // [pitch, yaw]
      if (!coords) return;
      const [, clickYaw] = coords;

      const currentId: string = this.viewer.getScene();
      const scene = this.sceneMap.get(currentId);
      const links: Link[] = scene?.links || [];
      if (!links.length) return;

      let best = links[0];
      let bestDiff = degDiff(clickYaw, best.yaw);
      for (let i = 1; i < links.length; i++) {
        const d = degDiff(clickYaw, links[i].yaw);
        if (d < bestDiff) { best = links[i]; bestDiff = d; }
      }

      const THRESHOLD = 80; // set to 180 to always move to nearest link
      if (bestDiff <= THRESHOLD) {
        this.viewer.loadScene(best.targetId, 0, 0, { transitionDuration: 600 });
      }
    };
    container.addEventListener('click', onClick);
    this._cleanup = () => container.removeEventListener('click', onClick);
  }

  ngOnDestroy(): void {
    try { this._cleanup?.(); } catch {}
    try { this.viewer?.destroy?.(); } catch {}
  }
}
