chrome.action.onClicked.addListener(async (tab) => {
    try {
        const [{ result: articleTitle }] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                // Try to get title from meta tags first
                const metaSelectors = [
                    'meta[name="citation_title"]',
                    'meta[property="og:title"]',
                    'meta[name="dc.title"]',
                    'meta[name="title"]',
                    'meta[name="twitter:title"]'
                ];

                for (const selector of metaSelectors) {
                    const meta = document.querySelector(selector);
                    if (meta && meta.content) {
                        return meta.content.trim();
                    }
                }

                // Fallback to visible titles if meta fails
                const possibleTitleElements = [
                    document.querySelector('h1.article-title'),
                    document.querySelector('h1.title'),
                    document.querySelector('.article-title'),
                    document.querySelector('[data-article-title]'),
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
