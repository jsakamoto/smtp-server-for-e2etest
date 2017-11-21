interface Window {
    Notification: {
        permission: string;
        requestPermission(callback: Function): void;
    }
}
