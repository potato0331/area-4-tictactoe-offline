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
  alert(e.offsetX + "," + e.offsetY);
  area4game.putStone(inputX, inputY); //수 정보 입력
  area4game.drawboard(context);
});
