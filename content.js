function scrapeTweets() {
  let tweets = [];
  let tweetElements = document.querySelectorAll('article[data-testid="tweet"]');

  tweetElements.forEach(article => {
    let tweetElement = article.querySelector('span.css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3');
    let usernameElement = article.querySelector('span.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0');
    let dateElement = article.querySelector('time');

    if (tweetElement && usernameElement && dateElement) {
      let tweet = tweetElement.innerText;
      let username = usernameElement.innerText;
      let date = dateElement.getAttribute('datetime');

      tweets.push(`${username} - ${date} - ${tweet}`);
    } else {
      console.warn('Incomplete tweet data found:', { tweetElement, usernameElement, dateElement });
    }
  });

  return tweets;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape") {
    let tweets = scrapeTweets();
    console.log('Scraped Tweets:', tweets);
    sendResponse({tweets: tweets});
  }
});