document.getElementById("setCookiesBtn").addEventListener("click", () => {
  const cookies = [
    {
      name: "productIdV2",
      value: "151",
      domain: "www.workshopdata.com",
      path: "/touch/site/layout/",
      secure: true,
      expirationDate: 1753800484
    },
    {
      name: "JSESSIONID",
      value: "app_0_30_touch~16B7FE71C8F18C5F49E8CF67A3A62E54",
      domain: "www.workshopdata.com",
      path: "/touch/",
      secure: true,
       expirationDate: 1753800484
    },
    {
      name: "rememberMeV2",
      value: "QW1waWUwMkA6QGFtcGllMjAxOEA6QHNlY3JldA==",
      domain: "www.workshopdata.com",
      path: "/touch/site/layout/",
      secure: true,
      expirationDate: 1753800483
    },
    {
      name: "styleIdV2",
      value: "miwa",
      domain: "www.workshopdata.com",
      path: "/touch/site/layout/",
      secure: true,
      expirationDate: 1753800484
    }
  ];

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    for (const cookie of cookies) {
      chrome.cookies.set({
        url: "https://" + cookie.domain,
        name: cookie.name,
        value: cookie.value,
        path: cookie.path,
        secure: cookie.secure,
        expirationDate: cookie.expirationDate
      }, (result) => {
        if (chrome.runtime.lastError) {
          console.error("❌ فشل ضبط الكوكي:", chrome.runtime.lastError);
        } else {
          console.log("✅ كوكي تم ضبطه:", result);
        }
      });
    }

    chrome.tabs.reload(tab.id); // إعادة تحميل التبويب بعد ضبط الكوكيز
  });
});
