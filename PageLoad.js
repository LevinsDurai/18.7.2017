
var functionListener=`/*ZohoHCAsap("Events",{

		Onload :  function(){
			
			//ZohoHCAsap.Hide();
			ZohoHCAsap.Properties( { keepithide : true });
		}
	
	})*/
window.addEventListener("message", function(event) {
	if (event.data.name=="UrlCheck")
	{
	  	if (typeof(ZohoHCAsap)!="undefined")
	  	{
	  		function zAsapObjGetter(){ 
	  			var orgId=ZohoHCAsap._defaultoptions.myAppPortalId;
	  			var AsapId=ZohoHCAsap._defaultoptions.id;
	  			var AsapName=ZohoHCAsap._defaultoptions.name;
	  			window.postMessage({type:"toolTip_orgId",orgId:orgId,AsapId:AsapId,AsapName:AsapName},"*")
	  		};
	  		zAsapObjGetter() ;
	  	}
	  	else  
	  	{  
	  		window.postMessage({type:"Asap_Not_Found"},"*")  
	  	}
	}
	  else if (event.data.name=="Department")
	  {
	  	if (ZohoHCAsap._defaultoptions.departmentId == "-1")
	  	{
		  	window.postMessage({name:"department",value:"All"},"*");
		}
		else
		{
			ZohoHCAsap.KB.API.Departments(null,function(response){
		  		window.postMessage({name:"department",value:response.data[0].name},"*");
		  	},
		  	function(errResponse){
		  		// "console.log(errResponse)"
		  	})
		}
	  }
	  else if(event.data.name=="Article")
	  {
	  	ZohoHCAsap.KB.API.Articles.Search({searchStr:event.data.article},function(response){
	  		window.postMessage({name:"article",value:response.data},"*");
	  	},
	  	function(errResponse){
	  		// "console.log(errResponse)"
	  	})
	  }
	  else if(event.data.name=="SingleArticle")
	  {
	  	ZohoHCAsap.KB.API.Articles( { id : event.data.article },function(response){
	  		window.postMessage({name:"SingleArticleObject",value:response},"*");
	  	},
	  	function(errResponse){
	  		// "console.log(errResponse)"
	  	})
	  }
	  else if(event.data.name=="GoAsapArticle")
	  {
	  	ZohoHCAsap.KB.Articles.Open( { id : event.data.value } );
	  }
	}, false);`


var script=document.createElement("script");
script.type="text/javascript";
script.appendChild(document.createTextNode(functionListener));
document.head.appendChild(script);