var cookiesObj;
var projectDisplay=true;
var msgOnLoad=true;
var tabId;
var mess="";
var sample="welcome";

chrome.browserAction.onClicked.addListener(function(tab){
  chrome.tabs.query({active:true,currentWindow:true},function(tabs){
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id , {"message":"activeTooltip"});
  });
});
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    if( request.message == true ) {
      chrome.tabs.query({active:true,currentWindow:true},function(tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id , {"message":"deactivateApp"});
      });    
    }else if(request.message == false){
      chrome.tabs.query({active:true,currentWindow:true},function(tabs){
        var activeTab = tabs[0];
        tabId=tabs[0].id;
        chrome.tabs.sendMessage(activeTab.id , {"message":true});
      });
    }
    
    else if (request.message=="getCookie")
    {
      var unique={};
      var cook;
      var zd_tt_agentTicket;
      var zz_tt_csrf;
      chrome.cookies.get({ url: 'https://*.zoho.com', name: 'IAMAGENTTICKET' },
            function (cookie) {
                if (cookie) {
                    cook=true;
                    zd_tt_agentTicket=cookie.value;
                }
                else {
                    cook=false;
                    zd_tt_agentTicket="noCookie";
                }
                chrome.cookies.get({ url: 'https://desk.zoho.com', name: 'crmcsr' },
                    function(cookie){
                      if(cookie){
                        zz_tt_csrf=cookie.value;
                      }
                      else{
                        zz_tt_csrf="noCookie";
                      }
                      unique.csrf=zz_tt_csrf;
                      unique.agent=zd_tt_agentTicket;
                      console.log(unique);
                      chrome.tabs.query({active:true,currentWindow:true},function(tabs){
                              var activeTab = tabs[0];
                              tabId=tabs[0].id;
                              chrome.tabs.sendMessage(activeTab.id , {"message":"cookieGet","cookieValue":JSON.stringify(unique)});
                        });
                    }
                );
        });
                  
    }
    else if(request.message === "editor")
    {
      chrome.tabs.query({active:true,currentWindow:true},function(tabs){
        
        chrome.tabs.executeScript(null, {file: "editor.js"});
      });  
    }
    else if(request.message==="previewMode")
    {
      chrome.tabs.query({active:true,currentWindow:true},function(tabs){
        chrome.tabs.executeScript(null, {file: "preview.js"});
      });
    }
    else if(request.message === "userView"){
      chrome.tabs.query({active:true,currentWindow:true},function(tabs){
        chrome.tabs.executeScript(null, {file: "userView.js"});
      });  
    }
    else if(request.message === "AsapListener"){
      chrome.tabs.query({active:true,currentWindow:true},function(tabs){
        chrome.tabs.executeScript(null, {file: "PageLoad.js"});
      });  
    }
  }
)