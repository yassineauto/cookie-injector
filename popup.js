document.getElementById("setCookiesBtn").addEventListener("click", () => {
  const cookies = [
    {
      name: "productIdV2",
      value: "198",
      domain: "www.workshopdata.com",
      path: "/touch/site/layout/",
      secure: true,
      expirationDate: 99999999999
    },
    {
      name: "JSESSIONID",
      value: "app_1_130_touch~70DED0FBD8B41B330DF1F87E542E8C25",
      domain: "www.workshopdata.com",
      path: "/touch/",
      secure: true
    },
    {
      name: "rememberMeV2",
      value: "SU5URVJGQ0U4OEA6QElOVEVSRkNFODhAOkBzZWNyZXQ="",
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
