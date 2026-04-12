export class AgUiEmitter {
    listeners = new Set();
    sink;
    constructor(options = {}) {
        this.sink = options.sink;
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    emit(event) {
        for (const l of this.listeners)
            l(event);
        this.sink?.(event);
    }
}
let globalEmitter = null;
export function getAgUi() {
    if (!globalEmitter)
        globalEmitter = new AgUiEmitter();
    return globalEmitter;
}
