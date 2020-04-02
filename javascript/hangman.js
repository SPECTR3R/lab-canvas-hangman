/*jshint esversion: 6 */
class Hangman {
  constructor(words) {
    this.words = words;
    this.secretWord = this.pickWord();
    this.letters = [];
    this.guessedLetters = '';
    this.errorsLeft = 10;
  }

  pickWord() {
    return this.words[Math.floor(Math.random() * this.words.length)];
  }

  checkIfLetter(keyCode) {
    return keyCode > 64 && keyCode < 91 ? true : false;
  }

  checkClickedLetters(letter) {
    return this.letters.includes(letter) ? false : true;
  }

  addCorrectLetter(letter) {
    this.guessedLetters += letter;
  }

  addWrongLetter(letter) {
    this.errorsLeft -= 1;
  }

  checkGameOver() {
    return this.errorsLeft ? false : true;
  }

  checkWinner() {
    function filtraPalabra(palabra) {
      return palabra
        .split('')
        .sort((a, b) => a.localeCompare(b))
        .filter((item, pos, self) => self.indexOf(item) == pos)
        .join('');
    }
    if (filtraPalabra(this.guessedLetters) === filtraPalabra(this.secretWord)) {
      return true;
    } else return false;
  }
}

let keyLetter;
let keyCode;
let hangman;
const startGameButton = document.getElementById('start-game-button');
if (startGameButton) {
  startGameButton.addEventListener('click', event => {
    hangman = new Hangman(['node', 'javascript', 'react', 'miami', 'paris', 'amsterdam', 'lisboa']);
    hangman.secretWord = hangman.pickWord();
    hangmanCanvas = new HangmanCanvas(hangman.secretWord);
    hangmanCanvas.createBoard();
    hangmanCanvas.drawLines();
  });
}

ctx = document.getElementById('hangman').getContext('2d');

document.addEventListener('keydown', event => {
  keyCode = event.keyCode;
  keyLetter = event.key;

  if (hangman.checkIfLetter(keyCode)) {
    if (hangman.checkClickedLetters(keyLetter)) {
      hangman.letters.push(keyLetter);
      if (hangman.secretWord.includes(keyLetter)) {
        [...hangman.secretWord].forEach((e, i) => {
          if (e === keyLetter) hangmanCanvas.writeCorrectLetter(i);
        });
        hangman.addCorrectLetter(keyLetter);
        if (hangman.checkWinner()) hangmanCanvas.winner(ctx);
      } else {
        hangman.addWrongLetter();
        hangmanCanvas.writeWrongLetter(keyLetter, hangman.errorsLeft);
        hangmanCanvas.drawHangman(hangman.errorsLeft);
        if (hangman.checkGameOver()) hangmanCanvas.gameOver(ctx);
      }
    }
  }

  console.log(hangman.secretWord);
  console.log(hangman.guessedLetters);
});

//* generar palabra y pintar las rayas cuando start
//* escuchar las teclas y si es letra:
//*    si no es letra: (checkIfLetter), continua
//*    si sí:
// *       verificar si ya esta en las letras introducidas (checkClickedLetters)
// *           si sí: continua
//  *          si no : revisar si nuestra letra esta dentro de la palabra a adivinar

//  *                      si sí: pintar todas las letras en donde van (writeCorrectLetter) y checar si gano
//                        si no: restar a vidas (addWrongLetter) y pintarla (writeWrongLetter),
//                                pintar al ahorcado drawHangman y checar si perdio
