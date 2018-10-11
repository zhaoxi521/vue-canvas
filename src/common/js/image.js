export default class ImageClass {
  constructor ({ctx, option}) {
    this.ctx = ctx
    this.id = option.id
    this.url = option.url
    this.width = option.width
    this.height = option.height
    this.x = option.x
    this.y = option.y
  }

  draw () {
    getImage(this.url).then(image => {
      // 如果获取失败
      if (!image) return
      // 获取成功
      this.ctx.beginPath()
      const x = this.x - this.width / 2
      const y = this.y - this.height / 2
      this.ctx.drawImage(image, x, y, this.width, this.height)
      this.ctx.closePath()
    })
  }

  checkPos (currentX, currentY) {
    const xMin = this.x - this.width / 2
    const xMax = this.x + this.width / 2
    const yMin = this.y - this.height / 2
    const yMax = this.y + this.height / 2
    return currentX >= xMin && currentX <= xMax && currentY >= yMin && currentY <= yMax
  }

  move (disX, disY) {
    this.x += disX
    this.y += disY
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
