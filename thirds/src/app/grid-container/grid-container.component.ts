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

  loseText = ""

  rowLength = 4;

  nextGeneratedNumber = 3;
  forceGenNumberCountTurn = 0; // Forces generation of number to be either 1, 2

  highScore = 0;
  highScoreTurn = 1;

  currentTurn = 1;
  noMovesLeft = false;

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
    this.startGrid();
  }

  grid : Square[][] = []

  getGrid() : Square[][] {
    return this.grid
  }

  startGrid() : void {
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
    this.currentTurn = 1;
  }

  move(direction: Direction) {
      let didMove = false;

      switch (direction) {
        case Direction.North:
          didMove = this.moveUp()
          break;
        case Direction.South:
          didMove = this.moveDown();
          break;
        case Direction.West:
          didMove = this.moveLeft();
          break;
        case Direction.East:
          didMove = this.moveRight();
          break;
      }

      if (didMove === false) {
        console.log("Invalid move. no available move.")
        // Exit early if cant move;
        return;
      }
      console.log("moved: " + Direction[direction])


      console.log("Generating squares")
      this.generateSquares(direction, this.nextGeneratedNumber);

      this.nextGeneratedNumber = this.getWeightedRandomNextValue();
      this.noMovesLeft = this.isGridLocked(); 
  }

  moveUp() : boolean {
    let canMove = false;

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

          canMove = true;
        }
      }

      console.log("end x" + x)

    }

    return canMove;
  }

  moveDown() : boolean {
    let canMove = false;

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

          canMove = true;
        }
      }

      console.log("end x" + x)
    }

    return canMove;
  }

  moveLeft() : boolean {
    let canMove = false;

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
          canMove = true;
        }
      }

      console.log("end y" + y)
    }

    return canMove;
  }

  moveRight() : boolean {
    let canMove = false;

    for (let x = this.grid.length -1; x >= 0; x--) { 
      console.log("x: " + x)
      console.log(this.grid.length)

      for (let y = 0; y < this.grid[x].length; y++) { 
        // No index out of range error
        if (x - 1 < 0) {
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

          canMove = true;
        }
      }

      console.log("end x: " + x)
    }
    console.log("ending right")

    return canMove;
  }

  canCombine(c1 : Square, c2 : Square): boolean {
    // C1 is the hard row, c2 would be combining into it.

    // if one of square is zero, and other is nonzero, can also combine. 
    if (c1.value === 0 && c2.value !== 0) {
      // We only combine c1 with c2. c2 going into c1.
      return true;
    }

    // Cater for 1 and 2
    if ((c1.value + c2.value) === 3) {
      return true;
    }
    else {
      // Only combine if they are the same value.
      if (c1.value === c2.value && c1.value % 3 === 0 && c2.value % 3 === 0) {
        if (c1.value === 0 && c2.value === 0) {
          // Do not combine if they are both 0
          return false;
        }

        return true;
      }
    }

    return false;
  }

  generateSquares(direction : Direction, nextGeneratedSquare : number) {
    // Squares should generate if there is space at the opposite direction moved.
    const rows = this.grid.length - 1;
    const col = this.grid[0].length - 1

    let startPointX = 0;
    let endPointX = rows
    let startPointY = 0;
    let endPointY = col
    
    switch (direction) {
      case Direction.North:
        startPointX = 0;
        endPointX = col
        startPointY = col;
        endPointY = col
        break;
      case Direction.South:
        startPointX = 0;
        endPointX = rows
        startPointY = 0;
        endPointY = 0;
        break;
      case Direction.West:
        startPointX = col
        endPointX = col
        startPointY = 0
        endPointY = col
        break;
      case Direction.East:
        startPointX = 0
        endPointX = 0
        startPointY = 0
        endPointY = col
    }

    // Collect all empty squares in the relevant range
    const emptySquares: { x: number; y: number }[] = [];
    for (let x = startPointX; x <= endPointX; x++) {
      for (let y = startPointY; y <= endPointY; y++) {
        if (this.grid[x][y].value === 0) {
          emptySquares.push({ x, y });
        }
      }
    }

    console.log("logging emptys")
    console.log(emptySquares)

    // If there are no empty squares, do nothing
    if (emptySquares.length === 0) {
      console.log("No empty squares available to generate a new square.");
      return;
    }

    // Randomly select one empty square
    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    const randomSquare = emptySquares[randomIndex];

    
    // Generate a new square at the selected position
    const value = nextGeneratedSquare;
    const square: Square = {
      x: randomSquare.x,
      y: randomSquare.y,
      value,
      isEmpty: value !== 0 ? false : true,
    };

    console.log(`Generated value: ${value} at (${randomSquare.x}, ${randomSquare.y})`);
    this.grid[randomSquare.x][randomSquare.y] = square;

    this.currentTurn++;
  }

  
  getWeightedRandom(): number {
    const values = [0, 1, 2, 3, 6, 12, 24];
    const weights = [7, 1, 1, 5, 2, 0.5, 0.2];
  
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

  getWeightedRandomNextValue(): number {
    // Temp scaling
  
    if (this.nextGeneratedNumber === 1 && this.forceGenNumberCountTurn < 2) {
      if (this.forceGenNumberCountTurn + 1 == 2) {
        // generate a new number
      }
      else {
        this.nextGeneratedNumber = 2;
        this.forceGenNumberCountTurn++;
        return this.nextGeneratedNumber;
      }
    }
    else if (this.nextGeneratedNumber === 2 && this.forceGenNumberCountTurn < 2) {
      if (this.forceGenNumberCountTurn + 1 == 2) {
        // generate a new number

      }
      else {
        this.nextGeneratedNumber = 1
        this.forceGenNumberCountTurn++;
        return this.nextGeneratedNumber;
      }
    }

    const flagToGenerate3orHigher = this.forceGenNumberCountTurn === 1 ? true : false

    let values = [1, 2, 3, 6, 12, 24];
    
    const weights = this.getWeightsOfGeneratedNumbers(flagToGenerate3orHigher);
    
    // This means that we want to guarantee to generate a number thats not 1 or 2
    if (this.forceGenNumberCountTurn == 1) {
      values = values.slice(2);
    }

    console.log("count of force gen: "+ this.forceGenNumberCountTurn)

    // Reset count to 0 , we want to generate a number that its not 1 or 2.
    this.forceGenNumberCountTurn = 0;

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

  resetGame() : void {
    this.highScore = this.getHighScore();
    this.highScoreTurn = this.currentTurn > this.highScoreTurn ? this.currentTurn : this.highScoreTurn;

    this.startGrid();
    this.noMovesLeft = this.isGridLocked();
  }

  getHighScore(): number {
    let highestCount = 0;
    for (let x = 0; x < this.grid.length; x++) { // Fixed loop condition
      for (let y = 0; y < this.grid[x].length; y++) { // Fixed loop condition
        const squareValue = this.grid[x][y]?.value || 0; // Use optional chaining and fallback
        if (highestCount < squareValue) {
          highestCount = squareValue;
        }
      }
    }
    return highestCount; // Ensure the function always returns a value
  }

  getWeightsOfGeneratedNumbers(generateNumberNot1Or2 : boolean) : Array<number> {
    // this is a horrible way of doing this but its fast
    let weights = [4, 4, 5, 3, 0.5, 0.2];
    if (this.currentTurn <= 15) {
      ;
    }
    else if (this.currentTurn > 15 && this.currentTurn < 30) {
      weights = [1, 1, 4, 4, 2, 1];
    }
    else {
      weights = [1, 1, 4, 4, 4, 2];
    }

    if (generateNumberNot1Or2) {
      return weights.slice(2);
    }

    return weights;
  }

  isGridLocked(): boolean {
    // Check for empty squares
    for (let x = 0; x < this.grid.length; x++) {
      for (let y = 0; y < this.grid[x].length; y++) {
        if (this.grid[x][y].value === 0) {
          return false; // Grid is not locked if there are empty squares
        }
      }
    }
  
    // Check for combinable squares
    for (let x = 0; x < this.grid.length; x++) {
      for (let y = 0; y < this.grid[x].length; y++) {
        const currentSquare = this.grid[x][y];
  
        // Check adjacent squares
        if (x > 0 && this.canCombine(currentSquare, this.grid[x - 1][y])) {
          return false; // Can combine with the square above
        }
        if (x < this.grid.length - 1 && this.canCombine(currentSquare, this.grid[x + 1][y])) {
          return false; // Can combine with the square below
        }
        if (y > 0 && this.canCombine(currentSquare, this.grid[x][y - 1])) {
          return false; // Can combine with the square to the left
        }
        if (y < this.grid[x].length - 1 && this.canCombine(currentSquare, this.grid[x][y + 1])) {
          return false; // Can combine with the square to the right
        }
      }
    }
  
    // If no empty squares and no combinable squares, the grid is locked
    return true;
  }
}
