import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
})
export class IntroComponent {

} 