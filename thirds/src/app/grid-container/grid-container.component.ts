import { Component, OnInit, HostListener} from '@angular/core';
import { GridSquareComponent } from "../grid-square/grid-square.component";
import { CommonModule } from '@angular/common';
import { Direction } from '../direction';
import { Square } from '../models/square';

@Component({
  selector: 'app-grid-container',
  imports: [GridSquareComponent, CommonModule],
  standalone: true,
  templateUrl: './grid-container.component.html',
  styleUrl: './grid-container.component.css'
})
export class GridContainerComponent implements OnInit {
  public Direction = Direction;

  loseText = "";

  rowLength = 4;

  @HostListener('window:keydown', ['$event'])
  handleKey(event : Event) {
    const key = (event as KeyboardEvent).key;
    switch (key) {
      case 'ArrowUp':
        this.move(Direction.North);
        break;
      case 'ArrowDown':
        this.move(Direction.South);
        break;
      case 'ArrowLeft':
        this.move(Direction.West);
        break;
      case 'ArrowRight':
        this.move(Direction.East);
        break;
      default:
        return; // exit this handler for other keys
    }
    event.preventDefault(); // prevent default action for arrow keys
  }

  ngOnInit(): void {
    let rows : any = [];
    for (let x = 0; x < this.rowLength; x++) {
      let columns : Square[] = []; 
      for (let y = 0; y < this.rowLength; y++) {
        const value = this.getWeightedRandom();
        const square : Square =  {
          x, y, value,
          isEmpty: value !== 0 ? false : true
        };

        columns.push(square);
      }
      
      rows.push(columns)
    }

    console.log(rows)

    this.grid = rows;
  }

  grid : Square[][] = []

  getGrid() : Square[][] {
    return this.grid
  }

  move(direction: Direction) {
      console.log("moved: " + Direction[direction])
      switch (direction) {
        case Direction.North:
          this.moveUp()
          break;
        case Direction.South:
          this.moveDown();
          break;
        case Direction.West:
          this.moveLeft();
          break;
        case Direction.East:
          this.moveRight();
          break;
      }
      console.log("Generating squares")
      this.generateSquares(direction);


  }

  moveUp() {
    for (let x = 0; x < this.grid.length; x++) {
      console.log("x: " + x)
      console.log(this.grid.length)

      for (let y = 0; y < this.grid[x].length; y++) { 
        // No index out of range error
        if (y+1 >= this.grid[x].length) {
          console.log("break")
          break;
        }

        let c1 = this.grid[x][y];
        let c2 = this.grid[x][y+1]
        const result = this.canCombine(c1, c2);
        console.log(`Result for combining ${result} for c1: ${c1.value} (${c1.x}, ${c1.y}) for c2: ${c2.value} (${c2.x}, ${c2.y})`)
        
        if (result) {
          // Set c1 with combined value
          this.grid[x][y].value = c1.value + c2.value
          // Set c2 to be zero (empty)
          this.grid[x][y+1].value = 0;
        }
      }

      console.log("end x" + x)

    }
  }

  moveDown() {
    for (let x = 0; x < this.grid.length; x++) {
      console.log("x: " + x)
      console.log(this.grid.length)

      for (let y = this.grid.length -1; y >= 0; y--) { 
        // No index out of range error
        if (y - 1 < 0) {
          console.log("break")
          break;
        }

        let c1 = this.grid[x][y];
        let c2 = this.grid[x][y-1]
        const result = this.canCombine(c1, c2);
        console.log(`Result for combining ${result} for c1: ${c1.value} (${c1.x}, ${c1.y}) for c2: ${c2.value} (${c2.x}, ${c2.y})`)
        
        if (result) {
          // Set c1 with combined value
          this.grid[x][y].value = c1.value + c2.value
          // Set c2 to be zero (empty)
          this.grid[x][y-1].value = 0;
        }
      }

      console.log("end x" + x)
    }
  }

  moveLeft() {
    for (let y = 0; y < this.grid.length; y++) {
      console.log("y: " + y)
      console.log(this.grid.length)

      for (let x = 0; x < this.grid[x].length; x++) { 
        // No index out of range error
        console.log("x" + x)
        if (x+1 >= this.grid[x].length) {
          console.log("break")
          break;
        }

        let c1 = this.grid[x][y];
        let c2 = this.grid[x+1][y]
        const result = this.canCombine(c1, c2);
        console.log(`Result for combining ${result} for c1: ${c1.value} (${c1.x}, ${c1.y}) for c2: ${c2.value} (${c2.x}, ${c2.y})`)
        
        if (result) {
          // Set c1 with combined value
          this.grid[x][y].value = c1.value + c2.value
          // Set c2 to be zero (empty)
          this.grid[x+1][y].value = 0;
        }
      }

      console.log("end y" + y)
    }
  }

  moveRight() {
    for (let x = this.grid.length -1; x >= 0; x--) { 
      console.log("x: " + x)
      console.log(this.grid.length)

      for (let y = 0; y < this.grid[x].length; y++) { 
        // No index out of range error
        if (x+1 > this.grid[x].length) {
          console.log("break")
          break;
        }

        let c1 = this.grid[x][y];
        let c2 = this.grid[x-1][y]
        const result = this.canCombine(c1, c2);
        console.log(`Result for combining ${result} for c1: ${c1.value} (${c1.x}, ${c1.y}) for c2: ${c2.value} (${c2.x}, ${c2.y})`)
        
        if (result) {
          // Set c1 with combined value
          this.grid[x][y].value = c1.value + c2.value
          // Set c2 to be zero (empty)
          this.grid[x-1][y].value = 0;
        }
      }

      console.log("end x" + x)
    }
  }

  canCombine(c1 : Square, c2 : Square): boolean {
    // C1 is the hard row, c2 would be combining into it.

    // if one of square is zero, and other is nonzero, can also combine. 
    if (c1.value === 0 && c2.value !== 0 || c2.value === 0 && c1.value !== 0) {
      return true;
    }

    // Cater for 1 and 2
    if ((c1.value + c2.value) === 3) {
      return true;
    }
    else {
      // Only combine if they are the same value.
      if (c1.value === c2.value && c1.value % 3 === 0 && c2.value % 3 === 0) {
        return true;
      }
    }

    return false;
  }

  generateSquares(direction : Direction) {
    // Squares should generate if there is space at the opposite direction moved.
    const rows = this.grid.length - 1;
    const col = this.grid[0].length - 1

    let startPointX = 0;
    let startPointY = 0;
    let endPointX = rows
    let endPointY = col
    
    switch (direction) {
      case Direction.North:
        startPointX = 0;
        startPointY = 0;
        endPointX = col
        endPointY = col
        break;
      case Direction.South:
        break;
      case Direction.West:
        startPointX = col
        startPointY = 0
        endPointX = col
        endPointY = col
        break;
      case Direction.East:
        startPointX = 0
        startPointY = 0
        endPointX = 0
        endPointY = col
    }

    
    for (let x = startPointX; x <= endPointX; x++) {
      console.log("x"+ x)
      for (let y = startPointY; y <= endPointY; y++) {
        console.log("y"+ y)

        if (this.grid[x][y].value !== 0) {
          continue;
        }
        const value = this.getWeightedRandom();
        const square : Square =  {
          x, y, value,
          isEmpty: value !== 0 ? false : true
        };

        console.log("Generated value:" + value)
        this.grid[x][y] = square;
      }
    }
  }

  
  getWeightedRandom(): number {
    const values = [0, 1, 2, 3, 6, 12, 24];
    const weights = [7, 7, 7, 4, 3, 0.5, 0.2];
  
    // Calculate the cumulative weight
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const rand = Math.random() * totalWeight;
  
    let cumulative = 0;
    for (let i = 0; i < values.length; i++) {
      cumulative += weights[i];
      if (rand < cumulative) {
        return values[i];
      }
    }
  
    // Fallback (shouldn't happen)
    return values[0];
  }

}
