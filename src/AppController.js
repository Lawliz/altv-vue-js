/* eslint-disable no-undef */
import { createApp, defineComponent } from 'vue'

import store from './store/index'
import { Controller, EventManager } from './main'
import Router from './router/index'
import App from './App.vue'

export default class AppController {
    app = {}
    params = {}

    async loadApp (appName, params) {
        if (Router[appName] === undefined) return console.log(`[WEBVIEW] ${appName} does not exist in Router`)

        if (params === undefined) params = {}
        this.params[appName] = params

        const alreadyExist = document.querySelectorAll('div')

        alreadyExist.forEach(el => {
            if (el.id === appName) {
                this.app[appName].unmount('#' + appName)
                el.remove()
            }
        })

        const element = document.createElement('div')
        element.id = appName
        document.body.appendChild(element)

        const ApplicationComponent = defineComponent(App)
        const Component = defineComponent(Router[appName]["home"])

        const app = createApp(ApplicationComponent)

        app.config.globalProperties = {
            $controller: Controller,
            $event: EventManager,
            $component: Component,
            params: this.params[appName],
            appName
        }

        app.use(store)

        this.app[appName] = app
        this.app[appName].vm = app.mount('#' + appName)
    }

    changePage (appName, pageName, params) {
        if (Router[appName] === undefined) return console.log(`[WEBVIEW] ${appName} does not exist in Router`)
        if (Router[appName][pageName] === undefined) return console.log(`[WEBVIEW] ${pageName} does not exist for app: ${appName} in Router`)

        this.params[appName] = params

        const Component = defineComponent(Router[appName][pageName])

        this.app[appName].config.globalProperties.$component = Component
        this.app[appName].vm.$forceUpdate()
    }

    destroyApp (appName) {
        if (Router[appName] === undefined) return console.log(`[WEBVIEW] ${appName} does not exist in Router`)

        const element = document.querySelectorAll('div')
        element.forEach(el => {
            if (el.id === appName) {
                this.app[appName].unmount('#' + appName)
                delete this.app[appName]
                el.remove()

                if ('alt' in window) alt.emit('webview:AppDestroy', appName)
            }
        })
    }
}
