import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferFormContainerComponent } from './transfer-form-container.component';

describe('TransferFormContainerComponent', () => {
  let component: TransferFormContainerComponent;
  let fixture: ComponentFixture<TransferFormContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferFormContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferFormContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
