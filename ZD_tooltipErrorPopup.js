var ZDTT_firstTimeFocused = true;
var ZDesk_tooltipError = function() {};

function createToolTipErrorPopupBox(obj) {
    var parent;
    var position;
    if (obj.id == undefined) {
        parent = document.body;
        position="change";
    } else {
        parent = document.getElementById(obj.id);
        position = "default";
    }
    var divContainer = document.createElement("div");
    divContainer.className = "svgIconContainerOfErrorPopup";
    parent.appendChild(divContainer);
    divContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"><symbol id="problem-exc" viewBox="0 0 32 32"><path d="M2.535 30.465h26.943c1.884 0 3.097-1.987 2.245-3.665l-13.471-23.872c-0.929-1.858-3.587-1.858-4.516 0l-13.471 23.872c-0.826 1.677 0.387 3.665 2.271 3.665zM18.122 24.916c0 1.239-0.903 2.194-2.194 2.194s-2.194-0.955-2.194-2.194v-0.052c0-1.239 0.903-2.194 2.194-2.194s2.194 0.955 2.194 2.194v0.052zM14.741 8.787h2.529c0.697 0 1.11 0.594 1.032 1.342l-1.11 9.704c-0.077 0.697-0.542 1.136-1.187 1.136s-1.11-0.439-1.187-1.136l-1.11-9.704c-0.077-0.748 0.336-1.342 1.033-1.342z"></path></symbol></svg>`;
    divContainer = document.createElement('div');
    divContainer.className = "zohodesk-Tooltip-error-message";
    parent.appendChild(divContainer);
    var childDiv = document.createElement("div");
    childDiv.className = "zohodesk-Tooltip-error-header";
    divContainer.appendChild(childDiv);
    var childDivinner = document.createElement("div");
    childDivinner.className = "zohodesk-Tooltip-error-icon";
    childDivinner.innerHTML = `<svg class="zohodesk-Tooltip-Alert-Error-icon"><use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="#problem-exc"></use></svg>`;
    childDiv.appendChild(childDivinner);
    childDivinner = document.createElement("div");
    childDivinner.className = "zohodesk-Tooltip-error-text";
    if (obj.content == undefined) {
        obj.content = "sorry for the disturbance ... Some technical work is ongoing ... Try again some time later...";
    }
    childDivinner.innerHTML = obj.content;
    childDiv.appendChild(childDivinner);
    childDiv = document.createElement("div");
    childDiv.className = "zohodesk-Tooltip-error-footer";
    for (i = 0; i < obj.buttons.length; i++) {
        childDivinner = document.createElement('div');
        if (i == 0) {
            childDivinner.className = "zohodesk-Tooltip-error-button zD-tooltip-lftBtn";
        } else {
            childDivinner.className = "zohodesk-Tooltip-error-button zD-tooltip-rtBtn";
        }
        childDivinner.id = obj.buttons[i].id;
        childDivinner.innerHTML = obj.buttons[i].content;
        childDiv.appendChild(childDivinner);
    }
    divContainer.appendChild(childDiv);
    var transprentDiv=document.createElement('div');
    transprentDiv.className = "zohodesk-Tooltip-layer";
    parent.appendChild(transprentDiv);
    ZD_ttErrorPopup.BindEven(obj.buttons);
    divContainer.style.zIndex=parseInt(findHighestZIndex('div'))+20;
    if(position == "change"){
        divContainer.style.left=((document.body.offsetWidth-10)-divContainer.offsetWidth)+"px";
        divContainer.style.top = "10px"
    }
    if(position == "default"){
        divContainer.style.left= "calc(50% - 185px)";
        divContainer.style.top = "calc(50% - 100px)";
    }
}




ZDesk_tooltipError.prototype.tabKeyPressed = function() {
    var focused;
    var ZDTTfooterbuttons = document.getElementsByClassName('zohodesk-Tooltip-error-button');
    if (ZDTT_firstTimeFocused) {
        ZDTTfooterbuttons[0].className += " ZDTooltipbtnFocused";
        ZDTT_firstTimeFocused = false;
        return
    }
    for (var i = 0; i < ZDTTfooterbuttons.length; i++) {
        if (ZDTTfooterbuttons[i].className.indexOf("ZDTooltipbtnFocused") != -1) {
            ZDTTfooterbuttons[i].className = ZDTTfooterbuttons[i].className.split(" ZDTooltipbtnFocused").join(" ");
        } else {
            ZDTTfooterbuttons[i].className += " ZDTooltipbtnFocused";
        }
    }
};
ZDesk_tooltipError.prototype.enterKeyPressed = function() {
    this.clearBindedEvent();
    this.deleteTooltipErrorPopupBox();
};
ZDesk_tooltipError.prototype.events = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.keyCode == 13) {
        this.enterKeyPressed(e);
    }
    if (e.keyCode == 27) {
        this.enterKeyPressed(e);
    }
    if (e.keyCode == 9) {
        this.tabKeyPressed(e);
    }
};
ZDesk_tooltipError.prototype.clearBindedEvent = function() {
    document.removeEventListener('keydown', this.addEvents, true);
};
ZDesk_tooltipError.prototype.BindEven = function(arrayObj) {
    this.addEvents = this.events.bind(this);
    document.addEventListener('keydown', this.addEvents, true);
    if (arrayObj != undefined) {
        for (var i = 0; i < arrayObj.length; i++) {
            document.getElementById(arrayObj[i].id).addEventListener('mouseup', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.clearBindedEvent();
                this.deleteTooltipErrorPopupBox();
            }.bind(this))
        }
    }
};
ZDesk_tooltipError.prototype.deleteTooltipErrorPopupBox = function() {
    var transprentDiv = document.getElementsByClassName('zohodesk-Tooltip-layer');
    if (transprentDiv.length != 0) {
        transprentDiv = transprentDiv[0];
        var parent=transprentDiv.parentElement;
        parent.removeChild(transprentDiv);
        parent.removeChild(document.getElementsByClassName('svgIconContainerOfErrorPopup')[0]);
        parent.removeChild(document.getElementsByClassName('zohodesk-Tooltip-error-message')[0]);
    }
    ZDTT_firstTimeFocused = true;
};

var ZD_ttErrorPopup = new ZDesk_tooltipError();