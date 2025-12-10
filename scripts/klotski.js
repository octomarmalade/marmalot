const CELL_SIZE = 100;
const GAP = 4;
const CELL_WITH_GAP = CELL_SIZE + GAP;

const colors = [
            '#a8d5a3', '#95c990', '#82bd7d', '#6fb16a',
            '#5ca557', '#499944', '#368d31', '#23811e'
        ];

let pieces = [];
let moveHistory = [];
let draggedPiece = null;
let dragStartPos = { x: 0, y: 0 };
let pieceStartPos = { x: 0, y: 0 };

function initGame() {
    const board = document.getElementById('board');
    board.innerHTML = '';
            
    for (let i = 0; i < 20; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        board.appendChild(cell);
            }

    pieces = [
        { id: 0, x: 1, y: 0, w: 2, h: 2, type: '2x2', label: '', color: colors[0] },
        { id: 1, x: 0, y: 0, w: 1, h: 2, type: '1x2', label: '', color: colors[1] },
        { id: 2, x: 3, y: 0, w: 1, h: 2, type: '1x2', label: '', color: colors[2] },
        { id: 3, x: 0, y: 2, w: 1, h: 2, type: '1x2', label: '', color: colors[3] },
        { id: 4, x: 3, y: 2, w: 1, h: 2, type: '1x2', label: '', color: colors[4] },
        { id: 5, x: 1, y: 2, w: 2, h: 1, type: '2x1', label: '', color: colors[5] },
        { id: 6, x: 1, y: 3, w: 1, h: 1, type: '1x1', label: '', color: colors[6] },
        { id: 7, x: 2, y: 3, w: 1, h: 1, type: '1x1', label: '', color: colors[7] },
        { id: 8, x: 1, y: 4, w: 1, h: 1, type: '1x1', label: '', color: colors[6] },
        { id: 9, x: 2, y: 4, w: 1, h: 1, type: '1x1', label: '', color: colors[7] },
            ];

    moveHistory = [];
    document.getElementById('winMessage').classList.remove('show');

    pieces.forEach(piece => {
        const pieceEl = document.createElement('div');
        pieceEl.className = `piece piece-${piece.type}`;
        pieceEl.textContent = piece.label;
        pieceEl.style.backgroundColor = piece.color;
        pieceEl.style.left = `${10 + piece.x * CELL_WITH_GAP}px`;
        pieceEl.style.top = `${10 + piece.y * CELL_WITH_GAP}px`;
        pieceEl.dataset.id = piece.id;

        pieceEl.addEventListener('mousedown', startDrag);
        pieceEl.addEventListener('touchstart', startDrag);

        board.appendChild(pieceEl);
        });
    }

function startDrag(e) {
    e.preventDefault();
    e.stopPropagation();
            
    const pieceEl = e.currentTarget;
    draggedPiece = pieces.find(p => p.id == pieceEl.dataset.id);
            
    const touch = e.touches ? e.touches[0] : e;
    dragStartPos = { x: touch.clientX, y: touch.clientY };
    pieceStartPos = { x: draggedPiece.x, y: draggedPiece.y };

    pieceEl.classList.add('dragging');

    document.addEventListener('mousemove', drag, { capture: true });
    document.addEventListener('mouseup', endDrag, { capture: true });
    document.addEventListener('touchmove', drag, { passive: false, capture: true });
    document.addEventListener('touchend', endDrag, { capture: true });
}

function drag(e) {
    if (!draggedPiece) return;
    e.preventDefault();
    e.stopPropagation();

    const touch = e.touches ? e.touches[0] : e;
    const dx = touch.clientX - dragStartPos.x;
    const dy = touch.clientY - dragStartPos.y;

    const pieceEl = document.querySelector(`[data-id="${draggedPiece.id}"]`);
    pieceEl.style.left = `${10 + pieceStartPos.x * CELL_WITH_GAP + dx}px`;
    pieceEl.style.top = `${10 + pieceStartPos.y * CELL_WITH_GAP + dy}px`;
}

function endDrag(e) {
    if (!draggedPiece) return;
    e.stopPropagation();
    if (e.preventDefault) e.preventDefault();

    const touch = e.changedTouches ? e.changedTouches[0] : e;
    const dx = touch.clientX - dragStartPos.x;
    const dy = touch.clientY - dragStartPos.y;

    let newX = pieceStartPos.x;
    let newY = pieceStartPos.y;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 50) newX++;
        else if (dx < -50) newX--;
    } else {
        if (dy > 50) newY++;
        else if (dy < -50) newY--;
    }

    if (isValidMove(draggedPiece, newX, newY)) {
        moveHistory.push(JSON.parse(JSON.stringify(pieces)));
        draggedPiece.x = newX;
        draggedPiece.y = newY;
        checkWin();
    }

    const pieceEl = document.querySelector(`[data-id="${draggedPiece.id}"]`);
    pieceEl.classList.remove('dragging');
    updatePiecePosition(pieceEl, draggedPiece);

    draggedPiece = null;

    document.removeEventListener('mousemove', drag, { capture: true });
    document.removeEventListener('mouseup', endDrag, { capture: true });
    document.removeEventListener('touchmove', drag, { capture: true });
    document.removeEventListener('touchend', endDrag, { capture: true });
}

function isValidMove(piece, newX, newY) {
    if (newX < 0 || newY < 0 || newX + piece.w > 4 || newY + piece.h > 5) {
        return false;
    }

    for (let other of pieces) {
        if (other.id === piece.id) continue;
                
        if (!(newX + piece.w <= other.x || 
                newX >= other.x + other.w || 
                newY + piece.h <= other.y || 
                newY >= other.y + other.h)) {
            return false;
        }
    }

    return true;
}

function updatePiecePosition(pieceEl, piece) {
    pieceEl.style.left = `${10 + piece.x * CELL_WITH_GAP}px`;
    pieceEl.style.top = `${10 + piece.y * CELL_WITH_GAP}px`;
}


function checkWin() {
    const mainPiece = pieces[0];
    if (mainPiece.x === 1 && mainPiece.y === 3) {
        document.getElementById('winMessage').classList.add('show');
    }
}

function resetGame() {
    initGame();
}

function undoMove() {
    if (moveHistory.length === 0) return;

    pieces = moveHistory.pop();
    document.getElementById('winMessage').classList.remove('show');

    const board = document.getElementById('board');
    pieces.forEach(piece => {
        const pieceEl = board.querySelector(`[data-id="${piece.id}"]`);
        updatePiecePosition(pieceEl, piece);
    });
}

initGame();