// Main entry point and game initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the game
    game = new Game();
    
    // Start the game loop
    game.run();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Could implement canvas resizing here if needed
    });
    
    // Prevent context menu on right click
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    // Prevent default behavior for arrow keys and space
    document.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
            e.preventDefault();
        }
    });
    
    console.log('🎮 Super Mario Adventure Game Initialized!');
    console.log('🕹️ Use ARROW KEYS to move and SPACEBAR to jump');
    console.log('🪙 Collect coins and defeat enemies for points!');
});