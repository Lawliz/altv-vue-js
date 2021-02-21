# Alt:V VueJS

Alt:V VueTS is available at: *coming soon*

## What Alt:V Vue is?

Alt:V Vue is a kind of "framework" for creating views in Alt:V by using Vue (created with VueCLI)

### How to use?

You can clone this repository to your gamemode workdir
```
git clone https://github.com/Lawliz/altv-vue-js.git webview
```

Once is downloaded don't forget to install `node_modules`
```
cd webview
npm i
```

After every changes you'll have to build the app running
```
npm run build
```

You can also use debug mode in game with
```
npm run serve
```
*If you browser don't open, make sure to open it in local*

### Configuration

The only configuration you've to do is simply change the **`outputDir`** in **`vue.config.js`**
```js
outputDir: join(__dirname, "../your/path")
```

You can also change the `port` in `devServer`
```js
devServer: {
    port: 25565,
    open: true
}
```

### Create an application

First create a **.vue** file in `views` directory and put the default Vue template in it
```html
<template>
    <div>
        <!-- You code goes here -->
    </div>
</template>

<script>
export default {
    name: "home"
}
</script>
```

Second go to `router/index.js` and create a router for your application and set the key to **home**

If you don't set the key to **home** the app will never be created when called.
```js
import HomeApplicationName from '../views/applicationName/Home.vue'
// import LoginApplicationName from '../views/applicationName/Login.vue'

const ApplicationRoutes = {
    home: HomeApplicationName
    // login: LoginApplicationName
}
```

After this you've to put it in the router like this:
```js
const Router = {
    "applicationName": ApplicationRoutes
    // "secondapplication": SecondApplicationRoutes
}
```

Also don't forget to change applicationName to your application name.

You can create multiple pages by following the above steps and now you can just name it whatever you want.

## How to render in game

You can use this file for creating your view: 
```js
import {
    WebView,
    showCursor,
    toggleGameControls,
    on,
    onServer,
    emit,
    emitServer
} from 'alt-client'

const isDebug = false

class View extends WebView {
    cursor = false
    controls = true

    /**
     * @param { string } url
     */
    constructor (url) {
        super(url, true)

        on("webview:LoadApp", this.loadApp.bind(this))
        on("webview:DestroyApp", this.destroyApp.bind(this))
        on("webview:CallEvent", this.callEvent.bind(this))
        on("webview:ChangePage", this.changePage.bind(this))
        onServer("webview:LoadApp", this.loadApp.bind(this))
        onServer("webview:DestroyApp", this.destroyApp.bind(this))
        onServer("webview:CallEvent", this.callEvent.bind(this))
        onServer("webview:ChangePage", this.changePage.bind(this))

        this.on("load", () => {
            emit("webview:Loaded")
            emitServer("webview:Loaded")
        })
    }

    /**
     * @param { boolean } state
     */
    setCursor (state) {
        if (this.cursor === state) return
        this.cursor = state
        showCursor(state)
    }

    /**
     * @param { boolean } state
     */
    setControls (state) {
        if (this.controls === state) return
        this.controls = state
        toggleGameControls(this.controls)
    }

    /**
     * @param { string } appName
     * @param { any } params
     */
    loadApp (appName, params = {}) {
        super.emit("webview:LoadApp", appName, params)
    }

    /**
     * @param { string } appName
     */
    destroyApp (appName) {
        super.emit("webview:DestroyApp", appName)
    }

    /**
     * @param { string } appName
     * @param { string } pageName
     * @param { any } params
     */
    changePage (appName, pageName, params) {
        super.emit("webview:ChangePage", appName, pageName, params)
    }

    /**
     * @param { string } eventName
     * @param { any[] } args
     */
    callEvent (eventName, ...args) {
        super.emit("webview:CallEvent", eventName, ...args)
    }
}

const UI = (isDebug) ? new View('http://127.0.0.1:8080') : new View('http://resources/path/to/outputDir')

export default UI
```

If you change to port in `vue.config.js` don't forget to update it in `new View(127.0.0.1:8080)`

Or you're free to create your own WebView.

If you choose to create your own WebView make sure to call the event present in this file when you want to use Alt:V Vue

After creating this, in your client files you can simply do this:
```js
import UI from './path/to/viewclass/'

// appName is a string and params is an empty object {}
// Don't forget params and args is optional so you don't need to pass it
UI.loadApp(appName, params)
UI.destroyApp(appName)
UI.changePage(appName, pageName, params)
UI.callEvent(eventName, ...args)
```

## Handle events in vue from alt

Sending event to your vue from client side
```js
UI.callEvent(eventName, ...args)
// WebView is an instance of alt.Webview
WebView.emit("webview:CallEvent", eventName, ...args)
```

In your `.vue` file you'll have to add the `mounted()` and `beforeUnmount()` functions

After this call the Event Manager with `this.$event.on()` and `this.$event.off()` methods

*example:*
```html
<template>
    <div>
    </div>
</template>

<script>
export default {
    mounted () {
        this.$event.on(eventName, (...args) => {
            // code goes here
        })
    },
    beforeUnmount () {
        this.$event.off(eventName)
    }
}
</script>
```

You can also call vue methods:
```html
<template>
    <div>
    </div>
</template>

<script>
export default {
    methods: {
        myMethod (...args) {
            // code goes here
        }
    },
    mounted () {
        this.$event.on(eventName, this.myMethod)
    },
    beforeUnmount () {
        this.$event.off(eventName)
    }
}
</script>
```

Thoses events are called by `UI.callEvent(eventName, ...args)` or `WebView.emit("webview:CallEvent", eventName, ...args)`

## How to change page

To change a page you can process by different methods.

First is just from your client calling the changePage method or event
```js
UI.changePage(appName, pageName, params)
// WebView is an instance of alt.Webview
WebView.emit("webview:ChangePage", appName, pageName, params)
```

Second is calling it directly by using the AppController in Vue
```html
<template>
    <div>
    </div>
</template>

<script>
export default {
    methods: {
        clickOnButton () {
            this.$controller.changePage(this.appName, pageName, params)
        }
    }
}
</script>
```
*appName is bind on this.appName*

## Destroy an application

To destroy an application it's the same as doing a changePage, you can do it in client side
```js
UI.destroyApp(appName)
// WebView is an instance of alt.Webview
WebView.emit("webview:DestroyApp", appName)
```

## Vue Store

You can use the Vue Store like a normal use

See https://vuex.vuejs.org/guide/ for more info

## Issues

If you had any issues with this, feel free to open an issue in this repository

Please don't DM authors on Discord for this

# Authors

Lawliz (http://github.com/Lawliz)

dictateurfou (https://github.com/dictateurfou)

# Thanks

Special thanks to Vue for everything

