document.getElementById("setCookiesBtn").addEventListener("click", () => {
  const cookies = [
    {
      name: "productIdV2",
      value: "198",
      domain: "www.workshopdata.com",
      path: "/touch/site/layout/",
      secure: true,
      expirationDate: 1749943131
    },
    {
      name: "JSESSIONID",
      value: "app_2_30_touch~23AA72D3CC6B966375401BBFC244684E",
      domain: "www.workshopdata.com",
      path: "/touch/",
      secure: true
    },
    {
      name: "rememberMeV2",
      value: "\"QW1vZG8yMkA6QEFtb2RvMjJAOkBzZWNyZXQ=\"",
      domain: "www.workshopdata.com",
      path: "/touch/site/layout/",
      secure: true,
      expirationDate: 99999999999
    },
    {
      name: "styleIdV2",
      value: "logicat",
      domain: "www.workshopdata.com",
      path: "/touch/site/layout/",
      secure: true,
      expirationDate: 99999999999
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
          console.error("Failed to set cookie:", chrome.runtime.lastError);
        } else {
          console.log("Cookie set:", result);
        }
      });
    }

    chrome.tabs.reload(tab.id);
  });
});
