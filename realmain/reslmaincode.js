let scene = -1;
let trashList = [];
let maxTrash = 50;
let trashAddInterval = 10;
let trashCount = 0;
let flyRoom;
let maxFlies = 50;
let flyAddInterval = 10;
let doorOpen = false;
let textDisable = 0;
let ballDisable = 0;

//쓰레기
let handPose;
let video;
let hands = [];

let ball = { x: 300, y: 300, r: 20, held: false };
let isGrabbing = false;

function preload() {
  handPose = ml5.handPose();
}

//설거지
let predictions = [];

let stainLayer;
let cleared = false;

let plateCount = 0;
let maxPlates = 3;
let finishedPlates = [];

let Handpose = {
  model: null,
  detectStart: function (videoElement, callback) {
    this.model = ml5.handpose(videoElement, () => {
      console.log("Handpose 모델 준비됨");
    });
    this.model.on("predict", callback);
  },
};


function gotHands(results) {
  predictions = results;
}



function setup() {
  createCanvas(windowWidth, windowHeight);
  flyRoom = createFlyRoom();
  textFont('Arial');
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  handPose.detectStart(video, gotHands);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  mianCode();
}

function mianCode() {
  background(222, 184, 135);

  if (scene === -1) {
    drawStartScreen();
  } else if (scene === 0) {
    drawCleanRoom();
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(" 아 귀찮아..\n 나중에 치우지 뭐", width/2, height/2);
  } else if (scene === 1) {
    drawRoomWithTrash();
    if (frameCount % trashAddInterval === 0 && trashCount < maxTrash) {
      trashList.push(new Trash());
      trashCount++;
    }
    if (trashCount >= maxTrash) {
      scene = 2;
    }
  } else if (scene === 2) {
    drawRoomWithTrash();
    flyRoom.update();
    if (frameCount % flyAddInterval === 0 && flyRoom.count() < maxFlies) {
      flyRoom.addFly();
    }
  } else if (scene === 3) {
    clickSink();
    washDish();
  } else if (scene === 4) {
    clickTrash(); // 이 안에 손 관련 내용 포함
    awayGarbage();
  } else if (scene === 5) {
    drawSunlightEnding();
  } else if (scene === 6) {
    drawAngryapart();
  } else if (scene === 4.5){
    drawHappyapart();
  }
}

function keyPressed() {
  if (key === 'n' || key === 'N') {
    scene = 4.5;
  }
  if (key === 'm' || key === 'M') {
    scene = 5;
  }
  if (key === 's' || key === 'S') {
    scene = 6;
    textDisable = 1;
  }
 
}

function drawStartScreen() {
  push();
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("2025년 6월 어느날...", width / 2, height / 2);
  pop();
}

function clickSink() {
  push();
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("이제 정말 치워야겠다...", width / 2, height / 2);

  pop();
}

function clickTrash() {
  push();
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("이제 정말 치우자...", width / 2, height / 2);
  pop();
}

function mousePressed() {
  if (scene === -1) {
    scene = 0;
    return;
  }
  if (scene === 0) {
    scene = 1;
    return;
  }

  // 문 클릭
  if (mouseX > width - width * 0.15 && mouseX < width && mouseY > 0 && mouseY < height) {
    doorOpen = !doorOpen;
  }

  // 싱크대 클릭
  let sinkX = width / 2;
  let sinkY = height / 3;
  let sinkWidth = 100;
  let sinkHeight = 10;

  if (mouseX > sinkX && mouseX < sinkX + sinkWidth &&
      mouseY > sinkY && mouseY < sinkY + sinkHeight + 40) {
    scene = 3;
    return;
  
  }

  // 쓰레기통 클릭
  let trashX = width / 4;
  let trashY = height * 0.7;
  let trashWidth = width / 2;
  let trashHeight = 200;


  if (mouseX > trashX && mouseX < trashX + trashWidth &&
      mouseY > trashY && mouseY < trashY + trashHeight + 40) {
    scene = 4;
    return;
  }

  // 돌아가기 버튼 (좌측 상단)
  if(scene === 4 && mouseX < width/10 && mouseY < height/10){
    scene = 1;
  }
  if(scene === 3 && mouseX < width/10 && mouseY < height/10){
    scene = 1;
  }
  if(scene === 6 && mouseX < width/10 && mouseY < height/10){
    scene = 1;
  }
}

function drawCleanRoom() {
  push();
  drawRoomBackground();
  pop();
}

function drawRoomWithTrash() {
  push();  
  drawRoomBackground();
  for (let t of trashList) {
    t.display();
  }
  pop();
  


  push();
  fill(0);
  textSize(15);
  textAlign(CENTER, CENTER);
  if (textDisable === 0) {
    text("파리가 나오면 s를 누르세요", 100, 15);
  }
  pop();

}

function drawRoomBackground() {
  push();
  background(240, 240, 220);
  let floorHeight = height * 0.25;
  let wallColor = color(230, 230, 210);
  let floorColor = color(210, 200, 180);

  noStroke();
  fill(wallColor);
  quad(0, 0, width, 0, width, height - floorHeight, 0, height - floorHeight);
  fill(floorColor);
  quad(width*0.17, height - floorHeight - 50, width*0.83, height - floorHeight - 50, width, height, 0, height);

  // 벽선
  push();
  stroke(floorColor);
  strokeWeight(3);
  line(width*0.17, height - floorHeight - 50, width*0.17, 0);
  line(width*0.83, height - floorHeight - 50, width*0.83, 0);
  pop();

  // 싱크대
  fill(245);
  rect(width*0.17, height/3, width*0.66, 115);
  let sinkX = width / 2;
  let sinkY = height / 3;
  fill(230);
  rect(sinkX, sinkY, 100, 10);
  fill(200);
  rect(sinkX + 70, sinkY - 40, 5, 40);
  ellipse(sinkX + 77, sinkY - 10, 7, 7);

  // 고무장갑
  fill(255, 105, 180);
  let gloveX = sinkX + 70;
  let gloveY = sinkY - 10;
  rect(gloveX, gloveY, 10, 10, 3);
  beginShape();
  vertex(gloveX + 1, gloveY + 10);
  vertex(gloveX + 1, gloveY + 25);
  vertex(gloveX + 2, gloveY + 25);
  vertex(gloveX + 2, gloveY + 35);
  vertex(gloveX + 4, gloveY + 25);
  vertex(gloveX + 4, gloveY + 35);
  vertex(gloveX + 6, gloveY + 25);
  vertex(gloveX + 6, gloveY + 35);
  vertex(gloveX + 8, gloveY + 25);
  vertex(gloveX + 8, gloveY + 35);
  vertex(gloveX + 9, gloveY + 25);
  vertex(gloveX + 9, gloveY + 10);
  endShape(CLOSE);

  // 침대
  let bedX = width * 0.03;
  let bedY = height - floorHeight + 20;
  let bedWidth = width * 0.3;
  let bedHeight = 100;
  let mattressHeight = 30;
  fill(72, 209, 204);
  rect(bedX, bedY, bedWidth, mattressHeight, 8);
  fill(139, 79, 30);
  rect(bedX, bedY + mattressHeight, bedWidth, bedHeight - mattressHeight, 8);
  fill(255);
  rect(bedX + 15, bedY - 20, 60, 25, 8);
  fill(0, 255, 255, 220);
  rect(bedX + 80, bedY, bedWidth - 90, mattressHeight + 20, 10);

  // 문
  if (doorOpen) {
    fill(120, 70, 40);
    stroke(80);
    strokeWeight(1);
    quad(width - width * 0.15, 0, width - width * 0.08, 20, width - width * 0.08, height - 20, width - width * 0.15, height - floorHeight - 50);
    noStroke();
    fill(200, 220, 240);
    rect(width - width * 0.08, 0, width * 0.08, height);
    fill(255);
    ellipse(width - width * 0.04, height - 150, 40, 50);
    rect(width - width * 0.075, height - 200, 30, 40, 3);
    fill(160);
    ellipse(width - width * 0.04, height - 150, 30, 40);
  } else {
    fill(120, 70, 40);
    stroke(80);
    strokeWeight(1);
    quad(width - width * 0.15, 0, width, 0, width, height, width - width * 0.15, height - floorHeight - 50);
    fill(255, 230, 180);
    ellipse(width - 20, height / 2 - 20, 10, 10);
  }

  pop();
}

// --- 쓰레기 ---
class Trash {
  constructor() {
    this.pos = createVector(random(width * 0.17, width * 0.83), random(height - 130, height - 100));
    this.size = random(10, 25);
    this.type = floor(random(4));
  }

  display() {
    noStroke();
    if (this.type === 0) {
      fill(160, 82, 45);
      rect(this.pos.x, this.pos.y, this.size * 1.2, this.size * 0.8, 2);
      fill(120, 60, 30, 150);
      rect(this.pos.x + 2, this.pos.y + 2, this.size * 1.1, this.size * 0.7, 2);
    } else if (this.type === 1) {
      fill(245, 255, 250);
      push();
      translate(this.pos.x, this.pos.y);
      ellipse(0, 0, this.size * 1.2, this.size * 0.8);
      ellipse(3, 2, this.size * 1.0, this.size * 0.6);
      pop();
    } else if (this.type === 2) {
      let w = this.size * 0.6;
      let h = this.size * 1.2;
      let x = this.pos.x;
      let y = this.pos.y;
      fill(200, 0, 0);
      rect(x, y, w, h, 4);
      fill(180);
      ellipse(x + w / 2, y, w, h * 0.25);
      ellipse(x + w / 2, y + h, w, h * 0.25);
      stroke(255);
      strokeWeight(1.2);
      noFill();
      beginShape();
      for (let i = 0; i < h; i += 4) {
        let waveX = sin(i * 0.1) * 2;
        vertex(x + w / 2 + waveX, y + i);
      }
      endShape();
      noStroke();
      fill(255);
      textSize(this.size * 0.5);
      textAlign(CENTER, CENTER);
      text("C", x + w / 2, y + h / 2);
    } else if (this.type === 3) {
      fill(40, 150, 90);
      rect(this.pos.x, this.pos.y, this.size * 0.5, this.size, 3);
      fill(80, 200, 120);
      rect(this.pos.x + this.size * 0.1, this.pos.y + this.size * 0.3, this.size * 0.3, this.size * 0.2);
      fill(40, 150, 90);
      rect(this.pos.x + this.size * 0.15, this.pos.y - this.size * 0.2, this.size * 0.2, this.size * 0.2, 3);
    }
  }
}

function createFlyRoom() {
  let flies = [];
  for (let i = 0; i < 3; i++) {
    flies.push(new Fly());
  }
  return {
    update() {
      for (let fly of flies) {
        fly.move();
        fly.display();
      }
    },
    addFly() {
      flies.push(new Fly());
    },
    count() {
      return flies.length;
    }
  };
}

class Fly {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(1, 3));
    this.size = random(5, 8);
    this.wingSpeed = random(0.1, 0.3);
  }

  move() {
    this.pos.add(this.vel);
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
    this.vel.rotate(random(-0.1, 0.1));
  }

  display() {
    let wingAngle = sin(frameCount * this.wingSpeed) * PI / 6;
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    fill(200, 200, 255, 100);
    noStroke();
    push();
    rotate(wingAngle);
    ellipse(-this.size * 0.6, -this.size * 0.5, this.size * 1.2, this.size * 0.5);
    pop();
    push();
    rotate(-wingAngle);
    ellipse(-this.size * 0.6, this.size * 0.5, this.size * 1.2, this.size * 0.5);
    pop();
    fill(50);
    ellipse(0, 0, this.size, this.size * 0.8);
    pop();
  }
}

function drawSunlightEnding() {
  // 화면 밝아지는 효과
  let bright = map(sin(frameCount * 0.02), -1, 1, 200, 255);
  background(bright, bright * 0.95, bright * 0.8);  // 따뜻한 색상

  // 햇살 효과
  noStroke();
  for (let i = 0; i < 20; i++) {
    let alpha = 50 + 50 * sin(frameCount * 0.01 + i);
    fill(255, 255, 200, alpha);
    let radius = 200 + 10 * i + 5 * sin(frameCount * 0.03 + i);
    ellipse(width / 2, height / 2, radius, radius);
  }

  // 메시지
  fill(80, 40, 20);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("청소를 미루지 않고, 재때재때 하면 \n\n나는 물론 모두가 행복해질거야!", width / 2, height / 2);
}


//파리 다 채워지면 빌라에서 이웃들이 화내는 코드
function drawAngryapart(){
  push();
  fill(0);
  rect(windowWidth/5.5, 200, width/1.5, height);
  triangle(windowWidth/5.5 - 50, 200, windowWidth/5.5 + width/1.5 + 50, 200, width/1.9, 100);
  pop();

  push();
  fill(255);
  rect(windowWidth/5.5 + 50, 250, 100, 100);
  rect(windowWidth/5.5 + 50, 400, 100, 100);
  rect(windowWidth/5.5 + width/3 + 50, 250, 100, 100);
  rect(windowWidth/5.5 + width/3 + 50, 400, 100, 100);
  pop();
  
  push();
  drawAngryFace(windowWidth/5.5 + 100, height/2 + 30, 80);
  drawAngryFace(windowWidth/2 + 110, height/2 + 30, 100);
  drawAngryFace(windowWidth/2 + 110, height/2 + 180, 90);
  pop();
  
  push();
   fill(255, 0, 0);
    textSize(170);
    textAlign(CENTER, CENTER);
    text("좀 치워라!",width/2, height/2);
  pop();
  
  fill(255, 0, 0);
  rect(10, 10, 80, 40, 10);
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("시작하기", 50, 30);
  
  push();
  fill(0);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("첫번째로 쓰레기를 눌러 치우고, 두번째로 싱크대를 눌러 설거지를 하세요!", width/2 , 20);
  pop();

  
}

function drawHappyapart(){
  push();
  background(204, 229, 255);
  fill(0);
  rect(windowWidth/5.5, 200, width/1.5, height);
  triangle(windowWidth/5.5 - 50, 200, windowWidth/5.5 + width/1.5 + 50, 200, width/1.9, 100);
  pop();

  push();
  fill(255);
  rect(windowWidth/5.5 + 50, 250, 100, 100);
  rect(windowWidth/5.5 + 50, 400, 100, 100);
  rect(windowWidth/5.5 + width/3 + 50, 250, 100, 100);
  rect(windowWidth/5.5 + width/3 + 50, 400, 100, 100);
  pop();
  
  push();
  drawHappyFace(windowWidth/5.5 + 100, height/2 + 30, 80);
  drawHappyFace(windowWidth/2 + 110, height/2 + 30, 100);
  drawHappyFace(windowWidth/2 + 110, height/2 + 180, 90);
  pop();
  
  push();
   fill(0, 0, 255);
    textSize(180);
    textAlign(CENTER, CENTER);
    text("상쾌해!",width/2, height/2);
  pop();
  
  fill(0);
  rect(10, 10, 80, 40, 10);
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("m을 눌러\n 엔딩보기", 50, 30);
  
  
}

//화난 얼굴 
function drawAngryFace(x, y, size) {
  let r = size / 2;

  // 얼굴
  fill(255, 220, 200);
  stroke(0);
  ellipse(x, y, size, size);

  // 눈
  fill(0);
  ellipse(x - r / 2.5, y - r / 4, r / 6, r / 6); // 왼쪽 눈
  ellipse(x + r / 2.5, y - r / 4, r / 6, r / 6); // 오른쪽 눈

  // 찌푸린 눈썹
  strokeWeight(5);
  stroke(0);
  line(x - r / 1.8, y - r / 2.5, x - r / 3, y - r / 3); // 왼쪽
  line(x + r / 3, y - r / 3, x + r / 1.8, y - r / 2.5); // 오른쪽

  // 화난 입
  noFill();
  strokeWeight(5);
  arc(x, y + r / 3, r / 1.5, r / 3, PI, 0, OPEN); // 입

  // 붉어진 뺨
  noStroke();
  fill(255, 100, 100, 100);
  ellipse(x - r / 2.5, y + r / 4, r / 5, r / 7);
  ellipse(x + r / 2.5, y + r / 4, r / 5, r / 7);
}

// 웃는 얼굴
function drawHappyFace(x, y, size) {
  let r = size / 2;

  // 얼굴
  fill(255, 220, 200);
  stroke(0);
  strokeWeight(2);
  ellipse(x, y, size, size);

  // 눈 (초롱초롱한 눈동자)
  let eyeOffsetX = r / 2.5;
  let eyeOffsetY = r / 4;
  let eyeSize = r / 6;
  let pupilSize = eyeSize * 0.6;
  let highlightSize = pupilSize * 0.4;

  // 왼쪽 눈
  drawShinyEye(x - eyeOffsetX, y - eyeOffsetY, eyeSize, pupilSize, highlightSize);
  // 오른쪽 눈
  drawShinyEye(x + eyeOffsetX, y - eyeOffsetY, eyeSize, pupilSize, highlightSize);

  // 눈썹 (내려간 부드러운 곡선)
  strokeWeight(3);
  stroke(0);
  noFill();
  arc(x - eyeOffsetX, y - eyeOffsetY - 20, 40, 20, 0, PI); // 왼쪽 눈썹
  arc(x + eyeOffsetX, y - eyeOffsetY - 20, 40, 20, 0, PI); // 오른쪽 눈썹

  // 웃는 입
  noFill();
  strokeWeight(5);
  arc(x, y + r / 3, r / 1.5, r / 3, 0, PI, OPEN); // 웃는 입

  // 보조개
  strokeWeight(2);
  point(x - r / 3.5, y + r / 3);
  point(x + r / 3.5, y + r / 3);
}

function drawShinyEye(x, y, eyeSize, pupilSize, highlightSize) {
  // 눈 흰자
  fill(255);
  stroke(0);
  strokeWeight(2);
  ellipse(x, y, eyeSize, eyeSize);

  // 눈동자 (검은색)
  fill(0);
  noStroke();
  ellipse(x, y, pupilSize, pupilSize);

  // 하이라이트 (초롱초롱한 느낌)
  fill(255);
  ellipse(x - pupilSize * 0.2, y - pupilSize * 0.2, highlightSize, highlightSize);
}




//박종한
function awayGarbage() {
  // 영상 좌우반전 출력
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();
  push();
  fill(0);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("손으로 공을 잡아서 오른쪽 하단으로 움직이세요.", width/2, 30);
  pop();
  fill(255, 0, 0);
  rect(10, 10, 200, 40, 10);
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("공이 없어졌으면 돌아가기", 115, 30);
  push();
  fill(255);
  rect(width - 500, height - 500, 500);
  pop();
  isGrabbing = false;
  let stateText = "폄";

  hands.forEach(hand => {
    let k = hand.keypoints;

    // 👇 좌우 반전된 손 좌표 생성
    let mirroredKeypoints = k.map(pt => ({
      x: width - pt.x,
      y: pt.y
    }));

    if (checkGrabbing(mirroredKeypoints)) {
      isGrabbing = true;
      stateText = "쥠";
    }

    visualizeKeypoints(mirroredKeypoints);
    handleBallInteraction(mirroredKeypoints); // 좌우반전된 좌표 전달
  });

  drawBall();
  showHandStateText(stateText);
  if (ball.x > width - 500 && ball.y > height - 500)
  {
    ballDisable = 1;
  }
}

// 👇 손가락 관절 시각화
function visualizeKeypoints(keypoints) {
  for (let i = 0; i < keypoints.length; i++) {
    fill(0, 255, 0);
    noStroke();
    circle(keypoints[i].x, keypoints[i].y, 10);
  }
}

// 👇 손이 쥐는 상태인지 확인
function checkGrabbing(k) {
  if (!k || k.length < 17) return false;
  return (
    k[12].y > k[9].y + 20 &&   // 중지 끝이 중간보다 아래
    k[8].y > k[5].y + 20 &&    // 검지 끝이 중간보다 아래
    k[16].y > k[13].y + 20     // 약지 끝이 중간보다 아래
  );
}

// 👇 공을 그리기
function drawBall() {
  if (ballDisable === 0) {
    fill(0);
    noStroke();
    circle(ball.x, ball.y, ball.r * 2);
  }
}

// 👇 손 상태 텍스트 출력
function showHandStateText(stateText) {
  fill(255, 0, 0);
  textSize(32);
  text(stateText, 20, 40);
}

// 👇 공이 손 안에 있는지 확인
function ballInHand(k, bx, by) {
  if (!k || k.length < 18) return false;
  return (
    bx > k[2].x &&
    bx < k[17].x &&
    by > k[9].y &&
    by < k[0].y
  );
}


// 👇 손과 공의 상호작용 처리
function handleBallInteraction(k) {
  if (!k || k.length < 18) return;

  const bx = ball.x;
  const by = ball.y;

  // 손 좌표계 기준에서 공이 손 안에 있는지 확인
  const insideHand =
    bx > Math.min(k[2].x, k[17].x) &&
    bx < Math.max(k[2].x, k[17].x) &&
    by > Math.min(k[9].y, k[0].y) &&
    by < Math.max(k[9].y, k[0].y);

  if (isGrabbing && insideHand) {
    ball.held = true;
    ball.x = k[9].x;
    ball.y = k[9].y + 20;
  } else {
    ball.held = false;
  }
}




// 👇 손 인식 결과 처리
function gotHands(results) {
  hands = results;
}


//양시영
let firsttime = 0;

function washDish() {
  push();
  if (firsttime === 0) {
    setupStain();
    firsttime = 1;
  }

  background(255);

  // 좌우반전된 영상 출력
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  // 완료된 접시 그리기
  for (let i = 0; i < finishedPlates.length; i++) {
    drawPlateAt(finishedPlates[i].x, finishedPlates[i].y);
  }

  if (!cleared && plateCount < maxPlates) {
    drawPlate();
    image(stainLayer, 0, 0);

    // 손 추적 → 얼룩 지우기 + 스펀지 브러시
    hands.forEach(hand => {
      const k = hand.keypoints;
      if (!k || k.length < 10) return;

      const x =  width - k[9].x;
      const y = k[9].y + 20;

      eraseStainWithBrush(x, y);
      drawSpongeBrush(x, y);
    });

    // 설거지 완료 판정
    if (isCleanedEnough()) {
      cleared = true;
      let plateX = width - 150 - plateCount * 140;
      let plateY = height / 2 + 50;
      finishedPlates.push({ x: plateX, y: plateY });

      setTimeout(() => {
        plateCount++;
        cleared = false;
        if (plateCount < maxPlates) {
          setupStain();
        }
      }, 1000);
    }

  } else if (plateCount >= maxPlates) {
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(48);
    text("설거지 끝!", width / 2, height / 2);
    text("N을 누르세요!!!!!", width / 2, 30);


  }
  
  pop();
}

function drawPlate() {
  fill(240);
  stroke(180);
  strokeWeight(4);
  ellipse(width / 2, height / 2 + 50, 400, 400);
}

function drawPlateAt(x, y) {
  fill(240);
  stroke(180);
  strokeWeight(4);
  ellipse(x, y, 400, 400);
}

function setupStain() {
  stainLayer = createGraphics(width, height);
  stainLayer.clear();
  stainLayer.noStroke();
  for (let i = 0; i < 200; i++) {
    let x = random(width / 2 - 150, width / 2 + 150);
    let y = random(height / 2 - 100, height / 2 + 200);
    let size = random(20, 60);
    stainLayer.fill(80, 50, 20, 150);
    stainLayer.ellipse(x, y, size);
  }
}

function drawSpongeBrush(x, y) {
  push();
  translate(x, y);
  fill(255, 255, 100);
  stroke(0);
  rectMode(CENTER);
  rect(0, 0, 80, 60, 25);
  pop();
}

function eraseStainWithBrush(x, y) {
  stainLayer.erase();
  stainLayer.push();
  stainLayer.translate(x, y);
  stainLayer.ellipse(0, 0, 80, 70);
  stainLayer.pop();
  stainLayer.noErase();
}

function isCleanedEnough() {
  let img = stainLayer.get();
  img.loadPixels();
  let alphaSum = 0;
  for (let i = 3; i < img.pixels.length; i += 4) {
    alphaSum += img.pixels[i];
  }
  let avgAlpha = alphaSum / (img.pixels.length / 4);
  return avgAlpha < 1;
}
