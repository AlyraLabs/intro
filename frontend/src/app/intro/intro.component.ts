import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss',
		'./intro.component.adaptives.scss'
	],
  animations: [
    
    trigger('navSlideUp', [
      state('hidden', style({
        transform: 'translateX(-50%) translateY(80px)',
        opacity: 0,
        filter: 'blur(10px)'
      })),
      state('visible', style({
        transform: 'translateX(-50%) translateY(0)',
        opacity: 1,
        filter: 'blur(0px)'
      })),
      transition('hidden => visible', [
        animate('1.2s cubic-bezier(0.23, 1, 0.32, 1)')
      ])
    ]),
    trigger('headerSlideDown', [
      state('hidden', style({
        transform: 'translateY(-80px)',
        opacity: 0
      })),
      state('visible', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('hidden => visible', [
        animate('1.2s cubic-bezier(0.23, 1, 0.32, 1)')
      ])
    ]),

    trigger('mobileMenuSlide', [
      state('closed', style({
        transform: 'translateX(100%)',
        opacity: 0,
        pointerEvents: 'none'
      })),
      state('open', style({
        transform: 'translateX(0)',
        opacity: 1,
        pointerEvents: 'all'
      })),
      transition('closed => open', [
        animate('0.3s cubic-bezier(0.23, 1, 0.32, 1)')
      ]),
      transition('open => closed', [
        animate('0.3s cubic-bezier(0.23, 1, 0.32, 1)')
      ])
    ]),

    trigger('faqExpand', [
      state('collapsed', style({
        maxHeight: '0px',
        opacity: 0,
        overflow: 'hidden',
        paddingTop: '0px',
        paddingBottom: '0px'
      })),
      state('expanded', style({
        maxHeight: '200px',
        opacity: 1,
        overflow: 'hidden',
        paddingTop: '20px',
        paddingBottom: '30px'
      })),
      transition('collapsed => expanded', [
        animate('0.35s cubic-bezier(0.4, 0.0, 0.2, 1)')
      ]),
      transition('expanded => collapsed', [
        animate('0.3s cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ]),

    trigger('dropdownExpand', [
      state('collapsed', style({
        maxHeight: '0px',
        opacity: 0,
        overflow: 'hidden'
      })),
      state('expanded', style({
        maxHeight: '200px',
        opacity: 1,
        overflow: 'hidden'
      })),
      transition('collapsed => expanded', [
        animate('0.35s cubic-bezier(0.4, 0.0, 0.2, 1)')
      ]),
      transition('expanded => collapsed', [
        animate('0.3s cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ]),

  ]
})
export class IntroComponent implements OnInit {


  isButtonHovered = false;
  navAnimationState = 'visible';
  headerAnimationState = 'visible';
  titleAnimationState = 'visible';
  subtitleAnimationState = 'visible';
  infoTextAnimated = true;

  isNavExpanded = false;
  isEcosystemExpanded = false;
  
  isMobileMenuOpen = false;
  
  // FAQ state
  expandedFaqIndex: number | null = null;
  
  // Header Ecosystem dropdown
  isHeaderEcosystemOpen = false;
  
  faqData = [
    {
      question: "How do I get started?",
      answer: "Getting started with Blackhole is easy! Simply integrate our SDK into your application, and you'll have access to multi-chain liquidity aggregation. Check out our documentation for step-by-step integration guides."
    },
    {
      question: "How can I monetize with Blackhole?",
      answer: "Blackhole offers multiple monetization opportunities including fee sharing, liquidity provision rewards, and partner incentives. You can earn revenue from every trade that flows through your application."
    },
    {
      question: "What is the Blackhole fee?",
      answer: "Blackhole charges competitive fees that vary by chain and trade size. Our fee structure is transparent and designed to provide maximum value while ensuring sustainable operations. Fees typically range from 0.1% to 0.3%."
    },
    {
      question: "Which tokens and chains are supported?",
      answer: "Blackhole supports major chains including Ethereum, Polygon, Arbitrum, Optimism, Base, Avalanche, BSC, and many more. We support thousands of tokens across these networks with continuous expansion."
    },
    {
      question: "How is Blackhole different?",
      answer: "Blackhole breaks liquidity fragmentation by aggregating liquidity across multiple chains and DEXs. Unlike traditional solutions, we provide unified access to deep liquidity with optimal routing and execution."
    },
    {
      question: "What's the maximum throughput?",
      answer: "Blackhole can handle thousands of transactions per second across multiple chains simultaneously. Our infrastructure is built for scale and can accommodate high-volume trading applications."
    }
  ];
  
  activeNavIndex = 3;
  defaultNavIndex = 3;
  previousNavIndex = 3;
  

  constructor() {}

  ngOnInit() {
    this.updateNavGlassPosition();
  }

  private buttonHoverTimeout: any = null;

  onButtonMouseEnter() {
    if (this.buttonHoverTimeout) {
      clearTimeout(this.buttonHoverTimeout);
      this.buttonHoverTimeout = null;
    }
    
    if (!this.isButtonHovered) {
      this.isButtonHovered = true;
    }
  }

  onButtonMouseLeave() {
    
    this.buttonHoverTimeout = setTimeout(() => {
      this.isButtonHovered = false;
      this.buttonHoverTimeout = null;
    }, 50);
  }

  reloadPage() {
    window.location.reload();
  }

  onCommunityMouseEnter() {
    this.isNavExpanded = true;
    this.isEcosystemExpanded = false;
  }

  onEcosystemMouseEnter() {
    this.isEcosystemExpanded = true;
    this.isNavExpanded = false;
  }

  onCommunityMouseLeave() {
  }

  onNavMouseLeave(event: MouseEvent) {
    this.isNavExpanded = false;
    this.isEcosystemExpanded = false;
    
    
    this.previousNavIndex = this.activeNavIndex;
    this.activeNavIndex = this.defaultNavIndex;
    this.updateNavGlassPosition();
  }

  onOtherNavItemEnter() {
    this.isNavExpanded = false;
    this.isEcosystemExpanded = false;
  }

  onNavItemHover(index: number) {
    this.previousNavIndex = this.activeNavIndex;
    this.activeNavIndex = index;
    this.updateNavGlassPosition();
  }

  onNavMouseLeaveItem() {
    
    
  }

  private updateNavGlassPosition() {
    const indicator = document.querySelector('.nav-glass-indicator') as HTMLElement;
    const navItems = document.querySelectorAll('.nav-item');
    
    if (indicator && navItems.length > this.activeNavIndex) {
      const activeItem = navItems[this.activeNavIndex] as HTMLElement;
      const container = document.querySelector('.nav-content') as HTMLElement;
      
      if (activeItem && container) {
        
        const itemRect = activeItem.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const relativeX = itemRect.left - containerRect.left;
        
        
        const isMovingRight = this.activeNavIndex > this.previousNavIndex;
        const isMovingLeft = this.activeNavIndex < this.previousNavIndex;
        
        
        if (isMovingRight) {
          indicator.style.transformOrigin = 'left center';
        } else if (isMovingLeft) {
          indicator.style.transformOrigin = 'right center';
        } else {
          indicator.style.transformOrigin = 'center center';
        }
        
        
        indicator.style.width = `${itemRect.width}px`;
        indicator.style.height = `${itemRect.height}px`;
        indicator.style.transform = `translateX(${relativeX}px)`;
        
        
        let animationName = 'navGlassScale';
        if (isMovingRight) {
          animationName = 'navGlassScaleRight';
        } else if (isMovingLeft) {
          animationName = 'navGlassScaleLeft';
        }
        
        indicator.style.animation = `${animationName} 440ms cubic-bezier(0.23, 1, 0.32, 1)`;
        
        
        setTimeout(() => {
          indicator.style.animation = '';
          indicator.style.transformOrigin = 'center center';
        }, 440);
      }
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  toggleFaq(index: number) {
    if (this.expandedFaqIndex === index) {
      this.expandedFaqIndex = null;
    } else {
      // Плавная смена - сначала закрываем текущий, потом открываем новый
      if (this.expandedFaqIndex !== null) {
        const previousIndex = this.expandedFaqIndex;
        this.expandedFaqIndex = null;
        setTimeout(() => {
          this.expandedFaqIndex = index;
        }, 150); // Половина времени анимации
      } else {
        this.expandedFaqIndex = index;
      }
    }
  }

  isFaqExpanded(index: number): boolean {
    return this.expandedFaqIndex === index;
  }

  toggleHeaderEcosystem() {
    this.isHeaderEcosystemOpen = !this.isHeaderEcosystemOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const ecosystemContainer = target.closest('.header-ecosystem-container');
    const faqContainer = target.closest('.faq');
    
    // Если клик не внутри контейнера ecosystem dropdown, закрываем его
    if (!ecosystemContainer && this.isHeaderEcosystemOpen) {
      this.isHeaderEcosystemOpen = false;
    }
    
    // Если клик не внутри FAQ секции, закрываем все открытые FAQ
    if (!faqContainer && this.expandedFaqIndex !== null) {
      this.expandedFaqIndex = null;
    }
  }

} 