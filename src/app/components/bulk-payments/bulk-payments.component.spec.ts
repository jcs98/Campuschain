import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkPaymentsComponent } from './bulk-payments.component';

describe('BulkPaymentsComponent', () => {
  let component: BulkPaymentsComponent;
  let fixture: ComponentFixture<BulkPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
