import { Client } from "tmi.js";

import WheelOfTwitch from "./wot";
import Settings from "./settings";
import Notifier from "./notifier";
import celebrate from "./celebrate";

import "./style.css";

const settings = new Settings();
let client: Client | null = null;

function start() {
  const wot = new WheelOfTwitch(
    document.querySelector<HTMLCanvasElement>("#wheel")!,
    document.querySelector<HTMLElement>("#spin")!,
    settings.entries
  );

  const notifier = new Notifier();
  notifier.add(notifier.ntfy(settings.channel));
  notifier.add(celebrate);
  // notifier.add(notifier.alert());
  wot.broadcast = notifier.notify.bind(notifier);

  if (client) client.disconnect();
  client = new Client({ channels: [settings.channel] });
  client.connect();

  client.on("message", (_, state, message) => {
    if (
      settings.including.length === 0 ||
      message.toLowerCase().includes(settings.including)
    )
      wot.addSector(
        state["display-name"] || state.username || "Unknown",
        state.color || settings.color
      );
  });
}

settings.init(() => {
  start();
});
