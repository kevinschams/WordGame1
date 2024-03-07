import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordgameComponent } from './wordgame.component';

describe('WordgameComponent', () => {
  let component: WordgameComponent;
  let fixture: ComponentFixture<WordgameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordgameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WordgameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
