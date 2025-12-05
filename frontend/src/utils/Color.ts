export class Color {
  public pixelData: ImageData;
  public hex: string;

  private constructor(
    public red: number,
    public green: number,
    public blue: number,
  ) {
    const buffer = new Uint8ClampedArray([this.red, this.green, this.blue, 255]);
    this.pixelData = new ImageData(buffer, 1, 1);

    this.hex = (() => {
      const toHexComponent = (value: number): string => {
        const hex = value.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };

      return `#${toHexComponent(this.red)}${toHexComponent(this.green)}${toHexComponent(this.blue)}`;
    })();
  }

  /**
   * Parses the given color.
   * @author Claude https://claude.ai/
   * @param value Hex value as string (e.g. `#ffffff`, `6b6b6b`, `#000`)
   * @returns The color
   */
  public static fromRGBHexString(value: string): Color {
    // Remove # if present
    value = value.replace(/^#/, '');

    // Handle 3-digit hex shorthand (e.g., "abc" -> "aabbcc")
    if (value.length === 3) {
      value = value
        .split('')
        .map((char) => char + char)
        .join('');
    }

    // Validate hex string
    if (!/^[0-9A-Fa-f]{6}$/.test(value)) {
      throw new Error(`Invalid hex color format, received ${value}`);
    }

    // Parse and return RGB values
    return new Color(
      parseInt(value.substring(0, 2), 16),
      parseInt(value.substring(2, 4), 16),
      parseInt(value.substring(4, 6), 16),
    );
  }
}
