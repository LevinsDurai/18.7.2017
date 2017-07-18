var Task=false;
var active=false;
var EditorListener=true;
var mouseOverDone=true;
var CloseIconMouseOverAction;
var ElementListener;
var parent;
var prvsElems;
var Zohodesk_Chrome_Extension_ConfigureElement=null;
var organitationID;
var AsapId;
var AsapName;
var ExtensionProjectId;
var windowLocationHref;
var PortalName;
var DepartmentName;
var AsapCSS="";
var Chrome_Extension_Save_Or_Edit_Option="Chrome_Extension_Save_ToolTip";
var Chrome_Extension_ToolTip_Delete_Or_Cancel="ToolTip Cancel";
var zd_tt_csrf;
var listOfTriggersObj=[];
var zd_tt_triggerListing ="ALL";
var zd_tt_focusedElementInd=undefined;

var commomDomainNameForAPI="desk.zoho.com";


function findHighestZIndex(elem) {
    var elems = document.getElementsByTagName(elem);
    testing = elems;
    var highest = 0;
    for (var i = 0; i < elems.length; i++) {
        var zindex = document.defaultView.getComputedStyle(elems[i]).getPropertyValue("z-index");
        if ((parseInt(zindex) > highest) && (zindex != 'auto')) {
            highest = parseInt(zindex);
        }
    }
    return highest;
}

function attachListeners()
{
        document.addEventListener('mousedown', onMouseDown, true);
        document.addEventListener('click', onMouseClick, true);
        document.addEventListener('mouseup', onMouseUp, true);
        document.addEventListener('dblclick',dblclick,true);
}
function dblclick(e)
{
	document.removeEventListener('click',onMouseClick,true);
	e.target.click();
	document.addEventListener('click', onMouseClick, true);
	document.addEventListener('mouseover',selectElement,true);
	Zohodesk_Chrome_Extension_ConfigureElement=null;
	// document.addEventListener('mousedown',Editor,true);
}
function onMouseDown(e)
{
	ElementListener=findInnerElements("editorBody",e.target);
	TooltipListener=findInnerElements("Chrome_Extension_showContentId",e.target);
	var insertOption = findInnerElements('ze_link',e.target);
	var inserplurOption = findInnerElements('KB_Editor_Overlay',e.target);
	if (ElementListener != true && TooltipListener != true && insertOption!=true && inserplurOption!=true)
	{
		Editor(e);
		e.preventDefault();
	    e.stopPropagation();
	}
}
function onMouseClick(e)
{
	ElementListener=findInnerElements("editorBody",e.target);
	TooltipListener=findInnerElements("Chrome_Extension_showContentId",e.target);
	var insertOption = findInnerElements('ze_link',e.target);
	var inserplurOption = findInnerElements('KB_Editor_Overlay',e.target);
	if (ElementListener != true && TooltipListener != true && insertOption!=true && inserplurOption!=true)
	{
		e.preventDefault();
    	e.stopPropagation();
    }
}
function onMouseUp(e)
{
	ElementListener=findInnerElements("editorBody",e.target);
	var insertOption = findInnerElements('ze_link',e.target);
	var inserplurOption = findInnerElements('KB_Editor_Overlay',e.target);
	if (ElementListener != true && insertOption!=true && inserplurOption!=true)
	{
		e.preventDefault();
	    e.stopPropagation();
	}
}
function detachClickListener()
{
	document.removeEventListener('click',onMouseClick,true);
	document.removeEventListener('mouseup', onMouseUp, true);
	document.removeEventListener('click', detachClickListener, true);
	document.removeEventListener('mousedown', onMouseDown, true);
	document.removeEventListener('dblclick',dblclick,true);
}

chrome.runtime.onMessage.addListener(function(request,sender,sendResponse)
{
		if (request.message=="activeTooltip")
		{
			requestAPI("https://desk.zoho.com/support/PortalList.do").post().then((res)=>console.log(res));
			window.postMessage({name:"UrlCheck"},"*");
			/*window.postMessage({name:"UrlCheck"},"*");
			chrome.runtime.sendMessage({"message":"editor"});
			document.addEventListener('mouseover',selectElement,true);
			chrome.runtime.sendMessage({"message":"previewMode"});
			attachListeners();*/
		}
		else if(request.message==true)
		{
			window.postMessage({name:"UrlCheck"},"*");
			chrome.runtime.sendMessage({"message":"editor"});
			document.addEventListener('mouseover',selectElement,true);
			chrome.runtime.sendMessage({"message":"previewMode"});
			attachListeners();
		}
		else if(request.message==false)
		{
			active=true;
			signin();
		}
		else if(request.message=="cookieGet")
		{
			var cookieRes=JSON.parse(request.cookieValue);
			if (cookieRes.csrf != "noCookie" && cookieRes.agent != "noCookie")
			{
				zd_tt_csrf=cookieRes.csrf;
				portalAPI(cookieRes.agent);
			}
			else
			{
				createToolTipErrorPopupBox({buttons:[{id:"zd_tt_ok",content:"ok"},{id:"zd_tt_cancel",content:"cancel"}],content:"<b>You are not signin your zohoDesk account...</b><br> please signin your desk account , and try some time later..."});
			}
		}
		else if (request.message==="active")
		{
			chrome.runtime.sendMessage({"message":active});
		}
		else if (request.message==="deactivateApp")
		{
			action=false;
		}
})
function AllFunction()
{
	document.addEventListener('mousedown',DeriveFunction,true);
}
function DeriveFunction(e)
{
	if (e.target.id=="tool_tip" || e.target.id=="toolTip_id" || e.target.id=="toolTipClickAction" || e.target.id=="toolTipClickActionChild" || e.target.id=="toolTipClickActionMainChild")
	{

		var zohodeskInitJs = document.createElement("script");
		zohodeskInitJs.type = "text/javascript";
		zohodeskInitJs.src = "https://localjs.zohostatic.com/support/05_02_2017_11937/js/ZohoDeskEditor_Tooltip_Init.js";
		zohodeskInitJs.className="desk_support_chromeAddons";
		document.getElementsByTagName("head")[0].appendChild(zohodeskInitJs);

		var Kernelscript = document.createElement("script");
		Kernelscript.type = "text/javascript";
		Kernelscript.src = "https://localjs.zohostatic.com/support/zde_v1/ZohoDeskEditorKernal.min.js";
		Kernelscript.className="desk_support_chromeAddons";
		document.getElementsByTagName("head")[0].appendChild(Kernelscript);

		var zohoDeskEditterCreater = document.createElement("script");
		zohoDeskEditterCreater.type = "text/javascript";
		zohoDeskEditterCreater.defer = true;
		zohoDeskEditterCreater.src = "https://localjs.zohostatic.com/support/05_04_2017_1052/js/ZohoDeskEditor_Tooltip_Edit.js";
		zohoDeskEditterCreater.className="desk_support_chromeAddons";
		document.getElementsByTagName("head")[0].appendChild(zohoDeskEditterCreater);


		clear("toolTipClickAction","parent");
		Task=true;
		attachListeners(e);
		document.addEventListener('mouseover',selectElement,true);
		getConfigureElements();
	}
}
function selectElement(e)
{
	if(e.target.localName != "use"){
		ElementListener=findInnerElements("editorBody",e.target);
		TooltipListener=findInnerElements("Chrome_Extension_showContentId",e.target);
		var insertOption = findInnerElements('ze_link',e.target);
		var inserplurOption = findInnerElements('KB_Editor_Overlay',e.target);
		if (ElementListener != true && TooltipListener !=true && insertOption!=true && inserplurOption!=true)
		{
			if (prvsElems!=undefined && prvsElems!=null)
			{
				prvsClass=(prvsElems.getAttribute("class")).replace(" zohodesk-Tooltip-currentShad","");
				prvsElems.className=prvsClass;
			}
			prvsElems=document.querySelector(fullPath(e.target));
			if(prvsElems){
				prvsElems.className+=" zohodesk-Tooltip-currentShad";
			}
		}
	}
}
function Editor(e)
{	
	if (mouseOverDone==true)
	{
		EditorListener=false;
		// Chrome_Extension_ToolTip_Delete_Or_Cancel="ToolTip Cancel";
		// Chrome_Extension_Save_Or_Edit_Option="Chrome_Extension_Save_ToolTip";
		Zohodesk_Chrome_Extension_ConfigureElement=prvsElems;
		document.removeEventListener('mouseover',selectElement,true);
		Task=false;
	}
}

function clear(e,action)
{
	if (action=="parent")
	{
		parent=document.getElementById(e).parentElement;
		parent.parentElement.removeChild(parent);
	}
	else if(action=="current")
	{
		parent=document.getElementById(e).parentElement;
		parent.removeChild(document.getElementById(e));
	}
}
function fullPath(selectedElement) {
    var isIDExist = false;
    var elementPath = [];
    var childs;
    if (selectedElement.id != "") {
        elementPath.unshift("[id='" + selectedElement.id + "']")
        return elementPath[0]
    }

    while (!isIDExist) {
        childs = selectedElement.parentElement.children
        for (var c = 0; childs[c] != selectedElement; c++);
        elementPath.unshift(selectedElement.tagName + ":nth-child(" + (c + 1) + ")")
        selectedElement = selectedElement.parentElement
        if (selectedElement.id !== "") {
            elementPath.unshift("[id='" + selectedElement.id + "']")
            isIDExist = true
        } else if (selectedElement.tagName == "HTML") {
            elementPath.unshift("HTML")
            isIDExist = true
        }
    }
    return elementPath.join(" > ")
}
function findInnerElements(parentEleId,checkEle){
	try{
		var innerElement = false
		var parentEle = document.getElementById(parentEleId);
		var parentEleChild = parentEle.getElementsByTagName("*")
		var parentEleChildLen = parentEleChild.length
		for(i=0;i<parentEleChildLen;i++){
			if(checkEle==parentEleChild[i]){
				innerElement=true
				break
			}
		}
		return innerElement
	}catch(err){
		//console.log(err);
	}	
}
function zd_tt_removeMouseOverElements(){
	var elems=document.getElementsByClassName("zohodesk-Tooltip-currentShad");
	if(elems.length != 0){
		for(var i=0 ; i<elems.length ; i++){
			elems[i].className=elems[i].className.split("zohodesk-Tooltip-currentShad").join('');
		}
		prvsElems = undefined ;
	}
}

function Chrome_Extension_ExecuteEditor()
{
	window.postMessage({name:"Department"},"*")
	chrome.runtime.sendMessage({"message":"editor"});
	chrome.runtime.sendMessage({"message":"previewMode"});
	// document.addEventListener('mouseover',selectElement,true);
	// attachListeners();
}

function Chrome_Extension_AddExtension(AsapId,organitationID,AsapName,domainName)
{
	requestAPI(" https://"+commomDomainNameForAPI+"/api/web/extensions?isEnabled=true&orgId="+organitationID+"&extensionName="+encodeURIComponent(AsapName)+"&domain="+encodeURIComponent(domainName)+"&asapId="+AsapId).post().then((res)=>{
		if(res.data != "you_dontHave_A_permission"){
			ExtensionProjectId=res.id;
			Chrome_Extension_ExecuteEditor();
		}
		else{
			createToolTipErrorPopupBox({buttons:[{id:"zd_tt_ok",content:"ok"},{id:"zd_tt_cancel",content:"cancel"}],content:"<b>You dont have a admin permission for this portal...</b> sorry Permission is denited..."});
			document.getElementsByClassName("zohodesk-Tooltip-error-message")[0].style.position="fixed";
			document.getElementsByClassName("zohodesk-Tooltip-layer")[0].style.position="fixed";
		}
	})
}


function Chrome_Extension_GetExtension(AsapId,organitationID)
{
	var domainName=window.location.hostname;
	requestAPI(" https://"+commomDomainNameForAPI+"/api/web/extensions?orgId="+organitationID+"&domain="+encodeURIComponent(domainName)+"&asapId="+AsapId).get().then((res)=>{
		if (res[0] != undefined)
		{
			console.log("Created",res);
			ExtensionProjectId=res[0].id;
			Chrome_Extension_ExecuteEditor();
		}
		else
		{
			console.log("willCreate",res);
			Chrome_Extension_AddExtension(AsapId,organitationID,AsapName,domainName);
		}
	})
}

function portalAPI(IAMAGENTTICKET)
{
	requestAPI(" https://support.zoho.com/api/v1/reports/organizations?ticket="+IAMAGENTTICKET).get().then((res)=>{
		var portals=res.data;
		var i;
		console.log(res);
		if(typeof(res.data)=="object"){
			for(i in portals){
				if(JSON.stringify(portals[i].id)==JSON.stringify(organitationID)){
					if(portals[i].isAdmin){
						Chrome_Extension_GetExtension(AsapId,organitationID);
						PortalName=portals[i].organizationName;
						return;
					}
					else
					{
						createToolTipErrorPopupBox({buttons:[{id:"zd_tt_ok",content:"ok"},{id:"zd_tt_cancel",content:"cancel"}],content:"<b>You are not a Admin...</b> sorry Permission is denited..."});
						return;
					}
				}
			}
			createToolTipErrorPopupBox({buttons:[{id:"zd_tt_ok",content:"ok"},{id:"zd_tt_cancel",content:"cancel"}],content:"<b>You are not in the portal ...</b> sorry Permission is denited..."});
			return;
		}
		else if(typeof(res.data)=="string"){
			createToolTipErrorPopupBox({buttons:[{id:"zd_tt_ok",content:"ok"},{id:"zd_tt_cancel",content:"cancel"}],content:"<b>Please Sign in desk.zoho.com ... </b> sorry Permission is denited..."});
		}
	})
}

window.addEventListener("message", function(event) {
    if (event.data.name == "department") {
        DepartmentName = event.data.value;
    }
    if(event.data.name=="ready_anchorList"){
    	var tempAnc=document.getElementById("Chrome_Extension_AnChorTag").getAttribute('ancId');
    	for(var f = 0 ; f<AnchorTagsList.length ; f++){
    		if(AnchorTagsList[f].id==tempAnc){
    			document.getElementById("Chrome_Extension_AnChorTag").innerText=AnchorTagsList[f].text;
    		}
    	}
    }
    if (event.data.name == "article") {
        if (document.getElementById("searchArticleBox").value == "") {
            hide("searchDisplay");
        } else {
            ArticlesObject = event.data.value;
            var parentDiv = document.createElement("div");
            parentDiv.className = "zohodesk-Tooltip-dropdown-content";
            parentDiv.id = "zohodesk_Tooltip_dropdown_articles_parent_id1";
            var container = document.createElement("ul");
            container.className = "zohodesk-Tooltip-list";
            if (ArticlesObject != undefined) {
                for (i = 0; i < ArticlesObject.length; i++) {
                    var child = document.createElement("li");
                    child.className = "zohodesk-Tooltip-dropdown-options";
                    child.id = ArticlesObject[i].id;
                    child.appendChild(document.createTextNode(ArticlesObject[i].title));
                    container.appendChild(child);
                }
                parentDiv.appendChild(container);
                var element = document.getElementById("searchDisplay").getElementsByTagName('div')[1];
                if (element != undefined) {
                    element.parentElement.removeChild(element);
                }
                document.getElementById("searchDisplay").appendChild(parentDiv);
                show("searchDisplay");

                document.getElementById("zohodesk_Tooltip_dropdown_articles_parent_id1").onclick = function(e) {
                    Chrome_Extension_Get_Select_Article(e);
                }
            }
        }
    } else if (event.data.type === "toolTip_orgId") {
        organitationID = event.data.orgId;
        AsapId = event.data.AsapId;
        AsapName = event.data.AsapName;
        chrome.runtime.sendMessage({
            "message": "getCookie"
        });
    } else if (event.data.type == "Asap_Not_Found") {
        createToolTipErrorPopupBox({
            buttons: [{
                id: "zd_tt_ok",
                content: "ok"
            }, {
                id: "zd_tt_cancel",
                content: "cancel"
            }],
            content: "<b>ASAP is not found ...</b><br>Please enable the ASAP and start the configuration ..."
        });
    }
    if (event.data.name == "SingleArticleObject") {
        var element;
        console.log(event.data.value);
        SingleArticleId = event.data.value.id;
        var tempVar = head(event.data.value.answer);
        if (tempVar.length != 0) {
            AnchorTagsList = tempVar;
            document.getElementById('Chrome_Extension_AnchorTagTotalParent').style.cursor = "default";
            document.getElementById("Chrome_Extension_AnChorTag").style.cursor = "pointer";
        } else {
            document.getElementById('Chrome_Extension_AnchorTagTotalParent').style.cursor = "default";
            element = document.getElementById("Chrome_Extension_AnChorTag");
            element.style.cursor = "default";
            element.innerText = "no AnchorTags";

        }
        window.postMessage({name:"ready_anchorList",value:"All"},"*");
    }

})

/*requestAPI("http://muhammed-zt133.tsi.zohocorpin.com:8936/api/web/asap/1000000008961?orgId=4628348&domain=hhskha.com").get().then((res)=>{
console.log(res);
})*/



function zd_tt_triggerUpdateObjFinder(elem){
	var focusedTriggerObj;
	// console.log(elem);
	elem=elem.target.parentNode.parentNode;
	if(elem.localName=="div"){
        elem=elem.parentNode;
    }
    for(var i=0 ; i<listOfTriggersObj.length ; i++){
    	if(elem.id==listOfTriggersObj[i].id){
    		focusedTriggerObj = listOfTriggersObj[i];
    		zd_tt_focusedElementInd = i;
    	}
    }
    
    if(focusedTriggerObj!=undefined){
    	zd_tt_triggerUpdate(focusedTriggerObj);
    	ConfigureObjectForEdit = focusedTriggerObj;
    }
}

function zd_tt_triggerUpdate(obj){
	// obj=JSON.parse(obj);
	var li = document.getElementsByClassName('zohodesk-Tooltip-toggleTap-li')[1];
	zd_tt_triggerMouseEvent(li,"mousedown");
	requestAPI("https://support.zoho.com/portal/api/kbArticles/"+obj.components["0"].solutionId+"?orgId="+organitationID).get().then((res)=>{
		document.getElementById("searchArticleBox").value=res.title;
		window.postMessage({name: "SingleArticle",article: obj.components["0"].solutionId}, "*");

	});
	li.firstElementChild.innerText=obj.name;
	document.getElementById('zd_tt_triggerName').value=obj.name;
	if(obj.triggers["0"].event=="HOVER"){
		zd_tt_showTrigger(document.getElementById("zohodesk_tooltip_trigger_options_onHover"));
	}
	if(obj.triggers["0"].event=="CLICK"){
		zd_tt_showTrigger(document.getElementById("zohodesk_tooltip_trigger_options_onClick"));
	}
	if(typeof(obj.preferences)!="object"){
		obj.preferences=JSON.parse(obj.preferences);
	}
	setTimeout(function(){document.getElementById('editerToolsContainer').lastElementChild.contentDocument.body.style.backgroundColor = obj.preferences.bgColor;
		document.getElementById('editerToolsContainer').lastElementChild.contentDocument.body.innerHTML=obj.components["0"].content;
		editer_InnerTextContent=obj.components["0"].content;
	}, 1000);
	if(obj.preferences.viewSize=="LARGE"){
		zd_tt_triggerSizeOptionSelector(document.getElementById("zohodesk-Tooltip-large"));
	}
	if(obj.preferences.viewSize=="MEDIUM"){
		zd_tt_triggerSizeOptionSelector(document.getElementById("zohodesk-Tooltip-medium"));
	}
	if(obj.preferences.viewSize=="SMALL"){
		zd_tt_triggerSizeOptionSelector(document.getElementById("zohodesk-Tooltip-small"));
	}
	if(obj.preferences.selector!=undefined){
		document.getElementById("Chrome_Extension_AnChorTag").setAttribute('ancId',obj.preferences.selector);
	}
	document.getElementById('TooltipSave').innerText="UPDATE";
	document.getElementById('TooltipCancel').innerText="DELETE";
	// document.getElementById('TooltipCancel').id="zd_tt_updateDelete";
	// document.getElementById('zd_tt_updateDelete').innerText="DELETE";
	document.removeEventListener('mouseover',selectElement,true);
    detachClickListener();
    zd_tt_removeMouseOverElements();
	Chrome_Extension_Save_Or_Edit_Option = "Chrome_Extension_Update_ToolTip";
	Chrome_Extension_ToolTip_Delete_Or_Cancel = "ToolTip Delete"
}

// function zd_tt_updateEvents(){this.elem=undefined};
// zd_tt_updateEvents.prototype.binder = function() {
// 	this.elem=document.getElementById('zd_tt_updateDelete');
// 	this.elem.addEventListener('click',this.delete);
// };
// zd_tt_updateEvents.prototype.deleter = function(e){

// }
// zd_tt_updateEvents.prototype.removeEvent = function(){
// 	this.elem.removeEventListener('click',this.delete);
// }

function zd_tt_triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

function zd_tt_triggerListInitiater(obj){
	if(obj.length!=0){
		var triggerLists = ZohoDesk_tooltip_triggerList_creator(obj);
		var div = document.createElement('div');
		div.className = "zohodesk-Tooltip-panel-content zohodesk-Tooltip-trigger-content";
		div.id = "zd_tt_listParent";
		div.appendChild(triggerLists);
		var loading = document.getElementById('zdtt_loadingContainer');
		if(loading != undefined){
			loading.parentElement.removeChild(loading);
		}
		document.getElementById("ZDTT_switching_comonElem").appendChild(div);
	}
	else{
		var noTriggers = `<div class="loading-area empty-trigger-content">
											<svg class="emptytrigger">
												<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#emptytrigger"></use>
											</svg>
											<div class="empty-message">No Triggers Has Been Added Yet</div>
											<div class="zohodesk-Tooltip-txtcntr" id="zd_tt_empty_buttonParent">
											</div>
										</div>`;
		var loading = document.getElementById('zdtt_loadingContainer');
		if(loading != undefined){
			loading.parentElement.removeChild(loading);
		}
	    document.getElementById("ZDTT_switching_comonElem").innerHTML=noTriggers;
		var aNB=document.createElement("button");
		aNB.className="zohodesk-Tooltip-form-button";
		aNB.innerText="+ Add New";
		aNB.addEventListener("click",function(e){zd_tt_triggerMouseEvent(document.getElementsByClassName('zohodesk-Tooltip-toggleTap-li')[1],"mousedown")});
		document.getElementById("zd_tt_empty_buttonParent").appendChild(aNB);
	}
}


function zd_tt_triggerListFilter(e) {
	e.stopPropagation();
	e.preventDefault();
	var oldListContainer = document.getElementById('zd_tt_listParent');
	if(oldListContainer != undefined){
		oldListContainer.parentElement.removeChild(oldListContainer);
	}
	var div = document.createElement('div');
	div.className = "loading-area";
	div.id="zdtt_loadingContainer";
	var secoundChild = `
                  <div class="loading-content">
                      <div class="loading-item"></div>
                  </div>
                  <div>loading...</div>`;
    div.innerHTML=secoundChild;
	var parent = document.getElementById('ZDTT_switching_comonElem');
	parent.appendChild(div);
    if (e.target.id == "zd_tt_TriggerAll") {
    	if(zd_tt_triggerListing!="ALL"){
	        requestAPI("https://" + commomDomainNameForAPI + "/api/web/extensions/" + ExtensionProjectId + "/messages?isEnabled=true&orgId=" + orgId).get().then((res) => {
	            ConfigureObjects = res;
	            listOfTriggersObj = res;
	            if (res.length != 0) {
	                zd_tt_triggerListInitiater(res);
	            } else {
	                zd_tt_triggerListInitiater([]);
	            }
	            zd_tt_triggerListing="ALL";
	            document.getElementById('zdtt_spanDropDown').innerHTML="All";
	            Chrome_Extension_RequireFunctionFlow(res);
	        })
    	}
    } else if ( e.target.id == "zd_tt_CreatedByMe" ) {
    	if(zd_tt_triggerListing!="CREATED_BY_ME"){
	    	requestAPI("https://" + commomDomainNameForAPI + "/api/web/extensions/" + ExtensionProjectId + "/messages?createdByMe=true&isEnabled=true&orgId=" + orgId).get().then((res) => {
	            ConfigureObjects = res;
	            listOfTriggersObj = res;
	            if (res.length != 0) {
	                zd_tt_triggerListInitiater(res);
	            } else {
	                zd_tt_triggerListInitiater([]);
	            }
	            zd_tt_triggerListing="CREATED_BY_ME";
	            document.getElementById('zdtt_spanDropDown').innerHTML="Created By Me";
	            Chrome_Extension_RequireFunctionFlow(res);
	        })
    	}
    }
}