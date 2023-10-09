import Tooltip from "./Tooltip.svelte";
import type { ComponentType } from "svelte";

export enum Sides {
  TM = "tm",
  BM = "bm",
  TL = "tl",
  TR = "tr",
  BL = "bl",
  BR = "br",
  L = "l",
  R = "r",
}

const defaultParams = {
  side: Sides.BM,
  icon: null,
  isTouchScreen: false,
  showOnMobile: true,
};

type TooltipParams = {
  text: string;
  side?: Sides;
  icon?: ComponentType | null;
  isTouchScreen?: boolean;
  className?: string;
  showOnMobile?: boolean;
};

const tooltip = (node: HTMLElement | SVGSVGElement, params: TooltipParams) => {
  let _params = { ...defaultParams, ...params };
  let component: InstanceType<typeof Tooltip> | null = null;
  const newTooltip = () => {
    component = new Tooltip({
      target: node,
      props: {
        text: _params.text,
        icon: _params.icon,
        className: _params.className,
        side: _params.side,
      },
    });
  };

  const destroyTooltip = () => {
    if (!component) return;
    component.$destroy();
    component = null;
  };

  const createTooltip = () => {
    const position = getComputedStyle(node).getPropertyValue("position");
    if (!position || position === "static") {
      node.style.position = "relative";
    }
    if (!component) {
      newTooltip();
    }
  };

  const createTooltipMobile = (e: Event) => {
    e.stopPropagation();
    if (_params.showOnMobile) {
      createTooltip();
    }
  };

  const _update = (newParams: TooltipParams) => {
    _params = { ..._params, ...newParams };
    if (component) {
      component.$set({ text: _params.text, icon: _params.icon });
    }
  };

  if (_params.isTouchScreen) {
    node.addEventListener("click", createTooltipMobile);
    window.addEventListener("click", destroyTooltip);
    return {
      update: _update,
      destroy() {
        node.removeEventListener("click", createTooltipMobile);
        window.removeEventListener("click", destroyTooltip);
      },
    };
  } else {
    node.addEventListener("mouseenter", createTooltip);
    node.addEventListener("mouseleave", destroyTooltip);
    node.addEventListener("blur", destroyTooltip);
    node.addEventListener("focus", createTooltip);
    node.addEventListener("click", node.blur);

    return {
      update: _update,
      destroy() {
        node.removeEventListener("mouseenter", destroyTooltip);
        node.removeEventListener("mouseleave", createTooltip);
        node.removeEventListener("focus", destroyTooltip);
        node.removeEventListener("blur", createTooltip);
        node.removeEventListener("click", node.blur);
      },
    };
  }
};

export default tooltip;
