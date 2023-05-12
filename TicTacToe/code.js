window.addEventListener("load", () => {
  game.events();
  game.showscore();
});
class Game {
  
  buttons = document.querySelectorAll(".square");
  reset = document.querySelector("#reset");
  score = document.querySelector("#score");
  scoreX = parseInt(sessionStorage.getItem("scoreplayer1"))||0;
  scoreO = parseInt(sessionStorage.getItem("scoreplayer2"))||0;
  draw=true;
  wincombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  player1array = [];
  player2array = [];
  playerturn = true;
  
  showscore(){
    this.scoreX = parseInt(sessionStorage.getItem("scoreplayer1"))||0;
    this.scoreO = parseInt(sessionStorage.getItem("scoreplayer2"))||0;
    this.score.innerText=`Gracz X ${this.scoreX} : ${this.scoreO} Gracz O`;
  }
  events() {
    this.buttons.forEach((el) => {
      el.addEventListener("click", (e) => {
        this.addSign(e);
      });
    });
    this.reset.addEventListener("click", this.resetGame);

    document.querySelector("#closebtn").addEventListener("click",this.resetGame);
  }
  addSign(e) {
    if (e.target.innerText == "") {
      if (this.playerturn === true) {
        e.target.innerText = "X";
        this.playerturn = false;
        this.player1array.push(Number(e.target.getAttribute("square_index")));
        console.log(this.player1array, "Gracz X");
        this.checkWinner();
      } else {
        e.target.innerText = "O";
        this.playerturn = true;
        this.player2array.push(Number(e.target.getAttribute("square_index")));
        console.log(this.player2array, "Gracz O");
        this.checkWinner();
      }
    } else {
      return;
    }
  }
  checkWinner() {
    for (let i = 0; i < this.wincombination.length; i++) {
      if (this.wincombination[i].every((el) => this.player1array.includes(el))) {
        console.log("Wygrywa gracz X");
        document.querySelector(".modal-body").innerText="Wygrywa Gracz 1";
        this.scoreX++;
        this.draw=false;
        this.saveScore();
        $("#modalId").modal("show");
        return;
        
      }
      else if (this.wincombination[i].every((el) => this.player2array.includes(el))) {
        console.log("Wygrywa gracz O");
        document.querySelector(".modal-body").innerText="Wygrywa Gracz 2";
        this.scoreO++;
        this.draw=false;
        this.saveScore();
        $("#modalId").modal("show");
        
      }
      else {
        if(Number(this.player1array.length)+Number(this.player2array.length)==9 && this.draw){
        document.querySelector(".modal-body").innerText="Remis";
        $("#modalId").modal("show");
      }
    }
    
    }
  }
  resetGame=()=> {
    this.buttons.forEach((el) => {
      el.innerText = "";
      this.player1array = [];
      this.player2array = [];
      this.playerturn=true;
      this.draw=true;
      this.showscore();
      
    });
  }
  saveScore(){
    sessionStorage.setItem("scoreplayer1",this.scoreX);
    sessionStorage.setItem("scoreplayer2",this.scoreO);
  }
}
const game = new Game();
