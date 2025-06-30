export interface Square {
    x: number;
    y: number;
    value: number;
    isEmpty: boolean;
    animationState: 'default' | 'combined' | 'spawn'; // Add animation state
}
