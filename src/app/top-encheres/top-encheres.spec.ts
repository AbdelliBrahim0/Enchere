import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopEncheres } from './top-encheres';

describe('TopEncheres', () => {
  let component: TopEncheres;
  let fixture: ComponentFixture<TopEncheres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopEncheres]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopEncheres);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
