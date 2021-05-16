import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksingleComponent } from './tasksingle.component';

describe('TasksingleComponent', () => {
  let component: TasksingleComponent;
  let fixture: ComponentFixture<TasksingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasksingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
