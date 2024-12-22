const gameState = {
    level: 1,
    movesLeft: 5,
    selectedColor: null,
    circles: [],
    moveHistory: [],
    levelConfigs: {
        1: {
            circles: 2,
            colors: ['purple', 'orange', 'green'],
            solution: ['orange', 'purple'],
            maxMoves: 5
        },
        2: {
            circles: 4,
            colors: ['green', 'orange', 'pink', 'yellow', 'cyan', 'purple'],
            solution: ['green', 'orange', 'yellow', 'cyan'],
            maxMoves: 5
        }
    }
};

function exitGame() {
    if (confirm("Are you sure you want to exit the game?")) {
        window.location.href = "index.html";
    }
}

function initializeLevel() {
    const config = gameState.levelConfigs[gameState.level];
    gameState.circles = new Array(config.circles).fill(null);
    gameState.movesLeft = config.maxMoves;
    gameState.moveHistory = [];
    gameState.selectedColor = null;

    updateUI();
}

function updateUI() {
    // Update moves left
    document.getElementById('moves-left').textContent = `${gameState.movesLeft} Moves left`;

    // Update level badge
    document.querySelector('.level-badge').textContent = `L${gameState.level}`;

    // Update circles
    const circlesContainer = document.getElementById('circles');
    circlesContainer.innerHTML = '';
    gameState.circles.forEach((color, index) => {
        const circle = document.createElement('div');
        circle.className = 'circle';
        if (color) circle.style.backgroundColor = color;
        circle.onclick = () => handleCircleClick(index);
        circlesContainer.appendChild(circle);
    });

    // Update palette
    const palette = document.getElementById('palette');
    palette.innerHTML = '';
    const config = gameState.levelConfigs[gameState.level];
    config.colors.forEach(color => {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option';
        if (color === gameState.selectedColor) colorOption.classList.add('selected');
        colorOption.style.backgroundColor = color;
        colorOption.onclick = () => handleColorSelect(color);
        palette.appendChild(colorOption);
    });

    // Update moves history
    const movesContainer = document.getElementById('moves');
    movesContainer.innerHTML = '';
    gameState.moveHistory.forEach(move => {
        const moveElement = document.createElement('div');
        moveElement.className = 'move';

        const circles = document.createElement('div');
        circles.className = 'move-circles';
        move.colors.forEach(color => {
            const circle = document.createElement('div');
            circle.className = 'move-circle';
            circle.style.backgroundColor = color;
            circles.appendChild(circle);
        });

        moveElement.appendChild(circles);
        moveElement.innerHTML += `
            <div>Correct colors: ${move.correctColors}</div>
            <div>Correct positions: ${move.correctPositions}</div>
        `;
        movesContainer.appendChild(moveElement);
    });

    // Update submit button state
    const submitButton = document.getElementById('submit');
    submitButton.disabled = gameState.circles.includes(null) || gameState.movesLeft <= 0;
}

function handleColorSelect(color) {
    gameState.selectedColor = color;
    updateUI();
}

function handleCircleClick(index) {
    if (!gameState.selectedColor || gameState.movesLeft <= 0) return;
    gameState.circles[index] = gameState.selectedColor;
    updateUI();
}

function checkSolution() {
    const config = gameState.levelConfigs[gameState.level];
    const correctColors = gameState.circles.filter((color, i) => 
        config.solution.includes(color)
    ).length;

    const correctPositions = gameState.circles.filter((color, i) => 
        color === config.solution[i]
    ).length;

    gameState.moveHistory.push({
        colors: [...gameState.circles],
        correctColors,
        correctPositions
    });

    if (correctPositions === config.solution.length) {
        showModal('success');
    } else if (gameState.movesLeft <= 1) {
        showModal('failure');
    }

    gameState.movesLeft--;
    gameState.circles = new Array(config.circles).fill(null);
    updateUI();
}

function showModal(type) {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const message = document.getElementById('modal-message');
    const primaryBtn = document.getElementById('modal-primary');
    const secondaryBtn = document.getElementById('modal-secondary');

    if (type === 'success') {
        title.textContent = 'Congratulations!';
        message.textContent = "You've solved this level! Ready for the next challenge?";
        primaryBtn.textContent = 'Next Level';
        secondaryBtn.textContent = 'Replay';
        secondaryBtn.style.display = 'block';

        primaryBtn.onclick = () => {
            gameState.level++;
            initializeLevel();
            modal.style.display = 'none';
        };
        secondaryBtn.onclick = () => {
            initializeLevel();
            modal.style.display = 'none';
        };
    } else {
        title.textContent = 'Game Over';
        message.textContent = "Don't worry! Practice makes perfect. Try again!";
        primaryBtn.textContent = 'Retry';
        secondaryBtn.style.display = 'none';

        primaryBtn.onclick = () => {
            initializeLevel();
            modal.style.display = 'none';
        };
    }

    modal.style.display = 'flex';
}

document.getElementById('submit').onclick = checkSolution;

// Initialize the game
initializeLevel();
