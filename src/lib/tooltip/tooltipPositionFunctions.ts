enum Sides {
  RM = "rm",
  LM = "lm",
  TM = "tm",
  BM = "bm",
  TL = "tl",
  TR = "tr",
  BL = "bl",
  BR = "br",
  L = "l",
  R = "r",
}

enum AS {
  TSide = 'tSide',
  BSide = 'bSide',
  LSide = 'lSide',
  RSide = 'rSide',
}
enum AP {
  MHPos = 'mhPos',
  MVPos = 'mvPos',
  LPos = 'lPos',
  RPos = 'rPos',
  TPos = 'tPos',
  BPos = 'bPos',
}
enum AD {
  TDir = 'tDir',
  BDir = 'bDir',
  LDir = 'lDir',
  RDir = 'rDir',
}
type ArrowCreationKey = keyof AS | keyof AP | keyof AD;

export { Sides, AS, AP, AD, type ArrowCreationKey }


const getFreePossibleSides = (
  node: HTMLElement,
  window: Window,
  arrowNodeGapSize: number,
  squashedFreeSide: Sides.R | Sides.L | null = null
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
      return Sides.TM;
    case b && m:
      return Sides.BM;
    case l:
      return Sides.L;
    case r:
      return Sides.R;
    case t && (startRToL || squashedFreeSide === Sides.L):
      return Sides.TL;
    case t && (startLToR || squashedFreeSide === Sides.R):
      return Sides.TR;
    case b && (startRToL || squashedFreeSide === Sides.L):
      return Sides.BL;
    case b && (startLToR || squashedFreeSide === Sides.R):
      return Sides.BR;
    default:
      return null;
  }
};

export const getWidestPossibleSideAndSetWidth = (
  node: HTMLElement,
  window: Window
): Sides.L | Sides.R => {
  const { left } = node.getBoundingClientRect();
  const largestPossibleWidthOnRight = window.innerWidth - left;
  const largestPossibleWidthOnLeft = left;
  if (largestPossibleWidthOnLeft > largestPossibleWidthOnRight) {
    return Sides.L;
  } else {
    return Sides.R;
  }
};

export const adjustTooltipPosition = (
  node: HTMLElement,
  window: Window,
  arrowNodeGapSize: number,
  squashedFreeSide: Sides.R | Sides.L | null = null
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
      arrowSide = AS.RSide;
      break;
    case "r":
      arrowSide = AS.LSide;
      break;
    case "tm":
    case "tr":
    case "tl":
      arrowSide = AS.BSide;
      break;
    case "bm":
    case "br":
    case "bl":
      arrowSide = AS.TSide;
      break;
    default:
      arrowSide = AS.BSide;
  }
  switch (arrowSide) {
    case "tSide":
      arrowDirection = AD.BDir;
      break;
    case "bSide":
      arrowDirection = AD.TDir;
      break;
    case "lSide":
      arrowDirection = AD.RDir;
      break;
    case "rSide":
      arrowDirection = AD.LDir;
      break;
    default:
      arrowDirection = AD.BDir;
      break;
  }
  switch (tooltipSide) {
    case "tm":
    case "bm":
      arrowPosition = AP.MHPos;
      break;
    case "tr":
    case "br":
      arrowPosition = AP.LPos;
      break;
    case "tl":
    case "bl":
      arrowPosition = AP.RPos;
      break;
    default: {
      arrowPosition = AP.MVPos;
      break;
    }
  }

  return `${tooltipSide} ${arrowSide} ${arrowPosition} ${arrowDirection}`;
};
