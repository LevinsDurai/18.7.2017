var toolTip;
var bodyDimensions=document.body.getBoundingClientRect();
var lastClicked=null;
// var topPosition;
// var bottomPosition;
// var leftPosition;
// var rightPosition;

var tooltipPositions={};




function onHover(obj,event){
	createTooltip(obj,event);	
}
function onClick(e,obj){
	if(e.target!=lastClicked){
		createTooltip(obj,e);
		lastClicked = e.target;
	}
}
function onHoverOut(e){
	removeTooltip();
}
function removeTooltip(){
	var targ=document.getElementsByClassName('tooltiptext');
	var len=targ.length;
	for(var i=0 ; i<len ; i++){
		document.body.removeChild(targ[0]);
	}
}
// function eventBinder(){
// 	var elements=document.getElementsByClassName('elem')
// 	for(i=0 ; elements.length>i ; i++){
// 		elements[i].addEventListener("mouseover",onHover);
// 		elements[i].addEventListener("mouseout",onHoverOut);
// 	}
// }

function createTooltip(con,event){
	var pDiv=document.createElement('div');
	pDiv.className="tooltiptext";
	document.body.appendChild(pDiv);
	pDiv.style.visibility="hidden";
	var arrowSpan = document.createElement('span');
	arrowSpan.className = "tooltiparrow";
	var contentDiv = document.createElement("div");
	contentDiv.className = "tooltipcont";
	contentDiv.innerHTML=con.content;
	pDiv.appendChild(arrowSpan);
	pDiv.appendChild(contentDiv);
	setTimeout(function(){positionBinder(event.target,con)},100);
}

// function positionBinder(elem){
// 	toolTip=document.getElementsByClassName("tooltiptext")[0];
// 	elemDimensions=elem.getBoundingClientRect();
// 	ttDimensions=toolTip.getBoundingClientRect();
// 	topPosition=topPopUp(elemDimensions,ttDimensions);
// 	bottomPosition=bottomPopUp(elemDimensions,ttDimensions);
// 	leftPosition=leftPopUp(elemDimensions,ttDimensions);
// 	rightPosition=rightPopUp(elemDimensions,ttDimensions);
// }

function positionBinder(elem,obj){
	//toolTip=document.getElementsByClassName("tooltiptext")[0];
	toolTip=document.getElementById("Chrome_Extension_showContentContainerId");
	elemDimensions=elem.getBoundingClientRect();
	ttDimensions={height:toolTip.offsetHeight,width:toolTip.offsetWidth};
	// console.log(ttDimensions);
	tooltipPositions={
		top : topPopUp(elemDimensions,ttDimensions),
		bottom : bottomPopUp(elemDimensions,ttDimensions),
		left : leftPopUp(elemDimensions,ttDimensions),
		right : rightPopUp(elemDimensions,ttDimensions)
	};
	// console.log(tooltipPositions)
	if(obj.position != undefined){
		if(obj.position==="top"){
			if(tooltipPositions.top.position != "topFailed"){
				return applyposition(tooltipPositions.top);
			}
			else{
				return defaultView()
			}
		}
		else if(obj.position==="bottom"){
			if(tooltipPositions.bottom.position != "bottomFailed"){
				return applyposition(tooltipPositions.bottom);
			}
			else{
				return defaultView()
			}
		}
		else if(obj.position==="left"){
			if(tooltipPositions.left.position != "leftFailed"){
				return applyposition(tooltipPositions.left);
			}
			else{
				return defaultView()
			}
		}
		else if(obj.position==="right"){
			if(tooltipPositions.right.position != "rightFailed"){
				return applyposition(tooltipPositions.right);
			}
			else{
				return defaultView()
			}
		}
	}
	else{
		return defaultView()
	}
}

function applyposition(posObj){
	//var arrow=document.getElementsByClassName('tooltiparrow')[0];
	//var pop=document.getElementsByClassName('tooltiptext')[0];
	var arrow=document.getElementsByClassName('zohodesk-Tooltip-tooltiparrow')[0];
	var pop=document.getElementById("Chrome_Extension_showContentId");
	document.getElementsByClassName("zohodesk-Tooltip-showContentClass")[0].className=document.getElementsByClassName("zohodesk-Tooltip-showContentClass")[0].className.split(" zohodesk-Tooltip-tooltip-hide")[0];
	arrow.style.top=posObj.arrowTop+"px";
	arrow.style.left=posObj.arrowLeft+"px";
	arrow.style.transform=posObj.deg;
	pop.style.top=posObj.ttipTop+"px";
	pop.style.left=posObj.ttipLeft+"px";
	pop.style.visibility="visible";
	// console.log(posObj)
}
function defaultView(){
	if(tooltipPositions.left.position === "leftOk"){
		return applyposition(tooltipPositions.left);
	}
	else if(tooltipPositions.right.position === "rightOk"){
		return applyposition(tooltipPositions.right);
	}
	else if(tooltipPositions.top.position === "topOk"){
		return applyposition(tooltipPositions.top);
	}
	else if(tooltipPositions.bottom.position === "bottomOk"){
		return applyposition(tooltipPositions.bottom);
	}
	else{
		if(tooltipPositions.left.position != "leftFailed"){
			return applyposition(tooltipPositions.left);
		}
		else if(tooltipPositions.right.position != "rightFailed"){
			return applyposition(tooltipPositions.right);
		}
		else if(tooltipPositions.top.position != "topFailed"){
			return applyposition(tooltipPositions.top);
		}
		else if(tooltipPositions.bottom.position != "bottomFailed"){
			return applyposition(tooltipPositions.bottom);
		}
	}
	return "positioning failed"
}


function topPopUp(elem,ttip){
	if(elem.top>(ttip.height+10)){
		if((elem.left+(elem.width/2))>(ttip.width/2)  && (((bodyDimensions.right-elem.right)+(elem.width/2))>(ttip.width/2))){
			return {position:"topOk","ttipLeft":((elem.left+(elem.width/2))-(ttip.width/2)),"ttipTop":(elem.top-(10+ttip.height)),"arrowLeft":(ttip.width/2)-10,"arrowTop":(ttip.height-9),"deg":"rotate(225deg)"}
		}
		else if((elem.left+(elem.width/2))<(ttip.width/2)  && (((bodyDimensions.right-elem.right)+(elem.width))>(ttip.width))){
			return {position:"topRightOk","ttipLeft":2,"ttipTop":(elem.top-(10+ttip.height)),"arrowLeft":(elem.width/2)-10,"arrowTop":ttip.height-9,"deg":"rotate(225deg)"}
		}
		else if((elem.left+(elem.width/2))>(ttip.width/2)  && (((bodyDimensions.right-elem.right)+(elem.width))<(ttip.width))){
			return {position:"topLeftOk","ttipLeft":((window.innerWidth-ttip.width)),"ttipTop":(elem.top-(10+ttip.height)),"arrowLeft":((elem.left-(window.innerWidth-ttip.width))+elem.width/2)-10,"arrowTop":ttip.height-9,"deg":"rotate(225deg)"}
		}
	}
	return {position:"topFailed"}
}

function bottomPopUp(elem,ttip){
	if(document.getElementsByTagName('body')[0].style.margin === ""){
		var winHeight=window.innerHeight-16;
	}
	else{
		var winHeight=window.innerHeight-document.getElementsByTagName('body')[0].style.margin;
	}
	
	if((winHeight-elem.bottom)>(ttip.height+10)){
		if((elem.left+(elem.width/2))>(ttip.width/2)  && (((bodyDimensions.right-elem.right)+(elem.width/2))>(ttip.width/2))){
			return {position:"bottomOk","ttipLeft":((elem.left+(elem.width/2))-(ttip.width/2)),"ttipTop":(elem.bottom+5),"arrowLeft":(ttip.width/2)-10,"arrowTop":-7,"deg":"rotate(45deg)"}
		}
		else if((elem.left+(elem.width/2))<(ttip.width/2)  && (((bodyDimensions.right-elem.right)+(elem.width))>(ttip.width))){
			return {position:"bottomRightOk","ttipLeft":elem.left,"ttipTop":(elem.bottom+5),"arrowLeft":(elem.width/2)-10,"arrowTop":-7,"deg":"rotate(45deg)"}
		}
		else if((elem.left+(elem.width/2))>(ttip.width/2)  && (((bodyDimensions.right-elem.right)+(elem.width))<(ttip.width))){
			return {position:"bottomLeftOk","ttipLeft":((elem.right-ttip.width)),"ttipTop":(elem.bottom+5),"arrowLeft":((elem.left-ttip.left)+elem.width/2)-10,"arrowTop":-7,"deg":"rotate(45deg)"}
		}
	}
	return {position:"bottomFailed"}
}

function leftPopUp(elem,ttip){
	if(document.getElementsByTagName('body')[0].style.margin === ""){
		var winHeight=window.innerHeight-16;
	}
	else{
		var winHeight=window.innerHeight-document.getElementsByTagName('body')[0].style.margin;
	}

	if((elem.left)>(ttip.width+10)){
		if((elem.top+(elem.height/2))>(ttip.height/2)  && (((winHeight-elem.bottom)+(elem.height/2))>(ttip.height/2))){
			return {position:"leftOk","ttipLeft":((elem.left)-(5+ttip.width)),"ttipTop":((elem.top+elem.height/2)-(ttip.height/2)),"arrowLeft":(ttip.width-9),"arrowTop":(ttip.height/2)-5,"deg":"rotate(135deg)"}
		}
		else if((elem.top+(elem.height/2))<(ttip.height/2)  && (((winHeight-elem.bottom)+(elem.height/2))>(ttip.height/2))){
			return {position:"leftBottomOk","ttipLeft":((elem.left)-(5+ttip.width)),"ttipTop":0,"arrowLeft":(ttip.width-9),"arrowTop":(elem.top+elem.height/2)-5,"deg":"rotate(135deg)"}
		}
		else if((elem.top+(elem.height/2))>(ttip.height/2)  && (((winHeight-elem.bottom)+(elem.height/2))<(ttip.height/2))){
			return {position:"leftTopOk","ttipLeft":((elem.left)-(5+ttip.width)),"ttipTop":(window.innerHeight-ttip.height),"arrowLeft":(ttip.width-9),"arrowTop":(ttip.height-((window.innerHeight-elem.bottom)+elem.height/2))-5,"deg":"rotate(135deg)"}
		}
	}
	return {position:"leftFailed"}
}

function rightPopUp(elem,ttip){
	if(document.getElementsByTagName('body')[0].style.margin === ""){
		var winHeight=window.innerHeight-16;
	}
	else{
		var winHeight=window.innerHeight-document.getElementsByTagName('body')[0].style.margin;
	}

	if((bodyDimensions.right-elem.right)>(ttip.width+10)){
		if((elem.top+(elem.height/2))>(ttip.height/2)  && (((winHeight-elem.bottom)+(elem.height/2))>(ttip.height/2))){
			return {position:"rightOk","ttipLeft":(elem.right+5),"ttipTop":((elem.top+elem.height/2)-(ttip.height/2)),"arrowLeft":-9,"arrowTop":(ttip.height/2)-5,"deg":"rotate(315deg)"}
		}
		else if((elem.top+(elem.height/2))<(ttip.height/2)  && (((winHeight-elem.bottom)+(elem.height/2))>(ttip.height/2))){
			return {position:"rightBottomOk","ttipLeft":(elem.right+5),"ttipTop":0,"arrowLeft":-9,"arrowTop":(elem.top+elem.height/2)-5,"deg":"rotate(315deg)"}
		}
		else if((elem.top+(elem.height/2))>(ttip.height/2)  && (((winHeight-elem.bottom)+(elem.height/2))<(ttip.height/2))){
			return {position:"rightTopOk","ttipLeft":(elem.right+5),"ttipTop":(window.innerHTML-ttip.height),"arrowLeft":-9,"arrowTop":(ttip.height-((window.innerHeight-elem.bottom)+elem.height/2))-5,"deg":"rotate(315deg)"}
		}
	}
	return {position:"rightFailed"}
}






function eventBinder(obj,elem){
	if( obj.trigger === "hover" ){

		elem.addEventListener("mouseover",function(event){
			return onHover(obj, event);
		});
		elem.addEventListener("mouseout",onHoverOut);
	}
	if( obj.trigger === "click" ){
		elem.addEventListener("mousedown",function(event){
			return onClick(event,obj)
		});
	}
}

document.addEventListener('mouseup' , function(e){
	if(lastClicked != null){
		if(e.target != lastClicked){
			removeTooltip();
			lastClicked=null;
		}
	}
})




function tooltipPositioning(obj){
	this.obj=obj;
	this.onHover=onHover;
	this.onClick=onClick;
	this.onHoverOut=onHoverOut;
	this.eventBinder=eventBinder
}