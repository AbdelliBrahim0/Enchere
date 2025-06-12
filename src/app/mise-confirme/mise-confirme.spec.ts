import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiseConfirme } from './mise-confirme';

describe('MiseConfirme', () => {
  let component: MiseConfirme;
  let fixture: ComponentFixture<MiseConfirme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiseConfirme]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiseConfirme);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
