const canvas = document.querySelector(".canvas");
const context = canvas.getContext("2d");

const startButton = document.querySelector(".start");

let area4game = new area4();
area4game.drawboard(context);

startButton.addEventListener("click", () => {
  alert("시작");
});

canvas.addEventListener("click", (e) => {
  let { inputX, inputY } = area4game.getPosition(e.offsetX, e.offsetY);

  if (inputX < 0 || inputX > 8 || inputY < 0 || inputY > 8) {
    return;
  } //보드판 밖 클릭 시 무시

  if (
    !area4game
      .getAllAvailableMove()
      .find((element) => element == inputX + 9 * inputY)
  ) {
    alert("착수 할 수 없는 곳 입니다.");
    return;
  } //착수 할 수 없는 곳 클릭시 무시

  area4game.putStone(inputX, inputY); //수 정보 입력
  area4game.drawboard(context);
});
