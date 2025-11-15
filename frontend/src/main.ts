import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

const enableAppAnimations = () =>
  document.documentElement.classList.add('app-ready');

// Prevent transitions until the page (fonts, background, etc.) has loaded.
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'complete') {
    enableAppAnimations();
  } else {
    window.addEventListener('load', enableAppAnimations, { once: true });
  }
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
