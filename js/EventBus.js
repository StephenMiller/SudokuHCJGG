class EventBus {
    constructor() {
        this.subscribers = {};
    }

    subscribe(event, callback) {
        this.subscribers[event] = this.subscribers[event] || [];
        if (!this.subscribers[event].includes(callback)) {
            this.subscribers[event].push(callback);
        }
        //console.log(this.subscribers);
    }
    
    unSubscribe(event, callback) {
        if (this.subscribers[event]) {
            this.subscribers[event] = this.subscribers[event].filter(subscriber => subscriber !== callback);
        }
    }

    publishData(event, data) {
        if (this.subscribers[event]) {
            this.subscribers[event].forEach(callback => callback(data));
        }
    }

    publish(event, ...args) {
        if(this.subscribers[event]) {
            this.subscribers[event].forEach(callback => callback(...args));
        }
    }
}