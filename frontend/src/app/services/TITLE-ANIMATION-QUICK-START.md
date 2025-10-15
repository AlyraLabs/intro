# TitleAnimationService - Быстрый старт

## 🚀 Минимальный пример

```typescript
// 1. Импорт
import { TitleAnimationService } from '../../services/title-animation.service';

// 2. Инжекция
constructor(private titleAnimationService: TitleAnimationService) {}

// 3. Инициализация
ngOnInit() {
  const titleElement = document.querySelector('h1');
  if (titleElement) {
    this.titleAnimationService.initializeTitleAnimation(
      titleElement as HTMLElement, 
      'My Title'
    );
  }
}

// 4. Очистка
ngOnDestroy() {
  this.titleAnimationService.clearAnimation();
}
```

## ⚙️ С настройками

```typescript
const config = {
  animationFrames: 100,        // Количество кадров
  animationSpeed: 20,          // Скорость (мс)
  glitchChars: '!@#$%^&*()',   // Глитч символы
  cyberChars: '01',            // Цифры
  possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
};

this.titleAnimationService.initializeTitleAnimation(
  titleElement as HTMLElement, 
  'My Title',
  config
);
```

## 🎯 ViewChild (рекомендуется)

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

## 📱 Адаптивная конфигурация

```typescript
private getConfig() {
  const isMobile = window.innerWidth < 768;
  return {
    animationFrames: isMobile ? 60 : 80,
    animationSpeed: isMobile ? 30 : 25
  };
}
```

## ⚠️ Важно помнить

1. **Всегда очищайте анимацию** в `ngOnDestroy()`
2. **Проверяйте существование элемента** перед инициализацией
3. **Используйте ViewChild** для лучшей производительности
4. **Настраивайте параметры** под ваши нужды

## 🔧 API

- `initializeTitleAnimation(element, title, config?)` - запуск анимации
- `clearAnimation()` - остановка анимации
- `destroy()` - полная очистка сервиса
