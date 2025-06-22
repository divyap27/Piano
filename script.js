const keys = ['c-key', 'd-key', 'e-key', 'f-key', 'g-key', 'a-key', 'b-key', 'high-c-key', 'c-sharp-key', 'd-sharp-key', 'f-sharp-key', 'g-sharp-key', 'a-sharp-key'];
const notes = [];
keys.forEach(function(key) {
  notes.push(document.getElementById(key));
});

// Frequency map for piano keys (C4 to C5)
const frequencies = {
  'c-key': 261.63, // C4
  'c-sharp-key': 277.18, // C#4
  'd-key': 293.66, // D4
  'd-sharp-key': 311.13, // D#4
  'e-key': 329.63, // E4
  'f-key': 349.23, // F4
  'f-sharp-key': 369.99, // F#4
  'g-key': 392.00, // G4
  'g-sharp-key': 415.30, // G#4
  'a-key': 440.00, // A4
  'a-sharp-key': 466.16, // A#4
  'b-key': 493.88, // B4
  'high-c-key': 523.25 // C5
};

// Web Audio API for playing sounds
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playNote(frequency) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.5);
}

function keyPlay(event) {
  event.target.style.backgroundColor = 'lightgray';
  const frequency = frequencies[event.target.id];
  if (frequency) {
    playNote(frequency);
  }
}

function keyReturn(event) {
  event.target.style.backgroundColor = '';
}

function assignKeyEvents(note) {
  note.onmousedown = keyPlay;
  note.onmouseup = keyReturn;
}

notes.forEach(assignKeyEvents);

// Song data
const songs = {
  'happy-birthday': {
    title: 'Happy Birthday',
    lines: [
      {
        words: ['HAP-', 'PY', 'BIRTH-', 'DAY', 'TO', 'YOU'],
        notes: ['G', 'G', 'A', 'G', 'C', 'B'],
        optional: { word: '', note: '' }
      },
      {
        words: ['HAP-', 'PY', 'BIRTH-', 'DAY', 'TO', 'YOU'],
        notes: ['G', 'G', 'A', 'G', 'D', 'C'],
        optional: { word: '', note: '' }
      },
      {
        words: ['HAP-', 'PY', 'BIRTH-', 'DAY', 'DEAR', 'FRI-'],
        notes: ['G', 'G', 'G', 'E', 'C', 'B'],
        optional: { word: 'END', note: 'A' }
      },
      {
        words: ['HAP-', 'PY', 'BIRTH-', 'DAY', 'TO', 'YOU!'],
        notes: ['F', 'F', 'E', 'C', 'D', 'C'],
        optional: { word: '', note: '' }
      }
    ]
  },
  'twinkle-twinkle': {
    title: 'Twinkle Twinkle',
    lines: [
      {
        words: ['TWIN-', 'KLE', 'TWIN-', 'KLE', 'LIT-', 'TLE'],
        notes: ['C', 'C', 'G', 'G', 'A', 'A'],
        optional: { word: '', note: '' }
      },
      {
        words: ['STAR,', 'HOW', 'I', 'WON-', 'DER', 'WHAT'],
        notes: ['G', 'F', 'F', 'E', 'E', 'D'],
        optional: { word: '', note: '' }
      },
      {
        words: ['YOU', 'ARE,', 'UP', 'A-', 'BOVE', 'THE'],
        notes: ['C', 'C', 'G', 'G', 'A', 'A'],
        optional: { word: '', note: '' }
      },
      {
        words: ['WORLD', 'SO', 'HIGH,', 'LIKE', 'A', 'DIA-'],
        notes: ['G', 'F', 'F', 'E', 'E', 'D'],
        optional: { word: '', note: '' }
      }
    ]
  },
  'mary-lamb': {
    title: 'Mary Had a Little Lamb',
    lines: [
      {
        words: ['MA-', 'RY', 'HAD', 'A', 'LIT-', 'TLE'],
        notes: ['E', 'D', 'C', 'D', 'E', 'E'],
        optional: { word: '', note: '' }
      },
      {
        words: ['LAMB,', 'LIT-', 'TLE', 'LAMB,', 'LIT-', 'TLE'],
        notes: ['E', 'D', 'D', 'D', 'E', 'E'],
        optional: { word: '', note: '' }
      },
      {
        words: ['LAMB,', 'MA-', 'RY', 'HAD', 'A', 'LIT-'],
        notes: ['E', 'E', 'D', 'C', 'D', 'E'],
        optional: { word: '', note: '' }
      },
      {
        words: ['TLE', 'LAMB,', 'ITS', 'FLEECE', 'WAS', 'WHITE'],
        notes: ['E', 'E', 'D', 'D', 'E', 'D'],
        optional: { word: '', note: '' }
      }
    ]
  }
};

// DOM elements
const nextOne = document.getElementById('first-next-line');
const nextTwo = document.getElementById('second-next-line');
const nextThree = document.getElementById('third-next-line');
const startOver = document.getElementById('fourth-next-line');
const lastLyric = document.getElementById('column-optional');
const songListItems = document.querySelectorAll('#song-list li');

let currentSong = 'happy-birthday';
let currentLine = 0;

function updateLyrics(lineIndex) {
  const song = songs[currentSong];
  const line = song.lines[lineIndex];
  const elements = [
    'one', 'two', 'three', 'four', 'five', 'six', 'optional'
  ];

  elements.forEach((el, index) => {
    const wordEl = document.getElementById(`word-${el}`);
    const noteEl = document.getElementById(`letter-note-${el}`);
    if (index < 6) {
      wordEl.innerHTML = line.words[index] || '';
      noteEl.innerHTML = line.notes[index] || '';
    } else {
      wordEl.innerHTML = line.optional.word;
      noteEl.innerHTML = line.optional.note;
      lastLyric.style.display = line.optional.word ? 'inline-block' : 'none';
    }
  });

  nextOne.hidden = lineIndex !== 0;
  nextTwo.hidden = lineIndex !== 1;
  nextThree.hidden = lineIndex !== 2;
  startOver.hidden = lineIndex !== 3;
}

function loadSong(songKey) {
  currentSong = songKey;
  currentLine = 0;
  updateLyrics(0);
}

nextOne.onclick = function() {
  currentLine = 1;
  updateLyrics(currentLine);
};

nextTwo.onclick = function() {
  currentLine = 2;
  updateLyrics(currentLine);
};

nextThree.onclick = function() {
  currentLine = 3;
  updateLyrics(currentLine);
};

startOver.onclick = function() {
  currentLine = 0;
  updateLyrics(currentLine);
};

songListItems.forEach(item => {
  item.addEventListener('click', () => {
    const songKey = item.getAttribute('data-song');
    loadSong(songKey);
    songListItems.forEach(li => li.classList.remove('active'));
    item.classList.add('active');
  });
});

// Initialize with the first song
loadSong('happy-birthday');
document.querySelector(`#song-list li[data-song="happy-birthday"]`).classList.add('active');