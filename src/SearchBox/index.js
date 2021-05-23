import {SEARCHBOX, VIEWPORT} from "../settings.json";

class SearchBox {
  #rectanglePosX = 0
  #rectanglePosY = 0
  #rectangleWidth = VIEWPORT.width * 0.6
  #rectangleHeight = 60
  #radius = 4
  #strokeWidth = 3
  #strokeColor = '0xff00ff00'
  #fillColor = '0xff00ffff'
  #margin = 3

  init({width, height, margin} = {width: VIEWPORT.width, height: 60, margin: 10}) {
    this.#rectangleWidth = width * 0.6
    this.#rectangleHeight = height
    this.#rectanglePosX = VIEWPORT.width / 2 - this.#rectangleWidth / 2 || 60
    this.#rectanglePosY = SEARCHBOX.height || 20
    return this /** For chaining **/
  }

  generateTemplate() {
    return {
      SearchBox:
        {
          x: this.#rectanglePosX,
          y: this.#rectanglePosY,
          texture: lng.Tools.getRoundRect(this.#rectangleWidth, this.#rectangleHeight, this.#radius, this.#strokeWidth, this.#strokeColor, true, this.#fillColor),

        }
    };

  }

  // =================================================
  // User actions
  // =================================================
  deleteLastCharacter()
  {

  }

  addCharacter(char)
  {

  }

}

const searchBox = new SearchBox()
export default searchBox

