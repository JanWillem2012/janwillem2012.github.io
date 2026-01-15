importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

self.addEventListener('push', function(event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) return;

    const data = event.data ? event.data.json() : {};
    const title = data.title || "Nieuw bericht";
    const message = data.alert || data.body || "Je hebt een melding ontvangen";

    const request = indexedDB.open("NotificationHistory", 1);
    request.onupgradeneeded = (e) => {
        e.target.result.createObjectStore("messages", { keyPath: "id", autoIncrement: true });
    };
    request.onsuccess = (e) => {
        const db = e.target.result;
        const transaction = db.transaction("messages", "readwrite");
        transaction.objectStore("messages").add({
            title: title,
            body: message,
            time: new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
        });
    };
});
