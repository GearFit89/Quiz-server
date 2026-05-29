
interface TimerState {
    id: NodeJS.Timeout;
    callback: Function;
    remaining: number;
    startTime: number;
    isPaused: boolean;
}
export default class TimerMap<K> extends Map<K, TimerState> {
    pause(key: K): void {
        const state = this.get(key);
        if (!state || state.isPaused) return;

        // Calculate elapsed time and update remaining
        const elapsed = Date.now() - state.startTime;
        state.remaining -= elapsed;
        state.isPaused = true;

        clearTimeout(state.id);
    }
    resume(key: K){
        const state = this.get(key);
        if (!state || !state.isPaused) return;
        state.isPaused = false;
        state.startTime = Date.now();
        state.id = setTimeout(()=>{
            state.callback();
            this.delete(key)
        }, state.remaining)

    }
    delete(key: K): boolean {
        const timeout = super.get(key);

     if(timeout)   clearTimeout(timeout.id);

     return super.delete(key);


    }
    setTimer(key: K, clbFn: () => void, time: number): this {
        // Auto-clean previous timer if it exists
        this.delete(key);

        const timeout = setTimeout(() => {
            clbFn();
            this.delete(key); // Cleanup map once finished
        }, time);

        return super.set(key,{
            id:timeout,
            isPaused:false,
            startTime:Date.now(),
            remaining:time,
            callback:clbFn

        });
    }
    clear(): void {
         this.forEach((timeout)=>{clearTimeout(timeout.id)});
         return super.clear();
    }
}
const Timers = new TimerMap<string>();
export { TimerMap , Timers };