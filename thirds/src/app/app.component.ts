import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GridContainerComponent } from "./grid-container/grid-container.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GridContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'thirds';
}
