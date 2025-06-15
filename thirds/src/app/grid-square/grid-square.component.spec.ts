import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSquareComponent } from './grid-square.component';

describe('GridSquareComponent', () => {
  let component: GridSquareComponent;
  let fixture: ComponentFixture<GridSquareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridSquareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridSquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
