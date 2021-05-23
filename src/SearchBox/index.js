import {KEYBOARD, VIEWPORT} from "../settings.json";

class SearchBox {
  #rectangleWidth = VIEWPORT.width * 0.6
  #rectangleHeight = 60
  #radius = 4
  #strokeWidth = 3
  #strokeColor = '0xff00ff00'
  #fillColor = '0xff00ffff'
  #margin = 3

  generateTemplate() {
    const template = {
      SearchBox:
    {
      // x: 0,
      // y: 0,
      texture: lng.Tools.getRoundRect(400, 60, 4, 3, '0xff00ff00', true, '0xff00ffff'),
      // texture: lng.Tools.getRoundRect(
      //   this.#rectangleWidth,
      //   this.#rectangleHeight,
      //   this.#radius,
      //   this.#strokeWidth,
      //   this.#strokeColor,
      //   true,
      //   this.#fillColor
      // )

    }
  }

    return template;

  }
}

const searchBox = new SearchBox()
export default searchBox

