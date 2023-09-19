export type Sides =
  | "rm"
  | "lm"
  | "tm"
  | "bm"
  | "tl"
  | "tr"
  | "bl"
  | "br"
  | "l"
  | "r";

const getFreePossibleSides = (
  node: HTMLElement,
  window: Window,
  arrowNodeGapSize: number,
  squashedFreeSide: "r" | "l" | null = null
): Sides | null => {
  const { width, height } = node.getBoundingClientRect();
  const {
    width: parentWidth,
    top,
    left,
  } = node.parentElement!.getBoundingClientRect();
  const ratioX = (1 + arrowNodeGapSize / 100) * width;
  const ratioY = (1 + arrowNodeGapSize / 100) * height;

  const t = top - ratioY > 0;
  const b = top + ratioY < window.innerHeight;
  const m = left + width / 2 < window.innerWidth && left - width / 2 > 0;
  const l = left - ratioX > 0;
  const r = left + ratioX < window.innerWidth;
  const startRToL = left - width + parentWidth > 0;
  const startLToR = left + width - parentWidth < window.innerWidth;
  switch (true) {
    case t && m:
      return "tm";
    case b && m:
      return "bm";
    case l:
      return "l";
    case r:
      return "r";
    case t && (startRToL || squashedFreeSide === "l"):
      return "tl";
    case t && (startLToR || squashedFreeSide === "r"):
      return "tr";
    case b && (startRToL || squashedFreeSide === "l"):
      return "bl";
    case b && (startLToR || squashedFreeSide === "r"):
      return "br";
    default:
      return null;
  }
};

export const getWidestPossibleSideAndSetWidth = (
  node: HTMLElement,
  window: Window
): "l" | "r" => {
  const { left } = node.getBoundingClientRect();
  const largestPossibleWidthOnRight = window.innerWidth - left;
  const largestPossibleWidthOnLeft = left;
  if (largestPossibleWidthOnLeft > largestPossibleWidthOnRight) {
    return "l";
  } else {
    return "r";
  }
};

export const adjustTooltipPosition = (
  node: HTMLElement,
  window: Window,
  arrowNodeGapSize: number,
  squashedFreeSide: "r" | "l" | null = null
) => {
  const tooltipSide = getFreePossibleSides(
    node,
    window,
    arrowNodeGapSize,
    squashedFreeSide
  );
  if (!tooltipSide) {
    if (!squashedFreeSide) {
      return null;
    }
    return "bm tSide mvPos bDir";
  }
  let arrowDirection: AD;
  let arrowSide: AS;
  let arrowPosition: AP;
  switch (tooltipSide) {
    case "l":
      arrowSide = "rSide";
      break;
    case "r":
      arrowSide = "lSide";
      break;
    case "tm":
    case "tr":
    case "tl":
      arrowSide = "bSide";
      break;
    case "bm":
    case "br":
    case "bl":
      arrowSide = "tSide";
      break;
    default:
      arrowSide = "bSide";
  }
  switch (arrowSide) {
    case "tSide":
      arrowDirection = "bDir";
      break;
    case "bSide":
      arrowDirection = "tDir";
      break;
    case "lSide":
      arrowDirection = "rDir";
      break;
    case "rSide":
      arrowDirection = "lDir";
      break;
    default:
      arrowDirection = "bDir";
      break;
  }
  switch (tooltipSide) {
    case "tm":
      arrowPosition = "mhPos";
      break;
    case "bm":
      arrowPosition = "mhPos";
      break;
    case "tr":
    case "br":
      arrowPosition = "lPos";
      break;
    case "tl":
    case "bl":
      arrowPosition = "rPos";
      break;
    default: {
      arrowPosition = "mvPos";
      break;
    }
  }

  return `${tooltipSide} ${arrowSide} ${arrowPosition} ${arrowDirection}`;
};
