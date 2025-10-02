const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 400,
    backgroundColor: '#1d1d1d',
    parent: 'game',
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

const ROWS = 8;
const COLS = 8;
const GEM_SIZE = 50;
let gems = [];

function preload() {
    this.load.image('gem', 'assets/gem.png'); // картинка фишки
}

function create() {
    // создаём поле
    for (let row = 0; row < ROWS; row++) {
        gems[row] = [];
        for (let col = 0; col < COLS; col++) {
            let x = col * GEM_SIZE + GEM_SIZE / 2;
            let y = row * GEM_SIZE + GEM_SIZE / 2;
            let gem = this.add.sprite(x, y, 'gem').setInteractive();
            gem.setTint(Phaser.Display.Color.RandomRGB().color); // разные цвета
            gem.row = row;
            gem.col = col;
            gem.on('pointerdown', () => selectGem(this, gem));
            gems[row][col] = gem;
        }
    }
}

let selectedGem = null;

function selectGem(scene, gem) {
    if (!selectedGem) {
        selectedGem = gem;
        gem.setScale(1.2);
    } else {
        // меняем местами с соседом
        if (areNeighbors(selectedGem, gem)) {
            swapGems(selectedGem, gem);
            checkMatches(scene);
        }
        selectedGem.setScale(1);
        selectedGem = null;
    }
}

function areNeighbors(g1, g2) {
    return (Math.abs(g1.row - g2.row) + Math.abs(g1.col - g2.col)) === 1;
}

function swapGems(g1, g2) {
    let tempTint = g1.tintTopLeft;
    g1.setTint(g2.tintTopLeft);
    g2.setTint(tempTint);
}

function checkMatches(scene) {
    let matches = [];

    // горизонтали
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS - 2; col++) {
            let c1 = gems[row][col].tintTopLeft;
            let c2 = gems[row][col+1].tintTopLeft;
            let c3 = gems[row][col+2].tintTopLeft;
            if (c1 === c2 && c2 === c3) {
                matches.push(gems[row][col], gems[row][col+1], gems[row][col+2]);
            }
        }
    }

    // вертикали
    for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS - 2; row++) {
            let c1 = gems[row][col].tintTopLeft;
            let c2 = gems[row+1][col].tintTopLeft;
            let c3 = gems[row+2][col].tintTopLeft;
            if (c1 === c2 && c2 === c3) {
                matches.push(gems[row][col], gems[row+1][col], gems[row+2][col]);
            }
        }
    }

    // удаляем совпадения
    matches.forEach(gem => {
        gem.setTint(Phaser.Display.Color.RandomRGB().color); // обновляем цвет
    });
}

function update() {}
