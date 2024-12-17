const solution1 = "DISNEY"; // Erstes Lösungswort
const solution2 = "PLUS";   // Zweites Lösungswort
const rows = 6;
const cols = 11; // 6 für DISNEY, 1 für die Lücke, 4 für PLUS

let currentRow = 0;
let currentCol = 0;
let gameOver = false;

// Grid erstellen
const grid = document.getElementById('grid');
for (let i = 0; i < rows * cols; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    if (i % cols === 6) {
        cell.style.border = "none";
        cell.style.backgroundColor = "transparent";
    }
    grid.appendChild(cell);
}
const cells = document.querySelectorAll('.cell');

// Tastatur erstellen
const keyboard = document.getElementById('keyboard');
const rowsKeys = [
    "QWERTZUIOP",  // Erste Zeile
    "ASDFGHJKL",   // Zweite Zeile
    "✓YXCVBNM⌫"    // Dritte Zeile mit Haken, Y und Löschen
];

rowsKeys.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');
    row.split("").forEach(letter => {
        const key = document.createElement('div');
        key.classList.add('key');
        key.textContent = letter;
        key.onclick = () => handleKeyPress(letter);
        rowDiv.appendChild(key);
    });
    keyboard.appendChild(rowDiv);
});

function handleKeyPress(letter) {
    if (gameOver) return;

    if (letter === "⌫") {
        removeLetter();
    } else if (letter === "✓") {
        checkWords();
    } else {
        // Überprüfe, ob eine Zelle bearbeitbar ist
        const editableCell = document.querySelector('.cell[contenteditable="true"]');
        if (editableCell) {
            editableCell.textContent = letter; // Ersetze den Inhalt der bearbeitbaren Zelle
            editableCell.contentEditable = false; // Deaktiviere die Bearbeitung
        } else {
            addLetter(letter);
        }
    }
}

function addLetter(letter) {
    if (currentCol < cols) {
        // Überspringe die Lücke
        if (currentCol === 6) currentCol++;

        const index = currentRow * cols + currentCol;
        cells[index].textContent = letter;
        currentCol++;
    }
}

function removeLetter() {
    if (currentCol > 0) {
        currentCol--;

        // Überspringe die Lücke
        if (currentCol === 6) currentCol--;

        const index = currentRow * cols + currentCol;
        cells[index].textContent = '';
    }
}

function checkWords() {
    if (currentCol < cols) return;

    let guess1 = "";
    let guess2 = "";

    // Erster Versuch: DISNEY
    for (let i = 0; i < 6; i++) {
        const index = currentRow * cols + i;
        guess1 += cells[index].textContent || " ";
    }

    // Zweiter Versuch: PLUS
    for (let i = 7; i < 11; i++) {
        const index = currentRow * cols + i;
        guess2 += cells[index].textContent || " ";
    }

    // Überprüfe die Buchstaben für DISNEY
    const solution1Letters = [...solution1]; // Kopie der Buchstaben von DISNEY
    const guess1Letters = [...guess1]; // Kopie der Buchstaben von der Eingabe

    for (let i = 0; i < 6; i++) {
        const index = currentRow * cols + i;
        const letter = guess1Letters[i];

        if (solution1[i] === letter) {
            cells[index].classList.add('correct');
            solution1Letters[i] = null; // Markiere als verwendet
            guess1Letters[i] = null; // Markiere als verwendet
        }
    }

    // Überprüfe die Buchstaben für PLUS
    const solution2Letters = [...solution2]; // Kopie der Buchstaben von PLUS
    const guess2Letters = [...guess2]; // Kopie der Buchstaben von der Eingabe

    for (let i = 0; i < 4; i++) {
        const index = currentRow * cols + (i + 7); // Offset für PLUS
        const letter = guess2Letters[i];

        if (solution2[i] === letter) {
            cells[index].classList.add('correct');
            solution2Letters[i] = null; // Markiere als verwendet
            guess2Letters[i] = null; // Markiere als verwendet
        }
    }

    // Zweiter Durchgang: Überprüfe auf vorhandene Buchstaben
    for (let i = 0; i < 6; i++) {
        const index = currentRow * cols + i;
        const letter = guess1Letters[i];

        if (letter && solution1Letters.includes(letter)) {
            cells[index].classList.add('present');
            solution1Letters[solution1Letters.indexOf(letter)] = null; // Markiere als verwendet
        }
    }

    for (let i = 0; i < 4; i++) {
        const index = currentRow * cols + (i + 7); // Offset für PLUS
        const letter = guess2Letters[i];

        if (letter && solution2Letters.includes(letter)) {
            cells[index].classList.add('present');
            solution2Letters[solution2Letters.indexOf(letter)] = null; // Markiere als verwendet
        }
    }

    // Überprüfe, ob die Lösungen korrekt sind
    if (guess1.trim() === solution1 && guess2.trim() === solution2) {
        document.getElementById('message').textContent = "Gewonnen!";
        gameOver = true;
    } else {
        currentRow++;
        currentCol = 0;

        if (currentRow === rows) {
            document.getElementById('message').textContent = "Verloren! Lösungen: " + solution1 + " und " + solution2;
            gameOver = true;
        }
    }

}

// Funktion zum Aktivieren der Zellenbearbeitung
function makeCellEditable(cell) {
    cell.contentEditable = true; // Mache die Zelle bearbeitbar
    cell.focus(); // Setze den Fokus auf die Zelle

    // Deaktiviere die Bearbeitung, wenn die Zelle den Fokus verliert
    cell.addEventListener('blur', () => {
        cell.contentEditable = false; // Deaktiviere die Bearbeitung
    });
}

// Initialisiere die erste Zelle als bearbeitbar
makeCellEditable(cells[currentRow * cols]);