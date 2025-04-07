function setup() {
  createCanvas(400, 400);
  background(220);

  let x = random(width);
  let y = random(height);

  ellipse(x, y, 50, 50); // 무작위 위치에 원 그리기
}