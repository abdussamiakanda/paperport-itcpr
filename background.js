chrome.action.onClicked.addListener(async (tab) => {
    try {
        const [{ result: articleTitle }] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                // Try common selectors for article titles on academic sites
                const possibleTitleElements = [
                    document.querySelector('h1.article-title'),
                    document.querySelector('h1.title'),
                    document.querySelector('.article-title'),
                    document.querySelector('[data-article-title]'),
                    // Fallback to first h1 if no specific article title found
                    document.querySelector('h1')
                ];
                
                const titleElement = possibleTitleElements.find(el => el !== null);
                return titleElement ? titleElement.textContent.trim() : document.title;
            }
        });
    
        const query = encodeURIComponent(articleTitle);
        const url = `https://library.itcpr.org?q=${query}`;  // Replace with real site later
        chrome.tabs.create({ url });
    } catch (err) {
        console.error("PaperPort error:", err);
    }
});
