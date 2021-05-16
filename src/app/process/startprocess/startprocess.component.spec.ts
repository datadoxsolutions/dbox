import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartprocessComponent } from './startprocess.component';

describe('StartprocessComponent', () => {
  let component: StartprocessComponent;
  let fixture: ComponentFixture<StartprocessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartprocessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
