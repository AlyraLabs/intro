import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare global {
  interface Window { gtag?: (...args: any[]) => void; }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(private router: Router) {}

  init(id: string) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        window.gtag?.('event', 'page_view', {
          send_to: id,
          page_path: event.urlAfterRedirects,
          page_title: document.title,
          page_location: window.location.href,
        });
      });
  }
}
