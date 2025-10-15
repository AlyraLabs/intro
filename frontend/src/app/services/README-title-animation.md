# TitleAnimationService - Инструкция по использованию

## Описание
`TitleAnimationService` - это Angular сервис для создания анимации заголовков с эффектом глитча. Сервис создает эффект "взлома" текста, где символы случайным образом заменяются на другие символы, создавая киберпанк-эстетику.

## Установка и импорт

### 1. Импорт сервиса в компонент
```typescript
import { TitleAnimationService } from '../../services/title-animation.service';
```

### 2. Инжекция в конструктор
```typescript
constructor(
  private titleAnimationService: TitleAnimationService
) {}
```

## Базовое использование

### Простейший пример
```typescript
export class MyComponent implements OnInit {
  private originalTitle = 'My Awesome Title';

  constructor(private titleAnimationService: TitleAnimationService) {}

  ngOnInit() {
    const titleElement = document.querySelector('h1');
    if (titleElement) {
      this.titleAnimationService.initializeTitleAnimation(
        titleElement as HTMLElement, 
        this.originalTitle
      );
    }
  }
}
```

### HTML шаблон
```html
<h1>My Awesome Title</h1>
```

## Расширенное использование с конфигурацией

### Настройка параметров анимации
```typescript
ngOnInit() {
  const titleElement = document.querySelector('h1');
  if (titleElement) {
    const customConfig = {
      animationFrames: 100,        // Количество кадров анимации (по умолчанию: 80)
      animationSpeed: 20,          // Скорость анимации в мс (по умолчанию: 25)
      glitchChars: '!@#$%^&*()',   // Символы для глитч-эффекта
      cyberChars: '01',            // Цифровые символы
      possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
    };

    this.titleAnimationService.initializeTitleAnimation(
      titleElement as HTMLElement, 
      this.originalTitle,
      customConfig
    );
  }
}
```

## Полный пример компонента

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TitleAnimationService } from '../../services/title-animation.service';

@Component({
  selector: 'app-example',
  template: `
    <div class="container">
      <h1>Cyberpunk Title</h1>
      <p>Содержимое страницы...</p>
    </div>
  `,
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit, OnDestroy {
  private originalTitle = 'Cyberpunk Title';

  constructor(private titleAnimationService: TitleAnimationService) {}

  ngOnInit() {
    this.initTitleAnimation();
  }

  ngOnDestroy() {
    // Важно очистить анимацию при уничтожении компонента
    this.titleAnimationService.clearAnimation();
  }

  private initTitleAnimation() {
    const titleElement = document.querySelector('h1');
    if (titleElement) {
      this.titleAnimationService.initializeTitleAnimation(
        titleElement as HTMLElement, 
        this.originalTitle
      );
    }
  }
}
```

## API Reference

### Методы сервиса

#### `initializeTitleAnimation(element: HTMLElement, originalTitle: string, config?: Partial<TitleAnimationConfig>)`
Инициализирует анимацию заголовка.

**Параметры:**
- `element` - HTML элемент заголовка
- `originalTitle` - оригинальный текст заголовка
- `config` - конфигурация анимации (опционально)

**Пример:**
```typescript
this.titleAnimationService.initializeTitleAnimation(
  document.querySelector('h1') as HTMLElement,
  'My Title',
  { animationFrames: 60, animationSpeed: 30 }
);
```

#### `clearAnimation()`
Останавливает текущую анимацию и очищает таймеры.

**Пример:**
```typescript
this.titleAnimationService.clearAnimation();
```

#### `destroy()`
Полностью уничтожает сервис и очищает все ресурсы.

**Пример:**
```typescript
this.titleAnimationService.destroy();
```

### Интерфейс TitleAnimationConfig

```typescript
interface TitleAnimationConfig {
  animationFrames: number;  // Количество кадров анимации
  animationSpeed: number;   // Скорость анимации в миллисекундах
  glitchChars: string;      // Символы для глитч-эффекта
  cyberChars: string;       // Цифровые символы
  possibleChars: string;    // Все возможные символы
}
```

## Стилизация

### CSS для анимации
```scss
h1 {
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: #00ff00;
  text-shadow: 0 0 10px #00ff00;
  transition: all 0.3s ease;
  
  &:hover {
    color: #ff0000;
    text-shadow: 0 0 15px #ff0000;
  }
}
```

### Адаптивные стили
```scss
@media (max-width: 768px) {
  h1 {
    font-size: 1.5rem;
  }
}

@media (min-width: 1200px) {
  h1 {
    font-size: 3rem;
  }
}
```

## Лучшие практики

### 1. Всегда очищайте анимацию
```typescript
ngOnDestroy() {
  this.titleAnimationService.clearAnimation();
}
```

### 2. Проверяйте существование элемента
```typescript
private initTitleAnimation() {
  const titleElement = document.querySelector('h1');
  if (titleElement) {
    this.titleAnimationService.initializeTitleAnimation(
      titleElement as HTMLElement, 
      this.originalTitle
    );
  }
}
```

### 3. Используйте ViewChild для лучшей производительности
```typescript
import { ViewChild, ElementRef } from '@angular/core';

export class MyComponent {
  @ViewChild('titleElement', { static: true }) titleElement!: ElementRef;

  ngOnInit() {
    this.titleAnimationService.initializeTitleAnimation(
      this.titleElement.nativeElement,
      'My Title'
    );
  }
}
```

```html
<h1 #titleElement>My Title</h1>
```

### 4. Настройка для разных устройств
```typescript
private getAnimationConfig() {
  const isMobile = window.innerWidth < 768;
  
  return {
    animationFrames: isMobile ? 60 : 80,
    animationSpeed: isMobile ? 30 : 25,
    glitchChars: isMobile ? '!@#$%' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    cyberChars: '01',
    possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
  };
}
```

## Устранение неполадок

### Проблема: Анимация не запускается
**Решение:** Убедитесь, что элемент существует в DOM:
```typescript
ngAfterViewInit() {
  const titleElement = document.querySelector('h1');
  if (titleElement) {
    this.titleAnimationService.initializeTitleAnimation(
      titleElement as HTMLElement, 
      this.originalTitle
    );
  }
}
```

### Проблема: Анимация продолжается после уничтожения компонента
**Решение:** Всегда вызывайте `clearAnimation()` в `ngOnDestroy`:
```typescript
ngOnDestroy() {
  this.titleAnimationService.clearAnimation();
}
```

### Проблема: Анимация слишком быстрая/медленная
**Решение:** Настройте параметры конфигурации:
```typescript
const config = {
  animationFrames: 120,  // Больше кадров = медленнее
  animationSpeed: 15     // Меньше значение = быстрее
};
```

## Примеры использования в разных сценариях

### 1. Анимация при загрузке страницы
```typescript
ngOnInit() {
  setTimeout(() => {
    this.initTitleAnimation();
  }, 1000); // Задержка 1 секунда
}
```

### 2. Анимация по клику
```typescript
onTitleClick() {
  const titleElement = document.querySelector('h1');
  if (titleElement) {
    this.titleAnimationService.initializeTitleAnimation(
      titleElement as HTMLElement, 
      this.originalTitle
    );
  }
}
```

### 3. Анимация нескольких заголовков
```typescript
ngOnInit() {
  const titles = document.querySelectorAll('.animated-title');
  titles.forEach((title, index) => {
    setTimeout(() => {
      this.titleAnimationService.initializeTitleAnimation(
        title as HTMLElement, 
        title.textContent || ''
      );
    }, index * 500); // Задержка между анимациями
  });
}
```

## Заключение

`TitleAnimationService` предоставляет простой и гибкий способ создания эффектных анимаций заголовков. Следуйте этим инструкциям для успешной интеграции сервиса в ваши компоненты.
