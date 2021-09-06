// background.js

chrome.runtime.onInstalled.addListener(() => {
    console.log('installed');
});


chrome.webNavigation.onCompleted.addListener(function() {
    chrome.notifications.create(
        "name-for-notification",
        {
          type: "basic",
          iconUrl: "/images/get_started16.png",
          title: "This is a notification",
          message: "hello there!",
        },
        function () {}
      );
}, {url: [{urlMatches : 'https://www.google.com/'}]});