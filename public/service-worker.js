self.addEventListener("install", (event) => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    self.clients.claim();
    console.log("[SW] Активирован");
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(self.clients.openWindow("/"));
});

self.addEventListener("message", (event) => {
    if (event.data?.type === "CUSTOM_PUSH") {
        const { title, body } = event.data.payload;

        self.registration.showNotification(title, {
            body,
            icon: "/Logo-mobile.png",
            badge: "/badge.png",
            requireInteraction: true,
        });

        console.log("[SW] Показано уведомление через CUSTOM_PUSH");
    }
});
