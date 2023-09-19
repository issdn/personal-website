const center = (
  node: HTMLElement,
  setPosition: (pos: { x: number; y: number }) => void
) => {
  const setPositionMiddle = () => {
    const { width, height } = node.getBoundingClientRect();
    setPosition({ x: window.innerWidth / 2 - width / 2, y: 30 });
  };
  if (node) {
    setPositionMiddle();
    window.addEventListener("resize", setPositionMiddle);
  }
  return {
    destroy() {
      window.removeEventListener("resize", setPositionMiddle);
    },
  };
};

const focusOnMount = (node: HTMLElement) => {
  let focused = false;
  if (node && !focused) {
    node.focus();
  }
};

export { center, focusOnMount };
