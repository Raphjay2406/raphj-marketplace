import { AgUiEmitter } from "./ag-ui.js";
import { ResultEnvelope } from "./envelope.js";
export interface DispatchInput<P, T> {
    worker: string;
    payload: P;
    handler: (payload: P) => Promise<ResultEnvelope<T>>;
    emitter?: AgUiEmitter;
    correlation_id?: string;
}
export declare function dispatch<P, T>(input: DispatchInput<P, T>): Promise<ResultEnvelope<T>>;
//# sourceMappingURL=dispatch.d.ts.map