export type NotifyFn = (winner: string) => void;

export default class Notifier {
  private fns: NotifyFn[] = [];

  add(fn: NotifyFn) {
    this.fns.push(fn);
  }

  notify(winner: string) {
    this.fns.forEach((fn) => fn(winner));
  }

  ntfy(topic: string, server: string = "https://ntfy.sh/"): NotifyFn {
    return (winner: string) => {
      fetch(server + topic, {
        method: "POST",
        body: winner,
      });
    };
  }

  alert(): NotifyFn {
    return (winner: string) => {
      alert(`Winner: ${winner}`);
    };
  }
}
