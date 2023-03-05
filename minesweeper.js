//Logic of Game

export const TILE_STATUSES  = {
    HIDDEN:"hidden",
    NUMBER:"number",
    MINE:"mine",
    MARKED:"marked",
}

export function createBoard(boardSize,numberOfMines){
    let board = []

    const minePositions = getMinePositions(boardSize,numberOfMines)
    //console.log(minePositions);

    for(let x = 0;x<boardSize;x++){
        let row = []
        for(let y=0;y<boardSize;y++){

            const element = document.createElement('div')
            element.dataset.status = TILE_STATUSES.HIDDEN

            const tile = {
                element,
                x,
                y,
                mine:minePositions.some(positionMatch.bind(null,{x,y})), 
                get status(){
                    return this.element.dataset.status
                },
                set status(value){
                    this.element.dataset.status = value
                }
            
            }
            row.push(tile)
        }
        board.push(row)
    }

    return board
}

export function markTile(tile){
    if(tile.status !== TILE_STATUSES.HIDDEN &&
        tile.status!== TILE_STATUSES.MARKED){
            return;
        }

    if(tile.status=== TILE_STATUSES.MARKED){
        tile.status= TILE_STATUSES.HIDDEN
    }else{
        tile.status= TILE_STATUSES.MARKED
    }
}
export function revealTile(board,tile){
    if(tile.status!== TILE_STATUSES.HIDDEN){
        return
    }
    if(tile.mine){
        tile.status=TILE_STATUSES.MINE
        return
    }
    tile.status = TILE_STATUSES.NUMBER

    const adjacentTiles = nearbyTiles(board,tile)
    
    const mines = adjacentTiles.filter(m=>m.mine)
    
    if(mines.length===0){
        adjacentTiles.forEach(revealTile.bind(null,board))
    }else{
        tile.element.textContent = mines.length
    }
}

export function checkWin(board){
  return board.every(row=>{
    return row.every(tile=>{
        return (tile.status === TILE_STATUSES.NUMBER) || (
            tile.mine && (tile.status === TILE_STATUSES.MARKED || 
                tile.status === TILE_STATUSES.HIDDEN)
        )
    })
  })
}

export function checkLose(board){
    return board.some(row=>{
        return row.some(tile=>{
            return tile.status === TILE_STATUSES.MINE
        })
    })
}


function getMinePositions(boardSize,numberOfMines){
    const positions = []
    
    while(positions.length < numberOfMines){
        const position = {
            x: randumNumber(boardSize),
            y: randumNumber(boardSize),
        }

        if(!positions.some(p=>positionMatch(p,position))){
            positions.push(position)
        }
    }

    return positions
}

function positionMatch(a,b){
    return a.x==b.x && a.y==b.y
}

function randumNumber(num){
    return Math.floor(Math.random()*num)
}
function nearbyTiles(board,{x,y}){
    const pdosi = []
    for(let i=-1;i<=1;i++){
        for(let j = -1;j<=1;j++){
            const tile = board[x+i]?.[y+j]
            if(tile) pdosi.push(tile)
        }
    }

    return pdosi
}

