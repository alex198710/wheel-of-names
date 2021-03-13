export default class CircleUtil {
  public static calculateCirclePoints(
    x0: number,
    y0: number,
    r: number,
    nbElements: number,
    index: number
  ): string {
    const t = 360 / nbElements
    const points = []
    for (let i = t * index; i < t * (index + 1); i += 5) {
      points.push(CircleUtil.calculatePoint(x0, y0, r, i))
    }
    points.push(CircleUtil.calculatePoint(x0, y0, r, t * (index + 1)))
    return points.reduce(
      (acc, curr) => `${acc} ${curr.x},${curr.y}`,
      `${x0},${y0}`
    )
  }
  
  public static calculatePoint(x0: number, y0: number, r: number, i: number) {
    const x = x0 + r * Math.cos(i * (Math.PI / 180))
    const y = y0 + r * Math.sin(i * (Math.PI / 180))
    return { x, y }
  }
  
  public static calculateTextPoint(
    x0: number,
    y0: number,
    r: number,
    nbElements: number,
    index: number
  ): { x: number; y: number } {
    const t = 360 / nbElements
    const lastIdx = t * (index + 1)
    const firstIdx = t * index
    return CircleUtil.calculatePoint(x0, y0, r, (firstIdx + lastIdx) / 2 + 7) // 7 degrees for text height
  }

  public static map (
    value: number,
    in_min: number,
    in_max: number,
    out_min: number,
    out_max: number
  ) {
    if (value === 0) {
      return out_min
    }
    return ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
  }
}
  