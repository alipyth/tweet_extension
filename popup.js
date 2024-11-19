document.getElementById("startScraping").addEventListener("click", () => {
    const scrollLimit = document.getElementById("scrollLimit").value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: scrapeTweets,
            args: [parseInt(scrollLimit)]
        });
    });
});

function scrapeTweets(scrollLimit) {
    const results = [];
    let scrolled = 0;

    const scrape = () => {
        document.querySelectorAll("article").forEach(tweet => {
            const text = tweet.querySelector("div[lang]")?.innerText;
            const username = tweet.querySelector("div span span")?.innerText;
            const date = tweet.querySelector("time")?.getAttribute("datetime");
            const imageUrl = tweet.querySelector("img[alt='Image']")?.getAttribute("src") || "none";  // Extract image URL or set "none"
            
            if (text && username && date) {
                results.push({ text, username, date, imageUrl });
            }
        });

        scrolled++;
        if (scrolled < scrollLimit) {
            // Generate a random delay between 2 and 3 seconds
            const delay = Math.floor(Math.random() * 1000) + 2000; // Random value between 2000ms and 3000ms
            setTimeout(() => {
                window.scrollTo(0, document.body.scrollHeight);
                scrape();
            }, delay);
        } else {
            const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "tweets.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    scrape();
}