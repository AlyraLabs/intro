import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MouseGradientService } from '../services/mouse-gradient.service';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss',
		'./intro.component.adaptives.scss'
	]
})
export class IntroComponent {
  constructor(private mouseGradientService: MouseGradientService) {}

  onMouseMove(event: MouseEvent) {
    this.mouseGradientService.onMouseMove(event);
  }

  onMouseLeave(event: MouseEvent) {
    const element = event.currentTarget as HTMLElement;
    this.mouseGradientService.resetGradientPosition(element);
  }
} 