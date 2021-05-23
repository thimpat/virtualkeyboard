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

import { Lightning, Utils, Log } from '@lightningjs/sdk'
import { VIEWPORT } from './settings.json'
import virtualKeyboard from './VirtualKeyboard'
import searchBox from './SearchBox'

// console.info(keys[0][0])
// console.info(JSON.stringify(keys[0][0]), null, 2)

export default class App /*Lightning.Application, */ extends Lightning.Component {
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }

  static _template() {
    virtualKeyboard.init()
    const keyboardTemplate = virtualKeyboard.generateTemplate()
    const searchBoxTemplate = searchBox.generateTemplate()

    const keys = {
      Background: {
        w: VIEWPORT.width,
        h: 1080,
        color: 0xfffbb03b,
        src: Utils.asset('images/background.png'),
      },
      // Logo: {
      //   mountX: 0.5,
      //   mountY: 1,
      //   x: 960,
      //   y: 600,
      //   src: Utils.asset('images/search.jpg'),
      // },
      // SearchBox: searchBoxTemplate,
      // SearchBox: {
      //   mountX: 0.5,
      //   mountY: 1,
      //   x: 960,
      //   y: 600,
      //   src: Utils.asset('images/search.png'),
      // },
      // SearchBox2: {
      //   texture: lng.Tools.getRoundRect(400, 60, 4, 3, '0xffffffff', true, '0xffffffff'),
      //   // Shadow: {
      //   //   x: 10,
      //   //   y: 10,
      //   //   zIndex: 1,
      //   //   color: 0x66000000,
      //   //   texture: lng.Tools.getShadowRect(rectangleWidth, rectangleHeight, radius, blur, margin),
      //   // },
      // },
      commandText: { x: 50, y: 28, text: { text: 'gffgfgfg', fontSize: 22 } },
    }

    return { ...keys, ...keyboardTemplate, ...searchBoxTemplate }
  }

  set commandText(v) {
    // this.tag('commandText').patch({ text: { text: `Animation command: ${v}` } })
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

    // this._myAnimation = this.tag('Logo').animation({
    //   duration: 3,
    //   repeat: -1,
    //   stopMethod: 'immediate',
    //   actions: [
    //     { p: 'y', v: { 0: { v: 450, sm: 0 }, 0.5: { v: 100, sm: 1 }, 1: { v: 450, sm: 0 } } },
    //   ],
    // })
  }

  _handleLeft() {
    this.tag('Logo').stop()
    this._myAnimation = this.tag('Logo')
      .animation({
        duration: 3,
        repeat: -1,
        stopMethod: 'immediate',
        actions: [{ p: 'x', v: { 0: { v: 450, sm: 0 }, 0.5: { v: 100, sm: 1 } } }],
      })
      .start()

    // this._myAnimation.start()
  }

  _handleRight() {
    this.tag('Logo').stop()
    this._myAnimation = this.tag('Logo')
      .animation({
        duration: 3,
        repeat: -1,
        stopMethod: 'immediate',
        actions: [
          { p: 'y', v: { 0: { v: 450, sm: 0 }, 0.5: { v: 100, sm: 1 }, 1: { v: 450, sm: 0 } } },
        ],
      })
      .start()
  }

  _handleUp() {
    alert(3)
  }

  _handleDown() {
    alert(4)
  }
}
