import { Injectable } from '@angular/core';

export interface TitleAnimationConfig {
  animationFrames: number;
  animationSpeed: number;
  glitchChars: string;
  cyberChars: string;
  possibleChars: string;
}

/**
 * Сервис для создания анимации заголовков с эффектом глитча
 * 
 * @example
 * ```typescript
 * // Базовое использование
 * constructor(private titleAnimationService: TitleAnimationService) {}
 * 
 * ngOnInit() {
 *   const titleElement = document.querySelector('h1');
 *   if (titleElement) {
 *     this.titleAnimationService.initializeTitleAnimation(
 *       titleElement as HTMLElement, 
 *       'My Title'
 *     );
 *   }
 * }
 * 
 * ngOnDestroy() {
 *   this.titleAnimationService.clearAnimation();
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // С настройками
 * const config = {
 *   animationFrames: 100,
 *   animationSpeed: 20,
 *   glitchChars: '!@#$%^&*()',
 *   cyberChars: '01',
 *   possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
 * };
 * 
 * this.titleAnimationService.initializeTitleAnimation(
 *   titleElement as HTMLElement, 
 *   'My Title',
 *   config
 * );
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TitleAnimationService {
  private defaultConfig: TitleAnimationConfig = {
    animationFrames: 80,
    animationSpeed: 25,
    glitchChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    cyberChars: '0123456789',
    possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  };

  private animationTimeouts: Map<HTMLElement, number> = new Map();

  /**
   * Инициализирует анимацию заголовка для указанного элемента
   * 
   * @param element - HTML элемент заголовка
   * @param originalTitle - оригинальный текст заголовка
   * @param config - конфигурация анимации (опционально)
   * 
   * @example
   * ```typescript
   * const titleElement = document.querySelector('h1');
   * if (titleElement) {
   *   this.titleAnimationService.initializeTitleAnimation(
   *     titleElement as HTMLElement, 
   *     'My Awesome Title'
   *   );
   * }
   * ```
   */
  initializeTitleAnimation(element: HTMLElement, originalTitle: string, config?: Partial<TitleAnimationConfig>): void {
    const animationConfig = { ...this.defaultConfig, ...config };
    
    // Запускаем анимацию с задержкой
    setTimeout(() => {
      this.animateTitle(element, originalTitle, animationConfig);
    }, 500);
    
    // Добавляем обработчик события наведения мыши
    element.addEventListener('mouseenter', () => {
      this.animateTitle(element, originalTitle, animationConfig);
    });
  }

  /**
   * Запускает анимацию заголовка немедленно без задержки
   * 
   * @param element - HTML элемент заголовка
   * @param originalTitle - оригинальный текст заголовка
   * @param config - конфигурация анимации (опционально)
   */
  startTitleAnimation(element: HTMLElement, originalTitle: string, config?: Partial<TitleAnimationConfig>): void {
    const animationConfig = { ...this.defaultConfig, ...config };
    
    // Проверяем, является ли это Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    // Если Safari и это ссылка, используем простой эффект прозрачности
    if (isSafari && element.tagName === 'A') {
      element.style.transition = 'opacity 0.2s ease';
      element.style.opacity = '0.7';
      
      // Добавляем обработчик для восстановления прозрачности при уходе мыши
      const mouseLeaveHandler = () => {
        element.style.opacity = '1';
        element.removeEventListener('mouseleave', mouseLeaveHandler);
      };
      
      element.addEventListener('mouseleave', mouseLeaveHandler);
      return;
    }
    
    // Для всех остальных случаев используем обычную анимацию
    this.animateTitle(element, originalTitle, animationConfig);
  }

  /**
   * Запускает анимацию заголовка
   * @param element - HTML элемент заголовка
   * @param originalTitle - оригинальный текст заголовка
   * @param config - конфигурация анимации
   */
  private animateTitle(element: HTMLElement, originalTitle: string, config: TitleAnimationConfig): void {
    // Останавливаем предыдущую анимацию для этого элемента, если она есть
    const existingTimeout = this.animationTimeouts.get(element);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    let frame = 0;
    const finalText = originalTitle;
    const resolvedChars = Array(finalText.length).fill(false);

    const animate = () => {
      if (frame >= config.animationFrames) {
        element.textContent = finalText;
        this.animationTimeouts.delete(element);
        return;
      }

      let result = '';
      const progress = frame / config.animationFrames;
      
      const currentCharIndex = Math.floor(finalText.length * progress);

      for (let i = 0; i < finalText.length; i++) {
        if (i < currentCharIndex) {
          result += finalText[i];
          resolvedChars[i] = true;
        } else if (i === currentCharIndex) {
          if (finalText[i] === ' ') {
            result += ' ';
            resolvedChars[i] = true;
          } else {
            const showCorrect = Math.random() < 0.7;
            
            if (showCorrect) {
              result += finalText[i];
            } else {
              result += this.getRandomChar(finalText[i], config);
            }
          }
        } else {
          if (finalText[i] === ' ') {
            result += ' ';
          } else {
            result += this.getRandomChar(finalText[i], config);
          }
        }
      }

      element.textContent = result;
      frame++;

      const timeoutId = window.setTimeout(animate, config.animationSpeed);
      this.animationTimeouts.set(element, timeoutId);
    };

    animate();
  }

  /**
   * Генерирует случайный символ для эффекта глитча
   * @param originalChar - оригинальный символ
   * @param config - конфигурация анимации
   * @returns случайный символ
   */
  private getRandomChar(originalChar: string, config: TitleAnimationConfig): string {
    const rand = Math.random();
    
    if (rand < 0.4) {
      const glitchIndex = Math.floor(Math.random() * config.glitchChars.length);
      return config.glitchChars[glitchIndex];
    } else if (rand < 0.7) {
      const cyberIndex = Math.floor(Math.random() * config.cyberChars.length);
      return config.cyberChars[cyberIndex];
    } else {
      const randomIndex = Math.floor(Math.random() * config.possibleChars.length);
      return config.possibleChars[randomIndex];
    }
  }

  /**
   * Очищает текущую анимацию и останавливает все таймеры
   * 
   * @example
   * ```typescript
   * ngOnDestroy() {
   *   this.titleAnimationService.clearAnimation();
   * }
   * ```
   */
  clearAnimation(): void {
    // Останавливаем все активные анимации
    this.animationTimeouts.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    this.animationTimeouts.clear();
    
    // Восстанавливаем прозрачность для Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        link.style.opacity = '1';
      });
    }
  }

  clearAnimationForElement(element: HTMLElement): void {
    // Останавливаем анимацию для конкретного элемента
    const timeoutId = this.animationTimeouts.get(element);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.animationTimeouts.delete(element);
    }
    
    // Восстанавливаем прозрачность для Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari && element.tagName === 'A') {
      element.style.opacity = '1';
    }
  }

  /**
   * Уничтожает сервис и очищает все ресурсы
   * 
   * @example
   * ```typescript
   * ngOnDestroy() {
   *   this.titleAnimationService.destroy();
   * }
   * ```
   */
  destroy(): void {
    this.clearAnimation();
  }
}
