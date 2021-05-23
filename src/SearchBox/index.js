import {SEARCHBOX, VIEWPORT} from "../settings.json";

class SearchBox {
  #contentArray = []
  #rectanglePosX = 0
  #rectanglePosY = 0
  #rectangleWidth = VIEWPORT.width * 0.6
  #rectangleHeight = 80
  #radius = 4
  #strokeWidth = 3
  #strokeColor = '0xff00ff00'
  #fillColor = '0xff00ffff'

  #textStartX = 0
  #textStartY = 0
  #margin = 10
  #fontSize = 24
  #maxChars = 10

  init({
         width = VIEWPORT.width,
         height = SEARCHBOX.height,
         fontSize = SEARCHBOX.fontSize,
         maxChars = SEARCHBOX.maxChars
       } = {}) {
    this.#rectangleWidth = width * 0.6
    this.#rectangleHeight = height
    this.#rectanglePosX = VIEWPORT.width / 2 - this.#rectangleWidth / 2 || 60
    this.#rectanglePosY = SEARCHBOX.height || 20
    this.#textStartX = this.#rectanglePosX + this.#margin
    this.#textStartY = this.#rectanglePosY + this.#rectangleHeight / 2 + (SEARCHBOX.calibrateY || 0)
    this.#fontSize = fontSize
    this.#maxChars = maxChars
    return this /** For chaining **/
  }

  generateTemplate() {
    return {
      SearchBox:
        {
          x: this.#rectanglePosX,
          y: this.#rectanglePosY,
          texture: lng.Tools.getRoundRect(this.#rectangleWidth, this.#rectangleHeight, this.#radius, this.#strokeWidth, this.#strokeColor, true, this.#fillColor),
        },
      SearchText: {
        x: this.#textStartX,
        y: this.#textStartY,
        text: {text: '', fontSize: this.#fontSize, textColor: SEARCHBOX.textColor}
      },
    };

  }

  // =================================================
  // User actions
  // =================================================
  deleteLastCharacter() {
    this.#contentArray.pop()
  }

  addCharacter(char) {
    if (this.#contentArray.length >= this.#maxChars) {
      return
    }
    this.#contentArray.push(char.toUpperCase())
  }

  getText() {
    return this.#contentArray.join("") + "*"
  }

}

const searchBox = new SearchBox()
export default searchBox

