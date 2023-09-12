import { writable } from "svelte/store";

const _windowStore = () => {
  const { set, subscribe } = writable<DeviceType>(null);
  const setDeviceType = (deviceType: "mobile" | "desktop") => {
    set(deviceType);
  };
  return {
    subscribe,
    setDeviceType,
  };
};

const windowStore = _windowStore();
export default windowStore;

const addEventHandlers = (
  node: HTMLElement,
  eventHandlers: EventHandlersObject
) => {
  Object.keys(eventHandlers).forEach((eventName) => {
    node.addEventListener(eventName, eventHandlers[eventName]);
  });

  return {
    destroy() {
      Object.keys(eventHandlers).forEach((eventName) => {
        node.removeEventListener(eventName, eventHandlers[eventName]);
      });
    },
    update(newEventHandlers: EventHandlersObject) {
      Object.keys(eventHandlers).forEach((eventName) => {
        node.removeEventListener(eventName, eventHandlers[eventName]);
      });
      Object.keys(newEventHandlers).forEach((eventName) => {
        node.addEventListener(eventName, newEventHandlers[eventName]);
      });
      eventHandlers = newEventHandlers;
    },
  };
};

export { addEventHandlers };
