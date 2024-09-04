import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoryListComponent } from './storylist.component';

describe('StorylistComponent', () => {
  let component: StoryListComponent;
  let fixture: ComponentFixture<StoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
