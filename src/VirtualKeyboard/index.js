import {KEYBOARD, VIEWPORT} from "../settings.json"
import {Log} from '@lightningjs/sdk'

class VirtualKeyboard {
  /**
   * Original keyboard layout with rows and columns
   * @type {[string[]|number[]|{"text": string, "type": string}[]]}
   */
  #layout = []

  /**
   * keyboard layout with rows and columns to be used for navigation
   * The original layout may contain some invalid/undefined/unreliable keys.
   * @type {[{"text": string, "type": string}[]]}
   */
  #convertedLayout = []

  /**
   * Flatten version of the layout to be used by the Lightning templating system
   * @type {{}}
   */
  #template = null

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

  // ---------
  #cursorX = 9
  #cursorY = 1
  #pointer = null


  /**
   * Extract from the settings file (layout key) the object that matches the entry
   * @param input
   * @returns {{}}
   */
  static convertEntryToKeyObject(input = "") {
    let obj = {}
    if (typeof input === 'object') {
      obj = input
    } else {
      obj.text = input.toString()
    }
    return obj
  }

  /**
   * Extract from the settings file (layout key) the string that matches the entry
   * @param input
   * @returns {string}
   */
  static convertEntryToChar(input) {
    return this.convertEntryToKeyObject(input).text
  }

  /**
   * Generate tag name for template element
   * @param prefix
   * @param name
   */
  generateTag(prefix = "", name = "") {
    try {
      prefix = prefix.trim()
      name = name.toString().trim()

      // Lightning wants the first letter to always be capitalized
      prefix = prefix.charAt(0).toUpperCase() + prefix.slice(1)
      return `${prefix}${name}`
    } catch (e) {
      Log.error(e)
    }
  }

  /**
   * Set size required for a single key
   */
  setupRowPositions() {
    this.#layout.map((line, num) => {
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
   * Returns number of characters present in a row
   * @param rowNumber
   * @returns {number|*}
   */
  countCharactersRow(rowNumber) {
    if (!this.#charactersPerLine || !this.#charactersPerLine[rowNumber]) {
      console.error(`You must initialise the Virtual Keyboard before calling this method`)
      return -1
    }
    return this.#charactersPerLine[rowNumber]
  }

  /**
   * Return virtual keyboard rows number
   * @returns {number}
   */
  countRows() {
    if (!this.#convertedLayout) {
      Log.error(`You must generate a Virtual Keyboard before calling this method`)
      return -1
    }
    return this.#convertedLayout.length
  }

  /**
   * Calculate offsets and widths of every row
   */
  calculateOffsetRows() {
    this.#layout.map((line, num) => {

      // Width
      this.#keyboardWidthX[num] = this.countCharactersRow(num) * this.#singleKeyboardWidth

      // Positions
      this.#keyboardPositionX[num] =
        this.#keyboardDefaultPositionX +
        (this.#keyboardWidth - this.#keyboardWidthX[num]) / 2 +
        this.#singleKeyboardWidth / 2
    })
  }

  /**
   * Initialise virtual keyboard using settings file
   * Some values can be set live
   */
  init({
         width = VIEWPORT.width,
         height = VIEWPORT.height,
         margin = 10,
         layoutName = KEYBOARD.setup.defaultLayout
       } = {}) {
    this.#layout = KEYBOARD.setup[layoutName].layout
    this.#keyboardHeight = KEYBOARD.viewportHeight

    this.#keyboardWidth = width * KEYBOARD.viewportPercentage / 100       // => 80% of the viewport width
    this.#keyboardDefaultPositionX = width * .1                           // => (width - width * .8) / 2

    this.#margin = margin

    this.#singleKeyboardHeight = this.#keyboardHeight / this.#layout.length
    this.setupRowPositions()

    this.calculateOffsetRows()

    if (KEYBOARD.position === "top") {
      this.#keyboardPositionY = 0
    } else {
      this.#keyboardPositionY = height - this.#keyboardHeight
    }

    return this /** For chaining **/
  }

  /**
   * Generate rectangle area
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
    const fillColor = KEYBOARD.keyBgColor

    const blur = 4
    const margin = blur * 2

    return {
      x: x - this.#singleKeyboardWidth / 2 + this.#singleKeyboardWidth / 8,
      y: y - rectangleHeight / 6,
      color: KEYBOARD.keyBgColor,
      colorLeft: KEYBOARD.colorLeft,
      colorRight: KEYBOARD.colorRight,
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
  generateSingleKeyItem(chars, col, row) {

    if (chars === undefined) {
      console.error(`Found key without text: `, chars)
      return {}
    }

    let key = {}
    key.x = col * this.#singleKeyboardWidth + this.#keyboardPositionX[row]
    key.y = row * this.#singleKeyboardHeight + this.#keyboardPositionY

    key.shadow = true

    key.text = {
      text: chars.toUpperCase(),
      fontFace: 'Regular',
      fontSize: this.#singleKeyboardHeight / 2,
      wordWrap: true, wordWrapWidth: 450, lineHeight: 30,
      textColor: KEYBOARD.textColor,
      shadow: true
    }

    const rectangle = this.generateSurroundingRectangleItem(key.x, key.y, chars.length)
    return {key, rectangle}
  }

  /**
   * Normalise template to support any sort of layout
   * @param finalRow
   */
  finaliseTemplate(finalRow) {
    if (finalRow.length < this.#nbMaxCharsPerLine) {
      const first = JSON.parse(JSON.stringify(finalRow[0]))
      const last = JSON.parse(JSON.stringify(finalRow[finalRow.length - 1]))
      first.dead = true
      first.side = 1
      last.dead = true
      last.side = -1

      do {
        finalRow.unshift(first)
        finalRow.push(last)
      }
      while (finalRow.length < this.#nbMaxCharsPerLine)

      if (finalRow.length > this.#nbMaxCharsPerLine) {
        finalRow.pop()
      }

    }

  }

  /**
   * Generates list of keys with attribute for drawing in the canvas
   * @returns {{}}
   */
  generateTemplate() {
    this.#template = {}
    const layout = this.#layout

    for (let iRow = 0; iRow < layout.length; ++iRow) {
      const line = layout[iRow]
      let count = 0
      this.#convertedLayout[iRow] = []

      for (let iCol = 0; iCol < line.length; ++iCol) {

        const input = line[iCol]

        const objInput = VirtualKeyboard.convertEntryToKeyObject(input)
        const chars = objInput.text

        const obj = this.generateSingleKeyItem(chars, count, iRow)
        count += chars.length
        const key = obj.key
        if (!key) {
          continue
        }

        const name = (input && input.type) ? input.type : input

        const rectangleTag = this.generateTag("Rectangle", name)
        this.#template[rectangleTag] = obj.rectangle

        const textTag = this.generateTag("Text", name)
        this.#template[textTag] = key

        objInput.textTag = textTag
        objInput.rectangleTag = rectangleTag

        if ("DELETE" === objInput.type) {
          objInput.text = KEYBOARD.setup.deleteSymbol
        }

        for (let iChar = 0; iChar < chars.length; ++iChar) {
          objInput.dead = false
          if (iChar < chars.length - 1)
          {
            objInput.dead = true
            objInput.side = 1
          }
          this.#convertedLayout[iRow].push(JSON.parse(JSON.stringify(objInput)))
        }
      }

      this.finaliseTemplate(this.#convertedLayout[iRow])
    }

    this.#pointer = this.getCursorInfo()

    return this.#template
  }


  // =================================================
  // User actions
  // =================================================
  /**
   * Returns focused key object
   * @returns {{text: string, type: string}}
   */
  getActiveTags() {
    const row = this.#convertedLayout[this.#cursorY]
    return row[this.#cursorX]
  }

  /**
   * Return the tag id the cursor is on
   */
  getCursorInfo() {
    const isLimitLeft = this.#cursorX <= 0
    const isLimitRight = this.#cursorX >= this.#convertedLayout[this.#cursorY].length - 1
    const isLimitTop = this.#cursorY <= 0
    const isLimitBottom = this.#cursorY >= this.#convertedLayout[this.#cursorY].length - 1

    const row = this.#convertedLayout[this.#cursorY]

    let tags = {}
    if (this.#cursorX < row.length) {
      tags = row[this.#cursorX]
    }

    const result = {
      cursorX: this.#cursorX,
      cursorY: this.#cursorY,
      textTag: tags.textTag,
      rectangleTag: tags.rectangleTag,
      isLimitLeft,
      isLimitRight,
      isLimitTop,
      isLimitBottom,
    }

    console.log(result)

    return result
  }

  cloneCursorInformation(pointer = this.#pointer) {
    return JSON.parse(JSON.stringify(pointer))
  }

  reviewHorizontalPosition(direction) {
    let key = this.#convertedLayout[this.#cursorY][this.#cursorX]

    if (!key.dead)
    {
      return
    }

    direction = direction || key.side
    do {
      const nChars = this.#convertedLayout[this.#cursorY].length
      this.#cursorX += direction
      if (this.#cursorX < 0 && direction < 0) {
        this.#cursorX = nChars - 1
      }
      else if (this.#cursorX >= nChars && direction > 0)
      {
        this.#cursorX = 0
      }
    }
    while (this.#convertedLayout[this.#cursorY][this.#cursorX].dead === true)
  }


  moveCursorUp() {
    if (this.#cursorY <= 0) {
      return
    }

    --this.#cursorY

    this.reviewHorizontalPosition()

    this.#pointer = this.getCursorInfo()
    return this.cloneCursorInformation()
  }

  moveCursorDown() {
    if (this.#cursorY >= this.countRows() - 1) {
      return
    }

    ++this.#cursorY

    this.reviewHorizontalPosition()

    this.#pointer = this.getCursorInfo()
  }

  moveCursorLeft() {
    this.#cursorX = this.#pointer.isLimitLeft ? this.countCharactersRow(this.#cursorY) - 1 : --this.#cursorX
    this.reviewHorizontalPosition(-1)
    this.#pointer = this.getCursorInfo()
  }

  moveCursorRight() {
    this.#cursorX = this.#pointer.isLimitRight ? 0 : ++this.#cursorX
    this.reviewHorizontalPosition(1)
    this.#pointer = this.getCursorInfo()
  }
}

const virtualKeyboard = new VirtualKeyboard()
export default virtualKeyboard

