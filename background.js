chrome.action.onClicked.addListener(async (tab) => {
    try {
        const [{ result: pageTitle }] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => document.title
        });
    
        const query = encodeURIComponent(pageTitle);
        const url = `https://library.itcpr.org?q=${query}`;  // Replace with real site later
        chrome.tabs.create({ url });
    } catch (err) {
        console.error("PaperPort error:", err);
    }
});
