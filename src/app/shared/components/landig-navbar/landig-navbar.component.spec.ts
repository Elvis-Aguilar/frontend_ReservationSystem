import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandigNavbarComponent } from './landig-navbar.component';

describe('LandigNavbarComponent', () => {
  let component: LandigNavbarComponent;
  let fixture: ComponentFixture<LandigNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandigNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandigNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
