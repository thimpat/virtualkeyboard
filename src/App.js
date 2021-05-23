/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * NOTE:
 * Template key name starts with a capital
 */

import { Lightning, Utils } from '@lightningjs/sdk'
import { VIEWPORT, KEYBOARD } from './settings.json'
import virtualKeyboard from './VirtualKeyboard'
import searchBox from './SearchBox'

export default class App extends Lightning.Component {
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }

  updateButton(properties, textColor, bgColor, colorLeft, colorRight) {
    this.tag(properties.textTag).patch({ text: { textColor } })
    this.tag(properties.rectangleTag).patch({ color: bgColor, colorLeft, colorRight })
  }

  clearActiveButton() {
    const properties = virtualKeyboard.getActiveTags()
    this.updateButton(
      properties,
      KEYBOARD.textColor,
      KEYBOARD.keyBgColor,
      KEYBOARD.colorLeft,
      KEYBOARD.colorRight
    )
  }

  paintActiveButton() {
    const properties = virtualKeyboard.getActiveTags()
    this.updateButton(
      properties,
      KEYBOARD.focusTextColor,
      KEYBOARD.focusKeyBgColor,
      KEYBOARD.focusKeyBgColor,
      KEYBOARD.focusKeyBgColor
    )
  }

  static _template() {
    const keyboardTemplate = virtualKeyboard.init(/*{ layoutName: 'uk' }*/).generateTemplate()
    const searchBoxTemplate = searchBox.init().generateTemplate()

    const keys = {
      Background: {
        w: VIEWPORT.width,
        h: VIEWPORT.height,
        color: 0xfffbb03b,
        src: Utils.asset('images/background.png'),
      },
    }

    return { ...keys, ...keyboardTemplate, ...searchBoxTemplate }
  }

  _init() {
    this.tag('Background')
      .animation({
        duration: 15,
        repeat: -1,
        actions: [
          {
            t: '',
            p: 'color',
            v: { 0: { v: 0xfffbb03b }, 0.5: { v: 0xfff46730 }, 0.8: { v: 0xfffbb03b } },
          },
        ],
      })
      .start()

    this.paintActiveButton()
  }

  _handleLeft() {
    this.clearActiveButton()
    virtualKeyboard.moveCursorLeft()
    this.paintActiveButton()
  }

  _handleRight() {
    this.clearActiveButton()
    virtualKeyboard.moveCursorRight()
    this.paintActiveButton()
  }

  _handleUp() {
    this.clearActiveButton()
    virtualKeyboard.moveCursorUp()
    this.paintActiveButton()
  }

  _handleDown() {
    this.clearActiveButton()
    virtualKeyboard.moveCursorDown()
    this.paintActiveButton()
  }

  /**
   * NOTE: Select on a remote control matches Enter on a keyboard
   * @private
   */
  _handleEnter() {
    const properties = virtualKeyboard.getActiveTags()
    const character = properties.text
    if (character === KEYBOARD.setup.deleteSymbol) {
      this._handleBack()
      return
    }
    searchBox.addCharacter(character)
    this.tag('SearchText').text.text = searchBox.getText()
  }

  _handleBack() {
    searchBox.deleteLastCharacter()
    this.tag('SearchText').text.text = searchBox.getText()
  }
}
