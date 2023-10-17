// Abstract base class for a player
abstract class Player {
  // Common properties (e.g. volume, song list, etc.) can be added here

  abstract play(): void;
  abstract pause(): void;
  abstract next(): void;

  // You can also have some concrete methods if they share the same logic
  // for both PremiumPlayer and PreviewPlayer
  setVolume(volume: number) {
    console.log(`Setting volume to ${volume}`);
  }
}

// PremiumPlayer extends the abstract Player
class PremiumPlayer extends Player {
  play() {
    console.log('Playing with premium quality');
  }

  pause() {
    console.log('Pausing premium player');
  }

  next() {
    console.log('Switching to the next song in premium player');
  }
}

// PreviewPlayer extends the abstract Player
class PreviewPlayer extends Player {
  play() {
    console.log('Playing in preview mode');
  }

  pause() {
    console.log('Pausing preview player');
  }

  next() {
    console.log('Switching to the next song in preview player');
  }
}

// Usage
// let currentPlayer: Player;

// if (userIsPremium) {
//   currentPlayer = new PremiumPlayer();
// } else {
//   currentPlayer = new PreviewPlayer();
// }

// currentPlayer.play();
// currentPlayer.next();
