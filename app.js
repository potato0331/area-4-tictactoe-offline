const canvas = document.querySelector(".canvas");
const context = canvas.getContext("2d");
const resetButton = document.querySelector(".reset");
const undoButton = document.querySelector(".undo");
const firstrestrictButton = document.getElementsByName("firstrestrict");
const moveSound = new Audio("./resources/TAK.wav");

let firstrestrict;
if (document.getElementById("5*5").checked) {
  firstrestrict = 5;
} else if (document.getElementById("3*3").checked) {
  firstrestrict = 3;
} else {
  firstrestrict = -1;
}

for (let i = 0; i < firstrestrictButton.length; i++) {
  firstrestrictButton[i].addEventListener("click", () => {
    if (firstrestrictButton[i].id == "5*5") {
      firstrestrict = 5;
    }
    if (firstrestrictButton[i].id == "3*3") {
      firstrestrict = 3;
    }
    if (firstrestrictButton[i].id == "none") {
      firstrestrict = -1;
    }
  });
}

let area4game = new area4(firstrestrict);
area4game.drawboard(context);

resetButton.addEventListener("click", () => {
  area4game = new area4(firstrestrict);
  area4game.drawboard(context);
});

undoButton.addEventListener("click", () => {
  area4game.mainBoard.pop();
  area4game.gameEndFlag = 0; // 게임이 끝난채로 무르기했을시, 게임이 다시 진행되게끔 설정
  area4game.drawboard(context);
});

canvas.addEventListener("click", (e) => {
  if (area4game.gameEndFlag) {
    return;
  }

  let { inputX, inputY } = area4game.getPosition(e.offsetX, e.offsetY);

  if (inputX < 0 || inputX > 8 || inputY < 0 || inputY > 8) {
    return;
  } //보드판 밖 클릭 시 무시

  if (
    // getAllAvailableMove 함수에서 지금 착수 한 곳의 index값을 찾을 수 없다면
    area4game
      .getAllAvailableMove()
      .find((element) => element == inputX + 9 * inputY) === undefined
  ) {
    //착수 할 수 없는 곳 이므로 클릭시 무시
    alert("착수 할 수 없는 곳 입니다.");
    return;
  }

  area4game.putStone(inputX, inputY); //수 정보 입력
  moveSound.play();
  area4game.drawboard(context);
  if (area4game.checkWin(inputX, inputY)) {
    //setTimeout이 비동기 함수이기 때문에, alert가 drawboard의 작용을 막지 않는다. 지리네
    setTimeout(() => {
      if (area4game.getNextcolor() == "white") {
        alert("BLACK WIN!");
      } else {
        alert("WHITE WIN!");
      }
    });
    area4game.gameEndFlag = true;
    area4game.drawboard(context);
  }
  if (area4game.getAllAvailableMove().length == 0) {
    //보드판이 꽉 차서 둘 칸이 없다면
    setTimeout(() => {
      alert("DRAW!");
      area4game.gameEndFlag = true;
      area4game.drawboard(context);
    });
  }
});
