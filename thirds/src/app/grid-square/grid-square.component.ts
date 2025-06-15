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
}
