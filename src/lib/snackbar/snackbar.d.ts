type SnackbarType = "error" | "success";
type SnackbarSettingObject = Record<
  SnackbarType,
  import("svelte").ComponentType
>;
type SnackbarStyleObject = Record<SnackbarType, string>;
type SnackbarType = keyof SnackbarSettingObject;
type SnackbarProps = {
  id: string;
  title: string;
  type: SnackbarType;
  detail?: string | null;
  duration: number;
};
type OptionalSnackbarProps = {
  type?: SnackbarType;
  detail?: string | null;
  duration?: number;
};