import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BussingHourComponent } from './bussing-hour.component';

describe('BussingHourComponent', () => {
  let component: BussingHourComponent;
  let fixture: ComponentFixture<BussingHourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BussingHourComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BussingHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
