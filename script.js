import { createBoard,
         markTile,
         revealTile, 
         TILE_STATUSES,
         checkWin,
         checkLose, } from "./minesweeper.js";

//Display/UI


const BOARD_SIZE = 10
const NUMBER_OF_MINES = 10
const mineCount = document.querySelector('[data-mines-total]')
const messageText = document.querySelector('.subtext')

//1. Populate a board with tiles/mines
const board = createBoard(BOARD_SIZE,NUMBER_OF_MINES)
const boardElement = document.querySelector('.board')

board.forEach(row=>{
    row.forEach(tile=>{
        boardElement.append(tile.element)
        //For Right Click
        tile.element.addEventListener('contextmenu',e=>{
            
            e.preventDefault()
            markTile(tile)
            listMinesLeft( )
            
        })
   
        //For Left Click
        tile.element.addEventListener('click',()=>{
            
            revealTile(board,tile)
            checkGameEnd()
        })
        
        
    })
})


boardElement.style.setProperty("--size",BOARD_SIZE)
mineCount.textContent= NUMBER_OF_MINES

function listMinesLeft(){
    const markedTilesCount = board.reduce((count,row)=>{
        return count + row.filter(tile=> tile.status===TILE_STATUSES.MARKED).length
    },0)

    mineCount.textContent = NUMBER_OF_MINES - markedTilesCount
}

function checkGameEnd(){
    const win = checkWin(board)
    const lose = checkLose(board)

    if(win || lose){
        boardElement.addEventListener('click', stopProp , {capture:true})
        boardElement.addEventListener('constextmenu', stopProp , {capture:true})
    }

    if(win){
        messageText.textContent = "You Won"
    }

    if(lose){
        messageText.textContent = "You Lose"
        board.forEach(row=>{
            row.forEach(tile=>{
                if(tile.status === TILE_STATUSES.MARKED) markTile(tile)
                if(tile.mine) revealTile(board,tile)
            })
        })

    }
}

function stopProp(e){
    e.stopImmediatePropagation()
}



