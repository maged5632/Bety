// src/app/pan360-viewer/pan360-viewer.ts
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HOME_TOUR, SceneNode } from '../tour.data';

// pannellum is loaded via <script> in src/index.html
declare const pannellum: any;

@Component({
  selector: 'app-pan360-viewer',
  standalone: true,
  template: `<div #pano class="pano"></div>`,
  styles: [`
    :host { display:block; height:100%; }
    .pano { position:absolute; inset:0; }
  `]
})
export class Pan360ViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('pano', { static: true }) panoRef!: ElementRef<HTMLDivElement>;
  private route = inject(ActivatedRoute);
  private viewer: any;

  private toScenes(nodes: SceneNode[]) {
    const scenes: Record<string, any> = {};
    for (const n of nodes) {
      scenes[n.id] = {
        type: 'equirectangular',
        panorama: n.imageUrl,
        hfov: n.hfov ?? 100,
        yaw: n.yaw ?? 0,
        pitch: n.pitch ?? 0,
        northOffset: n.northOffset ?? 0,
        hotSpots: (n.links ?? []).map(l => ({
          type: 'scene',
          sceneId: l.targetId,
          yaw: l.yaw,
          pitch: l.pitch ?? 0,
          text: l.text ?? 'Go'
        }))
      };
    }
    return scenes;
  }

  ngAfterViewInit(): void {
    const startId = this.route.snapshot.paramMap.get('id') || HOME_TOUR[0].id;

    // >>> Put your viewer init RIGHT HERE <<<
    this.viewer = pannellum.viewer(this.panoRef.nativeElement, {
      crossOrigin: 'anonymous', // important when using remote image URLs
      default: { firstScene: startId, sceneFadeDuration: 1000, autoLoad: true },
      showControls: true,
      compass: true,
      autoRotate: 1,
      mouseZoom: true,
      orientationOnByDefault: true,
      scenes: this.toScenes(HOME_TOUR)
    });

    // (Optional) react to route changes: /view/:id
    this.route.paramMap.subscribe(pm => {
      const id = pm.get('id');
      if (id && id !== this.viewer.getScene()) {
        this.viewer.loadScene(id, 0, 0, { transitionDuration: 1000 });
      }
    });
  }

  ngOnDestroy(): void {
    try { this.viewer?.destroy?.(); } catch {}
  }
}
