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

import {Lightning, Utils, Log} from '@lightningjs/sdk'
import {VIEWPORT} from "./settings.json"
import virtualKeyboard from './VirtualKeyboard'

// console.info(keys[0][0])
// console.info(JSON.stringify(keys[0][0]), null, 2)

export default class App extends Lightning.Component {
  static getFonts() {
    return [{family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf')}]
  }

  static _template() {
    // const options = {
    //   Background: {
    //     w: 1920,
    //     h: 1080,
    //     color: 0xfffbb03b,
    //     src: Utils.asset('images/background.png'),
    //   },
    //   Logo: {
    //     mountX: 0.5,
    //     mountY: 1,
    //     x: 960,
    //     y: 600,
    //     src: Utils.asset('images/logo.png'),
    //   },


    virtualKeyboard.init()
    const keyboardKeys = virtualKeyboard.generateTemplateKeyboard()

    const keys = {
      Background: {
        w: VIEWPORT.width,
        h: 1080,
        color: 0xfffbb03b,
        src: Utils.asset('images/background.png'),
      },
    }


    // Background: {
    //   w: 1920,
    //   h: 1080,
    //   color: 0xfffbb03b,
    //   src: Utils.asset('images/background.png'),
    // },
    // "Textq":{"x":0,"y":0,"color":"0xffffffff","text":{"text":"q","fontFace":"Regular","fontSize":92}},
    // ...keys

    // console.info(stuff[0][0])
    // console.info(JSON.stringify(stuff[0][0]), null, 2)
    return {...keys, ...keyboardKeys}
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
            v: {0: {v: 0xfffbb03b}, 0.5: {v: 0xfff46730}, 0.8: {v: 0xfffbb03b}},
          },
        ],
      })
      .start()
  }
}
