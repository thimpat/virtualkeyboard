import {KEYBOARD, VIEWPORT} from "../settings.json"

class VirtualKeyboard {
  #keys = KEYBOARD.setup.uk.layout

  #keyboardDefaultPositionX = 0

  // Offset for every row
  #keyboardPositionX = []

  // Width for every row
  #keyboardWidthX = []

  #keyboardPositionY = 0

  #keyboardWidth = 0;
  #keyboardHeight = 0;

  #singleKeyboardWidth = 100;
  #singleKeyboardHeight = 200;

  #margin = 5;

  #charactersPerLine = []
  #nbMaxCharsPerLine = 1


  /**
   * Set size required for a single key
   */
  setupRowPositions() {
    this.#keys.map((line, num) => {
      let charactersPerLine = 0
      line.map((input) => {
        const chars = VirtualKeyboard.convertEntryToChar(input)
        charactersPerLine += chars.length
      })

      this.#charactersPerLine[num] = charactersPerLine
      this.#nbMaxCharsPerLine = Math.max(this.#nbMaxCharsPerLine, this.#charactersPerLine[num])
    })

    this.#singleKeyboardWidth = this.#keyboardWidth / this.#nbMaxCharsPerLine
  }

  /**
   * Calculate offsets and widths of every row
   */
  calculateOffsetRows() {
    this.#keys.map((line, num) => {

      // Width
      this.#keyboardWidthX[num] = this.#charactersPerLine[num] * this.#singleKeyboardWidth

      // Positions
      this.#keyboardPositionX[num] =
        this.#keyboardDefaultPositionX +
        (this.#keyboardWidth - this.#keyboardWidthX[num]) / 2
    })
  }

  /**
   * Initialise virtual keyboard using settings file
   * Some values can be set live
   */
  init({width, height, margin} = {width: VIEWPORT.width, height: VIEWPORT.height, margin: 10}) {
    this.#keyboardHeight = KEYBOARD.viewportHeight

    this.#keyboardWidth = width * KEYBOARD.viewportPercentage / 100       // => 80% of the viewport width
    this.#keyboardDefaultPositionX = width * .1                           // => (width - width * .8) / 2

    this.#margin = margin

    this.#singleKeyboardHeight = this.#keyboardHeight / this.#keys.length
    this.setupRowPositions()

    this.calculateOffsetRows()

    if (KEYBOARD.position === "top") {
      this.#keyboardPositionY = 0
    } else {
      this.#keyboardPositionY = height - this.#keyboardHeight
    }
  }

  /**
   * Extract from the settings file (layout key) the character/string that matches a key
   * @param input
   * @returns {string}
   */
  static convertEntryToChar(input) {
    let chars = ""
    if (typeof input === 'object' && input !== null) {
      chars = "" + input.text
    } else {
      chars = "" + input
    }
    return chars
  }

  /**
   * Generate rectangle area for template
   * @param x
   * @param y
   * @param len
   * @returns {{rect: boolean, color: string, w: number, x: number, h: number, y: *}}
   */
  generateSurroundingRectangleItem(x, y, len) {
    const rectangleWidth = this.#singleKeyboardWidth * len - this.#margin
    const rectangleHeight = this.#singleKeyboardHeight - this.#margin
    const radius = 8
    const strokeWidth = 3
    const strokeColor = "0xff00ff00" // 0xffff00ff
    const fillColor = "0xff00ffff"

    const blur = 4
    const margin = blur * 2

    return {
      x: x - this.#singleKeyboardWidth / 2 + this.#singleKeyboardWidth / 8,
      y: y - rectangleHeight / 6,
      color: KEYBOARD.backgroundColorKeys,
      colorLeft: 0xFF636EFB, colorRight: 0xFF1C27bC,
      texture: lng.Tools.getRoundRect(rectangleWidth, rectangleHeight, radius, strokeWidth, strokeColor, true, fillColor),
      Shadow: {
        x: 10,
        y: 10,
        zIndex: 1,
        color: 0x66000000,
        texture: lng.Tools.getShadowRect(rectangleWidth, rectangleHeight, radius, blur, margin),
      }
    }
  }

  /**
   * Generate a keyboard key (rectangle + letter) for template
   * @param chars
   * @param col
   * @param row
   * @returns {{rectangle: {rect: boolean, color: string, w: number, x: number, h: number, y: *}, key: {}}|{}}
   */
  generateSingleKeyTemplate(chars, col, row) {

    if (chars === undefined) {
      console.error(`Found key without text: `, chars)
      return {}
    }

    let key = {}
    key.x = col * this.#singleKeyboardWidth + this.#keyboardPositionX[row]
    key.y = row * this.#singleKeyboardHeight + this.#keyboardPositionY

    // key.color = KEYBOARD.colorKeys
    key.shadow = true

    key.text = {
      text: chars.toUpperCase(),
      fontFace: 'Regular',
      fontSize: this.#singleKeyboardHeight / 2,
      wordWrap: true, wordWrapWidth: 450, lineHeight: 30,
      textColor: 0xbbffffff,
      shadow: true
    }

    const rectangle = this.generateSurroundingRectangleItem(key.x, key.y, chars.length)
    return {key, rectangle}
  }

  /**
   * Generates list of keys with attribute for drawing in the canvas
   * @returns {{}}
   */
  generateTemplate() {
    const keyboard = {}
    const keys = this.#keys

    for (let iRow = 0; iRow < keys.length; ++iRow) {
      const line = keys[iRow]
      let count = 0

      for (let iCol = 0; iCol < line.length; ++iCol) {

        const input = line[iCol]

        const chars = VirtualKeyboard.convertEntryToChar(input)

        const obj = this.generateSingleKeyTemplate(chars, count, iRow)
        count += chars.length
        const key = obj.key
        if (!key) {
          continue
        }

        const name = (input && input.type) ? input.type : input
        keyboard[`Rectangle${name}`] = obj.rectangle
        keyboard[`Text${name}`] = key
      }

    }
    return keyboard
  }


}

const virtualKeyboard = new VirtualKeyboard()
export default virtualKeyboard

