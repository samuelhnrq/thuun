import { BehaviorSubject, distinctUntilChanged, filter, map } from "rxjs";
import { getCurrentDate } from "./utils";

interface GlobalState {
  gameKey: string;
}

const globalSubject = new BehaviorSubject<GlobalState>({
  gameKey: getCurrentDate().toISOString(),
});

export const globalState$ = globalSubject.asObservable();

export const gameKey$ = globalState$.pipe(
  map((state) => state.gameKey),
  distinctUntilChanged(),
  filter((x): x is string => !!x),
);

function updateState(cb: (oldState: GlobalState) => GlobalState) {
  const current = globalSubject.getValue();
  globalSubject.next(cb(current));
}

export function dispatchGameKey(gameKey: string) {
  updateState((state) => ({ ...state, gameKey }));
}

export function dispatchDailyGame() {
  updateState((state) => ({
    ...state,
    gameKey: getCurrentDate().toISOString(),
  }));
}
