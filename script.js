
document.addEventListener('DOMContentLoaded', function() {
    var boardSize
    var allSquares
    var isGameOver
    var mineCount
    const MARKED_CLASS = 'marked'
    document.getElementById('board-size-form').addEventListener('submit', function(event) {
        event.preventDefault();
        mineCount = 0
        isGameOver = false
        //remove previous board
        const previousBoardSquares = document.querySelectorAll('.board-square');
        previousBoardSquares.forEach(function(square) {
            square.parentNode.removeChild(square);
        });
        //create the new board
        boardSize = Number(document.getElementById('board-size').value);

        const boardSquare = document.createElement('div');
        const boardSquareCover = document.createElement('div');
        boardSquare.setAttribute('class', 'board-common board-square');
        boardSquareCover.setAttribute('class', 'board-common board-square-cover');
        boardSquare.appendChild(boardSquareCover);

        const containerWidth = boardSize * 30
        const container = document.getElementById('container');
        container.style.width = `${containerWidth}px`
        container.style.height = `${containerWidth}px`

        //loop over the square number and render the board with covers and mines
        for (let index = 0; index < boardSize**2; index++) {
            const mineText = document.createTextNode('X');
            const boardSquareClone = boardSquare.cloneNode(true);
            const boardSquareCoverClone = boardSquareClone.querySelector('.board-square-cover');

            const isMine = Math.random() <= 0.15;
            if(isMine){
                mineCount++
                boardSquareClone.appendChild(mineText);
            }

            boardSquareCoverClone.addEventListener('click', checkSquare);
            boardSquareCoverClone.addEventListener('contextmenu', rightClickSquare);

            container.appendChild(boardSquareClone);
        }
        //assign adjacent mine count for each square
        allSquares = document.querySelectorAll('.board-square')
        for (var index = 0; index < allSquares.length; index++) {
            if(allSquares[index].textContent == 'X'){continue}
            var mineCounter = 0
            const adjacents = getAdjacents(index)
            adjacents.forEach(adjacent => {
                if(allSquares[adjacent]?.textContent == 'X'){
                mineCounter++
                }
            });
            const counterText = document.createTextNode(mineCounter == 0 ? '' : mineCounter);
            allSquares[index].appendChild(counterText) 
        }
    });

    function rightClickSquare(event){
        event.preventDefault();
        if(!isGameOver){
            const coverClickedClassList = event.target.classList;
            if(coverClickedClassList.contains(MARKED_CLASS)){
                coverClickedClassList.remove(MARKED_CLASS)
            }else{
                coverClickedClassList.add(MARKED_CLASS)
            }
        }
    }

    function checkSquare(event) {
        if(!isGameOver){
            const coverClicked = event.target;
            if(!coverClicked.classList.contains(MARKED_CLASS)){ //disallow clicks on marked squares
                coverClicked.style.display = 'none';
                const coverParent = event.target.parentNode
                const parentIndex = Array.from(coverParent.parentNode.children).indexOf(coverParent);
                const allSquareCoversBefore = document.querySelectorAll('.board-square-cover')
                if(coverParent.textContent == ''){
                    checkAdjacents(parentIndex)
                }else if(coverParent.textContent == 'X'){
                    isGameOver = true
                    coverParent.style.background = '#bf212f'
                    allSquareCoversBefore.forEach((cover)=>{
                        cover.style.display = 'none'
                    })
                    return;
                }
                const mineCovers = document.querySelectorAll('.board-square-cover:not([style*="display: none"])');
                if(mineCovers.length == mineCount){
                    isGameOver = true
                    const allSquares = document.querySelectorAll('.board-square')
                    allSquares.forEach((cover)=>{
                        cover.style.background = '#27b376'
                    })
                    mineCovers.forEach((cover)=>{
                        cover.style.background = '#006f3c'
                    })
                }
            }
        }
    }

    function getAdjacents(index){
        const middleAdjacent = [index+boardSize,index-boardSize]
        const rightAdjacent = [index+1, index+boardSize+1,index-boardSize+1]
        const leftAdjacent = [index-1, index+boardSize-1,index-boardSize-1]
        var adjacents = []
        if(index % boardSize == 0){ //checking if from the left most column
            adjacents = [...middleAdjacent, ...rightAdjacent]
        }else if((index-boardSize+1) % boardSize == 0){ //checking if from the right most column
            adjacents = [...middleAdjacent, ...leftAdjacent]
        }else{ //must be a center column square
            adjacents = [...middleAdjacent, ...leftAdjacent, ...rightAdjacent]
        }
        return adjacents
    }
    
    function checkAdjacents(currentSquareIndex) {
        const adjacents = getAdjacents(currentSquareIndex)
        adjacents.forEach(adjacent => {
            if(!['X', ' '].includes(allSquares[adjacent]?.textContent)){ 
                if(allSquares[adjacent]?.textContent == ''){
                    allSquares[adjacent].textContent = ' '
                    checkAdjacents(adjacent)
                }else if(adjacent >= 0 && adjacent < boardSize**2){
                    const cover = allSquares[adjacent].querySelector('.board-square-cover');
                    cover.style.display = 'none'
                }
            }
        });
    }
});