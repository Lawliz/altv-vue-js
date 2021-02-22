/* eslint-disable no-undef */
export default class EventManager {
    eventList = {}

    on (eventName, fn) {
        this.eventList[eventName] = fn
    }

    emit (eventName, ...args) {
        this.eventList[eventName](...args)
    }

    off (eventName) {
        delete this.eventList[eventName]
    }

    callGame (event, ...args) {
        alt.emit("webview:CallGame", event, ...args)
    }
}
