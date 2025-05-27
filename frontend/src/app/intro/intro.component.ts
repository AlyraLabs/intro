import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TypingAnimationService } from '../services/typing-animation.service';
import { CryptoPriceService } from '../services/crypto-price.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss',
		'./intro.component.adaptives.scss'
	]
})
export class IntroComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('subtitleLine1') subtitleLine1!: ElementRef;
  @ViewChild('tokenImg') tokenImg!: ElementRef;
  
  chainsCount = 0;
  bridgesCount = 0;
  dexsCount = 0;
  priceChanges: Record<string, number> = {};
  
  private readonly BRIDGES_TARGET = 17;
  private readonly DEXS_TARGET = 12;
  private readonly ANIMATION_DURATION = 2000;
  private readonly DELAY_BETWEEN = 200;
  private readonly SUBTITLE_TEXT = 'Smarter routing. Safer transactions. Unified experience.';
  private subtitleAnimationComplete = false;
  private updateInterval: any;

  constructor(
    private router: Router,
    private titleService: Title,
    private typingAnimationService: TypingAnimationService,
    private cryptoPriceService: CryptoPriceService
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Blackhole Labs');
    document.documentElement.classList.add('intro-page');
    setTimeout(() => this.startCountAnimation(), 500);
    this.startPriceUpdates();
  }

  ngAfterViewInit() {
    this.startTypingAnimation();
    this.setTokenBorderColors();
  }

  ngOnDestroy() {
    document.documentElement.classList.remove('intro-page');
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  private async startTypingAnimation() {
    if (!this.subtitleLine1?.nativeElement) return;


    const isMobile = window.innerWidth <= 970;
    
    if (isMobile) {
      this.subtitleLine1.nativeElement.textContent = this.SUBTITLE_TEXT;
      this.subtitleAnimationComplete = true;
    } else if (this.subtitleLine1.nativeElement.textContent.trim() === '') {
      await this.typingAnimationService.typeText(
        this.subtitleLine1.nativeElement,
        this.SUBTITLE_TEXT,
        {
          delay: 35,
          cursor: true,
          cursorChar: '|',
          onComplete: () => {
            this.subtitleAnimationComplete = true;
          }
        }
      );
    } else if (!this.subtitleAnimationComplete) {
      this.subtitleLine1.nativeElement.textContent = this.SUBTITLE_TEXT;
      this.subtitleAnimationComplete = true;
    }
  }

  private easeOutQuad(x: number): number {
    return 1 - (1 - x) * (1 - x);
  }

  private startCountAnimation() {
    const startTime = performance.now();
    const chainsTarget = 32;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      
      const chainsProgress = Math.min((elapsed) / this.ANIMATION_DURATION, 1);
      const chainsEase = this.easeOutQuad(chainsProgress);
      this.chainsCount = Math.floor(chainsTarget * chainsEase);
      
      const bridgesProgress = Math.min((elapsed - this.DELAY_BETWEEN) / this.ANIMATION_DURATION, 1);
      const bridgesEase = this.easeOutQuad(Math.max(0, bridgesProgress));
      this.bridgesCount = Math.floor(this.BRIDGES_TARGET * bridgesEase);
      
      const dexsProgress = Math.min((elapsed - this.DELAY_BETWEEN * 2) / this.ANIMATION_DURATION, 1);
      const dexsEase = this.easeOutQuad(Math.max(0, dexsProgress));
      this.dexsCount = Math.floor(this.DEXS_TARGET * dexsEase);
      
      if (chainsProgress < 1 || bridgesProgress < 1 || dexsProgress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  private async setTokenBorderColors() {
    const tokens = document.querySelectorAll('.token');
    
    tokens.forEach((token, index) => {
      const img = token.querySelector('.token-img') as HTMLElement;
      if (!img) return;

      const imgClass = Array.from(img.classList).find(cls => 
        cls !== 'token-img' && !cls.startsWith('token-')
      );
      
      if (!imgClass) {
        console.error(`No image class found for token ${index}`);
        return;
      }

      const imageUrl = `/img/intro/${imgClass}.png`;
      console.log(`Processing token ${index} with image: ${imageUrl}`);

      const tempImg = new Image();
      tempImg.crossOrigin = 'anonymous';
      
      tempImg.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;

        canvas.width = tempImg.width;
        canvas.height = tempImg.height;
        ctx.drawImage(tempImg, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let r = 0, g = 0, b = 0;
        let count = 0;
        
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 0) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
        }
        
        if (count > 0) {
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          
          let borderColor;
          if (brightness < 0.5) {
            const lightenAmount = 0.3;
            borderColor = `rgb(${Math.min(255, r + (255 - r) * lightenAmount)}, 
                             ${Math.min(255, g + (255 - g) * lightenAmount)}, 
                             ${Math.min(255, b + (255 - b) * lightenAmount)})`;
          } else {
            borderColor = `rgb(${r}, ${g}, ${b})`;
          }
          
          console.log(`Token ${index} (${imgClass}): Original color: rgb(${r}, ${g}, ${b}), Brightness: ${brightness}, Border color: ${borderColor}`);
          (token as HTMLElement).style.setProperty('--token-border-color', borderColor);
        }
      };

      tempImg.onerror = (error) => {
        console.error(`Error loading image for token ${index} (${imgClass}):`, error);
      };
      
      tempImg.src = imageUrl;
    });
  }

  onMouseMove(event: MouseEvent, element: EventTarget | null) {
    if (!element) return;
    const rect = (element as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const gradientX = (x / rect.width) * 100;
    const gradientY = (y / rect.height) * 100;
    
    (element as HTMLElement).style.setProperty('--gradient-x', `${gradientX}%`);
    (element as HTMLElement).style.setProperty('--gradient-y', `${gradientY}%`);
  }

  onMouseLeave(element: EventTarget | null) {
    if (!element) return;
    (element as HTMLElement).style.removeProperty('--gradient-x');
    (element as HTMLElement).style.removeProperty('--gradient-y');
  }

  launchApp() {
    window.open('https://app.blackhole.exchange', '_blank');
  }

  reloadPage() {
    window.location.reload();
  }

  private startPriceUpdates() {
    this.updatePrices();
    
    this.updateInterval = setInterval(() => {
      this.updatePrices();
    }, 5 * 60 * 1000);
  }

  private updatePrices() {
    this.cryptoPriceService.getAllTokenPriceChanges().subscribe(
      changes => {
        this.priceChanges = changes;
      },
      error => {
        console.error('Error fetching price changes:', error);
      }
    );
  }

  getPriceChangeClass(ticker: string): string {
    const change = this.priceChanges[ticker] || 0;
    return change < 0 ? 'negative' : 'positive';
  }

  getPriceChangeText(ticker: string): string {
    const change = this.priceChanges[ticker] || 0;
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
  }
} 