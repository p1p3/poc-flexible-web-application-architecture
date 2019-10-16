import Navigo from 'navigo';

export const NAVIGO = new Navigo(null, true);

export interface Route {
  component?: Object;
  template?: string;
  url: string;
}

export class RouterService {
  private static readonly subscribers: Object[] = [];
  private constructor() {}

  private static notify(route: Route, ...args: any) {
    RouterService.subscribers.forEach((subscriber: Function) => {
      subscriber(route, ...args);
    });
  }

  public static register(routes: Route[]) {
    routes.forEach((route: Route) => {
      NAVIGO.on(route.url, {
        as: route.url,
        uses: (...args: any) => {
          RouterService.notify(route, ...args);
        }
      }).resolve();
    });
  }

  public static navigate(route: string, absolute: boolean = false) {
    NAVIGO.navigate(route, absolute);
  }

  public static currect() {
    return NAVIGO.lastRouteResolved;
  }

  public static subscribe(subscriber: Function) {
    if (subscriber instanceof Function) {
      this.subscribers.push(subscriber);
    } else {
      throw new Error(`The subscriber is not a Function!`);
    }
  }

  public static unsubscribe(subscriber: Function) {
    const index = this.subscribers.indexOf(subscriber);
    if (index >= 0) {
      this.subscribers.splice(index, 1);
    }
  }
}