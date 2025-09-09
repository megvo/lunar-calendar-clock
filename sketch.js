// ============================================
// LUNAR CALENDAR CLOCK
// A traditional-style animated clock with 
// snake decorations and page-flip animations
// Based off the chinese calendar I saw often at my grandma's house!
// By: Megan Vo
// ============================================

// ============================================
// GLOBAL VARIABLES
// ============================================
let customFont;
let fontLoaded = false;

// animation variables
let prevMinute = -1;
let pageFlipping = false;
let flipFrame = 0;
let flipDuration = 30;
let oldMinute = 0;
let snakeAngle = 0;

// time display data
let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// ============================================
// SETUP FUNCTIONS
// ============================================
function preload() {
  fontLoaded = true;
}

function setup() {
  createCanvas(400, 600);
  textAlign(CENTER, CENTER);
  rectMode(CORNER);
}

// ============================================
// MAIN DRAW LOOP
// ============================================
function draw() {
  // draws gradient background
  drawBackground();
  
  // get current time
  let timeData = getCurrentTime();
  
  // update snake animation
  updateAnimations();
  
  // flips the page on minute change
  handlePageFlipping(timeData.minute);
  
  // redraws calendar page(s)
  drawPages(timeData);
}

// ============================================
// BACKGROUND & ANIMATIONS
// ============================================
function drawBackground() {
  // red background
  for (let i = 0; i <= height; i++) {
    let alpha = map(i, 0, height, 1, 0.7);
    stroke(180 * alpha, 0, 0);
    line(0, i, width, i);
  }
}

function updateAnimations() {
  // animate snake spiral
  snakeAngle += 0.01;
}

// ============================================
// TIME MANAGEMENT
// ============================================
function getCurrentTime() {
  return {
    hour: hour() % 12,
    minute: minute(),
    second: second(),
    year: year(),
    month: month(),
    weekday: weekdays[new Date().getDay()]
  };
}

function handlePageFlipping(currentMinute) {
  // triggers flip animation on minute change
  if (currentMinute !== prevMinute) {
    pageFlipping = true;
    flipFrame = 0;
    oldMinute = prevMinute;
    prevMinute = currentMinute;
    
    console.log("Minute changed to:", currentMinute);
  }
}

function drawPages(timeData) {
  // draws flipping animation or current page
  if (pageFlipping && flipFrame < flipDuration) {
    // shows both old and new pages during flip
    drawCalendarPage(oldMinute, timeData, true);  // old page
    drawCalendarPage(timeData.minute, timeData, false); // new page
    flipFrame++;
  } else {
    // show only current page
    pageFlipping = false;
    drawCalendarPage(timeData.minute, timeData, false);
  }
}

// ============================================
// CALENDAR PAGE RENDERING
// ============================================
function drawCalendarPage(minuteVal, timeData, isOldPage) {
  // calculate flip animation progress
  let progress = constrain(flipFrame / flipDuration, 0, 1);
  let alpha = isOldPage ? map(progress, 0, 1, 255, 0) : map(progress, 0, 1, 0, 255);
  let scaleVal = isOldPage ? map(progress, 0, 1, 1, 0.9) : 1;
  
  // apply flip transformation
  push();
  translate(width / 2, height / 2);
  scale(scaleVal);
  translate(-width / 2, -height / 2);
  
  // draw paper background
  drawPaperBackground(alpha);
  
  // draw content inside paper margins
  push();
  translate(30, 30);
  
  drawHeader(timeData, alpha);
  drawMainContent(minuteVal, timeData.hour, alpha);
  drawSecondsGrid(timeData.second, alpha);
  drawFooter(alpha);
  
  pop();
  pop();
}

// ============================================
// PAPER & LAYOUT ELEMENTS
// ============================================
function drawPaperBackground(alpha) {
  // went for a more traditional paper with warm tone
  noStroke();
  fill(250, 245, 235, alpha);
  stroke(200, 160, 0, alpha);
  strokeWeight(3);
  rect(30, 27, width - 60, height - 60, 8);
  
  // large decorative background red and gold snake
  drawLargeBackgroundSnake(width/2, height/2, alpha);
}

function drawHeader(timeData, alpha) {
  // red header bar
  noStroke();
  fill(180, 20, 20, alpha);
  rect(0, 0, width - 60, 25, 8, 8, 0, 0);
  
  // decorative binding holes
  fill(200, 160, 0, alpha);
  circle(40, 12, 6);
  circle(width - 100, 12, 6);
  
  // header text
  fill(255, 255, 255, alpha);
  textSize(11);
  text(`Year ${timeData.year} - Month ${timeData.month} - ${timeData.weekday}`, (width - 60) / 2, 12);
  
  // decorative separator line
  stroke(200, 160, 0, alpha);
  strokeWeight(2);
  line(20, 70, width - 80, 70);
  
  // small decorative dots
  drawDecorativeDots(alpha);
}

function drawDecorativeDots(alpha) {
  for (let i = 0; i < 5; i++) {
    fill(200, 160, 0, alpha * 0.6);
    noStroke();
    circle(30 + i * ((width - 120) / 4), 75, 3);
    circle(30 + i * ((width - 120) / 4), 265, 3);
  }
}

// ============================================
// MAIN CONTENT DISPLAY
// ============================================
function drawMainContent(minuteVal, hourVal, alpha) {
  // hour symbol (zodiac animal)
  drawHourDisplay(hourVal, alpha);
  
  // large minute display with decorative small green snake
  drawMinuteDisplay(minuteVal, alpha);
  
  // gold separator line
  stroke(180, 120, 0, alpha);
  strokeWeight(2);
  line(20, 270, width - 80, 270);
}

function drawHourDisplay(hourVal, alpha) {
  textFont('Arial'); 
  fill(100, 50, 0, alpha);
  textSize(20);
  text(`${getHourSymbol(hourVal)}`, (width - 60) / 2, 50);
}

function drawMinuteDisplay(minuteVal, alpha) {
  // decorative snake behind minute
  drawSnake((width - 60) / 2, 170, alpha);
  
  // large minute numbers
  textFont('Playfair Display');
  textStyle(BOLD);
  noStroke();
  fill(180, 20, 20, alpha);
  textSize(180);
  text(nf(minuteVal, 2), (width - 60) / 2, 180);

  // resets font - only wanted it to be applied to the big minute number
  textFont('Arial');
  textStyle(NORMAL);
}

// ============================================
// SECONDS GRID (Calendar-style)
// ============================================
function drawSecondsGrid(secondVal, alpha) {
  let cols = 10;
  let rows = 6;
  let cellW = (width - 60) / cols;
  let cellH = 30;
  let gridStartY = 300;
  
  for (let i = 0; i < 60; i++) {
    let x = (i % cols) * cellW;
    let y = floor(i / cols) * cellH + gridStartY;
    
    // color cells based on current second
    if (i < secondVal) {
      fill(180, 20, 20, alpha);          // past seconds: red box
    } else if (i === secondVal) {
      fill(200, 160, 0, alpha);          // current second: gold
    } else {
      noFill();                          // future seconds: not colored in yet
    }
    
    // draw cell border
    stroke(100, 50, 0, alpha);
    strokeWeight(1);
    rect(x, y, cellW, cellH);
    
    // add numbers (1-60 like calendar days)
    if (i < secondVal) {
      fill(255, 255, 255, alpha);       // white text on filled cells
    } else {
      fill(100, 50, 0, alpha);          // dark text on empty cells
    }
    noStroke();
    textSize(8);
    text(i + 1, x + cellW/2, y + cellH/2);
  }
}

// ============================================
// FOOTER ELEMENTS
// ============================================
function drawFooter(alpha) {
  // prosperity symbols
  noStroke();
  fill(100, 50, 0, alpha);
  textSize(12);
  text("🍀 Happiness   🧧 Good Fortune   🌸 Prosperity", (width - 60) / 2, height - 80);
  
  // corner decorations
  fill(200, 160, 0, alpha * 0.7);
  textSize(8);
  text("GOOD", 15, height - 50);
  text("LUCK", width - 75, height - 50);
}

// ============================================
// DECORATIVE SNAKE ELEMENTS
// ============================================
function drawSnake(cx, cy, alphaVal) { 
  push();
  translate(cx, cy);

  let totalSegments = 80;
  let maxT = TWO_PI * 2.5;

  // draw snake body as spiral
  noFill();
  beginShape();
  for (let i = 0; i <= totalSegments; i++) {
    let t = (i / totalSegments) * maxT;
    let r = 3 + t * 6;
    let x = cos(t + snakeAngle) * r;
    let y = sin(t + snakeAngle) * r;

    // gradient green coloring
    let lerpFactor = i / totalSegments;
    let rCol = lerp(30, 60, lerpFactor);  
    let gCol = lerp(120, 160, lerpFactor);
    let bCol = lerp(90, 120, lerpFactor);   

    stroke(rCol, gCol, bCol, alphaVal * 0.2); 
    strokeWeight(3); 
    vertex(x, y);
  }
  endShape();

  // draw snake head
  let tHead = maxT;
  let rHead = 3 + tHead * 6;
  let headX = cos(tHead + snakeAngle) * rHead;
  let headY = sin(tHead + snakeAngle) * rHead;

  fill(60, 160, 120, alphaVal * 0.2); 
  noStroke();
  ellipse(headX, headY, 10, 7);

  // draw eyes
  fill(0, alphaVal * 0.4);
  ellipse(headX - 2.2, headY - 1.5, 1.5, 1.5);
  ellipse(headX + 2.2, headY - 1.5, 1.5, 1.5);

  // draw forked tongue - tried making like a "Y" shape
  stroke(200, 60, 60, alphaVal * 0.4);
  strokeWeight(2);
  let tongueLen = 6;
  let tx = headX + tongueLen;
  let ty = headY;
  line(headX + 5, headY, tx, ty);
  line(tx, ty, tx + 2.5, ty - 1.5);
  line(tx, ty, tx + 2.5, ty + 1.5);

  pop();
}

function drawLargeBackgroundSnake(cx, cy, alphaVal) {
  push();
  translate(cx, cy);
  
  // large translucent snake covering background
  noFill();
  stroke(200, 160, 0, alphaVal * 0.1);
  strokeWeight(20);
  
  // main spiral pattern
  beginShape();
  for (let t = 0; t < TWO_PI * 4; t += 0.05) {
    let r = 10 + t * 15;
    let x = cos(t + snakeAngle * 0.5) * r;
    let y = sin(t + snakeAngle * 0.5) * r;
    vertex(x, y);
  }
  endShape();
  
  // secondary spiral for complexity (and because it's cool)
  stroke(180, 20, 20, alphaVal * 0.08);
  strokeWeight(15);
  beginShape();
  for (let t = 0; t < TWO_PI * 3.5; t += 0.07) {
    let r = 8 + t * 12;
    let x = cos(-t + snakeAngle * 0.3) * r;
    let y = sin(-t + snakeAngle * 0.3) * r;
    vertex(x, y);
  }
  endShape();
  
  pop();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function getHourSymbol(hr) {
  // chinese zodiac animals for each hour - each represents their position in the race
  const hourSymbols = ["🐀", "🐂", "🐅", "🐇", "🐉", "🐍", "🐎", "🐐", "🐒", "🐓", "🐕", "🐖"];
  let hour12 = hr === 0 ? 12 : (hr > 12 ? hr - 12 : hr);
  return hourSymbols[(hour12 - 1) % 12];
}
