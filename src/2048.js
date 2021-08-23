  class BoxUtil {
    constructor(matrix, width, height, gap) {
      matrix = matrix
      this.width = width
      this.height = height
      this.gap = gap
    }
    nums = {
        "0": {
            "color": "#776e65",
            "backgroundColor": "#eee4da",
            "fontSize": 65
        },
        "2": {
            "color": "#776e65",
            "backgroundColor": "#eee4da",
            "fontSize": 65
        },
        "4": {
            "color": "#776e65",
            "backgroundColor": "#ede0c8",
            "fontSize": 65
        },
        "8": {
            "color": "#f9f6f2",
            "backgroundColor": "#f2b179",
            "fontSize": 55
        },
        "16": {
            "color": "#f9f6f2",
            "backgroundColor": "#f59563",
            "fontSize": 55
        },
        "32": {
            "color": "#f9f6f2",
            "backgroundColor": "#f67c5f",
            "fontSize": 55
        },
        "64": {
            "color": "#f9f6f2",
            "backgroundColor": "#f65e3b",
            "fontSize": 55
        },
        "128": {
            "color": "#f9f6f2",
            "backgroundColor": "#edcf72",
            "fontSize": 35
        },
        "256": {
            "color": "#f9f6f2",
            "backgroundColor": "#edcc61",
            "fontSize": 35
        },
        "512": {
            "color": "#f9f6f2",
            "backgroundColor": "#edc850",
            "fontSize": 35
        },
        "1024": {
            "color": "#f9f6f2",
            "backgroundColor": "#abe358",
            "fontSize": 35
        },
        "2048": {
            "color": "#f9f6f2",
            "backgroundColor": "#4dd9cf",
            "fontSize": 35
        },
        "4096": {
            "color": "#f9f6f2",
            "backgroundColor": "#a283f9",
            "fontSize": 35
        },
        "8192": {
            "color": "#f9f6f2",
            "backgroundColor": "#f98383",
            "fontSize": 35
        }
    }
    createBgbox() {
      return $(`
        <div style="
          display: inline-block;
          vertical-align: top;
          margin-left: ${this.gap}px;
          margin-top: ${this.gap}px;
          width: ${this.width}px;
          height: ${this.height}px;
          background-color: rgba(238, 228, 218, 0.35);
          border-radius: 8px;
          "></div>
      `)
    }
    createNumbox(i, j, number) {
      number = ''+number
      return $(`
        <div class="number-box"
          id="cell-${i}-${j}"
          style="
          position: absolute;
          left: ${this.gap + j*(this.width + this.gap)}px;
          top: ${this.gap + i*(this.height + this.gap)}px;
          width: ${this.width}px;
          height: ${this.height}px;
          background-color: ${this.nums[number].backgroundColor};
          color: ${this.nums[number].color};
          font-size: ${this.nums[number].fontSize}px;
          line-height: ${this.height}px;
          text-align:center;
          border-radius: 8px;
          ">${number}</div>
      `)
    }
    getStyle(number) {
      number = ''+ number
      return {
        "color": this.nums[number].color,
        "backgroundColor": this.nums[number].backgroundColor,
        "fontSize": this.nums[number].fontSize       
      }
    }
    getPosLeft(x,y) {
      return this.gap + y * (this.width + this.gap)
    }
    getPosTop(x,y) {
      return this.gap + x * (this.height + this.gap)
    }
  }
    class Game2048 {
    constructor() {
      // 根据矩阵的值更新number-box
      this.matrix = new Array(4).fill(0).map(()=>new Array(4).fill(0))
      // 合并碰撞记录
      this.moved = new Array(4).fill(false).map(()=>new Array(4).fill(false))
      // score记录
      this.record = parseInt(localStorage.getItem('record2048')||0)
      this.gameContainer = $('#gameContainer')
      this.boxWidth = parseInt(this.gameContainer.css('width')) * 0.2
      this.boxHeight = parseInt(this.gameContainer.css('height')) * 0.2
      this.gap = parseInt(this.gameContainer.css('width')) * 0.04

      this.boxUtil = new BoxUtil(this.matrix, this.boxWidth, this.boxHeight, this.gap)
      this.initUI()
      this.newGame()
      this.bindKeys()
      this.sum = 0
      this.timer
    }
    initUI() {
      this.scoreBox = $('#score')
      this.autoBtn = $('#auto')
      this.suggestBtn = $('#suggest')
      this.restartBtn = $('#restart')
      this.gameOver = $('#gameOver')
      this.addScore = $('#addScore')
      this.scoreRecordBox = $('#record')
      // 添加背景盒子
      for (let i=0; i < 16; i++) {
        this.gameContainer.append(this.boxUtil.createBgbox(this.boxWidth, this.boxHeight, this.gap))
      }
      //给scoreRecodBox设置record
      this.scoreRecordBox.attr('record', this.record)
    }
    bindKeys() {
      // bindKeys
      // 箭头函数保存this

      // 移动端
      if ( /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        document.addEventListener('touchmove', function (event) {
          event.preventDefault();
        }, false);
        // JQuery SWIPEUP 和 SWIPEDOWN 失效问题
        (function () {
          // initializes touch and scroll events
          var supportTouch = $.support.touch,
            scrollEvent = "touchmove scroll",
            touchStartEvent = supportTouch ? "touchstart" : "mousedown",
            touchStopEvent = supportTouch ? "touchend" : "mouseup",
            touchMoveEvent = supportTouch ? "touchmove" : "mousemove";

          // handles swipe up and swipe down
          $.event.special.swipeupdown = {
              setup: function () {
                  var thisObject = this;
                  var $this = $(thisObject);

                  $this.bind(touchStartEvent, function (event) {
                      var data = event.originalEvent.touches ?
                            event.originalEvent.touches[0] :
                            event,
                        start = {
                            time: (new Date).getTime(),
                            coords: [data.pageX, data.pageY],
                            origin: $(event.target)
                        },
                        stop;

                      function moveHandler(event) {
                        if (!start) {
                            return;
                        }

                        var data = event.originalEvent.touches ?
                            event.originalEvent.touches[0] :
                            event;
                        stop = {
                            time: (new Date).getTime(),
                            coords: [data.pageX, data.pageY]
                        };

                        // prevent scrolling
                        if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                            event.preventDefault();
                        }
                      }

                      $this
                        .bind(touchMoveEvent, moveHandler)
                        .one(touchStopEvent, function (event) {
                            $this.unbind(touchMoveEvent, moveHandler);
                            if (start && stop) {
                                if (stop.time - start.time < 1000 &&
                                  Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                                  Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                                  start.origin
                                      .trigger("swipeupdown")
                                      .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                                }
                            }
                            start = stop = undefined;
                        });
                  });
              }
          };
          //Adds the events to the jQuery events special collection
          $.each({
            swipedown: "swipeupdown",
            swipeup: "swipeupdown"
          }, function (event, sourceEvent) {
            $.event.special[event] = {
                setup: function () {
                    $(this).bind(sourceEvent, $.noop);
                }
            };
          });
        })();


        this.restartBtn.on('tap', ()=>this.newGame())
        this.gameContainer.on('swipeleft', ()=>this.moveLeft())
        this.gameContainer.on('swiperight', ()=>this.moveRight())
        this.gameContainer.on('swipedown', ()=>this.moveBottom())
        this.gameContainer.on('swipeup', ()=>this.moveTop())   
        this.autoBtn.on('tap',()=>this.autoRun())
        this.suggestBtn.on('tap',()=>this.suggest())
      }else { //PC端
        this.restartBtn.on('click', ()=>this.newGame())
        $(document).keyup( (e)=>{
          switch(e.key) {
            case 'ArrowUp': 
              this.moveTop();   
              break;
            case 'ArrowDown': 
              this.moveBottom();
              break;
            case 'ArrowLeft': 
              this.moveLeft();
              break;
            case 'ArrowRight': 
              this.moveRight();
              break;
          }
        })
        this.autoBtn.on('click',()=>this.autoRun())
        this.suggestBtn.on('click',()=>this.suggest())
      }

    }
    newGame() {
      // matrix 变为0
      this.matrix = new Array(4).fill(0).map(()=>new Array(4).fill(0))
      this.moved = new Array(4).fill(false).map(()=>new Array(4).fill(false))
      this.scoreBox.text('0')
      this.gameOver.css('opacity',0)
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      // this.matrix[0][0] = 2
      // this.matrix[0][1] = 2
      // this.matrix[0][2] = 4
      // this.matrix[0][3] = 8
     // 添加 number-box 初始为0
      this.refreshBox()
      // 随机更新matrix, 然后让新的盒子显示并添加动画
      this.getRandomNewBox()
      this.getRandomNewBox()
      // 游戏记录
      this.scoreRecordBox.removeClass('newRecord')
      this.scoreBox.removeClass('newRecord')
    }
    // 游戏循环核心逻辑：将所有num-box擦除，根据matrix状态绘制盒子
    refreshBox() {
      $('.number-box').remove()
      this.moved = new Array(4).fill(false).map(()=>new Array(4).fill(false))
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          let box = this.boxUtil.createNumbox(i, j, this.matrix[i][j])
          if (this.matrix[i][j] === 0) {
            box.css('width', 0)
            box.css('height', 0)
            box.css('top', this.boxUtil.getPosTop(i,j) + this.boxHeight/2 +'px')
            box.css('left', this.boxUtil.getPosLeft(i,j) + this.boxWidth/2 + 'px')
            box.text('')
          }
          this.gameContainer.append(box)
        }
      }
    }
    getRandomNewBox() {
      if (!this.canNewbox(this.matrix)) return
      let x, y
      // time用于后期减少更新时间
      let time = 50
      while (time) {
        x = Math.floor(Math.random() * 4)
        y = Math.floor(Math.random() * 4)
        if (this.matrix[x][y] === 0) {
          break;
        }
        time--
      }
      if (time === 0) {
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            if (this.matrix[i][j] === 0) {
              x = i
              y = j
              break;
            }
          }
        }
      }
      let num = Math.random() > 0.5 ? 2 : 4
      this.matrix[x][y] = num
      this.showBoxAnimate(x, y, num)
      return (x,y,num)
    }
    
    showBoxAnimate(i, j, num) {
      let box = $(`#cell-${i}-${j}`)
      let style = this.boxUtil.getStyle(num)
      box.css('background-color', style.backgroundColor)
      box.css('color', style.color)
      box.css('font-size', style.fontSize)
      box.text(num)
      box.animate({
        'width': this.boxWidth,
        'height': this.boxHeight,
        'top':  this.boxUtil.getPosTop(i, j),
        'left': this.boxUtil.getPosLeft(i, j),
      }, 100)
    }
    canNewbox(matrix) {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          // 存在可以移动的盒子
          if (matrix[i][j] === 0)
            return true
        }
      }
      return false
    }

    noblock(x1, y1, x2, y2, arrow, matrix) {
      if (arrow === 'horizontal') {
        // 小坐标在前
        let min = Math.min(y1, y2)
        let max = Math.max(y1, y2)
        for (let j = min + 1; j < max; j++) {
          if (matrix[x1][j] !== 0)
          return false
        }
        return true
      }else if (arrow === 'vertical') {
        let min = Math.min(x1, x2)
        let max = Math.max(x1, x2)
        for (let i = min + 1; i < max; i++) {
          if (matrix[i][y1] !== 0)
          return false
        }
        return true
      }

    }

    canLeft(matrix) {
      for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
          if (matrix[i][j] !== 0) 
            if (matrix[i][j-1] === 0 || matrix[i][j-1] === matrix[i][j])
              return true
        }
      }
      return false
    }
    canRight(matrix) {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
          if (matrix[i][j] !== 0) 
            if (matrix[i][j+1] === 0 || matrix[i][j+1] === matrix[i][j])
              return true
        }
      }
      return false
    }
    canTop(matrix) {
      for (let i = 1; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (matrix[i][j] !== 0) 
            if (matrix[i-1][j] === 0 || matrix[i-1][j] === matrix[i][j])
              return true
        }
      }
      return false
    }
    canBottom(matrix) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
          if (matrix[i][j] !== 0) 
            if (matrix[i+1][j] === 0 || matrix[i+1][j] === matrix[i][j])
            
              return true
        }
      }
      return false
    }

    moveLeft() {
      // if (this.End() || !this.canLeft()) return
      if ( !this.canLeft(this.matrix)) return
      for (let i = 0; i < 4; i++) {
        // 从最左侧遍历
        for (let j = 1; j < 4; j++) {
          // 对于每一个不为0的matrix[i][j]判断是否可以移动到左边的matrix[i][k]
          if (this.matrix[i][j] !== 0) {
            //从最左边开始
            for (let k = 0; k <= j-1; k++) {
              if (this.matrix[i][k]=== 0 && this.noblock(i,k,i,j, 'horizontal', this.matrix)) {
                // 动画
                this.moveAnimate(i, j, i, k)
                // 向左移，左边位置变化，右边的变为0
                this.matrix[i][k] = this.matrix[i][j]
                this.matrix[i][j] = 0
              }else if (this.matrix[i][k] === this.matrix[i][j] && this.noblock(i,k,i,j,'horizontal', this.matrix) && !this.moved[i][k]) {
                // 动画
                this.moveAnimate(i, j, i, k)
                //向左移，左边位置变化，右边的变为0
                this.matrix[i][k] = this.matrix[i][j] * 2
                this.matrix[i][j] = 0

                this.moved[i][k] = true

                this.addScore.text(`+${this.matrix[i][k]}`)
                this.showAddSocreAnimation()

                let record = Number(this.scoreBox.text()) + this.matrix[i][k]
                this.updateRecord(record)
                this.scoreBox.text(record)
              }
            }
          }

        }
      }

      //刷新盒子
      setTimeout(()=>this.refreshBox(),150)
      setTimeout(()=>this.getRandomNewBox(),210)
      setTimeout(()=>this.isGameOver(),300)
    }
    
    moveRight() {
      // if (this.End() || !this.canLeft()) return
      if ( !this.canRight(this.matrix)) return
      for (let i = 0; i < 4; i++) {
        //从最右边开始遍历
        for (let j = 2; j >= 0; j--) {
          // 对于每一个不为0的matrix[i][j]判断是否可以移动到右边边的matrix[i][k]
          if (this.matrix[i][j] !== 0) {
            // 从最右边开始
            for (let k = 3; k >= j+1; k--) {
              if (this.matrix[i][k]=== 0 && this.noblock(i,k,i,j,'horizontal', this.matrix)) {
                // 动画
                this.moveAnimate(i, j, i, k)
                // 向右移
                this.matrix[i][k] = this.matrix[i][j]
                this.matrix[i][j] = 0
              }else if (this.matrix[i][k] === this.matrix[i][j] && this.noblock(i,k,i,j,'horizontal', this.matrix) && !this.moved[i][k]) {
                // 动画
                this.moveAnimate(i, j, i, k)
                // move
                this.matrix[i][k] = this.matrix[i][j] * 2
                this.matrix[i][j] = 0
                this.moved[i][k] = true

                this.addScore.text(`+${this.matrix[i][k]}`)
                this.showAddSocreAnimation()

                // 记录总分
                let record = Number(this.scoreBox.text()) + this.matrix[i][k]
                this.updateRecord(record)
                this.scoreBox.text(record)
              }
            }
          }

        }
      }
      //刷新盒子
      setTimeout(()=>this.refreshBox(),150)
      setTimeout(()=>this.getRandomNewBox(),210)
      setTimeout(()=>this.isGameOver(),300)
    }
    
    moveTop() {
      // if (this.End() || !this.canLeft()) return
      if ( !this.canTop(this.matrix)) return
      for (let i = 1; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          // 对于每一个不为0的matrix[i][j]判断是否可以移动到上边边的matrix[i][k]
          if (this.matrix[i][j] !== 0) {
            // 从最上开始
            for (let k = 0; k <= i-1; k++) {
              if (this.matrix[k][j]=== 0 && this.noblock(k,j,i,j,'vertical', this.matrix)) {
                // 动画
                this.moveAnimate(i, j, k, j)
                // 向上移
                this.matrix[k][j] = this.matrix[i][j]
                this.matrix[i][j] = 0

              }else if (this.matrix[k][j] === this.matrix[i][j] && this.noblock(k,j,i,j,'vertical', this.matrix)&& !this.moved[k][j]) {
                // 动画
                this.moveAnimate(i, j, k, j)
                // move
                this.matrix[k][j] = this.matrix[i][j] * 2
                this.matrix[i][j] = 0
                this.moved[k][j] = true
                // 加分动画
                this.addScore.text(`+${this.matrix[k][j]}`)
                this.showAddSocreAnimation()
                // 记录总分
                let record = Number(this.scoreBox.text()) + this.matrix[k][j]
                this.updateRecord(record)
                this.scoreBox.text(record)
              }
            }
          }

        }
      }
      //刷新盒子
      setTimeout(()=>this.refreshBox(),150)
      setTimeout(()=>this.getRandomNewBox(),210)
      setTimeout(()=>this.isGameOver(),300)
    }
    updateRecord(newRecord) {
      if (newRecord > this.record) {
        localStorage.setItem('record2048',newRecord)
        this.record = newRecord
        this.scoreRecordBox.addClass('newRecord')
        this.scoreRecordBox.attr('record', this.record)
        this.scoreBox.addClass('newRecord')
      }
    }
    
    moveBottom() {
      // if (this.End() || !this.canLeft()) return
      if (!this.canBottom(this.matrix)) return
      for (let i = 2; i >= 0; i--) {
        for (let j = 0; j < 4; j++) {
          // 对于每一个不为0的matrix[i][j]判断是否可以移动到下边边的matrix[i][k]
          if (this.matrix[i][j] !== 0) {
            // 从最下开始
            for (let k = 3; k >= i+1; k--) {
              if (this.matrix[k][j]=== 0 && this.noblock(k,j,i,j,'vertical', this.matrix)) {
                // 动画
                this.moveAnimate(i, j, k, j)
                // 向上移
                this.matrix[k][j] = this.matrix[i][j]
                this.matrix[i][j] = 0

              }else if (this.matrix[k][j] === this.matrix[i][j] && this.noblock(k,j,i,j,'vertical', this.matrix)&& !this.moved[k][j]) {
                // 动画
                this.moveAnimate(i, j, k, j)
                // move
                this.matrix[k][j] = this.matrix[i][j] * 2
                this.matrix[i][j] = 0
                this.moved[k][j] = true
                //
                this.addScore.text(`+${this.matrix[k][j]}`)
                this.showAddSocreAnimation()

                let record = Number(this.scoreBox.text()) + this.matrix[k][j]
                this.updateRecord(record)
                this.scoreBox.text(record)
              }
            }
          }

        }
      }
      //刷新盒子
      setTimeout(()=>this.refreshBox(),150)
      setTimeout(()=>this.getRandomNewBox(),210)
      setTimeout(()=>this.isGameOver(),300)
    }
    showAddSocreAnimation() {
      this.addScore.css('opacity', 1)
      this.addScore.stop().css('top',80+'px').animate({
        opacity: 0,
        top: -20
      },'slow',()=>this.addScore.css('top',80+'px'))
    }
    
    moveAnimate(fromi, fromj, toi, toj) {
      let box = $(`#cell-${fromi}-${fromj}`)
      box.animate({
        top: this.boxUtil.getPosTop(toi, toj),
        left: this.boxUtil.getPosLeft(toi, toj)
      },200)
    }
    isGameOver() {
      if (!this.canNewbox(this.matrix) && !this.canMove()) {
        this.gameOver.text('Game Over')
        this.gameOver.animate({
          'opacity': 1
        },1000)
        return true
      }
      return false
    }
    canMove() {
      return this.canLeft(this.matrix)||this.canRight(this.matrix)||this.canBottom(this.matrix)||this.canTop(this.matrix)
    }

    nextDirection(matrix) {
      // left 0. right 1, up 2, down 3
      let res = this.findDirection(matrix)
      let countTotal = []
      for (let i = 0; i < res.length; i++) {
        if (res[i]) {
          let round = 40
          let tmp = []
          while(round) {
            this.sum = 0
            this.countDFS(JSON.parse(JSON.stringify(matrix)),i,3,0)
            tmp.push(this.sum)
            round--
          }

          countTotal[i] = tmp.reduce((a,b)=>a+b)/10
        }else {
          countTotal[i] = -1000
        }
      }
      let max = 0, arrow
      countTotal.forEach((item, idx)=>{if (item > max) {max = item; arrow = idx}})
      return arrow
    }
    countDFS(matrix, i,depth = 3,score = 0) {
        if (depth === 0) {
          this.sum += score
          return
        }
        // 计算这层的分值,并且生成新的数    
        if (i === 0) {
          score += this.matrixLeft(matrix)
        }else if(i === 1) {
          score += this.matrixRight(matrix)
        }else if(i === 2) {
          score += this.matrixTop(matrix)
        }else if(i === 3) {
          score += this.matrixBottom(matrix)
        }
        if (this.canNewbox(matrix)) {
            matrix = this.getRandom(matrix)
        }
        // 下一层的方向
        let next = this.findDirection(matrix)
        next.forEach((item,idx) => {
          if (item) {
            this.countDFS(JSON.parse(JSON.stringify(matrix)), idx, depth-1, score)
          }
        })
    }
    findDirection(matrix) {
        let res = new Array(4).fill(false)
        if (this.canLeft(matrix)) {
          res[0] = true
        }
        if (this.canRight(matrix)) {
          res[1] = true
        }
        if (this.canTop(matrix)) {
          res[2] = true
        }
        if (this.canBottom(matrix)) {
          res[3] = true
        }
        return res
      }
    
    getRandom(matrix) {
      let x, y
      while (true) {
        x = Math.floor(Math.random() * 4)
        y = Math.floor(Math.random() * 4)
        if (matrix[x][y] === 0) {
          break;
        }

      }
      let num = Math.random() > 0.5 ? 2 : 4
      matrix[x][y] = num
      return matrix
    }

    matrixLeft(matrix) {
      if ( !this.canLeft(matrix)) return 0
      let total = 0
      let addScore = 0
      let zero = 0
      let moved = new Array(4).fill(false).map(()=>new Array(4).fill(false))
      for (let i = 0; i < 4; i++) {
        // 从最左侧遍历
        for (let j = 1; j < 4; j++) {
          // 对于每一个不为0的matrix[i][j]判断是否可以移动到左边的matrix[i][k]
          if (matrix[i][j] !== 0) {
            //从最左边开始
            for (let k = 0; k <= j-1; k++) {
              if (matrix[i][k]=== 0 && this.noblock(i,k,i,j, 'horizontal',matrix)) {
                // 向左移，左边位置变化，右边的变为0
                matrix[i][k] = matrix[i][j]
                matrix[i][j] = 0
              }else if (matrix[i][k] === matrix[i][j] && this.noblock(i,k,i,j,'horizontal',matrix) && !moved[i][k]) {
                //向左移，左边位置变化，右边的变为0
                matrix[i][k] = matrix[i][j] * 2
                matrix[i][j] = 0
                moved[i][k] = true

                addScore += matrix[i][k]
                zero++
              }
            }
          }
        }
        total = addScore + zero*20
        return total
      }
    }
    
    matrixRight(matrix) {
      // if (this.End() || !this.canLeft()) return
      if ( !this.canRight(matrix)) return 0
      let total = 0
      let addScore = 0
      let zero = 0
      let moved = new Array(4).fill(false).map(()=>new Array(4).fill(false))
      for (let i = 0; i < 4; i++) {
        //从最右边开始遍历
        for (let j = 2; j >= 0; j--) {
          // 对于每一个不为0的matrix[i][j]判断是否可以移动到右边边的matrix[i][k]
          if (matrix[i][j] !== 0) {
            // 从最右边开始
            for (let k = 3; k >= j+1; k--) {
              if (matrix[i][k]=== 0 && this.noblock(i,k,i,j,'horizontal', matrix)) {
                // 向右移
                matrix[i][k] = matrix[i][j]
                matrix[i][j] = 0
              }else if (matrix[i][k] === matrix[i][j] && this.noblock(i,k,i,j,'horizontal', matrix) && !moved[i][k]) {
                // move
                matrix[i][k] = matrix[i][j] * 2
                matrix[i][j] = 0
                moved[i][k] = true

                addScore += matrix[i][k]
                zero++
              }
            }
          }

        }
      }
      total = addScore + zero*20
      return total
    }
  
    matrixTop(matrix) {
      if ( !this.canTop(matrix)) return 0
      let total = 0
      let addScore = 0
      let zero = 0
      let moved = new Array(4).fill(false).map(()=>new Array(4).fill(false))
      for (let i = 1; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          // 对于每一个不为0的matrix[i][j]判断是否可以移动到上边边的matrix[i][k]
          if (matrix[i][j] !== 0) {
            // 从最上开始
            for (let k = 0; k <= i-1; k++) {
              if (matrix[k][j]=== 0 && this.noblock(k,j,i,j,'vertical', matrix)) {
                // 向上移
                matrix[k][j] = matrix[i][j]
                matrix[i][j] = 0

              }else if (matrix[k][j] === matrix[i][j] && this.noblock(k,j,i,j,'vertical', matrix)&& !moved[k][j]) {
                // move
                matrix[k][j] = matrix[i][j] * 2
                matrix[i][j] = 0
                moved[k][j] = true
                addScore += matrix[k][j]
                zero ++
              }
                
            }
          }
        }
      }
      total = addScore + zero*20
      return total
    }

    matrixBottom(matrix) {
      if (!this.canBottom(matrix)) return 0
      let total = 0
      let addScore = 0
      let zero = 0
      let moved = new Array(4).fill(false).map(()=>new Array(4).fill(false))
      for (let i = 2; i >= 0; i--) {
        for (let j = 0; j < 4; j++) {
          // 对于每一个不为0的matrix[i][j]判断是否可以移动到下边边的matrix[i][k]
          if (matrix[i][j] !== 0) {
            // 从最下开始
            for (let k = 3; k >= i+1; k--) {
              if (matrix[k][j]=== 0 && this.noblock(k,j,i,j,'vertical', matrix)) {
                // 向上移
                matrix[k][j] = matrix[i][j]
                matrix[i][j] = 0

              }else if (matrix[k][j] === matrix[i][j] && this.noblock(k,j,i,j,'vertical', matrix)&& !moved[k][j]) {
                // move
                matrix[k][j] = matrix[i][j] * 2
                matrix[i][j] = 0
                moved[k][j] = true
                //
                addScore+=matrix[k][j]
                zero++
              }
            }
          }
        }
      }
      total = addScore + zero*20
      return total
    }
    // 自动
    autoRun() {
      if (this.timer) {
        this.autoBtn.text('Auto-Run')
        clearInterval(this.timer)
        this.timer = null
      }else {
        this.autoBtn.text('Stop')
        this.timer = setInterval(()=>{
          let direction= this.nextDirection(JSON.parse(JSON.stringify(this.matrix)))
          switch(direction) {
            case 0: 
              this.moveLeft();   
              break;
            case 1: 
              this.moveRight();
              break;
            case 2: 
              this.moveTop();
              break;
            case 3: 
              this.moveBottom();
              break;
          }
        },700)
      }

    }
    // 下一步建议
    suggest() {
      let direction= this.nextDirection(JSON.parse(JSON.stringify(this.matrix)))
      let text
      switch (direction) {
        case 0:
          text = '👈'
          break;
        case 1:
          text = '👉'
          break;
        case 2:
          text = '👆'
          break;
        case 3:
          text = '👇'
          break;
        default:
          break;
      }
      this.gameOver.text(text)
      this.gameOver.stop().animate({
        'opacity': 1
      },1000,()=>this.gameOver.css('opacity',0))
    }
  }
