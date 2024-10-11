const canvas = document.querySelector(".canvas");
const context = canvas.getContext("2d");
const resetButton = document.querySelector(".reset");
const moveSound = new Audio("resources/TAK.wav");

let area4game = new area4();
area4game.drawboard(context);

resetButton.addEventListener("click", () => {
  area4game = new area4();
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
    !area4game
      .getAllAvailableMove()
      .find((element) => element == inputX + 9 * inputY)
  ) {
    //착수 할 수 없는 곳 이므로 클릭시 무시
    alert("착수 할 수 없는 곳 입니다.");
    return;
  }

  area4game.putStone(inputX, inputY); //수 정보 입력
  moveSound.play();
  area4game.drawboard(context);
  if (area4game.checkWin(inputX, inputY)) {
    setTimeout(() => {
      if (area4game.getNextcolor() == "white") {
        alert("BLACK WIN!");
      } //setTimeout이 비동기 함수이기 때문에, alert가 drawboard의 작용을 막지 않는다. 지리네
      else {
        alert("WHITE WIN!");
      }
    });
    area4game.gameEndFlag = true;
    area4game.drawboard(context);
  }
});
