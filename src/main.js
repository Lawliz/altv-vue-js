/* eslint-disable no-undef */
import AppControllerClass from './AppController'
import EventManagerClass from './EventManager'

const EventManager = new EventManagerClass()
const Controller = new AppControllerClass()

Controller.loadApp("home")

document.addEventListener('contextmenu', (e) => {
    e.preventDefault()
}, false)

if ('alt' in window) {
    alt.on('webview:LoadApp', (appName, params) => {
        Controller.loadApp(appName, params)
    })

    alt.on('webview:LoadAppSync', async (appName, params) => {
        Controller.loadApp(appName, params).then(() => {
            alt.emit('webview:AppLoaded', appName)
        })
    })

    alt.on('webview:DestroyApp', (appName) => {
        Controller.destroyApp(appName)
    })

    alt.on('webview:ChangePage', (appName, pageName, params) => {
        Controller.changePage(appName, pageName, params)
    })

    alt.on('webview:CallEvent', (eventName, ...args) => {
        EventManager.emit(eventName, ...args)
    })
}

export {
    EventManager,
    Controller
}
