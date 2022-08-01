import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspirePageComponent } from './inspire-page.component';

describe('InspirePageComponent', () => {
  let component: InspirePageComponent;
  let fixture: ComponentFixture<InspirePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InspirePageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InspirePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
