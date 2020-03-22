import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyLeafComponent } from './verify-leaf.component';

describe('VerifyLeafComponent', () => {
  let component: VerifyLeafComponent;
  let fixture: ComponentFixture<VerifyLeafComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyLeafComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyLeafComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
