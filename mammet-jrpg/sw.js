// Optional Progressive Web App service worker; no background data caching.
// Actual remote push messages require a server to save subscriptions and send Web Push.
self.addEventListener("push",event=>{
 const payload=event.data?event.data.json():{};
 event.waitUntil(self.registration.showNotification(payload.title||"Mammets Schatten",{
   body:payload.body||"Deine Gruppe hat einen neuen Zug.",
   icon:"./icon.svg",
   badge:"./icon.svg",
   data:{url:payload.url||"./"},
   tag:"mammet-turn"
 }));
});
self.addEventListener("notificationclick",event=>{
 event.notification.close();
 const target=event.notification.data?.url||"./";
 event.waitUntil(clients.openWindow(target));
});
