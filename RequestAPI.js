function get_cookie ( cookie_name ){
  var results = document && document.cookie.match( cookie_name + '=(.*?)(;|$)' );
  if ( results ){
    // console.log(unescape (results[1]),"afsdtegewrter");
    return ( unescape (results[1]) );
  }
  return null;
}

// function getCSRFCookie()
// {
//   var csrfToken=get_cookie("crmcsr");
//   return csrfToken;
//   //NO I18N  return csrfToken;
// }

function requestAPI(url){
  var core = {
    ajax : function(method, url, args, payload, files,headersArray){
      return new Promise( function (resolve, reject) {
        var client = new XMLHttpRequest();
        var uri = url;
        var data = "";
        if (args && (method === 'POST' || method === 'PUT')) {
          // console.log("Post Method Called");
          var argcount = 0;
          for (var key in args) {
            if (args.hasOwnProperty(key)) {
              if (argcount++) {
                data += '&';
              }
              data += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
            }
          }
        }
        client.open(method, uri);
        client.setRequestHeader("X-Requested-With", "XMLHttpRequest"); 
        // console.log("done  "+getCSRFCookie()) ;
        client.setRequestHeader("X-ZCSRF-TOKEN","crmcsrfparam="+zd_tt_csrf); 
        if(headersArray)
        {
          for (i=0;i<headersArray.length;i++)
          {
              client.setRequestHeader(Object.keys(headersArray)[0], Object.values(headersArray)[0]);
          }   


        }  
        if(files){
          var data = new FormData();
          /*for (var i=0, len=files.length; i < len; i++) {
            data.append("file", files[i]);
          }*/
          data.append("file", files[0]);
          client.send(data);
        }
        else if(payload)
        {
          client.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
          client.send(JSON.stringify(payload));
        }
        else{
          client.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          client.send(data);
        }

        
        client.onload = function () {
          if(this.status === 200 || this.status === 201 || this.status === 204 ) {
            if(this.readyState===4){
              var response = this.response ? this.response : this.responseText;
              if(response === ""){
                resolve({responseStatus:this.status});
              }
              else {
                // console.log(response);
                resolve(JSON.parse(response));
              }
            }
          }
          else if(this.status === 400 && this.readyState ===4){
            // createToolTipErrorPopupBox({buttons:[{id:"ok",content:"ok"},{id:"cancel",content:"cancel"}],content:"<b>You are not signin your zohoDesk account...</b><br> please signin your desk account , and try some time later..."});
            resolve({"data":"user_notSignedIn"});
          }
          else if(this.status === 403 && this.readyState ===4){
            // createToolTipErrorPopupBox({buttons:[{id:"ok",content:"ok"},{id:"cancel",content:"cancel"}],content:"<b>You are not signin your zohoDesk account...</b><br> please signin your desk account , and try some time later..."});
            resolve({"data":"you_dontHave_A_permission"});
          }
          else {
            reject(this);
          }
        };
        client.onerror = function (e) {
          reject(this);
        };


      });
    }
  };

  return {
    'get' : function(){
      return core.ajax('GET', url);
    },
    'post' : function(args,payload,headers) {
      return core.ajax('POST', url, args, payload);
    },
    'put' : function(args, payload,headers) {
      return core.ajax('PUT', url, args, payload);
    },
    'del' : function() {
      return core.ajax('DELETE', url);
    },
    'attach' : function(files,onProcess){
      return core.ajax('POST', url, {}, undefined, files);
    }
  };
};

