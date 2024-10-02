import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninMfaComponent } from './signin-mfa.component';

describe('SigninMfaComponent', () => {
  let component: SigninMfaComponent;
  let fixture: ComponentFixture<SigninMfaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigninMfaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SigninMfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
