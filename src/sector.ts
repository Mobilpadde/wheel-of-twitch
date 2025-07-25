export default class Sector {
  _color: string;
  _light: boolean;

  _label: string;
  _entries: number; // Number of entries per sector

  _x: number;
  _y: number;

  _start: number;
  _end: number;
  _radius: number;

  constructor(color: string, label: string) {
    this._color = color;
    this._label = label;
    this._entries = 1;

    this._x = 0;
    this._y = 0;
    this._radius = 0;
    this._start = 0;
    this._end = 0;

    const rgb = Sector.hexToRgb(this._color);
    const luminance = Sector.luminance(rgb);
    this._light = luminance > 0.5;
  }

  static hexToRgb(hex: string): number[] {
    return hex
      .replace(
        /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        (_, r, g, b) => "#" + r + r + g + g + b + b
      )
      .substring(1)
      .match(/.{2}/g)!
      .map((x) => parseInt(x, 16));
  }

  static luminance(rgb: number[]): number {
    return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  }

  get label(): string {
    return this._label;
  }

  get color(): string {
    return this._color;
  }

  get isLight(): boolean {
    return this._light === true;
  }

  set entries(entries: number) {
    this._entries = entries;
  }

  get entries(): number {
    return this._entries;
  }

  updateSector(
    start: number,
    end: number,
    radius?: number,
    x?: number,
    y?: number
  ) {
    this._start = start;
    this._end = end;
    if (radius) this._radius = radius;
    if (x) this._x = x;
    if (y) this._y = y;
  }

  containsAngle(angle: number): boolean {
    // Normalize angle to be within [0, 2π)
    const normalizedAngle =
      ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    // Get sector bounds
    const start = this._start;
    const end = this._end;

    // Handle the case where the sector crosses the 0/2π boundary
    if (start > end) {
      // Sector spans across 0 (e.g., from 5.5 to 0.5)
      return normalizedAngle >= start || normalizedAngle <= end;
    } else {
      // Normal case: sector doesn't cross 0
      return normalizedAngle >= start && normalizedAngle <= end;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // sector arc
    ctx.beginPath();
    ctx.moveTo(this._x, this._y);
    ctx.arc(this._x, this._y, this._radius, this._start, this._end);
    ctx.lineTo(this._x, this._y);
    ctx.closePath();

    ctx.fillStyle = this._color;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";
    ctx.stroke();

    // sector label
    ctx.save();
    ctx.translate(this._x, this._y);

    // Calculate the middle angle of the sector, handling wrap-around
    let middleAngle;
    if (this._start > this._end) {
      // Sector wraps around 0/2π boundary
      // For example: start=4.71, end=0 should have middle at 5.497 (or -0.785)
      middleAngle = (this._start + this._end + 2 * Math.PI) / 2;
      if (middleAngle > 2 * Math.PI) {
        middleAngle -= 2 * Math.PI;
      }
    } else {
      // Normal case: sector doesn't wrap around
      middleAngle = (this._start + this._end) / 2;
    }

    // Rotate to the middle of the sector
    ctx.rotate(middleAngle);

    // Position text in the center of the sector
    const textRadius = this._radius * 0.6;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = this._light ? "#000" : "#fff";
    ctx.font = "bold 16px monospace";
    ctx.fillText(this._label, textRadius, 0);

    ctx.restore();
  }
}
