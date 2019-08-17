function Log(...args: any[]) {
    // chrome.tabs.executeScript({
    //     code: `console.log(${args.map(str=>`'${str}'`).join(',')})`,
    // })
    console.log(...args);
}

chrome.runtime.onInstalled.addListener(() => {
    Log("Hello world");
    chrome.storage.local.get(Log);

    chrome.webRequest.onCompleted.addListener((details) => {
        Log(details);
        matchAction(details);
    }, {
        urls: ["*://api.gotinder.com/*"],
    });
});

async function matchAction(details: chrome.webRequest.WebResponseCacheDetails) {
    const url = new URL(details.url);
    const match = url.pathname.match(/^\/(pass|like)\/([a-z0-9]+).*/);
    if (match) {
        const [, action, user_id] = match;
        Log({
            action,
            user_id,
        });
        await saveAction(action, user_id);
    }
}

function getStorage(key: string): Promise<any> {
    return new Promise(resolve => {
        chrome.storage.local.get((items) => {
            return resolve(items[key]);
        });
    });
}
function saveStorage(ket: string, value: any) {
    return new Promise((resolve) => {
        chrome.storage.local.set({
            key: value,
        }, () => {
            resolve();
        })
    });
}

async function saveInfo(infos: any[]) {
    const all = await getStorage('all');
    for (const info of infos) {
        if (info.user && info.user._id) {
            all[info.user._id] = info;
        }
    }

    await saveStorage('all', all);
}

async function saveAction(action: string, id: string) {
    chrome.storage.local.set({
        [id]: action,
    });
}