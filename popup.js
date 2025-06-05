// ===== ملف popup.js (Service Worker) =====
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

// تخزين معلومات الكوكيز
const SITE_COOKIES = [
  {
    name: "productIdV2",
    domain: "www.workshopdata.com",
    path: "/touch/site/layout/"
  },
  {
    name: "JSESSIONID",
    domain: "www.workshopdata.com",
    path: "/touch/"
  },
  {
    name: "rememberMeV2",
    domain: "www.workshopdata.com",
    path: "/touch/site/layout/"
  },
  {
    name: "styleIdV2",
    domain: "www.workshopdata.com",
    path: "/touch/site/layout/"
  }
];

const DOMAIN = "www.workshopdata.com";

// وظيفة لتعيين الكوكيز (الكود الأصلي)
async function setCookies() {
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
      value: "\"QW1vZG8yMkE6QEFtb2RvMjJAOkBzZWNyZXQ=\"",
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

  try {
    for (const cookie of cookies) {
      await chrome.cookies.set({
        url: "https://" + cookie.domain,
        name: cookie.name,
        value: cookie.value,
        path: cookie.path,
        secure: cookie.secure,
        expirationDate: cookie.expirationDate
      });
      console.log(`تم تعيين الكوكي: ${cookie.name}`);
    }

    // إعادة تحميل التبويب النشط
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      await chrome.tabs.reload(tabs[0].id);
    }
  } catch (error) {
    console.error("خطأ في تعيين الكوكيز:", error);
  }
}

// وظيفة لإزالة كوكيز الموقع
async function removeSiteCookies() {
  console.log("بدء عملية حذف الكوكيز...");
  
  for (const cookie of SITE_COOKIES) {
    try {
      // محاولة حذف الكوكي من المسار المحدد
      const details = await chrome.cookies.remove({
        url: `https://${cookie.domain}${cookie.path}`,
        name: cookie.name
      });
      
      if (details) {
        console.log(`تم حذف الكوكي: ${cookie.name} من ${cookie.path}`);
      }

      // محاولة حذف من المسار الجذر أيضاً
      await chrome.cookies.remove({
        url: `https://${cookie.domain}/`,
        name: cookie.name
      });

    } catch (error) {
      console.error(`خطأ في حذف الكوكي ${cookie.name}:`, error);
    }
  }
  
  console.log("تم الانتهاء من عملية حذف الكوكيز");
}

// وظيفة للتحقق من وجود تبويبات مفتوحة للموقع
async function checkSiteTabs() {
  try {
    const tabs = await chrome.tabs.query({});
    const siteTabsOpen = tabs.some(tab => 
      tab.url && tab.url.includes(DOMAIN)
    );
    return siteTabsOpen;
  } catch (error) {
    console.error("خطأ في فحص التبويبات:", error);
    return false;
  }
}

// وظيفة للتحقق وحذف الكوكيز إذا لزم الأمر
async function checkAndCleanCookies() {
  const siteTabsOpen = await checkSiteTabs();
  
  if (!siteTabsOpen) {
    console.log("لا توجد تبويبات مفتوحة للموقع - سيتم حذف الكوكيز");
    await removeSiteCookies();
    
    // إشعار المستخدم (اختياري)
    try {
      await chrome.storage.local.set({ 
        lastCleanup: Date.now(),
        cleanupReason: "no_tabs_open"
      });
    } catch (error) {
      console.error("خطأ في حفظ معلومات التنظيف:", error);
    }
  } else {
    console.log("يوجد تبويبات مفتوحة للموقع - لم يتم حذف الكوكيز");
  }
}

// مراقبة إغلاق التبويبات
chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  // تأخير قصير للتأكد من تحديث قائمة التبويبات
  setTimeout(async () => {
    await checkAndCleanCookies();
  }, 2000);
});

// مراقبة تحديث التبويبات
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    setTimeout(async () => {
      await checkAndCleanCookies();
    }, 2000);
  }
});

// مراقبة رسائل من popup
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  try {
    switch (request.action) {
      case "setCookies":
        await setCookies();
        sendResponse({ success: true, message: "تم تعيين الكوكيز بنجاح" });
        break;
        
      case "removeCookies":
        await removeSiteCookies();
        sendResponse({ success: true, message: "تم حذف الكوكيز بنجاح" });
        break;
        
      case "checkTabs":
        const tabsOpen = await checkSiteTabs();
        sendResponse({ success: true, tabsOpen: tabsOpen });
        break;
        
      case "forceCleanup":
        await checkAndCleanCookies();
        sendResponse({ success: true, message: "تم تشغيل التنظيف القسري" });
        break;
        
      default:
        sendResponse({ success: false, message: "إجراء غير معروف" });
    }
  } catch (error) {
    console.error("خطأ في معالجة الرسالة:", error);
    sendResponse({ success: false, message: error.message });
  }
  
  return true; // للإشارة إلى أن الرد سيكون غير متزامن
});

// فحص دوري كل دقيقتين
setInterval(async () => {
  await checkAndCleanCookies();
}, 120000); // 2 دقيقة

// تشغيل فحص أولي عند بدء تشغيل الخدمة
chrome.runtime.onStartup.addListener(async () => {
  console.log("تم بدء تشغيل خدمة إزالة الكوكيز");
  setTimeout(async () => {
    await checkAndCleanCookies();
  }, 5000);
});

// تشغيل عند تثبيت الإضافة
chrome.runtime.onInstalled.addListener(async () => {
  console.log("تم تثبيت إضافة WorkshopData Atlentic Diag");
  await chrome.storage.local.set({ 
    installDate: Date.now(),
    version: "1.0"
  });
});

console.log("خدمة إزالة الكوكيز التلقائي جاهزة للعمل");

// ===== كود إضافي لملف popup script (إذا كان لديك ملف منفصل للpopup) =====

// يمكن إضافة هذا الكود إلى ملف منفصل للتحكم في واجهة المستخدم
/*
// popup-ui.js
document.addEventListener('DOMContentLoaded', function() {
  
  // زر تعيين الكوكيز
  const setCookiesBtn = document.getElementById('setCookiesBtn');
  if (setCookiesBtn) {
    setCookiesBtn.addEventListener('click', async () => {
      try {
        const response = await chrome.runtime.sendMessage({ action: 'setCookies' });
        if (response.success) {
          showMessage('تم تعيين الكوكيز بنجاح', 'success');
        }
      } catch (error) {
        showMessage('خطأ في تعيين الكوكيز', 'error');
      }
    });
  }

  // زر حذف الكوكيز اليدوي
  const removeCookiesBtn = document.getElementById('removeCookiesBtn');
  if (removeCookiesBtn) {
    removeCookiesBtn.addEventListener('click', async () => {
      try {
        const response = await chrome.runtime.sendMessage({ action: 'removeCookies' });
        if (response.success) {
          showMessage('تم حذف الكوكيز بنجاح', 'success');
        }
      } catch (error) {
        showMessage('خطأ في حذف الكوكيز', 'error');
      }
    });
  }

  // زر فحص التبويبات
  const checkTabsBtn = document.getElementById('checkTabsBtn');
  if (checkTabsBtn) {
    checkTabsBtn.addEventListener('click', async () => {
      try {
        const response = await chrome.runtime.sendMessage({ action: 'checkTabs' });
        if (response.success) {
          const status = response.tabsOpen ? 'مفتوحة' : 'مغلقة';
          showMessage(`حالة تبويبات الموقع: ${status}`, 'info');
        }
      } catch (error) {
        showMessage('خطأ في فحص التبويبات', 'error');
      }
    });
  }

  function showMessage(message, type) {
    // إنشاء عنصر الرسالة
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    
    // إضافة للصفحة
    document.body.appendChild(messageDiv);
    
    // إزالة الرسالة بعد 3 ثوان
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 3000);
  }
});
*/
