import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-grid-square',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './grid-square.component.html',
  styleUrl: './grid-square.component.css'
})
export class GridSquareComponent {
  @Input() square_value : number = 0;
  @Input() animationState: 'default' | 'combined' = 'default'; // Add animation state

  getBackgroundColor() {
    if (this.animationState === 'combined') {
      return ''
    }

    switch (this.square_value) {
      case 2:
        return '#ff4f4f';
      case 1:
        return '#4f65ff';
      case 0:
        return '#767885';
      default:
        return 'lightgrey';
    }
  } 
}
