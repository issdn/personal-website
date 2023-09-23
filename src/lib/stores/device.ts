import { writable } from "svelte/store";

const deviceStore = () => {
  const { set, subscribe } = writable<DeviceType>(DeviceType.Desktop);
  const setDeviceType = (deviceType: DeviceType) => {
    set(deviceType);
  };
  return {
    subscribe,
    setDeviceType,
  };
};

const deviceType = deviceStore();
enum DeviceType {
  Mobile = "mobile",
  Desktop = "desktop"
}
export { DeviceType, deviceType }