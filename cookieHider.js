// ==UserScript==
// @name        Cookie Hider
// @namespace   Smallpath2013@gmail.com
// @description Hide cookies you don't like
// @match       http://h.nimingban.com/*
// @version     1
// @grant       none
// ==/UserScript==
if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported")>-1)) {
  this.GM_getValue=function (key,def) {
      return localStorage[key] || def;
  };
  this.GM_setValue=function (key,value) {
      return localStorage[key]=value;
  };
  this.GM_deleteValue=function (key) {
      return delete localStorage[key];
  };
}
Array.prototype._forEach = Array.prototype._forEach || function (callback, context) {
  if (Object.prototype.toString.call(this) === '[object Array]') {
    var i,
    len;
    for (i = 0, len = this.length; i < len; i++) {
      if (typeof callback === 'function' && Object.prototype.hasOwnProperty.call(this, i)) {
        if (callback.call(context, this[i], i, this) === false) {
          break; // or return;
        }
      }
    }
  }
}
var version = 0.1;
var blackList = [];


try{
  var blackListRes = GM_getValue('CookieHider','');
  if(blackListRes != '')
   blackList = blackListRes.split(',');
  //console.log('blackList:'+blackList)
}catch(err){console.log(err)}



var targetElements = $.makeArray($('span.h-threads-info-report-btn'));
  Array.prototype._forEach.call(targetElements, function (item, index) {
    if($(item).find('a').text() == '举报')
     $(item).append('<span class="h-threads-info-report-btn shield">[<a>屏蔽</a>]</span>');
  });



$('.shield').each(function(k,v){
  $(v).find('a').click(function(e){
      var wow = $(this).parent().parent().parent().children('.h-threads-info-uid');
      blackList.push(wow.text().replace('ID:',''));
      GM_setValue('CookieHider',blackList.toString());
      return location.reload();
  })
})


$("#h-tool").append('<a title="前往底部" id="edit-cookie" class="h-tool-btn">'
                                  +'<i class="uk-icon-cog"></i></a>');

$('#h-tool').on('click','#edit-cookie',function(){
  
  var str = prompt(blackList.toString());
  
  if(!str) return;
  
  if(str=='reset'){
    blackList=[];
    GM_setValue('CookieHider','');
    return location.reload();;
  }
   
  if(str.indexOf('delete ')!=-1){
    str = str.replace(/delete\s/g,'');
    var newArr =[];
    blackList.forEach(function(item){
      if(item!=str)
        newArr.push(item);
    });
    blackList = newArr;
    GM_setValue('CookieHider',blackList.toString());
    return location.reload();
  }
  
  if(str){
    var str = str.replace(/,|\s/g,'');
    blackList.push(str);
    if(blackListRes=='')
     GM_setValue('CookieHider',str.toString());
    else
     GM_setValue('CookieHider',blackList.toString());
    return location.reload();
  }

    
});

hideCookie(blackList);

function hideCookie(blackArr) {
  var targetElements = $.makeArray($('span.h-threads-info-uid'));
  Array.prototype._forEach.call(targetElements, function (item, index) {
    blackArr._forEach(function (item, index) {
      var cookieName = this.innerHTML;
      var resultIndex = cookieName.indexOf(item);
      if (resultIndex != - 1) {
        $(this).parents('div.h-threads-info').parent().parent().hide();
      }
    }, item);
  })
}