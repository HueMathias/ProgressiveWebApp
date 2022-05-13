function main(){
    const permission = document.getElementById('push-permission')
    if (!permission &&
        !('Notification' in window) &&
        Notification.permission != 'default'
        ){
        return;
    }
        

    const button = document.createElement('button')
    button.innerText = 'Recevoir les notifications'
    permission.appendChild(button)
    button.addEventListener('click', askPermission)
}

function askPermission(){
    const permission = Notification.requestPermission();
    if (permission === "granted") {
        registerServiceWorker();
    }
}

async function registerServiceWorker(){
    const registration = await navigator.serviceWorker.register("/sw.js");
    let subscription = await registration.pushManager.getSubscription();
    // L'utilisateur n'est pas déjà abonné, on l'abonne au notification push
    if (!subscription) {
        subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: await getPublicKey(),
        });
    }

    await saveSubscription(subscription);
}

async function getPublicKey() {
    const { key } = await fetch("/push/key", {
      headers: {
        Accept: "application/json",
      },
    }).then((r) => r.json());
    return key;
}

async function saveSubscription(subscription) {
    await fetch("/push/subscribe", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: subscription.toJSON(),
    });
  }
  
main();
