import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TypingAnimationService } from '../services/typing-animation.service';
import { TitleAnimationService } from '../services/title-animation.service';

@Component({
  selector: 'app-developers',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './developers.component.html',
  styleUrls: ['./developers.component.scss',
		'./developers.component.adaptives.scss'
	],
})
export class DevelopersComponent implements AfterViewInit, OnDestroy {
  @ViewChild('description') descriptionEl!: ElementRef<HTMLElement>;
	@ViewChild('description2') description2El!: ElementRef<HTMLElement>;
	@ViewChild('description3') description3El!: ElementRef<HTMLElement>;

  isMobileMenuOpen = false;
  private menuItems: { element: HTMLElement; originalText: string }[] = [];
  private activeAnimations: Set<HTMLElement> = new Set();

  constructor(
    private renderer: Renderer2,
    private typingAnimation: TypingAnimationService,
    private titleAnimationService: TitleAnimationService
  ) {}

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    const pageContainer = document.querySelector('.page-container') as HTMLElement;
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      if (pageContainer) {
        pageContainer.style.overflow = 'hidden';
        pageContainer.style.height = 'calc(100dvh - 40px)';
      }
    } else {
      document.body.style.overflow = '';
      if (pageContainer) {
        pageContainer.style.overflow = '';
        pageContainer.style.height = '';
      }
    }
  }

  ngAfterViewInit(): void {
    this.typingAnimation.initialize(
      undefined, 
      [this.descriptionEl, this.description2El, this.description3El],
      this.renderer
    );
    
    
    this.initializeMenuAnimation();
  }

  private initializeMenuAnimation(): void {
    
    const menuLinks = document.querySelectorAll('.menu a');
    
    menuLinks.forEach((link) => {
      const element = link as HTMLElement;
      const originalText = element.textContent || '';
      
      
      this.menuItems.push({ element, originalText });
      
      
      element.addEventListener('mouseenter', () => {
        
        this.titleAnimationService.clearAnimationForElement(element);
        
        
        element.textContent = originalText;
        
        
        this.activeAnimations.add(element);
        this.titleAnimationService.startTitleAnimation(
          element,
          originalText,
          {
            animationFrames: 30,
            animationSpeed: 25,
            glitchChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            cyberChars: '01',
            possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
          }
        );
      });
      
      
      element.addEventListener('mouseleave', () => {
        
        
      });
    });

    
    const tagElements = document.querySelectorAll('.tag');
    
    tagElements.forEach((tag) => {
      const element = tag as HTMLElement;
      const originalText = element.textContent || '';
      
      
      this.menuItems.push({ element, originalText });
      
      
      element.addEventListener('mouseenter', () => {
        
        this.titleAnimationService.clearAnimationForElement(element);
        
        
        element.textContent = originalText;
        
        
        this.activeAnimations.add(element);
        this.titleAnimationService.startTitleAnimation(
          element,
          originalText,
          {
            animationFrames: 30,
            animationSpeed: 25,
            glitchChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            cyberChars: '01',
            possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
          }
        );
      });
      
      
      element.addEventListener('mouseleave', () => {
        
        
      });
    });

    
    const postElements = document.querySelectorAll('.post p');
    
    postElements.forEach((postElement) => {
      const element = postElement as HTMLElement;
      const originalText = element.textContent || '';
      
      
      this.menuItems.push({ element, originalText });
      
      
      element.addEventListener('mouseenter', () => {
        
        this.titleAnimationService.clearAnimationForElement(element);
        
        
        element.textContent = originalText;
        
        
        this.activeAnimations.add(element);
        this.titleAnimationService.startTitleAnimation(
          element,
          originalText,
          {
            animationFrames: 30,
            animationSpeed: 25,
            glitchChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            cyberChars: '01',
            possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
          }
        );
      });
      
      
      element.addEventListener('mouseleave', () => {
        
        
      });
    });

    
    const bottomLinkElements = document.querySelectorAll('.bottom-link');
    
    bottomLinkElements.forEach((bottomLink) => {
      const element = bottomLink as HTMLElement;
      const originalText = element.textContent || '';
      
      
      this.menuItems.push({ element, originalText });
      
      
      element.addEventListener('mouseenter', () => {
        
        this.titleAnimationService.clearAnimationForElement(element);
        
        
        element.textContent = originalText;
        
        
        this.activeAnimations.add(element);
        this.titleAnimationService.startTitleAnimation(
          element,
          originalText,
          {
            animationFrames: 30,
            animationSpeed: 25,
            glitchChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            cyberChars: '01',
            possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
          }
        );
      });
      
      
      element.addEventListener('mouseleave', () => {
        
        
      });
    });

    
    const buttonElements = document.querySelectorAll('.button');
    
    buttonElements.forEach((button) => {
      const buttonElement = button as HTMLElement;
      const textElement = buttonElement.querySelector('p') as HTMLElement;
      
      if (textElement) {
        const originalText = textElement.textContent || '';
        
        
        this.menuItems.push({ element: textElement, originalText });
        
        
        buttonElement.addEventListener('mouseenter', () => {
          
          this.titleAnimationService.clearAnimationForElement(textElement);
          
          
          textElement.textContent = originalText;
          
          
          this.activeAnimations.add(textElement);
          this.titleAnimationService.startTitleAnimation(
            textElement,
            originalText,
            {
              animationFrames: 30,
              animationSpeed: 25,
              glitchChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
              cyberChars: '01',
              possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            }
          );
        });
        
        
        buttonElement.addEventListener('mouseleave', () => {
          
          
        });
      }
    });
  }

  private stopAllAnimations(): void {
    
    this.titleAnimationService.clearAnimation();
    
    
    this.menuItems.forEach(({ element, originalText }) => {
      element.textContent = originalText;
    });
    
    
    this.activeAnimations.clear();
  }

  ngOnDestroy(): void {
    this.typingAnimation.destroy();
    this.stopAllAnimations();
    
    
    document.body.style.overflow = '';
    const pageContainer = document.querySelector('.page-container') as HTMLElement;
    if (pageContainer) {
      pageContainer.style.overflow = '';
      pageContainer.style.height = '';
    }
  }
} 
