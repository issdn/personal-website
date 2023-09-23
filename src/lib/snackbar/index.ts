enum SnackbarType {
    error = "error",
    success = "success"
}

type SnackbarSettingObject = Record<
    SnackbarType,
    import("svelte").ComponentType
>;
type SnackbarStyleObject = Record<SnackbarType, string>;
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

export { default as snackbars } from "./snackbars";
export { SnackbarType }
export type { SnackbarProps, SnackbarSettingObject, SnackbarStyleObject, OptionalSnackbarProps }