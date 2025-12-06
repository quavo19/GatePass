import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';

export interface Toast {
  id: string;
  type: ToastType;
  heading: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toasts = signal<Toast[]>([]);

  getToasts() {
    return this.toasts.asReadonly();
  }

  show(type: ToastType, heading: string, description: string): void {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, type, heading, description };
    this.toasts.update((toasts) => [...toasts, newToast]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      this.remove(id);
    }, 5000);
  }

  success(heading: string, description: string): void {
    this.show('success', heading, description);
  }

  error(heading: string, description: string): void {
    this.show('error', heading, description);
  }

  remove(id: string): void {
    this.toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }
}

