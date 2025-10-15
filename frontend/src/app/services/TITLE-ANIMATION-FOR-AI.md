# TitleAnimationService - Инструкция для ИИ

## 🎯 Что это?
Сервис для создания анимации заголовков с эффектом "глитча" - символы случайно заменяются на другие, создавая киберпанк-эстетику.

## 📁 Файлы
- `title-animation.service.ts` - основной сервис
- `README-title-animation.md` - подробная документация
- `TITLE-ANIMATION-QUICK-START.md` - быстрый старт

## 🚀 Минимальный код для копирования

```typescript
// 1. Импорт
import { TitleAnimationService } from '../../services/title-animation.service';

// 2. В компоненте
export class MyComponent implements OnInit, OnDestroy {
  constructor(private titleAnimationService: TitleAnimationService) {}

  ngOnInit() {
    const titleElement = document.querySelector('h1');
    if (titleElement) {
      this.titleAnimationService.initializeTitleAnimation(
        titleElement as HTMLElement, 
        'My Title'
      );
    }
  }

  ngOnDestroy() {
    this.titleAnimationService.clearAnimation();
  }
}
```

## ⚙️ С настройками

```typescript
const config = {
  animationFrames: 100,        // Количество кадров (больше = медленнее)
  animationSpeed: 20,          // Скорость в мс (меньше = быстрее)
  glitchChars: '!@#$%^&*()',   // Символы для глитча
  cyberChars: '01',            // Цифровые символы
  possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
};

this.titleAnimationService.initializeTitleAnimation(
  titleElement as HTMLElement, 
  'My Title',
  config
);
```

## 🎯 ViewChild (лучший способ)

```typescript
@ViewChild('titleElement', { static: true }) titleElement!: ElementRef;

ngOnInit() {
  this.titleAnimationService.initializeTitleAnimation(
    this.titleElement.nativeElement,
    'My Title'
  );
}
```

```html
<h1 #titleElement>My Title</h1>
```

## ⚠️ Критически важно
1. **ВСЕГДА** вызывать `clearAnimation()` в `ngOnDestroy()`
2. **ПРОВЕРЯТЬ** существование элемента перед инициализацией
3. **ИСПОЛЬЗОВАТЬ** ViewChild для лучшей производительности

## 🔧 API методы
- `initializeTitleAnimation(element, title, config?)` - запуск анимации
- `clearAnimation()` - остановка анимации  
- `destroy()` - полная очистка

## 📱 Адаптивность
```typescript
private getConfig() {
  const isMobile = window.innerWidth < 768;
  return {
    animationFrames: isMobile ? 60 : 80,
    animationSpeed: isMobile ? 30 : 25
  };
}
```

## 🎨 CSS стили
```scss
h1 {
  font-family: 'Courier New', monospace;
  color: #00ff00;
  text-shadow: 0 0 10px #00ff00;
}
```

## 🐛 Частые ошибки
- Забыли `clearAnimation()` в `ngOnDestroy()` → утечка памяти
- Не проверили существование элемента → ошибка
- Используете `querySelector` вместо ViewChild → плохая производительность

## ✅ Готовый шаблон компонента
```typescript
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { TitleAnimationService } from '../../services/title-animation.service';

@Component({
  selector: 'app-example',
  template: '<h1 #titleElement>My Title</h1>'
})
export class ExampleComponent implements OnInit, OnDestroy {
  @ViewChild('titleElement', { static: true }) titleElement!: ElementRef;

  constructor(private titleAnimationService: TitleAnimationService) {}

  ngOnInit() {
    this.titleAnimationService.initializeTitleAnimation(
      this.titleElement.nativeElement,
      'My Title'
    );
  }

  ngOnDestroy() {
    this.titleAnimationService.clearAnimation();
  }
}
```

## 🎯 Для других нейронок
Этот сервис готов к использованию. Просто скопируйте код выше и адаптируйте под свои нужды. Все примеры протестированы и работают.
