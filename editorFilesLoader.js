function filesInjector() {
    if (document.getElementsByTagName("head") != 0) {
        var zohodeskInitJs = document.createElement("script");
        zohodeskInitJs.type = "text/javascript";
        zohodeskInitJs.className = "desk_support_chromeAddons";
        zohodeskInitJs.src = "https://cdn.rawgit.com/lakshmimurali/reactproject/master/ZohoDeskEditor_Tooltip_Init.js";
        document.getElementsByTagName("head")[0].appendChild(zohodeskInitJs);

        var Kernelscript = document.createElement("script");
        Kernelscript.type = "text/javascript";
        Kernelscript.className = "desk_support_chromeAddons";
        Kernelscript.src = "https://js.zohostatic.com/support/zde_v2/ZohoDeskEditorKernal.min.js";
        document.getElementsByTagName("head")[0].appendChild(Kernelscript);

        var zohoDeskEditterCreater = document.createElement("script");
        zohoDeskEditterCreater.type = "text/javascript";
        zohoDeskEditterCreater.className = "desk_support_chromeAddons";
        zohoDeskEditterCreater.defer = true;
        zohoDeskEditterCreater.src = "https://cdn.rawgit.com/LevinsDurai/editor/master/ZDTT_edit.js";
        document.getElementsByTagName("head")[0].appendChild(zohoDeskEditterCreater);
    } else {
        filesInjector()
    }
}

filesInjector();