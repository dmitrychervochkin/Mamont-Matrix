self.addEventListener("push", (event: PushEvent) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || "Внимание!";
    const options: NotificationOptions = {
        body: data.body || "У тебя новые задачи в красном листе!",
        icon: data.icon || "/icon.png",
        badge: data.badge || "/badge.png",
        requireInteraction: true,
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event: NotificationEvent) => {
    event.notification.close();
    event.waitUntil(
        (self as any).clients.openWindow("/") // TS ругается, потому кастуем в any
    );
});
