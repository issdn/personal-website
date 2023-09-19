import { writable } from "svelte/store";

const deviceStore = () => {
  const { set, subscribe } = writable<DeviceType>(null);
  const setDeviceType = (deviceType: "mobile" | "desktop") => {
    set(deviceType);
  };
  return {
    subscribe,
    setDeviceType,
  };
};

const deviceType = deviceStore();
export default deviceType;