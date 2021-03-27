import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VizualisationComponent } from './vizualisation.component';

describe('VizualisationComponent', () => {
  let component: VizualisationComponent;
  let fixture: ComponentFixture<VizualisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VizualisationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VizualisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
