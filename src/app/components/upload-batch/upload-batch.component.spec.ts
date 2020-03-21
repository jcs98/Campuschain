import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBatchComponent } from './upload-batch.component';

describe('UploadBatchComponent', () => {
  let component: UploadBatchComponent;
  let fixture: ComponentFixture<UploadBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
