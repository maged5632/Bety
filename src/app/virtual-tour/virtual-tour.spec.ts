import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualTour } from './virtual-tour';

describe('VirtualTour', () => {
  let component: VirtualTour;
  let fixture: ComponentFixture<VirtualTour>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualTour]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirtualTour);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
