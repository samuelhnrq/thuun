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

function routeChange() {
  if (isServer) {
    return of(null);
  }
  return fromEvent(window.navigation, "navigate");
}

export const gameKey$: Observable<string | null> = concat(
  of(null),
  routeChange(),
).pipe(
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
