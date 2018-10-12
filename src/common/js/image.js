export default class ImageClass {
  constructor ({ctx, option}) {
    this.ctx = ctx
    this.id = option.id
    this.url = option.url
    this.width = option.width
    this.height = option.height
    this.x = option.x
    this.y = option.y
    this.scaleNum = 1
    this.selected = false
  }

  draw () {
    getImage(this.url).then(image => {
      // 如果获取失败
      if (!image) return
      // 获取成功
      this.ctx.beginPath()
      this.ctx.save()
      this.drawImage(image)
      this.selected && this.drawBorder()
      this.ctx.restore()
      this.ctx.closePath()
    })
  }

  checkPos (currentX, currentY) {
    const xMin = this.x - this.width * this.scaleNum / 2
    const xMax = this.x + this.width * this.scaleNum / 2
    const yMin = this.y - this.height * this.scaleNum / 2
    const yMax = this.y + this.height * this.scaleNum / 2
    return currentX >= xMin && currentX <= xMax && currentY >= yMin && currentY <= yMax
  }

  move (disX, disY) {
    this.x += disX
    this.y += disY
  }

  scale (flag) {
    if (flag) {
      this.scaleNum += 0.01
    } else {
      this.scaleNum -= 0.01
    }
  }

  drawImage (image) {
    const x = this.x - this.width * this.scaleNum / 2
    const y = this.y - this.height * this.scaleNum / 2
    this.ctx.drawImage(image, x, y, this.width * this.scaleNum, this.height * this.scaleNum)
  }

  drawBorder () {
    const NUM = 15
    const xMin = this.x - this.width * this.scaleNum / 2 - NUM
    const xMax = this.x + this.width * this.scaleNum / 2 + NUM
    const yMin = this.y - this.height * this.scaleNum / 2 - NUM
    const yMax = this.y + this.height * this.scaleNum / 2 + NUM
    this.ctx.lineWidth = '2'
    this.ctx.strokeStyle = '#838383'
    for (let x = xMin; x <= xMax; x++) {
      if (x % 10 <= 5) {
        this.ctx.lineTo(x, yMin)
      } else {
        this.ctx.moveTo(x, yMin)
      }
    }
    for (let y = yMin; y <= yMax; y++) {
      if (y % 10 <= 5) {
        this.ctx.lineTo(xMax, y)
      } else {
        this.ctx.moveTo(xMax, y)
      }
    }
    for (let x = xMax; x >= xMin; x--) {
      if (x % 10 <= 5) {
        this.ctx.lineTo(x, yMax)
      } else {
        this.ctx.moveTo(x, yMax)
      }
    }
    for (let y = yMax; y >= yMin; y--) {
      if (y % 10 <= 5) {
        this.ctx.lineTo(xMin, y)
      } else {
        this.ctx.moveTo(xMin, y)
      }
    }
    this.ctx.stroke()
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
