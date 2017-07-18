var Chrome_Extension_ConfigSelectors = []
var Chrome_Extension_Config
var Chrome_Extension_observer
var Chrome_Extension_list
var Chrome_Extension_interval;
var Chrome_Extension_bodyPosition;
var Chrome_Extension_CommonMousePointElement;
function TempMouseOver(e)
{
	Chrome_Extension_CommonMousePointElement=e.target;
}

/*document.addEventListener("DOMContentLoaded", function(event) {
	showTooltip()
})*/
Chrome_Extension_showTooltip();


function Chrome_Extension_Tooltip_User_View(ElementObject)
{
	Element=document.querySelector(ElementObject.triggers[0].element);
	if (ElementObject.triggers[0].event=="HOVER")
	{
		Element.addEventListener('mouseover',elementMouseMoveDeBounce,true);
		Element.addEventListener('mouseleave',function Chrome_Extension_hide(e){
			//clearInterval(Chrome_Extension_interval);
			setTimeout(function(){document.addEventListener('mouseover', Chrome_Extension_hideTooltip, true)},0);
		});
	}
	else if(ElementObject.triggers[0].event=="CLICK")
	{
		Element.addEventListener('click',elementMouseOverListener,true);
	}
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


function getCurrentDomainContents()
{
	var AsapId;
	var orgId;
	insertAsapListener();
	setTimeout(function(){window.postMessage({name:"Zohodesk_Chrome_Extension_AsapCheck"},"*")},2000);
	window.addEventListener("message",function(event)
	{
		if (event.data.name=="Zohodesk_Chrome_Extension_AsapDetails")
		{
			// console.log("jkdnkjdnclkdsld");
			AsapId=event.data.AsapId;
			orgId=event.data.orgId;
			// console.log("Listen ok",event);
			var currentDomainName=window.location.hostname;
			requestAPI("https://"+commomDomainNameForAPI+"/api/web/asap/"+AsapId+"?orgId="+orgId+"&domain="+currentDomainName).get().then((res)=>{
				// console.log("Get Extn", res);
				if (typeof(res[0])=="object")
				{
					// console.log(res[0].id);
					var ExtensionId=res[0].id;
					requestAPI("https://"+commomDomainNameForAPI+"/api/web/asap/"+AsapId+"/"+ExtensionId+"?checkIsEnabledFlag=true&orgId="+orgId).get().then((res)=>{
						// console.log("Get Msg",res);
						Chrome_Extension_RequireFunctionFlow(res);
					})
				}
			})
		}
	})
}


function Chrome_Extension_RequireFunctionFlow(Chrome_Extension_Config)
{
		var Chrome_Extension_ConfigLength = Chrome_Extension_Config.length
		var Chrome_Extension_x;
		var Chrome_Extension_CurrentDomainPath=window.location.href;
		for(i=0;i<Chrome_Extension_ConfigLength;i++){
			if (Chrome_Extension_CurrentDomainPath==Chrome_Extension_Config[i].triggers[0].url)
			{
				Chrome_Extension_ConfigSelectors.push(Chrome_Extension_Config[i].triggers[0].element);
			}
		}

		for(i=0;i<Chrome_Extension_ConfigLength;i++){
			// if (Chrome_Extension_CurrentDomainPath==Chrome_Extension_Config[i].triggers[0].url)
			// {
				var Chrome_Extension_element = document.querySelector(Chrome_Extension_Config[i].triggers[0].element);
				if(Chrome_Extension_element!=null){
					Chrome_Extension_Tooltip_User_View(Chrome_Extension_Config[i]);
				}
			// }
		}

		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
		Chrome_Extension_list = document.querySelector('body');
		 
		Chrome_Extension_observer = new MutationObserver(function(Chrome_Extension_mutations) {
			Chrome_Extension_mutations.forEach(function(Chrome_Extension_mutation) {
				var Chrome_Extension_addedNodes=Chrome_Extension_convert(Chrome_Extension_mutation.addedNodes)
				Chrome_Extension_addedNodes.map(function(Chrome_Extension_node, Chrome_Extension_index){
					if(Chrome_Extension_node.nodeType==1){
						Chrome_Extension_setAddListener(Chrome_Extension_node);
						var Chrome_Extension_nodeChilds = Chrome_Extension_node.getElementsByTagName("*")
						var Chrome_Extension_nodeChildslen = Chrome_Extension_nodeChilds.length
						Chrome_Extension_nodeChilds=Chrome_Extension_convert(Chrome_Extension_nodeChilds)
						Chrome_Extension_nodeChilds.map(function(Chrome_Extension_node, Chrome_Extension_index){
							Chrome_Extension_setAddListener(Chrome_Extension_node);
						});		
					}	
				});
			});
		});

		Chrome_Extension_observer.observe(Chrome_Extension_list, {
		childList: true,
		subtree: true
		});

		document.addEventListener("visibilitychange", function() {
			if(!document.hidden){
				Chrome_Extension_observer.observe(Chrome_Extension_list, {
					childList: true,
					subtree: true
				});
			}
			else if(document.hidden){
				Chrome_Extension_observer.disconnect()
			}
		})
}


function Chrome_Extension_showTooltip(){
	Chrome_Extension_Config = getCurrentDomainContents();
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
function fullPath( selectedElement ){ 
	var isIDExist = false;
	var elementPath = [];
	var childs;
	if(selectedElement.id!=""){  
	elementPath.unshift("[id='"+selectedElement.id+"']")
	return elementPath[0]
	    }

	while(!isIDExist){
	childs=selectedElement.parentElement.children
	for(var c=0;childs[c]!=selectedElement;c++);
	elementPath.unshift(selectedElement.tagName+":nth-child("+(c+1)+")")
	selectedElement = selectedElement.parentElement
	if(selectedElement.id!==""){
	elementPath.unshift("[id='"+selectedElement.id+"']")
	isIDExist=true
	        }
	else if(selectedElement.tagName=="HTML"){
	elementPath.unshift("HTML")
	isIDExist=true
	        }
	    }
	    return elementPath.join(" > ")
}

function Chrome_Extension_convert(Chrome_Extension_objArray){
	var Chrome_Extension_nodesArray = [];
	var Chrome_Extension_objArrayLen=Chrome_Extension_objArray.length
	for (var i=0;  i<Chrome_Extension_objArrayLen; i++){
		Chrome_Extension_nodesArray.push(Chrome_Extension_objArray[i]);
	}	
	return Chrome_Extension_nodesArray
}

function Chrome_Extension_setAddListener(Chrome_Extension_node){
	var Chrome_Extension_x=Chrome_Extension_ConfigSelectors.indexOf(Chrome_Extension_getSelector(Chrome_Extension_node));
	if(Chrome_Extension_x>=0){
		Chrome_Extension_Tooltip_User_View(Chrome_Extension_Config[Chrome_Extension_x]);
	}
} 

function Chrome_Extension_getSelector( Chrome_Extension_selectedElement ){
	try{
		var Chrome_Extension_isIDExist = false;
		var Chrome_Extension_elementPath = [];
		var Chrome_Extension_childs;
		if(Chrome_Extension_selectedElement.id!=""){   
			Chrome_Extension_elementPath.unshift("[id='"+Chrome_Extension_selectedElement.id+"']")
			return Chrome_Extension_elementPath[0]
	    }
		
		while(!Chrome_Extension_isIDExist){
			if(Chrome_Extension_selectedElement.tagName!="HTML"){
				Chrome_Extension_childs=Chrome_Extension_selectedElement.parentElement.children
				for(var c=0;Chrome_Extension_childs[c]!=Chrome_Extension_selectedElement;c++);	
				Chrome_Extension_elementPath.unshift(Chrome_Extension_selectedElement.tagName+":nth-child("+(c+1)+")")
				Chrome_Extension_selectedElement = Chrome_Extension_selectedElement.parentElement
				if(Chrome_Extension_selectedElement.id!==""){
					Chrome_Extension_elementPath.unshift("[id='"+Chrome_Extension_selectedElement.id+"']")
					Chrome_Extension_isIDExist=true
		        }
				else if(Chrome_Extension_selectedElement.tagName=="HTML"){
					Chrome_Extension_elementPath.unshift("HTML")
					Chrome_Extension_isIDExist=true
		        }
			}
			else{
				return "HTML"
			}
	    }
	    return Chrome_Extension_elementPath.join(" > ")
	}
	catch(err){}    
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
		var shortenedDescription=descriptionArray.slice(0,20);
		if(descriptionArray.length>20)
		{
			document.getElementById("Chrome_Extension_showContentContainerSpanId").innerHTML=(shortenedDescription.join(" ")+"...");
			document.getElementById("Chrome_Extension_ToolTip_View_More").innerHTML=`<div class="zohodesk-Tooltip-popup-button zohodesk-Tooltip-popup-button-small" id="Chrome_Extension_showContentContainerHrefId"><span></span>VIEW MORE</div>`;
			document.getElementById("Chrome_Extension_showContentContainerHrefId").children[0].id=Chrome_Extension_ArticleId;
			document.getElementById("Chrome_Extension_showContentContainerHrefId").onclick=function(e){
				var articleId=document.getElementById("Chrome_Extension_showContentContainerHrefId").children[0].id;
				window.postMessage({name:"GoAsapArticle",value:articleId},"*");
				Chrome_Extension_hideTooltip("zohodeskTooltipCloseTooltip");
			}
		}
		else
		{
			document.getElementById("Chrome_Extension_showContentContainerSpanId").innerHTML=Chrome_Extension_tooltipContent;
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