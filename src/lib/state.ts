import {
  concat,
  distinctUntilChanged,
  fromEvent,
  map,
  type Observable,
  of,
  shareReplay,
} from "rxjs";
import { getRequestEvent, isServer } from "solid-js/web";

function currentUrl(): URL {
  if (!isServer) {
    return new URL(window.location.href);
  }
  return new URL(getRequestEvent()?.request?.url || "");
}

function routeChange(): Observable<Event | null> {
  if (isServer) {
    return of(null);
  }
  return concat(of(null), fromEvent(window.navigation, "navigate"));
}

let gameKeyed$: Observable<string | null> | null = null;

export const gameKey$: () => Observable<string | null> = () => {
  if (!isServer && gameKeyed$) {
    return gameKeyed$;
  }
  gameKeyed$ = routeChange().pipe(
    map(() => {
      const path = currentUrl().pathname;
      if (path.startsWith("/game/")) {
        return path.split("/")[2];
      }
      return null;
    }),
    distinctUntilChanged(),
    shareReplay(1),
  );
  return gameKeyed$;
};
