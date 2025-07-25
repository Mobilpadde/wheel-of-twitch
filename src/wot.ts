import type { NotifyFn } from "./notifier";
import Sector from "./sector";

export default class WheelOfTwitch {
  sectors: Sector[];
  entriesPerUser: number; // Number of entries per user

  btnElm: HTMLElement;
  ctx: CanvasRenderingContext2D;

  radius: number;
  offset: number = Math.PI / 2;
  pi: number = Math.PI;
  tau: number = 2 * this.pi;

  arc: number = 0;
  angle: number = 0;
  velocity: number = 0;
  maxVelocity: number = 0.1;
  friction: number = 0.99;

  spinning: boolean = false;
  done: boolean = true;
  notified: boolean = false;
  locked: boolean = false; // Lock state - prevents adding new sectors after spin

  broadcast: NotifyFn = () => {};

  constructor(
    canvas: HTMLCanvasElement,
    btnElm: HTMLElement,
    entriesPerUser: number = 1
  ) {
    this.sectors = [];
    this.entriesPerUser = entriesPerUser;

    this.btnElm = btnElm;
    this.btnElm.textContent = "Waiting for entries...";

    this.ctx = canvas.getContext("2d")!;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.radius = this.ctx.canvas.width / 2;

    this.btnElm.addEventListener("click", () => {
      if (this.locked && this.done) {
        // Unlock but don't spin yet, then we "reset"
        this.locked = false;
        this.btnElm.textContent = "SPIN";
        this.btnElm.style.background = "#000";
        this.btnElm.classList.remove("light", "dark");
        return;
      }

      this.spinning = true;
      this.done = false;
      this.notified = false;
      this.locked = true;

      if (this.velocity == 0) {
        this.velocity =
          this.maxVelocity + Math.random() * (this.entries() / this.total / 2);
      }
    });

    this.engine();
  }

  set broadcastFn(fn: NotifyFn) {
    this.broadcast = fn;
  }

  get total() {
    return this.sectors.length;
  }

  get index() {
    let adjustedPointerAngle = (this.offset + this.pi - this.angle) % this.tau;
    if (adjustedPointerAngle < 0) {
      adjustedPointerAngle += this.tau;
    }

    for (let i = 0; i < this.sectors.length; i++) {
      const sector = this.sectors[i];

      if (sector.containsAngle(adjustedPointerAngle)) {
        // If we're exactly at the start boundary, check if a later sector also contains this angle
        if (Math.abs(adjustedPointerAngle - sector._start) < 1e-10) {
          // Look for a sector that has this angle as its end boundary
          for (let j = i + 1; j < this.sectors.length; j++) {
            if (this.sectors[j].containsAngle(adjustedPointerAngle)) return j;
          }
        }

        return i;
      }
    }

    // Fallback: if no sector contains the pointer, return the first one
    console.warn(
      "No sector contains adjusted pointer angle, returning index 0"
    );
    return 0;
  }

  reset() {
    this.sectors = [];
    this.angle = 0;
    this.velocity = 0;
    this.spinning = false;
    this.done = true;
    this.notified = false;
    this.locked = false;

    this.btnElm.textContent = "Waiting for entries...";
    this.btnElm.style.background = "#000";
    this.btnElm.classList.remove("light", "dark");

    this.update();
  }

  entries(count: number = 0): number {
    return this.sectors
      .slice(0, count || this.total)
      .reduce((acc, { entries }) => acc + (entries || 0), 0);
  }

  addSector(label: string, color: string) {
    if (!this.done || this.locked) return;

    if (!label || !color) {
      console.error("Invalid sector:", { label, color });
      return;
    }

    // Check if sector already exists
    const existingsector = this.sectors.find((s) => s._label === label);
    if (existingsector) {
      const counts = this.sectors.reduce<Record<string, number>>(
        (acc, value) => ({
          ...acc,
          [value._label]: (acc[value._label] || 0) + 1,
        }),
        {}
      );

      if (counts[label] >= this.entriesPerUser + 1) {
        console.warn("Maximum entries reached for sector:", label);
        return;
      }

      existingsector.entries! += 1;
    } else {
      const newSector = new Sector(color, label);
      newSector.updateSector(0, 0, this.radius, this.radius, this.radius);

      this.sectors.push(newSector);
    }

    this.update();
    this.btnElm.textContent = "SPIN";
  }

  update() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.arc = this.tau / this.entries();

    const orderedSectors = this.sectors;

    // Start first sector centered at pointer position (base position, no rotation applied)
    let currentAngle = this.offset - (this.arc * orderedSectors[0].entries) / 2;

    orderedSectors.forEach((sector) => {
      const sectorArc = this.arc * sector.entries; // Arc size for this sector

      // Calculate angles in the base coordinate system (no rotation applied)
      const startAngle = currentAngle % this.tau;
      const endAngle = (currentAngle + sectorArc) % this.tau;

      sector.updateSector(startAngle, endAngle);
      currentAngle = currentAngle + sectorArc;
    });

    this.drawWheel();
  }

  drawWheel() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();

    this.ctx.translate(this.radius, this.radius);
    this.ctx.rotate(this.angle);
    this.ctx.translate(-this.radius, -this.radius);

    this.sectors.forEach((sector) => sector.draw(this.ctx));

    this.ctx.restore();
  }

  setChoice(notify: boolean = false) {
    const sectorIndex = this.index;
    const sector = this.sectors[sectorIndex];

    if (!sector) {
      console.warn("No sector found at index:", sectorIndex);
      return;
    }

    this.btnElm.textContent = this.done ? "SPIN" : sector.label;
    this.btnElm.style.background = sector.color;
    this.btnElm.className = `${sector.isLight ? "light" : "dark"}`;

    if (notify && !this.notified) {
      this.spinning = false;
      this.done = true;
      this.notified = true;
      this.btnElm.textContent = `🎉 ${sector.label} 🎉`;
      this.broadcast(sector.label);
    }
  }

  engine() {
    if (this.spinning) this.frame();
    requestAnimationFrame(() => this.engine());
  }

  frame() {
    this.drawWheel();

    if (!this.spinning) return;

    this.angle += this.velocity;
    this.angle %= this.tau;

    this.velocity *= this.friction;
    if (this.velocity < 0.00065) {
      this.velocity = 0;
      this.setChoice(true);
      return;
    }

    this.setChoice();
  }
}
