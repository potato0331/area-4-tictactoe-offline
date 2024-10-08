class area4 {
  VACANT = " ";
  BLACK = "black";
  WHITE = "white";
  blockinterval = 68;
  sideMargin = 18;

  mainBoard = new Array();
  boardArray;
  scoreArray;

  constructor() {
    this.boardArray = Array.from(Array(10), () => new Array(10).fill(" "));
    this.scoreArray = Array.from(Array(10), () => new Array(10).fill(1)); //본문에 설명이 없어서 일단 만듬, ai관련기능이면 지우기
  }

  getPosition(offsetX, offsetY) {
    return {
      inputX: Math.floor((offsetX - this.sideMargin) / this.blockinterval),
      inputY: Math.floor((offsetY - this.sideMargin) / this.blockinterval),
    };
  }

  getBoardPosition(inputX, inputY) {
    return {
      boardX:
        inputX * this.blockinterval + this.blockinterval / 2 + this.sideMargin,
      boardY:
        inputY * this.blockinterval + this.blockinterval / 2 + this.sideMargin,
    };
  }

  getNextcolor() {
    if (this.mainBoard.length == 0) {
      return "black";
    } else {
      return this.mainBoard[this.mainBoard.length - 1].color == "black"
        ? "white"
        : "black";
    }
  } // mainboard의 이전 턴 정보에서 색을 뺴옴

  putStone(inputX, inputY) {
    let MoveInfo = Object.create(null);
    MoveInfo.x = inputX;
    MoveInfo.y = inputY;
    MoveInfo.color = this.getNextcolor();
    MoveInfo.order = this.mainBoard.length + 1;
    this.mainBoard.push(MoveInfo);
  } //그 수의 정보를 mainBoard에 입력

  checkArea(MoveInfo) {
    return { AreaX: MoveInfo.x % 3, AreaY: MoveInfo.y % 3 };
  } //두어진 수의 영역 확인하기

  drawStone(ctx, MoveInfo) {
    let { boardX, boardY } = this.getBoardPosition(MoveInfo.x, MoveInfo.y);
    //돌 위치 계산
    ctx.beginPath(); //새 선 그릴 준비
    ctx.strokeStyle = "darkgrey";
    ctx.lineWidth = 2;
    ctx.arc(boardX, boardY, 30, 0, 2 * Math.PI); //경로지정
    ctx.stroke(); // 선 그리기
    ctx.beginPath();
    ctx.fillStyle = MoveInfo.color; // 돌 색깔 지정
    ctx.arc(boardX, boardY, 30, 0, 2 * Math.PI);
    ctx.fill(); // 색 채우기
  }

  checkAvailableMove(MoveInfo) {
    // 각각의 칸을 0~80의 숫자로 표현
    //인덱스->좌표 변환식은 x=index % 9 y=Math.floor(index / 9)
    //좌표->인덱스 변환식은 x+9*y
    let AvailableMoveList = new Array();
    if (this.mainBoard.length == 0) {
      //첫 수일경우
      for (let i = 0; i < 81; i++) {
        if (
          !(
            i % 9 > 1 &&
            i % 9 < 7 &&
            Math.floor(i / 9) > 1 &&
            Math.floor(i / 9) < 7
          )
        ) {
          AvailableMoveList.push(i);
        }
      }
    } else {
      // 첫 수가 아닐경우
      let { AreaX, AreaY } = this.checkArea(MoveInfo);
      let NWsquare = 3 * AreaX + 27 * AreaY;
      let AvailableArea = [
        NWsquare,
        NWsquare + 1,
        NWsquare + 2,
        NWsquare + 9,
        NWsquare + 10,
        NWsquare + 11,
        NWsquare + 18,
        NWsquare + 19,
        NWsquare + 20,
      ];
      // 착수 가능한 영역 안 칸들의 인덱스 리스트
      for (let i of AvailableArea) {
        let occupied = this.mainBoard.find(
          (point) => point.x == i % 9 && point.y == Math.floor(i / 9)
        );
        if (occupied === undefined) {
          AvailableMoveList.push(i);
        }
      }
    }
    return AvailableMoveList;
  }

  drawAvailableMove(ctx, MoveList) {
    for (let i of MoveList) {
      let { boardX, boardY } = this.getBoardPosition(i % 9, Math.floor(i / 9));
      boardX -= 29;
      boardY -= 29; // 사각형 크기의 절반-getBoardPosition함수가 구해다주는 위치가 사각형의 중앙이기 때문에, 위치를 좌상단으로 옮겨줘야 함
      ctx.strokeStyle = "Yellow";
      ctx.lineWidth = 4;
      ctx.strokeRect(boardX, boardY, 58, 58);
    }
  }

  drawboard(ctx) {
    ctx.clearRect(0, 0, 648, 648); //보드영역 지우기
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        //정사각형그리기
        ctx.strokeRect(
          i * this.blockinterval + this.sideMargin,
          j * this.blockinterval + this.sideMargin,
          this.blockinterval,
          this.blockinterval
        );
      }
    }

    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        //큰정사각형그리기
        ctx.strokeRect(
          3 * i * this.blockinterval + this.sideMargin,
          3 * j * this.blockinterval + this.sideMargin,
          3 * this.blockinterval,
          3 * this.blockinterval
        );
      }
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";
    ctx.strokeRect(
      2 * this.blockinterval + this.sideMargin,
      2 * this.blockinterval + this.sideMargin,
      5 * this.blockinterval,
      5 * this.blockinterval
    );
    //첫수 금지선 그리기
    /** 여기까지 보드판 영역**/

    for (let MoveInfo of this.mainBoard) {
      this.drawStone(ctx, MoveInfo);
    }
    // 바둑알 그리기

    this.drawAvailableMove(
      ctx,
      this.checkAvailableMove(this.mainBoard[this.mainBoard.length - 1])
    );
  }
}
