export default class ImageClass {
  constructor ({ctx, option}) {
    this.ctx = ctx
    this.id = option.id
    this.url = option.url
    this.width = option.width
    this.height = option.height
    this.x = option.x
    this.y = option.y
    this.selected = false
    this.borderVal = 10
    this.image = null
  }

  draw () {
    if (this.image !== null) {
      this.drawHandle(this.image)
      return
    }
    getImage(this.url).then(image => {
      // 如果获取失败
      if (!image) return
      // 获取成功
      this.drawHandle(image)
    })
  }

  drawHandle (image) {
    this.ctx.beginPath()
    this.ctx.save()
    this.drawImage(image)
    this.selected && this.drawBorder()
    this.ctx.restore()
    this.ctx.closePath()
  }

  checkPos (currentX, currentY) {
    const NUM = this.selected ? 15 : 0
    const xMin = this.x - this.width / 2 - NUM
    const xMax = this.x + this.width / 2 + NUM
    const yMin = this.y - this.height / 2 - NUM
    const yMax = this.y + this.height / 2 + NUM
    return currentX >= xMin && currentX <= xMax && currentY >= yMin && currentY <= yMax
  }

  checkPosPoint (currentX, currentY) {
    let state = ''
    const NUM = 15
    const xMin = this.x - this.width / 2 - NUM
    const xMax = this.x + this.width / 2 + NUM
    const yMin = this.y - this.height / 2 - NUM
    const yMax = this.y + this.height / 2 + NUM
    if (currentX >= xMin && currentX <= xMax && currentY >= yMin && currentY <= yMax) {
      if ((currentX - xMin <= 10) && yMin < currentY < yMax) {
        state += 'left'
      }
      if ((currentY - yMin <= 10) && yMin < currentY < yMax) {
        state += 'top'
      }
      if ((xMax - currentX) <= 10 && yMin < currentY < yMax) {
        state += 'right'
      }
      if ((yMax - currentY <= 10) && xMin < currentX < xMax) {
        state += 'bottom'
      }
    }
    return state
  }

  move (disX, disY) {
    this.x += disX
    this.y += disY
  }

  drawImage (image) {
    const x = this.x - this.width / 2
    const y = this.y - this.height / 2
    this.ctx.drawImage(image, x, y, this.width, this.height)
  }

  drawBorder () {
    const NUM = this.borderVal
    const xMin = this.x - this.width / 2 - NUM
    const xMax = this.x + this.width / 2 + NUM
    const yMin = this.y - this.height / 2 - NUM
    const yMax = this.y + this.height / 2 + NUM
    const w = 5
    this.ctx.lineWidth = '2'
    this.ctx.strokeStyle = '#838383'

    this.drawLine(xMin, xMax, yMin, yMax)
    this.drawRect(xMin, xMax, yMin, yMax, w)
  }

  drawLine (xMin, xMax, yMin, yMax) {
    // 从左上角开始画
    // 1
    this.drawLineSimple(xMin, xMax, yMin, 'x')
    // 2
    this.drawLineSimple(yMin, yMax, xMax, 'y')
    // 3
    this.drawLineSimple(xMax, xMin, yMax, 'x')
    // 4
    this.drawLineSimple(yMax, yMin, xMin, 'y')

    this.ctx.stroke()
  }

  drawRect (xMin, xMax, yMin, yMax, w) {
    // 从左上角开始画
    // 1
    this.drawRectSimple(xMin - w, yMin - w, 2 * w)
    this.drawRectSimple((xMax - xMin) / 2 + xMin - w, yMin - w, 2 * w)
    // 2
    this.drawRectSimple(xMax - w, yMin - w, 2 * w)
    this.drawRectSimple(xMax - w, (yMax - yMin) / 2 + yMin - w, 2 * w)
    // 3
    this.drawRectSimple(xMax - w, yMax - w, 2 * w)
    this.drawRectSimple((xMax - xMin) / 2 + xMin - w, yMax - w, 2 * w)
    // 4
    this.drawRectSimple(xMin - w, yMax - w, 2 * w)
    this.drawRectSimple(xMin - w, (yMax - yMin) / 2 + yMin - w, 2 * w)
  }

  drawLineSimple (a, b, fixed, direction) {
    if (a > b) {
      for (let m = a; m >= b; m--) {
        const resetM = m - a
        if (resetM % 10 >= -5) {
          direction === 'x' ? this.ctx.lineTo(m, fixed) : this.ctx.lineTo(fixed, m)
        } else {
          direction === 'x' ? this.ctx.moveTo(m, fixed) : this.ctx.moveTo(fixed, m)
        }
      }
    } else {
      for (let m = a; m <= b; m++) {
        const resetM = m - a
        if (resetM % 10 <= 5) {
          direction === 'x' ? this.ctx.lineTo(m, fixed) : this.ctx.lineTo(fixed, m)
        } else {
          direction === 'x' ? this.ctx.moveTo(m, fixed) : this.ctx.moveTo(fixed, m)
        }
      }
    }
  }

  drawRectSimple (x, y, w) {
    this.ctx.rect(x, y, w, w)
    this.ctx.fill()
  }
}

async function getImage (url) {
  // 生成图片实例
  let image = new Image()
  image.src = url

  // 图片在本地缓存
  if (image.complete) return image

  // 去加载
  image = await loadImage(image).then(t => t ? image : null)

  return image
}

function loadImage (image) {
  return new Promise((resolve) => {
    image.onload = function () {
      resolve(true)
    }
    image.onerror = function () {
      resolve(false)
    }
  })
}
