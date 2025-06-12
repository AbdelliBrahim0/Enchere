import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsForts } from './points-forts';

describe('PointsForts', () => {
  let component: PointsForts;
  let fixture: ComponentFixture<PointsForts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointsForts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointsForts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
