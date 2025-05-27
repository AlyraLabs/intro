import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TypingAnimationService {
  private readonly DEFAULT_DELAY = 50;

  constructor() {}

  async typeText(
    element: HTMLElement,
    text: string,
    options: {
      delay?: number;
      cursor?: boolean;
      cursorChar?: string;
      onComplete?: () => void;
    } = {}
  ): Promise<void> {
    const {
      delay = this.DEFAULT_DELAY,
      cursor = true,
      cursorChar = '|',
      onComplete
    } = options;

    element.textContent = '';
    
    let cursorElement: HTMLElement | null = null;
    if (cursor) {
      cursorElement = document.createElement('span');
      cursorElement.textContent = cursorChar;
      cursorElement.style.opacity = '1';
      element.appendChild(cursorElement);
    }

    for (let i = 0; i < text.length; i++) {
      await new Promise(resolve => setTimeout(resolve, delay));
      
      const char = text[i];
      const span = document.createElement('span');
      span.textContent = char;
      element.insertBefore(span, cursorElement);
    }

    if (cursorElement) {
      cursorElement.remove();
    }

    if (onComplete) {
      onComplete();
    }
  }
} 