class area4 {
  VACANT = " ";
  BLACK = "black";
  WHITE = "white"; //가이드에서 하래서 했는데 그래서 이거 ㅅㅂ 왜하는거임 상수선언의 의의란 뭘가...
  blockinterval = 68;
  sideMargin = 18; //"왼쪽으로 1픽셀만 옮겨주세요!"가 왜 죽일놈인지 알거같기도 합니다
  gameEndFlag = false;

  mainBoard = new Array();
  boardArray;

  constructor() {
    this.boardArray = Array.from(Array(9), () => new Array(9).fill(" "));
  }

  getPosition(offsetX, offsetY) {
    return {
      inputX: Math.floor((offsetX - this.sideMargin) / this.blockinterval),
      inputY: Math.floor((offsetY - this.sideMargin) / this.blockinterval),
    };
  } //클릭된 위치의 좌표값을 기반으로 칸의 위치를 구함

  getBoardPosition(inputX, inputY) {
    return {
      boardX:
        inputX * this.blockinterval + this.blockinterval / 2 + this.sideMargin,
      boardY:
        inputY * this.blockinterval + this.blockinterval / 2 + this.sideMargin,
    };
  } //칸의 위치값을 기반으로 그 칸의 중심점의 좌표값을 구함

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
    this.boardArray[inputY][inputX] = this.getNextcolor();
    //boardArray에 착수정보 저장
    let MoveInfo = Object.create(null);
    MoveInfo.x = inputX;
    MoveInfo.y = inputY;
    MoveInfo.color = this.getNextcolor();
    MoveInfo.order = this.mainBoard.length + 1;
    this.mainBoard.push(MoveInfo);
    //그 수의 정보를 mainBoard에 입력
  }

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

  getAllAvailableMove() {
    //각각의 칸을 0~80의 숫자로 표현
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
      let { AreaX, AreaY } = this.checkArea(
        this.mainBoard[this.mainBoard.length - 1]
      );
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

    if (AvailableMoveList.length == 0) {
      //만약 영역이 가득차 착수가 불가능 하다면, 겹치는 칸을 제외하고 전부 착수가능
      for (let i = 0; i < 81; i++) {
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
      //i는 getAllAvailableMove함수의 결과값인 인덱스 값의 집합
      let { boardX, boardY } = this.getBoardPosition(i % 9, Math.floor(i / 9));
      boardX -= 29;
      boardY -= 29; // 사각형 크기의 절반-getBoardPosition함수가 구해다주는 위치가 사각형의 중앙이기 때문에, 위치를 좌상단으로 옮겨줘야 함
      ctx.strokeStyle = "Yellow";
      ctx.lineWidth = 4;
      ctx.strokeRect(boardX, boardY, 58, 58);
    }
  }

  drawLastStone(ctx) {
    if (this.mainBoard.length == 0) {
      return;
    }
    let { boardX, boardY } = this.getBoardPosition(
      this.mainBoard[this.mainBoard.length - 1].x,
      this.mainBoard[this.mainBoard.length - 1].y
    );
    ctx.beginPath(); //새 선 그릴 준비
    ctx.fillStyle = this.getNextcolor();
    ctx.arc(boardX, boardY, 5, 0, 2 * Math.PI);
    ctx.fill(); // 색 채우기
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

    this.drawLastStone(ctx);
    //두어진 수에 빨간 표시

    if (!this.gameEndFlag) {
      //게임이 끝난게 아니라면
      this.drawAvailableMove(ctx, this.getAllAvailableMove());
    }
    //착수 가능한 영역을 노란 사각형으로 표시하기
  }

  checkWin(boardX, boardY) {
    //*주의* ssibal fucking long 내가 이거 언젠가는 최적화하고만다 ㅅㅂ
    let color = this.boardArray[boardY][boardX];
    let winFlag = false;

    //가로방향
    let rowCount = 0;
    for (let i = 1; i < 4; i++) {
      //가로방향-왼쪽방향
      if (boardX - i < 0) {
        break;
      } //보드판 밖으로 나가면 break
      if (this.boardArray[boardY][boardX - i] == color) {
        rowCount++;
      } else {
        break;
      } //색이 다르거나 없으면 break
    }
    for (let i = 1; i < 4; i++) {
      //가로방향-오른쪽방향
      if (boardX + i > 8) {
        break;
      }
      if (this.boardArray[boardY][boardX + i] == color) {
        rowCount++;
      } else {
        break;
      }
    }
    if (rowCount >= 3) {
      winFlag = true;
    } //가로방향을 합쳐서 3이상이면(착수된 돌 포함4개) winFlag에 표시

    //세로방향
    let columnCount = 0;
    for (let i = 1; i < 4; i++) {
      //세로방향-위쪽방향
      if (boardY - i < 0) {
        break;
      }
      if (this.boardArray[boardY - i][boardX] == color) {
        columnCount++;
      } else {
        break;
      }
    }
    for (let i = 1; i < 4; i++) {
      //가로방향-아래쪽방향
      if (boardY + i > 8) {
        break;
      }
      if (this.boardArray[boardY + i][boardX] == color) {
        columnCount++;
      } else {
        break;
      }
    }
    if (columnCount >= 3) {
      winFlag = true;
    }

    //좌상단-우하단대각선방향
    let NWtoSEdiagonalCount = 0;
    for (let i = 1; i < 4; i++) {
      //좌상단방향
      if (boardY - i < 0 || boardX - i < 0) {
        break;
      }
      if (this.boardArray[boardY - i][boardX - i] == color) {
        NWtoSEdiagonalCount++;
      } else {
        break;
      }
    }
    for (let i = 1; i < 4; i++) {
      //우하단방향
      if (boardY + i > 8 || boardX + i > 8) {
        break;
      }
      if (this.boardArray[boardY + i][boardX + i] == color) {
        NWtoSEdiagonalCount++;
      } else {
        break;
      }
    }
    if (NWtoSEdiagonalCount >= 3) {
      winFlag = true;
    }

    //우상단-좌하단대각선 방향
    let NEtoSWdiagonalCount = 0;
    for (let i = 1; i < 4; i++) {
      //우상단방향
      if (boardY - i < 0 || boardX + i > 8) {
        break;
      }
      if (this.boardArray[boardY - i][boardX + i] == color) {
        NEtoSWdiagonalCount++;
      } else {
        break;
      }
    }
    for (let i = 1; i < 4; i++) {
      //우하단방향
      if (boardY + i > 8 || boardX - i < 0) {
        break;
      }
      if (this.boardArray[boardY + i][boardX - i] == color) {
        NEtoSWdiagonalCount++;
      } else {
        break;
      }
    }
    if (NEtoSWdiagonalCount >= 3) {
      winFlag = true;
    }

    return winFlag;
  }
}
