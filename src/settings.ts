let settings = {
  entries: 2,
  channel: "jynxzi",
  color: "#ffb703",
  including: "",
};

export default class Settings {
  burger: HTMLElement;
  settings: HTMLElement;
  saveBtn: HTMLElement;
  entriesElm: HTMLInputElement;
  channelElm: HTMLInputElement;
  colorElm: HTMLInputElement;
  includingElm: HTMLInputElement;
  ntfyElm: HTMLAnchorElement;

  callback: () => void = () => {};

  entries: number = settings.entries;
  channel: string = settings.channel;
  color: string = settings.color;
  including: string = settings.including;

  constructor() {
    this.burger = document.getElementById("burger")!;
    this.settings = document.getElementById("settings")!;
    this.saveBtn = document.getElementById("save")!;

    this.ntfyElm = document.getElementById("ntfy")! as HTMLAnchorElement;

    this.entriesElm = document.getElementById("entries")! as HTMLInputElement;
    this.channelElm = document.getElementById("channel")! as HTMLInputElement;
    this.colorElm = document.getElementById("color")! as HTMLInputElement;
    this.includingElm = document.getElementById(
      "including"
    )! as HTMLInputElement;
  }

  init(cb: () => void) {
    const local = localStorage.getItem("settings");
    if (local) settings = { ...settings, ...JSON.parse(local) };
    localStorage.setItem("settings", JSON.stringify(settings));

    this.entries = settings.entries;
    this.channel = settings.channel;
    this.color = settings.color;
    this.including = settings.including;

    this.entriesElm.value = String(this.entries);
    this.channelElm.value = this.channel;
    this.colorElm.value = this.color;
    this.includingElm.value = this.including;

    this.ntfyElm.href = `https://ntfy.sh/${this.channel}`;

    this.burger.addEventListener("click", () => this.toggle());
    this.saveBtn.addEventListener("click", () => this.save());

    this.callback = cb;
    this.callback();
  }

  toggle() {
    this.settings.classList.toggle("open");
  }

  save() {
    this.entries = parseInt(this.entriesElm.value, 10);
    this.channel = this.channelElm.value.trim();
    this.color = this.colorElm.value.trim();
    this.including = this.includingElm.value.trim();

    settings.entries = this.entries;
    settings.channel = this.channel;
    settings.color = this.color;
    settings.including = this.including;

    localStorage.setItem("settings", JSON.stringify(settings));

    this.toggle();
    this.callback();
  }
}
