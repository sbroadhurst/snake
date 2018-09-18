var canvas = document.getElementById('myCanvas')
var grid = document.getElementById('grid')
var ctx = canvas.getContext('2d')
var grd = grid.getContext('2d')
var nameBox = document.getElementById('nameBox')
nameBox.style.display = 'none'
nameBox.maxLength = '3'
//grid
var box = 32
// var gridX = grid.width
// var gridY = grid.height
var snakeDx = 0
var snakeDy = 0
var snake = []
snake[0] = {
  x: 9 * box,
  y: 10 * box
}

var food = {
  x: Math.floor(Math.random() * 17 + 1) * box,
  y: Math.floor(Math.random() * 15 + 3) * box
}

let speed = 100
var levelScore = 3
var rightPressed = true
var leftPressed = false
var upPressed = false
var downPressed = false

//canvas
var x = canvas.width
var y = canvas.height
var score = 0
var time = 0
var paused = true
var gameEnd = false
var level = 1
var maxLevel = 5
var count = 0
var countDown = 20 * 60

//database and score
let scoreBoard = []
var database = firebase.database()
var ref = database
  .ref('snake')
  .orderByChild('order')
  .limitToFirst(10)

function sortData(data, attr) {
  var arr = []
  for (var prop in data) {
    if (data.hasOwnProperty(prop)) {
      var obj = {}
      obj[prop] = data[prop]
      obj.tempSortName = data[prop][attr]
      arr.push(obj)
    }
  }

  arr.sort(function(a, b) {
    var at = a.tempSortName,
      bt = b.tempSortName
    return at > bt ? 1 : at < bt ? -1 : 0
  })

  var result = []
  for (var i = 0, l = arr.length; i < l; i++) {
    var obj = arr[i]
    delete obj.tempSortName
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        var id = prop
      }
    }
    var item = obj[id]
    result.push(item)
  }
  return result
}

function gotData(data) {
  scoreBoard = sortData(data.val(), 'order')
}

function errData(err) {
  console.log('Error: ' + err)
}

function checkFood() {
  //checks to see if new food is on snake, makes a new food if true
  snake.forEach(element => {
    if (food.x === element.x && food.y === element.y) {
      return (food = {
        x: Math.floor(Math.random() * 17 + 1) * box,
        y: Math.floor(Math.random() * 15 + 3) * box
      })
    }
  })
}

function drawFood() {
  checkFood()
  grd.beginPath()
  grd.rect(food.x, food.y, box, box)
  grd.fillStyle = 'blue'
  grd.fill()
  grd.closePath()
}

function drawSnake() {
  snake.forEach(element => {
    grd.beginPath()
    grd.rect(element.x, element.y, box, box)
    grd.fillStyle = 'white'
    grd.fill()
    grd.closePath()
  })
}

document.addEventListener('keydown', keyDownHandler)

function keyDownHandler(e) {
  if (
    (e.key == 'ArrowRight' && leftPressed != true && paused != true) ||
    (e.key == 'd' && leftPressed != true && paused != true)
  ) {
    rightPressed = true
    upPressed = false
    downPressed = false
  }
  if (
    (e.key == 'ArrowLeft' && rightPressed != true && paused != true) ||
    (e.key == 'a' && rightPressed != true && paused != true)
  ) {
    leftPressed = true
    upPressed = false
    downPressed = false
  }

  if (
    (e.key == 'ArrowUp' && downPressed != true && paused != true) ||
    (e.key == 'w' && downPressed != true && paused != true)
  ) {
    upPressed = true
    leftPressed = false
    rightPressed = false
  }
  if (
    (e.key == 'ArrowDown' && upPressed != true && paused != true) ||
    (e.key == 's' && upPressed != true && paused != true)
  ) {
    downPressed = true
    leftPressed = false
    rightPressed = false
  } else if (e.code == 'Enter' && gameEnd === false) {
    paused = !paused
  }
}

function collisionDetection(head, snake) {
  for (let i = 0; i < snake.length; i++) {
    if (head.x == snake[i].x && head.y == snake[i].y) {
      return true
    }
  }
  return false
}

function drawScore() {
  ctx.font = '30px ArcadeClassic'
  ctx.fillStyle = 'white'
  ctx.fillText('Score: ' + score, 35, 35)
}

function drawTime(time) {
  ctx.font = '30px ArcadeClassic'
  ctx.fillStyle = 'white'
  ctx.fillText('Time: ' + Math.round(time) + 's', 280, 35)
}

function drawLevel() {
  ctx.font = '30px ArcadeClassic'
  ctx.fillStyle = 'white'
  ctx.fillText('Level: ' + level, 535, 35)
}

function drawStartScreen() {
  ctx.beginPath()
  ctx.rect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'black'
  ctx.fill()
  ctx.font = '80px ArcadeClassic'
  ctx.fillStyle = 'white'
  ctx.fillText('Snake!', x / 2 - 140, 150)
  ctx.font = '20px ArcadeClassic'
  ctx.fillText('Press ENTER to start or pause the game', 155, 190)
  drawScoreBoard()

  // startButton()
}

function drawScoreBoard() {
  ref.on('value', gotData, errData)
  let y = 320
  let position = 1
  var keys = Object.keys(scoreBoard)
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i]
    var name = scoreBoard[k].name
    var score = scoreBoard[k].score
    ctx.fillStyle = 'white'
    ctx.font = '30px ArcadeClassic'

    ctx.fillText('Leaderboard Scores:', 205, 250)
    ctx.font = '24px ArcadeClassic'

    ctx.fillText(position + '.  ' + name, 270, y)
    ctx.fillText(score, 380, y)
    y += 30
    position++
  }
}

function drawCountDown() {
  ctx.fillStyle = 'white'
  ctx.font = '40px ArcadeClassic'
  ctx.fillText(Math.round(countDown / 60), 560, 120)
  countDown--
}

function drawGameEndScreen() {
  ctx.beginPath()
  ctx.rect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'black'
  ctx.fill()
  ctx.font = '50px ArcadeClassic'
  ctx.fillStyle = 'white'
  ctx.fillText('Game End', 250, 150)
  ctx.font = '20px ArcadeClassic'
  ctx.fillText('Final Score = ' + score, 280, 190)
  ctx.fillText('Enter name: ', 280, 215)
  nameBox.style.display = 'block'
  drawScoreBoard()
  drawCountDown()

  //// will be used for when we enter a name
  document.addEventListener('keydown', function(evt) {
    if (event.code == 'Enter') {
      countDown = 1
    }
    if ((evt.keyCode < 65 && evt.keyCode !== 8) || evt.keyCode > 90) {
      evt.preventDefault()
    }
  })

  if (countDown === 0) {
    var data = {
      name: nameBox.value,
      score: score,
      order: -1 * score
    }

    database
      .ref()
      .child('snake')
      .push(data)

    document.location.reload()
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  if (paused) {
    drawStartScreen()
    grd.clearRect(0, 0, grid.width, grid.height)
  } else if (gameEnd) {
    drawGameEndScreen()
    grd.clearRect(0, 0, grid.width, grid.height)
  } else {
    drawScore()
    drawLevel()

    time++
    drawTime(time / 60)
  }
  requestAnimationFrame(draw)
}
requestAnimationFrame(draw)

function drawSnakeGame() {
  if (!paused && !gameEnd) {
    grd.clearRect(0, 0, grid.width, grid.height)

    drawSnake()
    drawFood()

    //head
    let snakeX = snake[0].x
    let snakeY = snake[0].y
    //wall collision
    console.log(snakeX, snakeY)
    if (snakeX < 0) {
      snakeX = 576
    }
    if (snakeX > 576) {
      snakeX = 0
    }
    if (snakeY < 0) {
      snakeY = 576
    }
    if (snakeY > 576) {
      snakeY = 0
    }
    //movement

    if (rightPressed) {
      snakeX += box
    }

    if (leftPressed) {
      snakeX -= box
    }

    if (downPressed) {
      snakeY += box
    }

    if (upPressed) {
      snakeY -= box
    }
    //food collision

    if (snakeX == food.x && snakeY == food.y) {
      score++
      food = {
        x: Math.floor(Math.random() * 17 + 1) * box,
        y: Math.floor(Math.random() * 15 + 3) * box
      }
    } else {
      //remove tail
      snake.pop()
    }

    // new head
    let newHead = {
      x: snakeX,
      y: snakeY
    }
    //tail collision
    if (collisionDetection(newHead, snake)) {
      gameEnd = true
    }

    //wall collision
    //if (
    //   snakeX < -box ||
    //   snakeX > 19 * box ||
    //   snakeY < -box ||
    //   snakeY > 19 * box ||
    //   collisionDetection(newHead, snake)
    // ) {
    //   gameEnd = true
    // }

    snake.unshift(newHead)

    // if (score === levelScore) {
    //   level++
    //   levelScore += 5
    //   speed -= 5
    //   grd.clearRect(0, 0, grid.width, grid.height)
    //   // leftPressed = false
    //   // rightPressed = false
    //   // upPressed = false
    //   // downPressed = false
    // }
  }
}
setInterval(drawSnakeGame, speed)
