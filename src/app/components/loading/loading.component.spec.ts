import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const loadingText = compiled.querySelector('p');
    expect(loadingText?.textContent).toContain('Loading...');
  });

  it('should have full screen overlay', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const overlay = compiled.querySelector('div');
    expect(overlay?.classList.contains('fixed')).toBe(true);
    expect(overlay?.classList.contains('inset-0')).toBe(true);
  });

  it('should have animated spinner', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const spinner = compiled.querySelector('.animate-spin');
    expect(spinner).toBeTruthy();
  });
});

