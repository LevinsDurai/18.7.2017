var ConfigureObjects;
var ConfigureObjectForEdit;
var StaticArticleId;
var Chrome_Extension_CommonMousePointElement;

function TempMouseOver(e)
{
	Chrome_Extension_CommonMousePointElement=e.target;
}


function insertAsapListener()
{
	var functionListener=`
	window.addEventListener("message", function(event) {
		if (event.data.name=="Zohodesk_Chrome_Extension_AsapCheck")
		{
		  	if (typeof(ZohoHCAsap)!="undefined")
		  	{
		  		function zAsapObjGetter(){ 
		  			var orgId=ZohoHCAsap._defaultoptions.myAppPortalId;
		  			var AsapId=ZohoHCAsap._defaultoptions.id;
		  			var AsapName=ZohoHCAsap._defaultoptions.name;
		  			window.postMessage({name:"Zohodesk_Chrome_Extension_AsapDetails",orgId:orgId,AsapId:AsapId,AsapName:AsapName},"*")
		  		};
		  		zAsapObjGetter() ;
		  	}
		}
	}, false);`


	var script=document.createElement("script");
	script.type="text/javascript";
	script.appendChild(document.createTextNode(functionListener));
	document.head.appendChild(script);
}
insertAsapListener();

function getCurrentDomainContents()
{
	// console.log("msg function called");
	var AsapId;
	var orgId;
	setTimeout(function(){window.postMessage({name:"Zohodesk_Chrome_Extension_AsapCheck"},"*")},2000);
}

function configuredElementsHighlighter(obj){
	for(i in obj){
		var currentObj = obj[i];
		var ele =document.querySelector(currentObj.triggers["0"].element);
		if(ele.className.indexOf(" zohodesk-Tooltip-ConfigureBg")==-1){
			ele.className+=" zohodesk-Tooltip-ConfigureBg";
		}
	}
}

window.addEventListener("message",function(event)
	{
		if (event.data.name=="Zohodesk_Chrome_Extension_AsapDetails")
		{
			console.log("msg event called");
			AsapId=event.data.AsapId;
			orgId=event.data.orgId;
			console.log("Listen ok",event);
			var currentDomainName=window.location.hostname;
			requestAPI("https://"+commomDomainNameForAPI+"/api/web/extensions/"+ExtensionProjectId+"/messages?isEnabled=true&orgId="+orgId).get().then((res)=>{
					// console.log("Get Msg",res);
					listOfTriggersObj=res;
					if(res.length != 0){
						zd_tt_triggerListInitiater(res);
					}
					else{
						zd_tt_triggerListInitiater([]);
					}
					// configuredElementsHighlighter(res);
					Chrome_Extension_RequireFunctionFlow(res);
			})
			/*requestAPI("https://"+commomDomainNameForAPI+"/api/web/extensions/"+AsapId+"/messages?orgId="+orgId+"&domain="+currentDomainName).get().then((res)=>{
				console.log("Get Extn", res);
				if (typeof(res[0])=="object")
				{
					console.log(res[0].id);
					var ExtensionId=res[0].id;
					requestAPI("https://"+commomDomainNameForAPI+"/api/web/asap/"+AsapId+"/"+ExtensionId+"?checkIsEnabledFlag=true&orgId="+orgId).get().then((res)=>{
						console.log("Get Msg",res);
						Chrome_Extension_RequireFunctionFlow(res);
					})
				}
			})*/
		}
	})


function Chrome_Extension_Edit_Option(e)
{
	var Chrome_Extension_Element_Path=fullPath(e.target);
	for (i=0;i<ConfigureObjects.length;i++)
	{
		if (Chrome_Extension_Element_Path==ConfigureObjects[i].triggers[0].element)
		{
			Chrome_Extension_ToolTip_Delete_Or_Cancel="ToolTip Delete";
			Chrome_Extension_Save_Or_Edit_Option="Chrome_Extension_Update_ToolTip";
			ConfigureObjectForEdit=ConfigureObjects[i];
			popupBackgroundColor=ConfigureObjectForEdit.preferences.bgColor;
			Size_option=ConfigureObjectForEdit.preferences.viewSize;
			Trigger_option=ConfigureObjectForEdit.triggers[0].event;
			StaticArticleId=ConfigureObjectForEdit.components.solutionId;
			SingleArticleId=ConfigureObjectForEdit.components.solutionId;
			var editer_InnerTextContent=ConfigureObjectForEdit.components.content;
			var injectTheIframeValue = document.getElementsByClassName("KB_Editor_iframe")[0];
			injectTheIframeValue.contentDocument.body.innerHTML="<div>"+editer_InnerTextContent+"</div>";
		}
	}
}



function Chrome_Extension_RequireFunctionFlow(ConfigureObjects)
{
	console.log('preview file loaded');
	var Chrome_Extension_CurrentDomainPath=window.location.pathname;
	for (i=0;i<ConfigureObjects.length;i++)
	{
		if (Chrome_Extension_CurrentDomainPath==ConfigureObjects[i].triggers[0].url)
		{
			var Element=document.querySelector(ConfigureObjects[i].triggers[0].element);
			if (Element != null)
			{
				var SplitClass=Element.className.split(" ");
				if (SplitClass[SplitClass.length-1] != "configureElementsClass")
				{
					Element.className+=" configureElementsClass";
					Element.addEventListener('dblclick',Chrome_Extension_Edit_Option,true);
					Element.addEventListener('mouseover',stopMouseOverTemporary,true);
					Element.addEventListener('mouseleave',RestartMouseOver,true);
					if (ConfigureObjects[i].triggers[0].event=="HOVER")
					{
						Element.addEventListener('mouseover',elementMouseMoveDeBounce,true);
						Element.addEventListener('mouseleave',function Chrome_Extension_hide(e){
							setTimeout(function(){document.addEventListener('mouseover', Chrome_Extension_hideTooltip, true)},1000);
						});
					}
					else if(ConfigureObjects[i].triggers[0].event=="CLICK")
					{
						Element.addEventListener('mouseover',startClickAction,true);
						Element.addEventListener('click',elementMouseOverListener,true);
						Element.addEventListener('mouseleave',stopClickAction,true);
					}
				}
			}
		}
	}
}

function getConfigureElements()
{
	ConfigureObjects=getCurrentDomainContents();
}
getConfigureElements();
function startClickAction(e)
{
	document.removeEventListener('click',onMouseClick,true);
}
function stopClickAction(e)
{
	document.addEventListener('click',onMouseClick,true);
}
function stopMouseOverTemporary(e)
{
	mouseOverDone=false;
	var SplitClassMouseOver=e.target.className.split(" ");
	if (SplitClassMouseOver[SplitClassMouseOver.length-1]=="zohodesk-Tooltip-currentShad")
	{
		prvsClass=(e.target.getAttribute("class")).replace(" zohodesk-Tooltip-currentShad","");
		e.target.className=prvsClass;
	}
}
function RestartMouseOver(e)
{
	mouseOverDone=true;
}
/*function checkElement(e)
{
	e.target.removeEventListener('mouseover',selectElement,true);
	ElementListener=findInnerElements("Chrome_Extension_showContentId",e.target);
	if (ElementListener == true)
	{
		mouseOverDone=false;
		var SplitClassMouseOver=e.target.className.split(" ");
		if (SplitClassMouseOver[SplitClassMouseOver.length-1]=="currentShad")
		{
			prvsClass=(e.target.getAttribute("class")).replace(" currentShad","");
			e.target.className=prvsClass;
		}
	}
	else
	{
		mouseOverDone=true;
	}
}*/
function removeConfigureElements()
{
	if (ConfigureObjects != null)
	{
		for (i=0;i<ConfigureObjects.length;i++)
		{
			var Element=document.querySelector(ConfigureObjects[i].triggers[0].element);
			if (Element != null)
			{
				var prvsClass=(Element.getAttribute("class")).replace(" configureElementsClass","");
				Element.className=prvsClass;
			}
		}
	}
}
var interval;
function elementMouseMoveDeBounce(e)
{   
	clearInterval(interval);
	document.addEventListener('mouseover',TempMouseOver,true);
	interval = setTimeout(elementMouseOverListener.bind(this,e),400);
}
function elementMouseOverListener(e)
{
	console.log(Chrome_Extension_CommonMousePointElement);
	document.removeEventListener('mouseover',TempMouseOver,true);
	if (e.target == Chrome_Extension_CommonMousePointElement)
	{
		var Id=fullPath(e.target);
		for (i=0;i<Chrome_Extension_Config.length;i++)
		{
			if (Chrome_Extension_Config[i].triggers[0].element==Id)
			{
				var preferncesObj=JSON.parse(Chrome_Extension_Config[i].preferences);
				var Chrome_Extension_TooltipSize;
				if (preferncesObj.ViewSize=="LARGE")
				{
					Chrome_Extension_TooltipSize="zohodesk-Tooltip-popup-large";
				}
				else if(preferncesObj.ViewSize=="MEDIUM")
				{
					Chrome_Extension_TooltipSize="zohodesk-Tooltip-popup-medium";
				}
				else if(preferncesObj.ViewSize=="SMALL")
				{
					Chrome_Extension_TooltipSize="zohodesk-Tooltip-popup-small";
				}
				Chrome_Extension_tooltipPopup(Chrome_Extension_Config[i].components.content,e,Chrome_Extension_TooltipSize,preferncesObj.bgColor,Chrome_Extension_Config[i].id);
				break;
			}
		}
	}
}
function Chrome_Extension_popupdesign()
{
	var Chrome_Extension_ttdesign=document.createElement("div");
	Chrome_Extension_ttdesign.setAttribute("id","Chrome_Extension_showContentId");
	Chrome_Extension_ttdesign.setAttribute("class","zohodesk-Tooltip-showContentClass zohodesk-Tooltip-tooltip-hide");
	document.body.appendChild(Chrome_Extension_ttdesign);
	document.getElementById("Chrome_Extension_showContentId").innerHTML=`<div style="height: 0; width: 0; position: absolute; visibility: hidden">
  		<svg xmlns="http://www.w3.org/2000/svg">
			<symbol id="Tooltip-close" viewBox="0 0 32 32">
	<path d="M16,0.4C7.4,0.4,0.4,7.4,0.4,16s7,15.6,15.6,15.6s15.6-7,15.6-15.6S24.6,0.4,16,0.4C16,0.4,16,0.4,16,0.4z M21.9,21.9
		c-0.6,0.6-1.6,0.6-2.3,0L16,18.4L12.4,22c-0.6,0.6-1.6,0.6-2.3,0s-0.6-1.6,0-2.3l3.7-3.7l-3.5-3.5c-0.6-0.6-0.6-1.6,0-2.3
		s1.6-0.6,2.3,0l3.5,3.5l3.3-3.3c0.6-0.6,1.6-0.6,2.3,0s0.6,1.6,0,2.3l-3.3,3.3l3.6,3.6C22.5,20.3,22.5,21.3,21.9,21.9L21.9,21.9z"/>
	</symbol>
  		</svg>
  	</div><div class='zohodesk-Tooltip-popup-header'><span class='zohodesk-Tooltip-close'><svg class="zohodesk-tooltip-svg-icon icon zohodesk-tooltip-cl-white" id="zohodesk_Tooltip_close_tooltip">
            <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="#Tooltip-close"></use>
          </svg></span></div><span class='zohodesk-Tooltip-tooltiparrow'></span><div class='zohodesk-Tooltip-tooltipcontText' id='Chrome_Extension_showContentContainerId'><p class='zohodesk-Tooltip-para' id='Chrome_Extension_showContentContainerSpanId'></p><div id="Chrome_Extension_ToolTip_View_More"></div></div>`
}
/*User View*/

function Chrome_Extension_tooltipPopup(Chrome_Extension_tooltipContent,Chrome_Extension_node,Chrome_Extension_size,Chrome_Extension_backgroundColor,Chrome_Extension_ArticleId){
	Chrome_Extension_popupdesign();
	var descriptionArray=Chrome_Extension_tooltipContent.split(" ");
	if (Chrome_Extension_ArticleId == "")
	{
		document.getElementById("Chrome_Extension_showContentContainerSpanId").innerHTML=Chrome_Extension_tooltipContent;
		document.getElementById("Chrome_Extension_showContentContainerSpanId").className+=" zohodesk-Tooltip-overflow";
	}
	else
	{
		var shortenedDescription=descriptionArray.slice(0,10);
		document.getElementById("Chrome_Extension_showContentContainerSpanId").innerHTML=(shortenedDescription.join(" ")+"...");
		document.getElementById("Chrome_Extension_ToolTip_View_More").innerHTML=`<div class="zohodesk-Tooltip-popup-button zohodesk-Tooltip-popup-button-small" id="Chrome_Extension_showContentContainerHrefId"><span></span>VIEW MORE</div>`;
		/*document.getElementById("Chrome_Extension_showContentContainerHrefId").onclick=function(e){
				Chrome_Extension_hideTooltip("zohodeskTooltipCloseTooltip");
			}*/
	}
	if (Chrome_Extension_ArticleId != "")
	{
		document.getElementById("Chrome_Extension_showContentContainerHrefId").children[0].id=Chrome_Extension_ArticleId;
		document.getElementById("Chrome_Extension_showContentContainerHrefId").onclick=function(e){
			var articleId=document.getElementById("Chrome_Extension_showContentContainerHrefId").children[0].id;
			window.postMessage({name:"GoAsapArticle",value:articleId},"*");
		}
	}
	document.getElementById("Chrome_Extension_showContentContainerId").className+=" "+Chrome_Extension_size;
	document.getElementById("Chrome_Extension_showContentContainerId").style.backgroundColor=Chrome_Extension_backgroundColor;
	document.getElementsByClassName("zohodesk-Tooltip-tooltiparrow")[0].style.backgroundColor=Chrome_Extension_backgroundColor;
	document.getElementById("zohodesk_Tooltip_close_tooltip").onclick=function(e)
	{
		Chrome_Extension_hideTooltip("zohodeskTooltipCloseTooltip");
		if (CloseIconMouseOverAction==true)
		{
			document.addEventListener('mouseover',selectElement,true);
			EditorListener=true;
		}
	}
	//document.addEventListener('mouseover',checkElement,true);
	Chrome_Extension_ele=document.getElementsByClassName("zohodesk-Tooltip-showContentClass")[0];
		Chrome_Extension_leng=Chrome_Extension_ele.classList;
		if(Chrome_Extension_leng==0){
			Chrome_Extension_ele.className +="zohodesk-Tooltip-tooltip-hide"
		}
		else{
			Chrome_Extension_inde=Chrome_Extension_ele.className.indexOf("zohodesk-Tooltip-tooltip-hide");
			if(Chrome_Extension_inde==-1){
				Chrome_Extension_ele.className +=" zohodesk-Tooltip-tooltip-hide"
			}
		}

	if(Chrome_Extension_tooltipContent!=undefined){
		//TooltipPosition
		positionBinder(Chrome_Extension_node.target,{"position":"top"});
	}
	else{
		Chrome_Extension_ele=document.getElementsByClassName("zohodesk-Tooltip-showContentClass")[0];
		Chrome_Extension_leng=Chrome_Extension_ele.classList;
		if(Chrome_Extension_leng==0){
			Chrome_Extension_ele.className +="zohodesk-Tooltip-tooltip-hide"
		}
		else{
			Chrome_Extension_inde=Chrome_Extension_ele.className.indexOf("zohodesk-Tooltip-tooltip-hide");
			if(Chrome_Extension_inde==-1){
				Chrome_Extension_ele.className +=" zohodesk-Tooltip-tooltip-hide"
			}
		}
	}
}
function Chrome_Extension_hideTooltip(e)
{
	var Chrome_Extension_ele=document.getElementsByClassName("zohodesk-Tooltip-showContentClass")[0];
	var tooltipElement=false;
	if (e != "zohodeskTooltipCloseTooltip")
	{
		tooltipElement=findInnerElements("Chrome_Extension_showContentId",e.target);
	}
	if (Chrome_Extension_ele != undefined && tooltipElement != true)
	{
		if(document.body.children.Chrome_Extension_showContentId);
		{
			while(document.body.children.Chrome_Extension_showContentId)
			{
				document.body.removeChild(document.getElementById("Chrome_Extension_showContentId"));
			}
		}
		document.removeEventListener("mouseover", Chrome_Extension_hideTooltip, true);
	}
}

