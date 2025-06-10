let scene = -1;
let trashList = [];
let maxTrash = 50;
let trashAddInterval = 4;
let trashCount = 0;
let flyRoom;
let maxFlies = 50;
let flyAddInterval = 4;
let doorOpen = false;
let textDisable = 0;
let ballDisable = 0;
let trashImg;
let sinkImg;
let spongeImg;
let openHandImg;
let closeHandImg;
let trachBoxImg;
let floorImg;
let roomIng;
let canTrash;
let tissueTrash;
let bottleTrash;
let happyImg;
let angryImg;
let bathbackgroundImg;
let boardImg;
let shirtImg;


//쓰레기
let handPose;
let video;
let hands = [];

let ball = { x: 300, y: 300, r: 20, held: false };
let isGrabbing = false;

function preload() {  //이미지 불러오기기
  handPose = ml5.handPose();
  trashImg = loadImage('images/tmfprl.png');
  sinkImg = loadImage('images/sink.png');
  spongeImg = loadImage('images/sponge1.png');
  openHandImg = loadImage('images/vua1.png');
  closeHandImg = loadImage('images/wnla1.png');
  trachBoxImg = loadImage('images/tmfprlxhd.png');
  floorImg = loadImage('images/floorImg.png');
  roomIng = loadImage('images/roomImg.png');
  canTrash = loadImage('images/can.png');
  tissueTrash = loadImage('images/gbwl.png');
  bottleTrash = loadImage('images/bottle.png');
  happyImg = loadImage('images/happy.png');
  angryImg = loadImage('images/angry.png');
  shirtImg = loadImage('images/shirt.png');
  bathbackgroundImg = loadImage('images/bathroom.png');
  boardImg = loadImage('images/board.png');
}

//설거지
let predictions = [];

let stainLayer;
let cleared = false;

let plateCount = 0;
let maxPlates = 2;
let finishedPlates = [];

let Handpose = {
  model: null,
  detectStart: function (videoElement, callback) {
    this.model = ml5.handpose(videoElement, function () {
      console.log("Handpose 모델 준비됨");
    });
    this.model.on("predict", callback);
  },
};


function gotHands(results) {
  predictions = results;
}

credits = [
    "봐주셔서 감사합니다!",
    "",
    "Directed by",
    "이한민",
    "",
    "박종한",
    "",
    "양시영",
    "",
    "Created with Visual Studio",
    "",
    "이한민",
    "안녕하세요, 이한민입니다. 이번이 저희의",
    "첫 팀플이라 처음엔 여러 가지로 어려움이 많았어요.",
    "하지만 저희 팀은 코딩, 디자인, 기획 모든 부분에",
    "골고루 힘쓰며, 서로 도우면서 최선을 다했습니다.",
    "누구 하나 게으름 피우지 않고 적극적으로 참여해",
    "의견 조율도 잘 이루어졌고, 어려운 점도 함께 극복할",
    "수 있었어요. 이번 경험을 통해 ",
    "협업의 중요성을 깊이 배웠습니다.",
    "",
    "박종한",
    "첫 팀플이라 낯설고 힘든 부분이 많았지만",
    "저희 조에서 서로의 부족한 점을 채워주며 균형있게",
    "작업했습니다. 덕분에 프로젝트를 하는 동안 즐거웠고",
    "어려운 순간이 있을 때에도 함께 넘길 수 있었던 것 같습니다.",
    "이번 경험을 통해 협동을 배울 수 있었고",
    "앞으로 더 잘해보고 싶은 마음이 커졌습니다.",
    "",
    "양시영",
    "저희 모두가 서로 배려하며 함께 노력하니 팀 분위기도 좋아지고",
    "결과물도 만족스러웠습니다.",
    "이번 팀플을 통해 협업의 진정한 의미와 책임감을 깨달았습니다.",
    "앞으로는 더 체계적이고 효율적으로 함께 일하며 성장해 나가고 싶습니다.",
    "",
    "",
    "AI 사용률 0%....??",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "일 뻔한 AI 사용률 75%",
    "",
    "Special Thanks",
    "Professor Jung",
    "",
    "감사합니다 ^~^",
    "",
    "The End"];


function setup() {
  createCanvas(windowWidth, windowHeight);
  flyRoom = createFlyRoom();
  textFont('Arial');
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  handPose.detectStart(video, gotHands);
  centerX = width / 2;
  redCircleX = centerX;
  textAlign(CENTER, CENTER);
  textSize(100);
  fill(255);
  y = height;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  if (scene === -1) {
    drawStartScreen();
  } else if (scene === 0) {
    image(roomIng, 0, 0, width, height);
    push();
    stroke(0);
    strokeWeight(4);
    fill(255);
    textSize(80);
    text(" 아 귀찮아..\n 나중에 치우지 뭐", width/2, height/2);
    pop();
  } else if (scene === 1) {
    drawRoomWithTrash();
    if (frameCount % trashAddInterval === 0 && trashCount < maxTrash && ballDisable === 0) {
      trashList.push(new Trash());
      trashCount++;
    }
    if(ballDisable === 1) {
      image(roomIng, 0, 0, width, height);
    }
    if (trashCount >= maxTrash && ballDisable === 0) {
      scene = 2;
    }
  } else if (scene === 2) {
    drawRoomWithTrash();
    flyRoom.update();
    if (frameCount % flyAddInterval === 0 && flyRoom.count() < maxFlies) {
      flyRoom.addFly();
    }
  }
  else if (scene === 3) washDish();
  else if (scene === 4) awayGarbage();
  else if (scene === 5) drawSunlightEnding();
  else if (scene === 6) drawAngryapart();
  else if (scene === 4.5) drawHappyapart();
  else if (scene === 7) cleanClothes();
  else if (scene === 8) endingCredits();
}

function endingCredits() {
  push();
  fill(255);
  background(0);
  // 텍스트 간 간격
  let spacing = 40;

  for (let i = 0; i < credits.length; i++) {
    let textY = y + i * spacing;
    text(credits[i], width / 2, textY);
  }

  y -= 3;
  pop();
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
  if(scene == 5 && key === 'p' || key ==='P'){
    scene = 8;
  }
  if (keyCode === LEFT_ARROW) {
    direction = 'left';
    if (redCircleX !== centerX - 150) {
      redCircleX = centerX - 150;
    }
  }
  else if (keyCode === RIGHT_ARROW) {
    direction = 'right';
    if (redCircleX !== centerX + 150) {
      redCircleX = centerX + 150;
    }
  }

  if (direction !== lastDirection && lastDirection !== '') {
    altCount++;
    let bubbleSize = 20 + altCount * 10;
    bubbles.push({ size: bubbleSize });

    if (altCount >= 10) {
      bubbles = [];
      showBlackCircle = false;
    }
  }

  lastDirection = direction;
}

function drawStartScreen() {
  push();
  background(0);
  fill(255);
  textSize(32);
  text("2025년 6월 어느날...", width / 2, height / 2);
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
  let sinkX = (width / 2) - 100;
  let sinkY = height / 2;
  let sinkWidth = 100;
  let sinkHeight = 20;

  if (mouseX > sinkX && mouseX < sinkX + sinkWidth &&
      mouseY > sinkY && mouseY < sinkY + sinkHeight + 40) {
    scene = 3;
    return;
  
  }

  //화장실 클린
  let clothesX = width - 400;
  let clothesY = 200;
  let clothesWidth = 1000;
  let clothesHeight = 1000;

  if (mouseX > clothesX && mouseX < clothesX + clothesWidth &&
      mouseY > clothesY && mouseY < clothesY + clothesHeight + 40) {
    scene = 7;
    return;
  
  }

  // 쓰레기통 클릭
  let trashX = width / 2;
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
  if(scene === 7 && mouseX < width/10 && mouseY < height/10){
    scene = 1;
  }
}

function drawRoomWithTrash() {
  push();  
  image(roomIng, 0, 0, width, height);
  for (let t of trashList) {
    t.display();
  }
 
  fill(0);
  textSize(15);
  if (textDisable === 0) {
    push();
    stroke(0);
    fill(255);
    rect(10, 10, 200, 40, 10);
    pop();
    text("파리가 나오면 s를 누르세요", 110, 30);
  }
  pop();
}

// --- 쓰레기 ---
class Trash {
  constructor() {
    this.pos = createVector(random(width * 0.5, width * 0.83), random(height - 130, height - 100));
    this.size = random(10, 25);
    this.type = floor(random(4));
  }

  display() {
    noStroke();
    if (this.type === 0) {//박스
      image(trashImg, this.pos.x, this.pos.y, 30, 50);
    } else if (this.type === 1) { // 휴지
      image(tissueTrash, this.pos.x, this.pos.y, 50, 50);
    } else if (this.type === 2) {//캔
      image(canTrash, this.pos.x, this.pos.y, 30, 50);
    } else if (this.type === 3) { // 병
      image(bottleTrash, this.pos.x, this.pos.y, 30, 60);
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
  textSize(32);
  text("청소를 미루지 않고, 재때재때 하면 \n\n나는 물론 모두가 행복해질거야!", width / 2, height / 2);
  push();
  stroke(0);
  fill(255);
  rect(10, 10, 80, 40, 10);
  fill(0);
  textSize(16);
  text("p을 눌러\n 크레딧보기", 50, 30); 
  pop(); 
}


//파리 다 채워지면 빌라에서 이웃들이 화내는 코드
function drawAngryapart(){
  image(angryImg, 0, 0, width, height);
  push();
  fill(255, 0, 0);
  textSize(170);
  text("좀 치워라!!",width/2, height/2);
  pop();
  
  fill(255);
  rect(10, 10, 80, 40, 10);
  fill(0);
  textSize(16);
  text("시작하기", 50, 30);
  
  push();
  stroke(0);
  strokeWeight(2);
  fill(255);
  textSize(40);
  text("\n첫번째로 쓰레기를 눌러 치우고, 두번째로 화장실을 눌러 밀린 빨래를 하세요.\n마지막으로 싱크대를 눌러 설거지를 하세요!", width/2 , height - 100);
  pop();
}

function drawHappyapart(){
  image(happyImg, 0, 0, width, height);
  push();
  stroke(0);
  strokeWeight(3);
  fill(102, 255, 255);
  textSize(180);
  text("상쾌해!",width/2, height/2);
  pop();
  
  push();
  stroke(0);
  fill(255);
  rect(10, 10, 80, 40, 10);
  fill(0);
  textSize(16);
  text("m을 눌러\n 엔딩보기", 50, 30);  
  pop();
}

//박종한
function awayGarbage() {
  // 영상 좌우반전 출력
  push();
  translate(width, 0);
  scale(-1, 1);
  image(floorImg, 0, 0, width, height);
  pop();
  push();
  fill(0);
  textSize(40);
  text("손으로 공을 잡아서 오른쪽 하단으로 움직이세요.", width/2, 30);
  pop();
  fill(255);
  rect(10, 10, 200, 40, 10);
  fill(0);
  textSize(16);
  text("쓰레기를 버렸다면 돌아가기", 115, 30);
  push();
  fill(255);
  image(trachBoxImg, width - 400, height - 500, 500, 500);
  pop();

  hands.forEach(function(hand) {
    let k = hand.keypoints;
  
    // 좌우 반전된 손 좌표 생성
    let mirroredKeypoints = k.map(function(pt) {
      return {
        x: width - pt.x,
        y: pt.y
      };
    });

    if (checkGrabbing(mirroredKeypoints)) {
      push();
      isGrabbing = true;
      imageMode(CENTER);
      image(closeHandImg, mirroredKeypoints[9].x, mirroredKeypoints[9].y, 450, 450);
      pop();
    }
    else
    {
      push();
      isGrabbing = false;
      imageMode(CENTER);
      image(openHandImg, mirroredKeypoints[9].x, mirroredKeypoints[9].y, 450, 450);
      pop();
    }

    handleBallInteraction(mirroredKeypoints); // 좌우반전된 좌표 전달
  });

  drawBall();
  //쓰레기 지우기
  if (ball.x > width - 500 && ball.y > height - 500)
  {
    ballDisable = 1;
  }
}



// 손이 쥐는 상태인지 확인
function checkGrabbing(k) {
  if (!k || k.length < 17) return false;
  return (
    k[12].y > k[9].y + 20 &&   // 중지 끝이 중간보다 아래
    k[8].y > k[5].y + 20 &&    // 검지 끝이 중간보다 아래
    k[16].y > k[13].y + 20     // 약지 끝이 중간보다 아래
  );
}

// 쓰레기을 그리리기
function drawBall() {
  if (ballDisable === 0) {
    push();
    imageMode(CENTER);
    fill(0);
    noStroke();
    image(trashImg, ball.x, ball.y);
    pop();
  }
}


// 공이 손 안에 있는지 확인
function ballInHand(k, bx, by) {
  if (!k || k.length < 18) return false;
  return (
    bx > k[2].x &&
    bx < k[17].x &&
    by > k[9].y &&
    by < k[0].y
  );
}


// 손과 공의 상호작용 처리
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
    ball.y = k[9].y + 30;
  } else {
    ball.held = false;
  }
}


// 손 인식 결과 처리
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

  image(sinkImg, 0, 0, width, height);

  // 완료된 접시 그리기
  for (let i = 0; i < finishedPlates.length; i++) {
    drawPlateAt(finishedPlates[i].x, finishedPlates[i].y);
  }

  if (!cleared && plateCount < maxPlates) {
    drawPlate();
    image(stainLayer, 0, 0);

    // 손 추적 → 얼룩 지우기 + 스펀지 브러시
    hands.forEach(function(hand) {
      const k = hand.keypoints;
      if (!k || k.length < 10) {
        return;
      }
    
      const x = width - k[9].x;
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

      setTimeout(function() {
        plateCount++;
        cleared = false;
        if (plateCount < maxPlates) {
          setupStain();
        }
      }, 1000);
    }

  } else if (plateCount >= maxPlates) {
    fill(0);
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
  imageMode(CENTER);
  image(spongeImg, x, y, 150, 100);
  pop();
}

function eraseStainWithBrush(x, y) {
  stainLayer.erase();
  stainLayer.push();
  stainLayer.translate(x, y);
  stainLayer.ellipse(0, 0, 100, 100);
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
  return avgAlpha < 1.3;
}

//빨래

let redCircleX;
let centerX;
let direction = ''; // 'left' or 'right'
let lastDirection = '';
let altCount = 0;
let bubbles = [];
let showBlackCircle = true;


function cleanClothes() {
  image(bathbackgroundImg, 0, 0, width, height);
  push();
  imageMode(CENTER); 
  image(boardImg, width/2, height/2, 400, 500);
  pop();
  push();
  imageMode(CENTER);
  image(shirtImg, width/2, height/2, 600, 600);
  pop();

  // 검정색 원
  if (showBlackCircle) {
    fill(0);
    ellipse(centerX, height / 2, 40);
    ellipse(centerX+20, (height / 2)-40, 30);
    ellipse(centerX-40, (height / 2)+30, 20);
  }

  // 거품 그리기
  for (let b of bubbles) {
    noStroke();
    fill(135, 206, 250, 50); // 하늘색, 투명도 50
    ellipse(centerX, height / 2, b.size);
    ellipse(centerX+20, (height / 2)-40, b.size);
    ellipse(centerX-40, (height / 2)+30, b.size);
  }
  push();
  fill(255);
  rect(10, 10, 200, 40, 10);
  fill(0);
  textSize(16);
  text("빨래 다하면 돌아가기", 115, 30);
  text("방향키(왼/오)번갈아 누르며 얼룩을 지우세요.", width/2, 30);
  pop();
  push();
  imageMode(CENTER); 
    // 손
  image(openHandImg, redCircleX, (height / 2));
  pop()
}
