import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('size signal input', () => {
    it('should have default value of md', () => {
      expect(component.size()).toBe('md');
    });

    it('should accept sm value', () => {
      fixture.componentRef.setInput('size', 'sm');
      expect(component.size()).toBe('sm');
    });

    it('should accept md value', () => {
      fixture.componentRef.setInput('size', 'md');
      expect(component.size()).toBe('md');
    });

    it('should update when size input changes', () => {
      expect(component.size()).toBe('md');

      fixture.componentRef.setInput('size', 'sm');
      expect(component.size()).toBe('sm');

      fixture.componentRef.setInput('size', 'md');
      expect(component.size()).toBe('md');
    });

    it('should be a signal function', () => {
      expect(typeof component.size).toBe('function');
    });
  });

  describe('type signal input', () => {
    it('should have default value of button', () => {
      expect(component.type()).toBe('button');
    });

    it('should accept submit value', () => {
      fixture.componentRef.setInput('type', 'submit');
      expect(component.type()).toBe('submit');
    });

    it('should accept reset value', () => {
      fixture.componentRef.setInput('type', 'reset');
      expect(component.type()).toBe('reset');
    });

    it('should update when type input changes', () => {
      expect(component.type()).toBe('button');

      fixture.componentRef.setInput('type', 'submit');
      expect(component.type()).toBe('submit');

      fixture.componentRef.setInput('type', 'reset');
      expect(component.type()).toBe('reset');
    });

    it('should be a signal function', () => {
      expect(typeof component.type).toBe('function');
    });
  });

  describe('signal input behavior', () => {
    it('should return default values when called', () => {
      expect(component.size()).toBe('md');
      expect(component.type()).toBe('button');
    });

    it('should have both signal inputs defined', () => {
      expect(component.size).toBeDefined();
      expect(component.type).toBeDefined();
      expect(typeof component.size).toBe('function');
      expect(typeof component.type).toBe('function');
    });

    it('should be reactive to input changes', () => {
      const initialSize = component.size();
      fixture.componentRef.setInput('size', 'sm');
      const newSize = component.size();

      expect(initialSize).not.toBe(newSize);
      expect(newSize).toBe('sm');
    });
  });
});
