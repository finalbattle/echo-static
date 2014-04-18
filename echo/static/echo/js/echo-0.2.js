/**
 * @author Zhenjiang.Wang
 * @version 0.2
 */
var Echo = {'version': '0.2'};
/**
 * check if an element is the body element
 * @param {Object} element
 * @returns true | false
 */
function $ifBody(element){
    if(!$chk2(element)) return false;
    return (/^(?:body|html)$/i).test(element.tagName);
}
/**
 * check if an object exist & not null & not '' & not exactly 0
 * @param {Object} obj
 * @returns true|false
 */
function $chk2(obj){
    if(obj == undefined) return false;
    if(obj == null) return false;
    if(obj == '') return false;
    return !!(obj || obj === 0)
}
/**
 * check if a string matching a specific type
 * @param {string} chkstr the string to be tested
 * @param {string} type type of the string, maybe int|uint|float|ufloat|date|ym|time|email, ym means year-month
 * @returns true|false
 */
function $chkType(chkstr,type){
    if(!$chk2(chkstr) || !$chk2(type)) return false;
    var trimed = chkstr.trim();
    if(type == 'int') return new RegExp("^-{0,1}[0-9]*$").test(trimed);
    else if(type == 'uint') return new RegExp("^[0-9]*$").test(trimed);
    else if(type == 'float') return new RegExp("^-{0,1}[0-9.]*$").test(trimed);
    else if(type == 'ufloat') return new RegExp("^[0-9.]*$").test(trimed);
    else if(type == 'date') return new RegExp("^\\d{4}-\\d{1,2}-\\d{1,2}$").test(trimed);
    else if(type == 'ym') return new RegExp("^\\d{4}-\\d{1,2}$").test(trimed);
    else if(type == 'time') return new RegExp("^\\d{2}:\\d{2}(:\\d{2})*$").test(trimed);
    else if(type == 'email') return new RegExp("^[a-zA-Z0-9_(-).]{1,}@[a-zA-Z0-9_(-).]{1,}\\.[a-zA-Z0-9_(-).]{1,}$").test(trimed);
    else if(type == 'url') return new RegExp("^[a-zA-z]+://[^\s]*").test(trimed);
}
/**
 * set a class name to an element and remove the class to its brothers
 * @param {Object} obj - the object to set class
 * @param {Object} containerPattern - pattern of container of the elements
 * @param {Object} classOwnerPattern - pattern of the elements
 * @param {Object} cssClass - class name to be set
 */
function $uniqueClass(obj,containerPattern, classOwnerPattern, cssClass) {
    $(obj).getParent(containerPattern).getElements(classOwnerPattern).removeClass(cssClass);
    $(obj).getParent(classOwnerPattern).addClass(cssClass);
}
function $chkCn(str){
    var pattern = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
    return pattern.test(str.trim());
}
function $addUriParam(uriString,key,value){
    var _uri = uriString.toURI();
    _uri.setData(key,value);
    return _uri.toString();
}
function $reloadPage(targetFrame){
    var win = window;
    if(targetFrame) win = targetFrame;
    if(!win) return;
    win.location.href = $addUriParam(win.location.href,'_rp_',Math.random());
}
/**
 * check if a string matching a specific condition
 * @param {string} value the string to be tested
 * @param {string} validator a compound validator, composed of some of required|int|uint|float|ufloat|date|ym|time|email
 * @return {string} the error message, if '', means passed
 */
function $ifValid(value,validator){
    if(validator.indexOf('required')>=0 && value.trim()=='') return '必须输入内容';
    if(validator.indexOf('float')>=0 && !$chkType(value.trim(),'float')) return '必须输入浮点数';
    if(validator.indexOf('int')>=0 && !$chkType(value.trim(),'int')) return '必须输入整数';
    if(validator.indexOf('uint')>=0 && !$chkType(value.trim(),'uint')) return '必须输入正整数';
    if(validator.indexOf('date')>=0 && !$chkType(value.trim(),'date')) return '必须输入日期，如2010-01-01';
    if(validator.indexOf('time')>=0 && !$chkType(value.trim(),'time')) return '必须输入时间，如20:01:01';
    if(validator.indexOf('ym')>=0 && !$chkType(value.trim(),'ym')) return '必须输入年月，如2010-01';
    if(validator.indexOf('email')>=0 && !$chkType(value.trim(),'email')) return '必须输入邮件地址，如abc@123.com';
    if(validator.indexOf('url')>=0 && !$chkType(value.trim(),'url')) return '必须输入网址，如http://www.123.com';
    return '';
}
/**
 * stop the event bubble to parent object
 * @param {Object} ev the event to be stopped
 */
function $stopBubble(ev){
    if(ev.stopPropagation) ev.stopPropagation();
    ev.cancelBubble = true;
}
/**
 * preview an image while uploading
 * @param {Object} fileInput - file control
 * @param {Object} imgShow - parent of the image control
 */
function $imgPreview(fileInput,imgShow){
    if (Browser.ie) {
        if (window.XMLHttpRequest) {
            imgShow.innerHTML = '';
            fileInput.select();
            imgShow.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = document.selection.createRange().text;
        } else {
            imgShow.getElementsByTagName("img")[0].src = fileInput.value;
        }
    } else if (fileInput.files) {
        var file = fileInput.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            imgShow.getElementsByTagName("img")[0].src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}
/**
 * dynamic shows the count of characters in a textarea or input
 * @param {Object} textControl the container to be counted
 * @param {Object} tipControl the control to show the count tip
 */
function $calcWord(textControl, tipControl, remainTotal){
    var ctrl = $(textControl);
    if (ctrl) {
        var tc = $(tipControl);
        if (tc) {
            tc.innerHTML = remainTotal ? (remainTotal - ctrl.value.length) : ctrl.value.length;
        }
        ctrl.addEvent('keyup', function(){
            if (tc) {
                tc.innerHTML = remainTotal ? (remainTotal - ctrl.value.length) : ctrl.value.length;
            }
        });
    }
}
/**
 * store values carried by checkboxes in the container, every checkbox should have two attributes:
 * id(format:chk_+the value to carry), value(the text to show)
 * @param {Object} container the container
 * @param {Object} textBox the control to show the checked text
 * @param {Object} valueBox the control to store the checked value
 */
function $storeValue(container, textBox, valueBox){
    if (!container) return; container = $(container);
    var ids = ""; var txts = "";
    var childs = container.getElementsByTagName("input");
    for (var i = 0; i < childs.length; i++) {
        if (childs[i].checked) {
            // id格式为chk_+id, 因此,前4个字符略过
            ids += childs[i].id.substring(4) + ","; txts += childs[i].value + "，";
        }
    }
    if (textBox) {
        textBox = $(textBox);
        if (textBox) {
            if (textBox.type == "text" || textBox.type == "hidden") textBox.value = txts;
            else textBox.innerHTML = txts.substring(0, txts.length - 1);
        }
    }
    if (valueBox) { valueBox = $(valueBox); if (valueBox) valueBox.value = ids; }
}
/**
 * show a container with several checkboxes, the check state of these checkboxes determined by the value of the textBox
 * @param {Object} container container to be shown
 * @param {Object} textBox the text box holding values to be checked
 * @param {Object} options extra options, the options are passed to {@link fshow}
 */
function $showInfoTable(container, textBox, options){
    container = $(container); var namestr = ''; if(!options) options = {};
    if (textBox) {
        textBox = $(textBox);
        if (textBox.type == "text" || textBox.type == "hidden") namestr = textBox.value;
        else namestr = textBox.innerHTML;
    }
    var names = namestr.split(",");
    // if has cn char, use cn char as spliter
    if(namestr.indexOf('，') > 0) names = namestr.split('，');
    var type = "checkbox";
    if (options && options.chkType) type = chkType;
    var childs = container.getElementsByTagName("input");
    for (var i = 0; i < childs.length; i++)  childs[i].checked = false;
    for (var i = 0; i < childs.length; i++) {
        if (childs[i].type == type) {
            for (var j = 0; j < names.length; j++) {
                if (names[j] == childs[i].value) childs[i].checked = true;
            }
        }
    }
    options.handle_class = 'title';
    if (Browser.ie) {
        var frm = new Element('iframe',{'class':'cover'});
        container.grab(frm);
    }
    container.fshow(options);
}
/**
 * check or uncheck all checkbox in the specific container, the check state determained by the check all input
 * @param {Object} parent container name or container object
 * @param {Object} chkall the check all input
 */
function $checkAll(parent, chkall){
    var childs = $(parent).getElementsByTagName("input");
    for (var i = 0; i < childs.length; i++) {
        if($chk2(childs[i].type) && childs[i].type=='checkbox')
            childs[i].checked = $(chkall).checked;
    }
}
/**
 * check one radio box in the container and uncheck the others
 * @param {Object} parent container name or container object
 * @param {Object} self the radio box to be checked
 */
function $selRadio(parent,self){
    var ptable = $(parent);
    var childs = ptable.getElementsByTagName("input");
    for (var i = 0; i < childs.length; i++) {
        if (childs[i] == self)  childs[i].checked = true;
        else childs[i].checked = false;
    }
}
/**
 * get the values of checked checkboxes in the container
 * @param {Object} parent container
 * @param {Object} chkall check all input
 * @returns {string} values splited by ,
 */
function $getCheckValues(parent, chkall){
    var ptable = $(parent); var ids = ""; chkall = $(chkall);
    var childs = ptable.getElementsByTagName("input");
    for (var i = 0; i < childs.length; i++) {
        if($chk2(chkall)){
            if (childs[i].checked && childs[i] != chkall)  ids += childs[i].value + ",";
        }else{
            if (childs[i].checked)  ids += childs[i].value + ",";
        }
    }
    return ids;
}
/**
 * get the values of checked checkboxes in the container
 * @param {Object} parent container
 * @param {Object} chkall check all input
 * @returns {list} values
 */
function $getChkVals(parent, chkall){
    var ptable = $(parent); var ids = []; chkall = $(chkall);
    var childs = ptable.getElementsByTagName("input");
    for (var i = 0; i < childs.length; i++) {
          if($chk2(chkall)){
        if (childs[i].checked && childs[i] != chkall)  ids.push(childs[i].value);
          }else{
        if (childs[i].checked)  ids.push(childs[i].value);
          }
    }
    return ids;
}
/**
 * close all MsgBox instances
 * @param {Object} target if specified, close the MsgBox instances in that frame, maybe 'top'|''
 */
function $closeAllMsg(target){
    var boxes = $$('.popup');
    if(target && target=='top') boxes = window.top.$$('div.popup');
    for (var i = 0; i < boxes.length; i++) {
        var iframes = $(boxes[i]).getElements('iframe');
        iframes.each(function(i){i.destroy();});
        boxes[i].destroy();
        // remove all shadows
        var shadows = $(document.body).getElements('div.gShadow');
        shadows.each(function(i){i.destroy()});
    }
}
function $enableButton(button,enable){
    var btn = $(button); if(!$chk2(btn)) return;
    var loadingText = '请稍候...';
    if(!enable){
        var formerText = '';
        if(btn.tagName.toLowerCase() == 'input') formerText = btn.value;
        else if(btn.tagName == 'a') formerText = btn.innerHTML;
        btn.set('former',formerText);
        btn.set('bkco',btn.style);
        //btn.set('bkco',btn.style.background);
        if(btn.tagName.toLowerCase() == 'input') btn.value = loadingText;
        else if(btn.tagName == 'a') btn.innerHTML = loadingText;
        btn.style.background = '#ccc';
        btn.disabled = true;
    }else{
        var formerText = btn.get('former'); if(!$chk2(formerText)) formerText = '确定';
        if(btn.tagName.toLowerCase() == 'input') btn.value = formerText;
        else if(btn.tagName == 'a') btn.innerHTML = formerText;
        //btn.setStyle('background',btn.get('bkco'));
        btn.set('style',btn.get('bkco'));
        btn.disabled = false;
    }
}

/**
 * format string, e.g. 'test{0}{1}'.format(var1,var2)
 */
String.prototype.format = function(){
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function(m,i){return args[i];});
}
/**
 * remove any character from string's start and end.
 */
if (!String.prototype.trim) {
    var pattern = /^\s+|\s+$/g;
    String.prototype.trim = function(){
        return this.replace(pattern, '');
    }
}
String.prototype.ltrim = function(char){
    if (!char) {
        char = " \t\n\r";
    }
    var space = new String(char);
    var str = new String(this);
    if (space.indexOf(str.charAt(0)) != -1) {
        var j = 0,i = str.length;
        while (j < i && space.indexOf(str.charAt(j)) != -1) {
            j++;
        }
        str = str.substring(j,i);
    }
    return str;
};
String.prototype.rtrim = function(char){
    if (!char) {
        char = " \t\n\r";
    }
    var space = new String(char);
    var str = new String(this);
    if (space.indexOf(str.charAt(str.length - 1)) != -1) {
        var i = str.length - 1;
        while (i >= 0 && space.indexOf(str.charAt(i)) != -1) {
            i--;
        }
        str = str.substring(0,i + 1);
    }
    return str;
};
String.html2text = function(str){
    // remove the first <p> and the last </p>
    str = str.trim(); if(!str) return "";
    if(str.indexOf('<p>') == 0) str = str.substring(3);
    if(str.indexOf('</p>') == str.length-4) str = str.substring(0,str.length-4);
    return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<\/p><p>/g, '\n');
}
String.text2html = function(str){
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\\n/g,"</p><p>");
}
/**
 * static method to format string, e.g. String.format('test{0}{1}',var1,var2)
 */
String.format = function(){
    if(arguments.length == 0) return null;
    var str = arguments[0];
    for(var i=1;i<arguments.length;i++) {
        var re = new RegExp('\\{' + (i-1) + '\\}','gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}
/**
 * convert a string to Date object
 */
String.toDate = function(){
    if(arguments.length == 0) return null;
    var str = arguments[0];
    if(!$chkType(str,'date') && !$chkType(str,'ym')) return null;
    var dt = new Date(); var times = Date.parse(str); dt.setTime(times);
    return dt;
}
/**
 * encode string using encodeURI
 * @param {Bool}encodeAll - true means encode all chars including special chars(like ;/?:@&=+$,#),
 *          false means encode chars except special chars, default is false
 */
String.encode = function(encodeAll){
    if(arguments.length == 0) return null;
    var str = arguments[0];
    if(encodeAll) return encodeURIComponent(str);
    return encodeURI(str);
}
/**
 * @ignore
 * @param {Object} obj
 * @param {Object} method
 */
function assocEvent(obj,method){
    return (function(e){ e = e || window.event; return obj[method](e,this); });
}
/**
 * @ignore
 * @param {Object} obj
 * @param {Object} method
 */
function assocMethod(obj,method){
    return (function(params){ return obj[method](params,this); });
}
/**
 * @ignore
 */
var DoBase64 = new Class({
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    /**
     * public method for encoding
     * @param {string} input input string
     */
    encode : function (input) {
        var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
        input = Base64._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++); chr2 = input.charCodeAt(i++); chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2; enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);  enc4 = chr3 & 63;
            if (isNaN(chr2)) enc3 = enc4 = 64;
            else if (isNaN(chr3)) enc4 = 64;
            output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }
        return output;
    },
    /**
     * public method for decoding
     * @param {Object} input input string
     */
    decode : function (input) {
        var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++)); enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++)); enc4 = this._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4); chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) output = output + String.fromCharCode(chr2);
            if (enc4 != 64) output = output + String.fromCharCode(chr3);
        }
        output = Base64._utf8_decode(output);
        return output;
    },
    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) { utftext += String.fromCharCode(c);}
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },
    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "", i = 0, c = 0, c1 = 0, c2 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) { string += String.fromCharCode(c); i++;}
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
});
/**
 * @class static instance to handle base64
 * @example Base64.encode('testdb');
 * @example Base64.decode('UIJFJEWFW/');
 */
var Base64 = new DoBase64();
/**
 * @class extend Element of mootools, add some methods
 */
Element.implement({
    /**
     * show a loading text or image hovering over this element
     * @param {Object} imgUrl url or the image to show
     */
    loading: function(options){
        if (this._loadBox) return;
        if (this.style.display == 'none') {
            var coord = window.getCoordinates();
        } else {
            var coord = this.getCoordinates();
        }
        this._loadBox = new Element('div', {
            'class': 'loadBox',
            style: 'z-index:65534;position:absolute;'
        });
        this._text = new Element('p');
        if ($defined(options)) {
            if (options.image) {
                var img = new Element('img');
                this._loadBox.adopt(img);
                img.src = options.image;
            }
            this._text.innerHTML = options.text || 'Loading...';
        }
        this._loadBox.adopt(this._text);
        document.body.appendChild(this._loadBox);
        var selfSize = this._loadBox.getCoordinates();
        var left = (coord.width - selfSize.width) / 2 + window.getScroll().x;
        var top = (coord.height - selfSize.height) / 2 + window.getScroll().y;
        this._loadBox.setStyles({
            'left': left,
            'top': top
        });
        if (window.event) window.event.returnValue = false;
    },
    /**
     * remove the loading box
     */
    loaded: function(){
        if (this._loadBox) { this._loadBox.close(); this._loadBox = null; }
    },
    /**
     * get html via an url and fill this element, when loading html, show loading text or image
     * @param {Object} url the url to be loaded
     */
    loadUrl: function(url, onLoaded, options){
        if (options) {
            this.loading(options);
        } else {
            this.loading({text:'载入中...'});
        }
        var self = this;
        new echoAjax({url:url,method:'get', type:'html', onSuccess:function(tree,elements,html,js){
            self.innerHTML = html; self.loaded();
            if(onLoaded) onLoaded();
            },onFailure: function(){}
        }).fire();
        if(window.event) window.event.returnValue = false;
    },
    /**
     *  load an image background and show it when loading completed
     * @param {Object} imgurl
     * @param {Object} loadingImage
     */
    loadImg: function(imgurl,loadingImage){
        if($chk2(loadingImage)) this.loading({image: loadingImage});
        else this.loading();
        var self = this;
        var tmp = new Element('img');
        tmp.addEvent('load',function(){ self.src = imgurl; this.destroy(); self.loaded(); });
        tmp.addEvent('error',function(){ this.destroy(); self.loaded(); });
        tmp.src = imgurl;
        if(window.event) window.event.returnValue = false;
    },
    /**
     * set absolute position in the window, no matter the page scrolled or not
     * @param {Object} obj position object, format {x:0,y:0}
     */
    setWinPosition: function(obj){
        var wSize = window.getScroll();
        var selfSize = this.getSize();
        var parentPos = {x:0,y:0};
        var parent = this.getOffsetParent();
        while($chk2(parent)) {
            parentPos.x += parent.offsetLeft; parentPos.y += parent.offsetTop; parent = parent.getOffsetParent();
        }
        this.style.top = obj.y + wSize.y + 'px';
        this.style.left = obj.x + wSize.x + 'px';
    },
    /**
     * get the content rect of this element, removing all padding and margin
     * @param {Object} parentList as an invisible element has no size in IE,
     *      so if the element is invisible, we must make it visible manually and then hide it,
     *      this parameter gives the parents to force to be show to make this element visible
     * @returns {x:width,y:height}
     */
    getTSize: function(parentList){
        var sz = this.getSize(); var displayList = new Array();
        if($chk2(parentList)){
            for(var i=0;i<parentList.length;i++){
                var parent = parentList[i]; if($chk2(parent)) parent = $(parent);
                if($chk2(parent)){
                    var display = parent.style.display; if(!$chk2(display)) display = ''; if(display == 'none') parent.show();
                    displayList[i] = display;
                }
            }
        }
        var selfdisplay = this.style.display; if(!$chk2(selfdisplay)) selfdisplay = '';
        if(selfdisplay == 'none'){this.show(); sz = this.getSize(); this.setStyle('display',selfdisplay); }
        else sz = this.getSize();
        if($chk2(parentList)){
            for(var i=0;i<parentList.length;i++){
                var parent = parentList[i]; if($chk2(parent)) parent = $(parent);
                if($chk2(parent) && displayList[i] != '') parent.style.display = displayList[i];
            }
        }
        var border = {  left:this.getStyle('border-left-width').toInt(), right:this.getStyle('border-right-width').toInt(),
                        top:this.getStyle('border-top-width').toInt(), bottom:this.getStyle('border-bottom-width').toInt()
                    };
        var padding = { left:this.getStyle('padding-left').toInt(), right:this.getStyle('padding-right').toInt(),
                        top:this.getStyle('padding-top').toInt(), bottom:this.getStyle('padding-bottom').toInt()
                    };
        sz.x = sz.x - border.left - border.right - padding.left - padding.right;
        sz.y = sz.y - border.top - border.bottom - padding.top - padding.bottom;
        return sz;
    },
    /**
     * if point in this element
     * @param {Object} point {x,y}
     */
    hasPoint: function(point){
        var selfCoord = this.getCoordinates();
        return selfCoord.top<=point.y && selfCoord.bottom>=point.y && selfCoord.left<=point.x && selfCoord.right>=point.x;
    },
    /**
     * create a shadow cover all the page
     */
    createShadow: function(){
        var shadow = new Element('div',{'class':'gShadow',style:'z-index:65520;background:#000;filter:alpha(opacity=30);opacity:0.3;width:100%;height:100%;'});
        shadow.setStyle('position','fixed'); shadow.setStyle('left',0); shadow.setStyle('top',0);
        if (Browser.ie) {
            var winSize = window.getScrollSize();
            shadow.setStyle('position','absolute');
            shadow.setStyle('width',winSize.x); shadow.setStyle('height',winSize.y);
            var frm = new Element('iframe', {'class': 'cover'});
            frm.setStyles({ 'width':winSize.x, 'height':winSize.y });
            shadow.grab(frm);
        }
        shadow.setStyle('display','none');
        $(document.body).appendChild(shadow); shadow.setStyle('display',''); this.shadow = shadow;
    },
    /**
     * make this element stick to another element
     * @param options parameter object to specify how to stick
     *  <p><b>relativeTo:</b> the object or its name which this element to be sticked to, default is the body element</p
     *  <p><b>position:</b> the parameter of mootools Element.Position</p
     *  <p><b>edge:</b> the parameter of mootools Element.Position</p
     *  <p><b>offset:</b> the {x,y} offset from the relativeTo object</p
     *  <p><b>modal:</b> if true, create shadow to cover the page, default is false; if true, must use tHide() to hide this element</p
     *  <p><b>allowOutWindow:</b> if true, this element can be out of the window, default is false</p
     */
    stick: function(options){
        var pos = 'bottomleft'; var edge = 'topleft'; var rel = document.body;
        // if need shadow, do shadow
        if(options && options.modal && !$chk2(this.shadow)) this.createShadow();
        if(options && options.position) pos = options.position;
        if(options && options.edge) edge = options.edge;
        if(options && options.relativeTo) rel = options.relativeTo;
        else if(options && options.event) rel = options.event.target || options.event.srcElement;
        if (rel == document.body) { pos = 'center'; edge = 'center'; }
        this.position({position:pos,edge:edge,relativeTo:rel});
        this.show();
        if(options && options.offset){
            if(options.offset.x) this.style.left = this.getStyle('left').toInt() + options.offset.x + 'px';
            if(options.offset.y) this.style.top = this.getStyle('top').toInt() + options.offset.y + 'px';
        }
        if (!options || !options.allowOutWindow) {
            // see if out of screen, if out, move it in the window
            var winscroll = window.getScroll(); var winsize = window.getSize(); var dim = this.getCoordinates();
            var pos = { x: dim.left, y: dim.top }; var chg_pos = false;
            if (dim.left < 0) { pos.x = 0; chg_pos = true; }
            else if (dim.width < winsize.x && dim.right > winscroll.x + winsize.x) {
                    pos.x = winscroll.x + winsize.x - dim.width; chg_pos = true;
            }
            if(dim.top < 0){ pos.y = 0; chg_pos = true; }
            else if (dim.height < winsize.y && dim.bottom > winscroll.y + winsize.y) {
                // make sure the title bar in the window
                if (winsize.y > dim.height) pos.y = winscroll.y + winsize.y - dim.height;
                chg_pos = true;
            }
            if (chg_pos) this.setStyles({left:pos.x,top:pos.y});
        }
        if (Browser.ie) {
            var frm = new Element('iframe',{'class':'cover'});
            this.setStyle('overflow','hidden');
            this.grab(frm);
        }
    },
    /**
     * show this element and make it can be moved
     * @param options parameters to config
     *  <p><b>handle - the control to be dragged to move this element</p>
     *  <p>all the other parameters in options is passed to stick method {@link stick}</p>
     */
    fshow: function(options){
        if(!options) options = {};
        var handle = null;
        if(options.handle) handle = options.handle;
        else if(options.handle_class) handle = this.getElement('.' + options.handle_class);
        else handle = this.getElement('.title');
        var rel = document.body;
        if(options.relativeTo) rel = options.relativeTo;
        if(options.event) rel = options.event.target || options.event.srcElement;
        // check if is child of body, if not, move to body
        var parent = this.getParent();
        if(!$ifBody(parent)) $(document.body).grab(this);
        options.relativeTo = rel;
        this.stick(options);
        if($chk2(handle)) var dragg = new Draggable({handle:handle,container:this});
    },
    /**
     * close the shadow and this element
     */
    close: function(){
        // remove shadow
        if($chk2(this.shadow)) {
            this.shadow.destroy();
            this.shadow = null;
            try {
                delete this.shadow;
            } catch(e) {}
        }
        this.destroy();
        try {
            delete this;
        } catch(e) {}
    },
    /**
     * close the shadow and hide this element
     */
    tHide: function(){
        if($chk2(this.shadow)) {
            this.shadow.destroy();
            this.shadow = null;
            try {
                delete this.shadow;
            } catch(e) {}
        }
        this.hide();
    }
});
/**
 * @ignore
 */
var EnvGetter = new Class({
    Browser:{name:'unknown',version:'unknown',fullname:'unknown',screenSize:'unknown'},
    OS:{name:'unknown'},
    _browserLib:[{name:'Tencent Traveler',key:'TencentTraveler',vkey:'TencentTraveler'},
                {name:'Netscape',key:'Netscape',vkey:'Netscape'},{name:'Chrome',key:'Chrome',vkey:'Chrome\/'},
                {name:'MSIE',key:'MSIE',vkey:'MSIE'},{name:'Firefox',key:'Firefox',vkey:'Firefox\/'},
                {name:'Opera',key:'Opera',vkey:'Version\/'},{name:'Safari',key:'Safari',vkey:'Version\/'}
                ],
    _osLib:[{name:'Windows CE',key:'Windows CE'}, {name:'blackberry',key:'blackberry'},
            {name:'android',key:'android'},
            {name:'iPad',key:'iPad'},{name:'iPod',key:'iPod'},{name:'iPhone',key:'iPhone'},
            {name:'palm',key:'palm'},{name:'Windows 98',key:'Windows 98'},
            {name:'Windows NT4.0',key:'Windows NT 4.0'}, {name:'Windows 2000',key:'Windows NT 5.0'},
            {name:'Windows XP',key:'Windows NT 5.1'}, {name:'Windows 2003',key:'Windows NT 5.2'},
            {name:'Windows Vista',key:'Windows NT 6.0'},{name:'Windows 7',key:'Windows NT 6.1'},
            {name:'Ubuntu',key:'Ubuntu'},{name:'Linux',key:'Linux'}, {name:'Mac',key:'Mac'}
            ],
    initialize: function(){
        var agent = navigator.userAgent.toLowerCase();
        this.getBrowser(agent);
        this.getOS(agent);
    },
    getBrowser: function(agent){
        for(var i=0;i<this._browserLib.length;i++){
            var item = this._browserLib[i];
            if(agent.indexOf(item.key.toLowerCase())>=0){
                this.Browser.name = item.name;
                // got browser, getting version now
                var re = new RegExp(String.format('.*{0}\\W*([.\\w]+)\\W*.*',item.vkey),'i');
                var version = agent.replace(re,'$1');
                if($chk2(version)) this.Browser.version = version;
                break;
            }
        }
        if(this.Browser.version != 'unknown') this.Browser.fullname = this.Browser.name + this.Browser.version;
        this.Browser.screenSize = String.format('{0}*{1}',window.screen.width,window.screen.height);
    },
    getOS: function(agent){
        for(var i=0;i<this._osLib.length;i++){
            var item = this._osLib[i];
            if(agent.indexOf(item.key.toLowerCase())>=0){
                this.OS.name = item.name; break;
            }
        }
    },
    ifIPad: function(){
        return (this.OS.name == 'iPad' || this.OS.name == 'iPod' || this.OS.name == 'iPhone')
    }
});
/**
 * @class detect browser and operation system
 * @property {Object} Browser {name:'firefox',version:'3.6.3',screenSize:'1024*768'}
 * @property {Object} OS {name:'WindowsXp'}
 */
var Env = new EnvGetter();
/**
 * @class make an object be draggable
 * @param {Object} options
 * <p><b>handle: </b>the control to be dragged to move the container</p>
 * <p><b>container: </b>the control to be moved</p>
 * @example new Draggable({handle:someControl,container:anotherControl});
 */
var Draggable = new Class({
    _options: null, _container: null, _handle: null,
    initialize: function(options){
        this._options = options;
        if(!options.handle) return null;
        this._handle = $(options.handle);
        if(options.container) this._container = $(options.container);
        else if(options.containerCssClass)
            this._container = this.findParent(this._handle,options.containerCssClass);
        if(!this._handle || !this._container) return null;
        this._container.setStyles({'position':'absolute','z-index':'65533'});
        this._handle.onmousedown = assocEvent(this,'doDrag');
    },
    findParent: function(ele,cssClass){
        while(ele && !$(ele).hasClass(cssClass)){
            ele = ele.parentNode;
        }
        if($(ele).hasClass(cssClass)) return ele;
        else return null;
    },
    drag: function(event,handle,container){
        var ev = event || window.event || arguments[0];
        var e = new Event(ev);
        var containerSize = container.getCoordinates();
        var offsetx = e.page.x - containerSize.left;
        var offsety = e.page.y - containerSize.top;
        var doc = document;
        doc.addEvent('mousemove',function(e){
            var newx = e.page.x - offsetx; var newy = e.page.y - offsety;
            $(container).setStyles({left:newx,top:newy});
        });
        doc.addEvent('mouseup',function(){
            doc.removeEvents('mousemove'); doc.removeEvents('mouseup');
        });
    },
    doDrag: function(event,ele){this.drag(event,this._handle,this._container);}
});
/**
 * @class Create a moveable message box, the box can container some controls,too
 * @param {Object} options parameters to make the msgbox
 * <p><b>title: </b>title of the box</p>
 * <p><b>removeTitle</b>if removeTitle is true,the box has't title</p>
 * <p><b>message: </b>show message </p>
 * <p><b>cssClass: </b>cssClass of the whole box</p>
 * <p><b>sectClass: </b>cssClass of the content box</p>
 * <p><b>style: </b>style text attached to the box</p>
 * <p><b>autoSize: </b>if autoSize is true, the box will set minWidth(initial=360) and minHeight(initial=100) to 0</p>
 * <p><b>buttons：</b>buttons to be added to the box[{text:'',action:somefunction,cssClass:''}...],
 *  action can be 'close'(build-in function, means close the box)</p>
 * <p><b>centerBtn: </b>if centerBtn is true,center the buttons on the box</p>
 * <p><b>delay: </b>close the box how many milliseconds later</p>
 * <p><b>outClose: </b>if true, the box close when click outside the box, default is false</p>
 * @property close close the box
 * @property smartClose close the box using a fadding effect
 * @property refresh refresh the box size and position
 * @property refreshSize only refresh the box size
 * @property appendElement append an element to the content box
 * @property loadPage load a page through ajax
 * @property getElement get the box element
 * @property appendButton append a button to the box
 * <p><b>{Object} btnOption</b></p>
 * <p>format:{text:'',cssClass:'',action:somefunction},
 * action can be 'close'(build-in function, means close the box)</p>
 * @example new MsgBox({title:'test',message:'msg',buttons:[{text:'close',action:'close'},{text:'test',action:function(){...}}],cssClass:'spec',autoSize:true,modal:true,centerBtn:true});
 */
var MsgBox = new Class({
    _minWidth:360, _minHeight:100,
    _options:{},_container: null, _handle: null, _onClose:function(){}, _overrideClose:null,_removeTitle:false,
    _title: '信息提示', _message: '', _msgboxClass: 'popup', _sectClass:'',
    _style:'', _btnConfigs:[], _buttons:[], _button_box:null, _inner_box:null,
    _content_box:null, _shadow_box:null,
    initialize: function(options){
        if(!options) options = {};
        this._options = options;
        if(options.removeTitle) this._removeTitle = options.removeTitle;
        if(options.title) this._title = options.title;
        if(options.onClose) this._onClose = options.onClose;
        if(options.overrideClose) this._overrideClose = options.overrideClose;
        if(options.message) this._message = options.message;
        if(options.cssClass) this._msgboxClass = options.cssClass;
        if(options.sectClass) this._sectClass = options.sectClass;
        if(options.style) this._style = options.style;
        if(!options.buttons) {
            this._btnConfigs = [{text:'关闭',action:'close'}];
        } else {
            this._btnConfigs = options.buttons;
        }
        if(options.centerBtn) {
            this._centerBtn = true;
        }
        if($defined(options.autoSize)){ this._minWidth = 0; this._minHeight = 0; }
        else{
            if($defined(options.minWidth)) this._minWidth = options.minWidth;
            if($defined(options.minHeight)) this._minHeight = options.minHeight;
        }
        this.createBox();
        if (options.delay)  this.smartClose.delay(options.delay,this);
        if(options.outClose) {
            var self = this;
            document.addEvent('click',function(){ self.close(); });
            this._container.addEvent('click',function(event){ $stopBubble(event); });
        }
    },
    /**
     * @ignore
     */
    createBox: function(){
        var self = this;
        var container  = new Element('div',{'class':'popup',style:this._style});
        container.addClass(this._msgboxClass);
        this._container  = container;
        var inner_box = new Element('div',{'class':'sect'});
        var title_bar = new Element('h2',{style:'zoom:1;'});
        this._handle = new Element('span',{'class':'move title'});
        this._handle.appendText(this._title);
        var close_box = new Element('span',{'class':'extra'});
        var link_a = new Element('a',{'href':'javascript:;','class':'btnClose'});
        link_a.addEvent('click',function(){ self.close(); });
        link_a.appendText('X');
        close_box.appendChild(link_a);
        title_bar.grab(this._handle); title_bar.grab(close_box);
        var sectcontent_box = new Element('div',{'class':'sectContent'});
        if($chk2(this._sectClass)) sectcontent_box.addClass(this._sectClass);
        this._content_box = new Element('div',{'class':'newContent'});
        if(this._options.autoScroll) this._content_box.setStyle('overflow','auto');
        if(this._message != ''){
            var text_box = new Element('div',{'class':'textBox'});
            text_box.innerHTML = this._message;
            this._content_box.grab(text_box);
        }
        var btn_box = new Element('div',{'class':'sectBtn'});
        if (this._centerBtn) {
            btn_box.addClass('setCenter');
        }
        this._button_box = btn_box;
        sectcontent_box.grab(this._content_box);
        // buttons
        if(this._btnConfigs){ for(var i=0;i<this._btnConfigs.length;i++) this.appendButton(this._btnConfigs[i]); }
        sectcontent_box.grab(btn_box);
        if(!this._removeTitle) inner_box.grab(title_bar);
        inner_box.grab(sectcontent_box);
        this._inner_box = inner_box;
        this._container.grab(inner_box);
        this._container.style.display = "none";

        $(document.body).appendChild(this._container);

        if (this._message != '') {
            var sz = this._container.getTSize();
            // set minHeight and minWidth
            var contSz = this._content_box.getTSize([this._container]);
            if (this._minWidth > 0 && contSz.x < this._minWidth) {
                this._container.setStyle('width', sz.x + this._minWidth - contSz.x);
                this._content_box.setStyle('width', this._minWidth);
            }
            if (this._minHeight > 0 && contSz.y < this._minHeight) {
                this._container.setStyle('height', sz.y + this._minHeight - contSz.y);
                this._content_box.setStyle('height', this._minHeight);
            }
        }
        // show after resize
        this._container.fshow($merge(this._options,{handle:this._handle}));
    },
    refresh: function(refreshSize){
        if(refreshSize) this.refreshSize();
        this._container.fshow($merge(this._options,{handle:this._handle}));
    },
    refreshSize: function(options){
        var defaults = {width:true,height:true};
        defaults = $merge(defaults,options);
        // refresh size
        var coord_in = this._inner_box.getCoordinates();
        var coord_out = this._container.getCoordinates();
        if(defaults.width)
            if(coord_in.width  > coord_out.width) this._container.setStyle('width',coord_in.width+10);
        if(defaults.height)
            if(coord_in.height > coord_out.height) this._container.setStyle('height',coord_in.height+10);
    },
    setOnClose: function(onclose){
        this._onClose = onclose;
    },
    /**
     * close the box
     */
    close: function(){
        if($chk2(this._overrideClose)) { this._overrideClose(); return; }
        this._onClose();
        this._container.close();
    },
    /**
     * close the box using a fadding effect
     */
    smartClose: function(){
        var self = this;
        var mfx = new Fx.Morph(self._container,{duration:1000,onComplete:function(){ self.close(); }});
        mfx.start({opacity:[1,0]});
    },
    /**
     * append a button to the box
     * @param {Object} btnOption format:{text:'',action:somefunction},
     * action can be 'close'(build-in function, means close the box)
     */
    appendButton: function(btnOption){
        if(!btnOption.text) return;
        if (this._buttons.length > 0) {
            var span = new Element('span'); span.appendText(' ');
            this._button_box.grab(span);
        }
        var self = this; var button;
        if(btnOption.type && btnOption.type != ''){
            if(btnOption.type == 'button') button = new Element('button',{'class':'button'});
            else if(btnOption.type == 'link') button = new Element('a',{href:'javascript:;'});
            else button = new Element('button',{'class':'button'});
        }else{ button = new Element('button',{'class':'button'}); }
        button.appendText(btnOption.text);
        if(btnOption.action == 'close') button.addEvent('click',function(){ self.close(); });
        else{
            if($type(btnOption.action) == 'function')
                button.addEvent('click',function(){ (btnOption.action)(); });
        }
        if(btnOption.cssClass) {
            button.addClass(btnOption.cssClass);
        }
        this._buttons[this._buttons.length] = button;
        this._button_box.grab(button);
    },
    appendElement: function(elem){
        if(!$chk2(elem)) return;
        if($type(elem) != 'element') return;
        this._content_box.grab(elem);
        this.refresh();
    },
    getContentSize: function(){
        return this._content_box.getTSize();
    },
    centerText: function(text){
        var size = this.getContentSize();
        // treat one char as 15px by default
        var padding_topdown = (size.y - 15)/8;
        var padding_leftright = size.x/8;
        var div = new Element('div',{style:String.format('padding:{0}px {1}px;',padding_topdown,padding_leftright)});
        div.setStyle('text-align','center');
        div.innerHTML = text;
        this._content_box.empty();
        this.appendElement(div);
    },
    setHtml: function(html){
        this._content_box.innerHTML = html;
    },
    loadPage: function(url,loadedfunc,fixedSize){
        var self = this;
        this._content_box.loading({text:'载入中...'});
        new echoAjax({url:url,params:'',method:'get', type:'html',
            onSuccess:function(tree,elements,html,js){
                self._content_box.innerHTML = html;
                self._content_box.loaded();
                if(!$chk2(fixedSize))self.refreshSize();
                Browser.exec(js);
                if(loadedfunc) loadedfunc();
            },
            onFailure:function(){
                self._content_box.innerHTML = '获取信息出错';
                self._content_box.loaded();
            }}).fire();
    },
    getElement: function(){
        return this._container;
    },
    addEvtHandler: function(evtString, evtFunc){
        if(evtString == 'close'){
            this._onClose = evtFunc;
        }
    }
});
/**
 * @class create a moveable confirm box
 * @param {Object} options
 * <p><b>message: </b>the confirm message</p>
 * <p><b>action: </b>: function to do when clicking the confirm button</p>
 *  @property close close the box
 */
var ConfirmBox = new Class({
    _message:'', _action:null, _box:null,
    initialize: function(options){
        this._message = options.message || '';
        var self = this;
        this._action = function(){ (options.action || $empty)(); self.close(); };
        this._title = options.title || '确认提示';
        var box_options = {
            message:this._message, title:this._title, modal:true,
            buttons:[{text:'确定',action:this._action},{text:'取消',action:'close'}]
        };
        this._box = new MsgBox($merge(options,box_options));
    },
    /**
     * close the confirm box
     */
    close: function(){ if(this._box != null) this._box.close(); }
});
/**
 * @class create a moveable prompt box
 * @param {Object} options
 * <p><b>title: </b>the confirm message</p>
 * <p><b>action: </b>function to do when clicking the ok button</p>
 * <p><b>controls: </b>controls to be added to the box,
 * format:[type:'select|checkGroup|radioGroup|text|textarea|',title:'',id:'',valid:'',{tip}:'',{cssClass}:'',{items}:[text:'',value:'']],
 * the parameters in {}means optional</p>
 *  @property close close the box
 *  @property getControl get control by id
 */
var PromptBox = new Class({
    _title:'输入提示', _controlConfigs:[], _controls:[], _action:null, _box:null,
    initialize: function(options){
        if(options.controls) this._controlConfigs = options.controls;
        if(options.title) this._title = options.title;
        var self = this;
        if(!options.action) this._action = function(){ self.close(); };
        else this._action = function(){
            var result = self.getResult(); if(result == null) return;
            (options.action)(result); self.close();
        };
        var container = this.createControls();
        var box_options = {
            title:this._title, cssClass:'gForm',
            buttons:[{text:'确定',action:this._action},{text:'取消',action:'close'}]
        };
        this._box = new MsgBox($merge(options,box_options));
        this._box.appendElement(container);
    },
    /**
     * testdb
     * @type null
     */
    createControls: function(){
        var container = new Element('div',{'class':'newContainer'}); var self = this;
        this._controlConfigs.each(function(item,index){
            container.grab(self.createField(item));
        });
        return container;
    },
    createField: function(itemConfig){
        // create row div
        var row = new Element('div',{'class':'row'});
        var col = new Element('div',{'class':'col'});
        if(itemConfig.title){
            var label = new Element('label'); label.appendText(itemConfig.title); row.grab(label);
        }
        var control = null;
        if(itemConfig.type == 'select'){
            control = new Element('select');
            if(itemConfig.items){
                itemConfig.items.each(function(item){
                    var opt = new Element('option');
                    opt.text = item.text; opt.value = item.value;
                    try{ control.add(opt,null); }catch(ex){ control.add(opt); }
                    if(item.selected) opt.set('selected','true');
                });
            }
        }else if(itemConfig.type == 'checkGroup'){
            control = new Element('div');
            if(itemConfig.items){
                itemConfig.items.each(function(item){
                    var opt = new Element('input',{'type':'checkbox','value':item.value});
                    if(item.checked) opt.set('checked','true');
                    control.grab(opt); control.appendText(item.text);
                });
            }
        }else if(itemConfig.type == 'radioGroup'){
            control = new Element('select');
            if(itemConfig.items){
                itemConfig.items.each(function(item){
                    var opt = new Element('input',{'type':'radio','value':item.value});
                    if(item.checked) opt.set('checked','true');
                    opt.addEvent('click',function(){$selRadio(control,this);});
                    control.grab(opt); control.appendText(item.text);
                });
            }
        }else if(itemConfig.type == 'text'){
            control = new Element('input',{'type':'text','class':'inputbox'});
        }else if(itemConfig.type == 'textarea'){
            control = new Element('textarea',{'rows':5});
        }else{
            control = new Element('input');
        }
        control.set('etype',itemConfig.type);
        if(itemConfig.title) control.set('label',itemConfig.title);
        if(itemConfig.id) control.set('eid',itemConfig.id);
        if(itemConfig.valid) control.set('evalid',itemConfig.valid);
        if($chk2(itemConfig.value)) control.set('value',itemConfig.value);
        if(itemConfig.cssClass) control.addClass(itemConfig.cssClass);
        // itemConfig.evt "onclick|new DatePicker({relativeTo:this, event:event})"
        if(itemConfig.evt){
            evt = itemConfig.evt.split('|')[0];
            func = itemConfig.evt.split('|')[1];
            control.set(evt, func);
        }
        col.grab(control);
        if(itemConfig.tip){
            var tip = new Element('span',{'style':'margin-left:1em;','class':'alert'});
            tip.appendText(itemConfig.tip);
            col.grab(tip);
        }
        row.grab(col);
        this._controls[this._controls.length] = control;
        return row;
    },
    getControl: function(id){
        for(var i=0;i<this._controls.length;i++){
            var item = this._controls[i];
            if(item.get('eid')==id) return item;
        }
    },
    getResult: function(){
        var result = new Object();
        for(var i=0;i<this._controls.length;i++){
            var item = this._controls[i];
            var id = item.get('eid');
            if(!$chk2(id)) return;
            var type = item.get('etype');
            if(type == 'checkGroup'){
                result[id] = $getCheckValues(item); var valid = item.get('evalid');
                if($chk2(valid) && valid.indexOf('required')>=0){
                    // only check required
                    if(!new RegExp("[^,]").test(result[id])){
                        var name = item.get('label');
                        new TipBox({relativeTo:item,content:name+'必须选择至少一项',direction:'right'}); return null;
                    }
                }
            }else if(type == 'radioGroup'){
                result[id] = $getCheckValues(item); var valid = item.get('evalid');
                if($chk2(valid) && valid.indexOf('required')>=0){
                    // only check required
                    if(!new RegExp("[^,]").test(result[id])){
                        var name = item.get('label');
                        new TipBox({relativeTo:item,content:name+'必须选择',direction:'right'}); return null;
                    }
                }
            }else{
                result[id] = item.get('value'); var valid = item.get('evalid');
                if($chk2(valid)){
                    var value = item.get('value'); var res = $ifValid(value,valid);
                    if(res != ''){
                        var name = item.get('label')||'';
                        new TipBox({relativeTo:item,content:name+res,direction:'right'}); return null;
                    }
                }
            }
        }
        return result;
    },
    close: function(){ if(this._box != null) this._box.close(); }
});
/**
 * @class create a log container
 * @property log write log to log container
 * @property debug.. debug/info/warn/error
 */
var Logger = new Class({
    _container: null, _handle: null, _contentDiv: null, _class: 'popup logger',
    _types:[{'text':'debug','trim':'D'},{'text':'info','trim':'I'},{'text':'warn','trim':'W'},{'text':'error','trim':'E'}],
    _style:'background:#fff;border:1px solid #ccc;',
    initialize: function(){
    },
    doInit: function(){
        var container = this.createBox();
        window.addEvent('scroll',function(){
            var wSize = window.getSize(); var selfSize = container.getSize();
            container.setWinPosition({ x: wSize.x - selfSize.x - 50, y: 50 });
        });
    },
    createBox: function(){
        this._container = new Element('div',{'class':this._class,style:this._style});
        var self = this;
        var title_bar = new Element('h2',{style:'zoom:1;overflow:hidden;padding:3px 6px;border-bottom:solid 1px #ccc;font-size:14px;'});
        this._handle = new Element('span',{style:'margin:4px;float:left;width:70%;cursor:move;'});
        this._handle.appendText('Echo Log'); title_bar.grab(this._handle);
        var extra_box = new Element('span',{'class':'extra',style:'float:right;width:26%;margin-top:3px;cursor:pointer;'});

        this._types.each(function(item){
            var log_box = new Element('span',{'class':item.text,'etype':item.text,'title':'切换'+item.text+'信息'});
            log_box.appendText(item.trim); log_box.addEvent('click',function(){self.toggle(this);});
            extra_box.grab(log_box);
        });
        var hide_box = new Element('span',{'class':'hide','title':'最小化'});hide_box.appendText('-');
        hide_box.addEvent('click',function(){self._container.hide();});
        extra_box.grab(hide_box);
        var close_box = new Element('span', {'class': 'close','title':'关闭'});close_box.appendText('X');
        close_box.addEvent('click',function(){ var cont = self._container; self._container = null; cont.close();});
        extra_box.grab(close_box);

        title_bar.grab(extra_box);

        this._contentDiv = new Element('div',{style:'clear:both;margin:1em;overflow-y:scroll;height:200px;'});
        this._contentDiv.empty();
        this._container.grab(title_bar);
        this._container.grab(this._contentDiv);
        this._container.style.display = "none";

        this._container.setStyle('z-index','65535');
        $(window.top.document.body).appendChild(this._container);
        this._container.fshow({handle:this._handle});
        return this._container;
    },
    buidMsg: function(type,msg){
        var dt = new Date();
        var dtstr = String.format('{0}:{1}:{2}:{3}',dt.getHours()>10?dt.getHours():'0'+dt.getHours(),dt.getMinutes()>10?dt.getMinutes():'0'+dt.getMinutes(),
            dt.getSeconds()>10?dt.getSeconds():'0'+dt.getSeconds(),dt.getMilliseconds());
        return String.format("<p class='{0}'><strong>{1}</strong>: {2}</p>",type, dtstr, msg);
    },
    addLog: function(type,args){
        if(!$chk2(this._container)) this.doInit();
        if(this._container.style.display=='none') this._container.show();
        var msg = '';
        if(args.length == 0) msg = '';
        else{
            msg = args[0];
            for(var i=1;i<args.length;i++) {var re = new RegExp('\\{' + (i-1) + '\\}','gm'); msg = msg.replace(re, args[i]); }
        }
        // show box
        if (this._container.style.display != 'block') {
            this._container.style.display = "block";
            var wSize = window.getSize(); var selfSize = this._container.getSize();
            this._container.setWinPosition({ x: wSize.x - selfSize.x - 50, y: 50 });
        }
        this._contentDiv.innerHTML += this.buidMsg(type,msg);
        var scSize = this._contentDiv.getScrollSize(); this._contentDiv.scrollTo(scSize.x, scSize.y);
    },
    toggle: function(obj){
        var type = obj.get('etype'); var self = this;
        if(obj.hasClass('disable')){ obj.removeClass('disable'); this._contentDiv.getElements('.'+type).each(function(item){item.style.display = '';});  }
        else{ obj.addClass('disable'); this._contentDiv.getElements('.'+type).each(function(item){item.style.display = 'none';}); }
    },
    log: function(){ var args = arguments || []; this.addLog('info',args); },
    debug: function(){ var args = arguments || []; this.addLog('debug',args); },
    info: function(){ var args = arguments || []; this.addLog('info',args); },
    warn: function(){ var args = arguments || []; this.addLog('warn',args); },
    error: function(){ var args = arguments || []; this.addLog('error',args); }
});
var log = new Logger();
/**
 * @class handle AJAX in an specific way, return result from server need {result:true|false,message:''}
 * @param options options parameters
 * <p><b>url: </b>the request url</p>
 * <p><b>params: </b>the request parameters</p>
 * <p><b>message: </b>if success, show message.success, if failed, show message.failure, if not defined, show default message</p>
 * <p><b>target: </b>if success, fill target with result.message</p>
 * <p><b>redirect: </b>if success, redirect to this parameter</p>
 * <p><b>redirectFromServer: </b>if success, redirect to result.message from server</p>
 * <p><b>reLoad: </b>if success, reload current page</p>
 * @property fire do this AJAX request
 * @example new echoAjax({url:'/abc/',message:{success:'done'}}).fire();
 */
var echoAjax = new Class({
    _options: {}, _url: '', _params: '', _method:'POST', _type: 'json',
    initialize: function(options){
        this._options = options;
        if(options){
            if(options.type && $type(options.type) == 'string'){
                var type = options.type.toLowerCase(); this._type = type;
                switch(options.type){
                    case 'json': this._onSuccess = this.jsonSuccess; break;
                    case 'html': this._onSuccess = this.htmlSuccess; break;
                    default: this._onSuccess = this.jsonSuccess; break;
                }
            }
        }
        if(options.url) this._url = options.url;
        if(options.method) this._method = options.method;
        if(options.type && $type(options.type) == 'string') this._type = options.type.toLowerCase();
        if(options.params) this._params = options.params;
    },
    fire: function(){
        var this_obj = this;
        if(this._type == 'json'){
            new Request.JSON({
                url: this._url, data: this._params, method:this._method,
                onSuccess: function(response){
                    this_obj.jsonSuccess(response);
                }, onFailure: function(response){
                    this_obj.failure();
                }
            }).send();
        }else if(this._type == 'html'){
            new Request.HTML({
                url: this._url, data: this._params, method:this._method,
                onSuccess: function(tree,elements,html,js){
                    this_obj.htmlSuccess(tree,elements,html,js);
                }, onFailure: function(response){
                    this_obj.failure();
                }
            }).send();
        }
    },
    jsonSuccess: function(response){
        if(this._options.onSuccess) this._options.onSuccess(response);
        else if(response.result == true || response.result == 'true'){
            if(this._options){
                if(this._options.message && this._options.message.success){
                    new MsgBox({message:this._options.message.success});
                }else if(this._options.target){
                    $(this._options.target).innerHTML = response.message;
                }else if(this._options.redirect){
                    window.location.href = this._options.redirect;
                }else if(this._options.redirectFromServer){
                    window.location.href = response.message;
                }else if(this._options.reLoad){
                    $reloadPage();
                }
            }
        }else{
            new MsgBox({message:response.message});
        }
    },
    htmlSuccess: function(tree,elements,html,js){
        if(this._options.onSuccess) this._options.onSuccess(tree,elements,html,js);
        else if(this._options.target){
            $(this._options.target).innerHTML = html;
        }
    },
    failure: function(){
        if (this._options.onFailure) this._options.onFailure();
        else {
            var msg = '';
            if (this._options && this._options.message && this._options.message.failure) {
                msg = this._options.message.failure;
            }
            if(msg != '') new MsgBox({ message: msg });
        }
    }
});
/**
 * @class build a table using some data, not completed
 */
var echoTable = new Class({
    _options: null,
    initialize: function(){
        ;
    }
});
/**
 * @class a tip box to show some information around a specified control
 * @param options option parameters
 * <p><b>relativeTo: </b>the element the box relative to, must be specified</p>
 * <p><b>content: </b>the message to show</p>
 * <p><b>style: </b>inline style for the box in mootools' coding style, e.g. {'width':100,'height':200}</p>
 * <p><b>cssClass: </b>cssClass for the box</p>
 * <p><b>direction: </b>the location relative to host, maybe left|top|right|bottom|hover</p>
 * <p><b>delay: </b>if specified, the box will be auto closed [delay] milliseconds later</p>
 * <p><b>outClose: </b>if true,the box will be closed when clicking outside</p>
 * <p><b>remove_close: </b>if true,remove the close button</p>
 * @property close close the box
 * @property smartClose close the box using a fadding effect
 */
var TipBox = new Class({
    _options: {}, _direction:'bottom',_cssClass:'tipBox', _position: 'bottom', _edge:'top', _container: null, _contentBox:null, _relativeTo: null,
    initialize: function(options){
        if(!options || !options.relativeTo) return null; var relativeTo = $(options.relativeTo); if(!relativeTo) return null;
        if (relativeTo._tipBox) { relativeTo._tipBox.close(); }
        this._options = options; this._relativeTo = relativeTo;
        if(options.cssClass) this._cssClass = options.cssClass;
        if(options.direction) this._direction = options.direction;
        this.parseDirection();
        if(options.position) this._position = options.position;
        if(options.edge) this._edge = options.edge;
        this.createBox();
        this._relativeTo._tipBox = this._container;
        if (options.delay)  this.smartClose.delay(options.delay,this);
        if(options.outClose) {
            var self = this;
            document.addEvent('click',function(){ self.close(); });
            this._container.addEvent('click',function(event){ $stopBubble(event); });
        }
    },
    parseDirection: function(){
        var dir = this._direction; var pos = 'bottom'; var edge = 'top';
        if(dir == 'bottom') { pos = 'bottom'; edge = 'top'; }
        else if(dir == 'left') { pos = 'left'; edge = 'right'; }
        else if(dir == 'top') { pos = 'top'; edge = 'bottom'; }
        else if(dir == 'right') { pos = 'right'; edge = 'left'; }
        else if(dir == 'hover') { pos = 'center'; edge = 'center'; }
        this._position = pos; this._edge = edge;
    },
    createBox: function(){
        var _div = new Element('div'); var options = this._options; var self = this;
        _div.addClass(this._cssClass);
        var zindex = '65534';
        if(options.zIndex) zindex = '' + options.zIndex;
        _div.setStyles({'z-index':zindex,'position':'absolute'});
        if(options.style) _div.setStyles(options.style);
        var contentBox = new Element('div',{'class':'content'});
        _div.grab(contentBox);
        if(!$chk2(options.remove_close)){
            var closeBox = new Element('div',{'class':'close'});
            closeBox.appendText('X'); closeBox.addEvent('click',function(){ self.close(); });
            _div.grab(closeBox);
        }
        this._contentBox = contentBox;
        if(options.content) contentBox.innerHTML = options.content;
        $(document.body).appendChild(_div);
        this._container = _div;
        var offset = {x:0,y:0};
        if(this._options.offset) offset = this._options.offset;
        this._container.stick($merge(options,{position:this._position,edge:this._edge,relativeTo:this._relativeTo, offset:offset}));
    },
    setHtml: function(htmltext){
        this._contentBox.innerHTML = htmltext;
    },
    setChild: function(child){
        if (this._contentBox && child) {
            this._contentBox.empty(); this._contentBox.grab(child);
        }
    },
    close: function(){
        if(this._options.onClose) (this._options.onClose)();
        if(this._options.outClose) {
            var self = this;
            document.removeEvents('click');
            this._container.removeEvents('click');
        }
        this._container.close(); this._relativeTo._tipBox = null;
    },
    smartClose: function(){
        var self = this;
        var mfx = new Fx.Morph(self._container,{duration:1000,onComplete:function(){ self.close(); }});
        mfx.start({opacity:[1,0]});
    }
});
/**
 * @class show search tips while input in search box, server must accept the condition 'key=xxx', and
 *  return json format: {items:[{text:'',desc:''}...]}
 * @param options option parameters
 * <p><b>relativeTo: </b>the element the box relative to, must be specified</p>
 * <p><b>dataUrl: </b>server url to get tips</p>
 * <p><b>style: </b>inline style for the box in mootools' coding style, e.g. {'width':100,'height':200}</p>
 * <p><b>cssClass: </b>cssClass for the box</p>
 * <p><b>form: </b>form to be sumibted while one item is selected</p>
 * <p><b>onSelect: </b>function to be fired while one item is selected</p>
 */
var SearchTip = new Class({
    _options: {}, _relativeTo: null, _form:null, _tipBox: null, _dataUrl: null, _lastWord:'', _solved: true,
    _list:null, _onSelect:null, _cssClass:'searchTip',_selClass:'hover',_lastItems:null,
    initialize: function(options){
        if(!options || !options.relativeTo || !options.dataUrl) return null;
        this._options = options; this._relativeTo = $(options.relativeTo); this._dataUrl = options.dataUrl;
        if(!this._relativeTo) return null;
        if(options.cssClass) this._cssClass = $(options.cssClass);
        if(options.form) this._form = $(options.form);
        if(options.onSelect) this._onSelect = options.onSelect;
        if(options.width) this._width = options.width;
        //this._relativeTo.onkeyup = this.createContent.bindWithEvent(this);
        this._relativeTo.addEvent('keyup',this.createContent.bindWithEvent(this))
    },
    getTipBox: function(){
        if (!$chk2(this._tipBox)) {
            var size = this._width || this._relativeTo.getSize().x; var self = this;
            this._tipBox = new TipBox({
                relativeTo: this._relativeTo, content: '加载中...', remove_close: true, outClose: true,
                style: { width: size + 'px'},position:'bottomLeft',edge:'topLeft',cssClass:this._cssClass,
                onClose: function(){ self._tipBox = null; }
            });
        }
        return this._tipBox;
    },
    createContent: function(ev){
        var done = this.doKeyup(ev); if(done) return false;
        var dataUrl = this._dataUrl; var value = this._relativeTo.value; var self = this;
        if(!$chk2(value)){ this.clear(); return; }
        var tipBox = this.getTipBox();
        if(this._lastWord == value){ self.generateContent(self._lastItems); return; }
        this._lastWord = value;
        var ajax = new Request.JSON({
            url:dataUrl, data: 'key=' + value,
            onSuccess: function(response){
                var items = response.items; if(items.length==0){ self.clear(); }
                self._lastItems = items;
                self.generateContent(items); self._solved = true;
            }
        }).send();
    },
    generateContent: function(items){
        if(!$chk2(items)) return;
        var ul = new Element('ul');
        for(var i=0;i<items.length;i++){
            var item = items[i]; var li = new Element('li'); var textNode = new Element('span',{'class':'text'});
            textNode.appendText(item.text); li.appendChild(textNode);
            if($chk2(item.desc)) {
                var descNode = new Element('span',{'class':'desc'});
                descNode.appendText(item.desc); li.appendChild(descNode);
            }
            li.set('_text',item.text);
            if(i==items.length-1) li.addClass('last');
            ul.appendChild(li);
        }
        this._list = ul; var tipBox = this.getTipBox(); tipBox.setChild(ul);this.attachEvents();
    },
    attachEvents: function(){
        var ul = this._list; if(!$chk2(ul)) return;
        // attach events to ul items
        var items = ul.getElementsByTagName('li'); var self = this;
        if(items.length == 0) return;

        for (var i = 0; i < items.length; i++) {
            items[i].addEvent('mouseover', function(event){
                for (var j = 0; j < items.length; j++) $(items[j]).removeClass(self._selClass);
                this.addClass(self._selClass);
            });
            items[i].addEvent('click', function(event){ self.select(); });
        }
        ul.addEvent('keyup', function(event){ var done = self.doKeyup(event); if(done) return; });
    },
    doKeyup: function(event,source){
        var evt = new Event(event);
        var passKeys = ['enter','up','down','left','right','delete','esc'];
        if(evt.key == 'up'){ this.up(); return true;}
        else if(evt.key == 'down'){ this.down(); return true;}
        else if(evt.key == 'enter'){
            //this.select(); return true;
        }
        else if(evt.key == 'esc'){ this.clear(); return true; }
        return false;
    },
    select: function(){
        // get selected item
        if(this._list == null) return;
        var items = this._list.getElements('li');
        var sel_item = null;
        for(var i=0;i<items.length;i++){
            if(items[i].hasClass(this._selClass)){ sel_item = items[i]; break; }
        }
        if($chk2(sel_item)) this._relativeTo.value = sel_item.get('_text');
        if($chk2(this._form)) this._form.submit();
        if($chk2(this._onSelect)) (this._onSelect)();
        this.clear();
        this._relativeTo.focus();
    },
    up: function(){
        if(this._list == null) return;
        var items = this._list.getElementsByTagName('li');
        if(items.length == 0) return;
        var sel_index = -1;
        for (var i = 0; i < items.length; i++) {
            if (items[i].hasClass(this._selClass)) { sel_index = i; break; }
        }
        if (sel_index == -1) {
            items[items.length-1].addClass(this._selClass); this._relativeTo.value = items[items.length-1].get('_text');
        }else if (sel_index == 0){  items[0].removeClass(this._selClass); }
        else{
            items[sel_index].removeClass(this._selClass); items[sel_index-1].addClass(this._selClass);
            this._relativeTo.value = items[sel_index-1].get('_text');
        }
    },
    down: function(){
        if(this._list == null) return;
        var items = this._list.getElementsByTagName('li');
        if(items.length == 0) return;
        var sel_index = -1;
        for (var i = 0; i < items.length; i++) {
            if ($(items[i]).hasClass(this._selClass)) { sel_index = i; break; }
        }
        if (sel_index == -1){
            items[0].addClass(this._selClass); this._relativeTo.value = items[0].get('_text');
        }else if (sel_index == items.length-1) items[items.length-1].removeClass(this._selClass);
        else{
            items[sel_index].removeClass(this._selClass); items[sel_index+1].addClass(this._selClass);
            this._relativeTo.value = items[sel_index+1].get('_text');
        }
    },
    clear: function(){ if($chk2(this._tipBox)) this._tipBox.close(); this._tipBox = null; }
});
/**
 * @class build compound conditions to pass to server
 * @param options option parameters
 * <p><b>controls: </b>condition control array, controls maybe ul|input(text|hidden)</p>
 * <p><i>control element parameters: </i>
 *  e.g. &lt;ul id='test'&gt;&lt;li&gt;&lt;a evalue='tt'&gt;testa&lt;/a&gt;&lt;/li&gt;&lt;/ul&gt;
 *  if the link above is clicked, a condition like 'test=tt' will be added into page parameters and send to server,
 *  and while the page loading, the link will be set selected as to the condition 'test=tt' in page parameters
 * </p>
 * <p><b>submitButtons: </b>submit button array, submit button can manually submit the conditions</p>
 * <p><b>autoFire: </b>once click one control, automatically replace current page using new conditions</p>
 * <p><b>extraParams: </b>extra parameters passed to server</p>
 * @example new ParamsBox({controls:$$('params'),submitButtons:[$('btn')]});
 */
var ParamsBox = new Class({
    _options:{}, _autoFire:true, _controls:[], _submitButtons:[], _extraParams:'',
    initialize: function(options){
        if(!options || !options.controls) return;
        this._options = options;
        this._controls = options.controls; if(this._controls.length==0) return;
        if(options.submitButtons) this._submitButtons = options.submitButtons;
        if(options.autoFire) this._autoFire = options.autoFire;
        if(options.extraParams) this._extraParams = options.extraParams;
        this.attachEvt(); this.loadUrl();
    },
    attachEvt: function(){
        var self = this;
        var uls = this._controls;
        for(var i=0;i<uls.length;i++){
            // link buttons
            var lnks = uls[i].getElements('a');
            for(var j=0;j<lnks.length;j++) {
                if(!this._submitButtons.contains(lnks[j]))
                    lnks[j].addEvent('click',function(event){ self.checkMe(event); });
            }
            // input text control
            var inputs = uls[i].getElements('input');
            for(var j=0;j<inputs.length;j++) {
                if(!this._submitButtons.contains(inputs[j]))
                    lnks[j].addEvent('click',function(event){ self.checkMe(event); });
            }
        }
        if(this._submitButtons.length > 0)
            this._submitButtons.each(function(item){
                if(item && item.type=='button') item.addEvent('click',function(){ self.goUrl(); });
                // 给文本框增加回车即查询功能
                if(item && item.type=='text'){
                    item.addEvent('keydown',function(event){
                        if(event.key == 'enter' && !event.control && !event.shift && !event.alt){
                            self.goUrl();
                        }
                    });
                }
            });
    },
    loadUrl: function(){
        // initial all selections
        var uls = this._controls;
        for(var i=0;i<uls.length;i++) this.setState(uls[i].get('id'));
        // set url parameters
        var search = window.location.search.replace('?','');
        var params = search.parseQueryString();
        for(var item in params){
            this.setState(item,params[item]);
        }
    },
    getOtherUrl: function(obj){
        if(!obj) return ''; obj = $(obj); if(!obj) return ''; var ret = '';
        if (obj.tagName.toLowerCase() != 'input') {
            var links = obj.getElements('a');
            for (var i = 0; i < links.length; i++) {
                if ($(links[i].parentNode).hasClass('active')) {
                    ret = links[i].get('eurl'); break;
                }
            }
        }else if(obj.type=='text' || obj.type=='hidden' || obj.type==''){
            ret = obj.get('eurl');
        }
        if(!$chk2(ret)) ret = '';
        return ret;
    },
    getState: function(obj){
        if(!obj) return '-1'; obj = $(obj); if(!obj) return '-1'; var ret = '-1';
        if (obj.tagName.toLowerCase() != 'input') {
            var links = obj.getElements('a');
            for (var i = 0; i < links.length; i++) {
                if ($(links[i].parentNode).hasClass('active')) {
                    ret = $(links[i]).get('evalue'); break;
                }
            }
        }else if(obj.type=='text' || obj.type=='hidden' || obj.type==''){
            ret = obj.value;
        }
        return ret;
    },
    setState: function(obj,value){
        if(!obj) return; obj = $(obj); if(!obj) return;
        if(obj.tagName.toLowerCase() != 'input'){
            if(!$chk2(value)) value = '-1';
            value = value + '';
            var links = obj.getElements('a');
            for(var i=0;i<links.length;i++){
                if (links[i].get('evalue') == value) {
                    $(links[i].parentNode).addClass('active');
                } else {
                    $(links[i].parentNode).removeClass('active');
                }
            }
        }else{
            if (obj.type == 'text' || obj.type == 'hidden' || obj.type == '') {
                if($chk2(value)) obj.value = value;
                else obj.value = '';
            }
        }
    },
    checkMe: function(ev){
        ev = ev || window.event;
        var element = ev.target || ev.srcElement;
        var parent = element.parentNode.parentNode;
        var links = parent.getElementsByTagName('a');
        for(var i=0;i<links.length;i++){
            if(links[i] == element) $(links[i].parentNode).addClass('active');
            else $(links[i].parentNode).removeClass('active');
        }
        // connect to sub elements
        var uls = this._controls; var id = parent.get('id');
        if($chk2(id)){
            for (var i = 0; i < uls.length; i++) {
                var pname = uls[i].get('eparent');
                if($chk2(pname) && pname == id){
                    this.setState(uls[i],-1);
                }
            }
        }

        if(this._autoFire)  this.goUrl();
        ev.returnValue = false;
        if(window.event) window.event.returnValue = false;
    },
    goUrl: function(){
        var url = window.location.href.replace(window.location.search,'');
        var params = new Object(); var uls = this._controls;
        for(var i=0;i<uls.length;i++){
            var id = uls[i].get('id'); params[id] = this.getState(id);
            if(url=='') url = this.getOtherUrl(id);
        }
        var par = this._extraParams.parseQueryString();
        for(var i in par){ if($chk2(i)) params[i] = String.encode(par[i]); }
        var _uri = url.toURI();
        _uri.setData(params,true);
        window.location.href = _uri.toString();
    }
});
/**
 * @class calendar web control
 * @param options option parameters
 * <p><b>relativeTo: </b>the relativeTo element the datepicker relative to</p>
 * <p><b>onlyMonth: </b>if true, only show month, default is false</p>
 * <p><b>clickClose: </b>if true, must click the close button to close the datepicker,
 *      if false, auto close the datepicker when click outside, default is false</p>
 * <p><b>event: </b>if auto close, must specify event</p>
 * @example someTextInput.addEvent('focus',function(event){new DatePicker({relativeTo:this});});
 */
var DatePicker = new Class({
    _options:{}, relativeTo : null, year : 0, month : 0, day : 0, _container:null, _shadow:null,
    _year_span:null, _year_input:null,
    month_names : ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
    weekday_names : ["日","一","二","三","四","五","六"],
    today_name : "今天", close_name : "关闭", _cssClass:'dtpick',
    _month_table_cssClass: 'monthTable', _week_table_cssClass:'weekTable', _day_table_cssClass:'dayTable',
    initialize : function(options){
        if (!options || !options.relativeTo) return;
        this.callback = options.callback || null;
        this.relativeTo = $(options.relativeTo);
        this._options = options;
        if (options.onlyMonth) {
            this._options.onlyMonth = true;
        } else {
            this._options.onlyMonth = false;
        }
        // close all box
        var now_dtpicks = $$('.' + this._cssClass);
        //// first close the inner shadow cover
        now_dtpicks.each(function(item){
            item.getElements('iframe').each(function(sub){ sub.destroy(); });
            item.destroy();
        });
        this.createBox();
        // get value of input, if none, set today
        var sDay = String.toDate(options.startDay || this.relativeTo.value);
        var dt = sDay || new Date();
        this.year = dt.getFullYear(); this.month = dt.getMonth() + 1; this.day = dt.getDate();
        this.showYear(this.year); 
        this.createShadow();
    },
    createShadow: function(){
        if (Browser.ie) {
            var dtSize = this._container.getSize();
            var frm = new Element('iframe',{'class':'cover'});frm.setStyles({'width':dtSize.x,'height':dtSize.y});
            this._container.grab(frm); this._shadow = frm;
        }
    },
    createBox : function(){
        var self = this;
        // paint interface
        var dt_div = new Element("div",{'class':this._cssClass,"style":"position:absolute;display:none;z-index:65534;"});
        dt_div.addClass('popup');
        var dt_table = new Element("table",{'class':this._month_table_cssClass});
        var dt_table_body = new Element("tbody");
        // title
        var year_row = new Element("tr");
        var prev_year_cell = new Element("td",{'events': {
            "click": function(event){ self.showYear(self.year - 1); $stopBubble(event);},
            "mouseover":function(){this.addClass('hover');},
            "mouseout":function(){this.removeClass('hover');}
        }}); prev_year_cell.appendText("<<");
        var year_cell = new Element("td",{'colspan':"2"});
        this._year_span = new Element("a",{'href':"javascript:;",'events':{"click":function(event){self.changeYear();$stopBubble(event);}}});
        this._year_input = new Element("input",{'style':"display:none;",'value':this.year,
            'events':{"keyup":function(event){self.inputYear(event);},"blur":function(event){self.doChangeYear();}}});
        year_cell.appendChild(this._year_span); year_cell.appendChild(this._year_input);
        var next_year_cell = new Element("td",{'events': {
            "click": function(event){ self.showYear(self.year + 1); $stopBubble(event);},
            "mouseover":function(){this.addClass('hover');},
            "mouseout":function(){this.removeClass('hover');}
        }}); next_year_cell.appendText(">>");
        var today_cell = new Element("td",{'events': {
            "click": function(event){ self.showToday(); $stopBubble(event);},
            "mouseover":function(){this.addClass('hover');},
            "mouseout":function(){this.removeClass('hover');}
        }});
        today_cell.appendText(this.today_name);
        var close_cell = new Element("td",{'events': {
            "click": function(event){ self.close();},
            "mouseover":function(){this.addClass('hover');},
            "mouseout":function(){this.removeClass('hover');}
        }});
        close_cell.appendText(this.close_name);
        year_row.appendChild(prev_year_cell); year_row.appendChild(year_cell);
        year_row.appendChild(next_year_cell);year_row.appendChild(today_cell);
        year_row.appendChild(close_cell);
        dt_table_body.appendChild(year_row);
        // month
        var mrow = new Element("tr");
        for(var i=0;i<12;i++){
            if(i>0 && i%6==0) { dt_table_body.appendChild(mrow); mrow = new Element("tr");}
            var cell = new Element("td",{'id':"m_"+i,'month':i+1,
                'events':{"click":function(event){self.selectMonth(this.getAttribute("month"));$stopBubble(event);},
                    "mouseover":function(){this.addClass('hover');},
                    "mouseout":function(){this.removeClass('hover');}
            }});
            cell.appendText(this.month_names[i]);
            mrow.appendChild(cell);
        }
        dt_table_body.appendChild(mrow); dt_table.appendChild(dt_table_body); dt_div.appendChild(dt_table);
        // days
        // only create day table when onlyMonth=false
        if(!this._options.onlyMonth){
            var day_table = new Element("table",{'class':"dayTable"});
            var day_table_body = new Element("tbody");
            var head_day_row = new Element("tr",{'class':"weekTitle"});
            for(var i=0;i<7;i++){
                var cell = new Element("td");
                cell.appendText(this.weekday_names[i]);
                head_day_row.appendChild(cell);
            }
            day_table_body.appendChild(head_day_row);
            var day_row = new Element("tr");
            for(var i=0;i<42;i++){
                if(i>0 && i%7==0) { day_table_body.appendChild(day_row); day_row = new Element("tr");}
                var cell = new Element("td",{'id':"d_"+i,
                    'events':{"click":function(event){self.selectDay(this.innerHTML);$stopBubble(event);},
                        "mouseover":function(){if(this.innerHTML!='')this.addClass('hover');},
                        "mouseout":function(){this.removeClass('hover');}
                    }});
                day_row.appendChild(cell);
            }
            day_table_body.appendChild(day_row);
            day_table.appendChild(day_table_body);
            dt_div.appendChild(day_table);
        }
        // append to input
        $(document.body).appendChild(dt_div);
        dt_div.stick({relativeTo: this.relativeTo});
        this._container = dt_div;
        if(!this._options.clickClose && this._options.event){
            document.addEvent('click',function(){ self.close(); });
            $stopBubble(this._options.event);
        }
    },
    doChangeYear : function(){
        this._year_span.style.display="block"; this._year_input.style.display="none";
        var val = this._year_input.value;
        if($chkType(val,"uint")) this.showYear(val.toInt());
    },
    changeYear : function(){
        this._year_input.value = this._year_span.innerHTML;
        this._year_span.style.display="none";this._year_input.style.display="block";
        this._year_input.focus();
    },
    inputYear : function(event){
        if(event.code == "13" && $chkType(this._year_input.value,'uint')) this.doChangeYear();
    },
    showToday : function(){
        var dt = new Date();
        this.year = dt.getFullYear(); this.month = dt.getMonth() + 1; this.day = dt.getDate();
        this.showYear(this.year);
    },
    showYear : function(year){
        if($chk2(year) && year >= 0){ this._year_span.innerHTML = year; this.year = year; }
        else this._year_span.innerHTML = this.year;
        // show month
        this.showMonth(this.month);
    },
    showMonth : function(month){
        if($chk2(month) && month >= 1 && month <= 12) this.month = month;
        for(var i=0;i<12;i++){
            if(i == this.month-1){ $("m_"+i).addClass("selmonth");}
            else{ $("m_"+i).removeClass("selmonth");}
        }
        // write days of the month
        if(!this._options.onlyMonth){
            var specdt = new Date(); specdt.setFullYear(this.year); specdt.setMonth(this.month-1); specdt.setDate(1);
            var weekday_first = specdt.getDay();
            var monthdays = 31;
            if(this.month == 4 || this.month == 6 || this.month == 9 || this.month == 11){monthdays = 30;}
            else if(this.month == 2){
                if(this.leap(this.year)) monthdays = 29;
                else monthdays = 28;
            }
            for(var i=0;i<42;i++){ $("d_" + i).empty();$("d_" + i).removeClass("border"); }
            for(var i=0;i<monthdays;i++){ var cell = $("d_"+(weekday_first + i)); cell.addClass("border");cell.appendText(i+1); }
            // show selected day
            this.showDay(this.day);
        }
    },
    showDay : function(day){
        if($chk2(day) && day >= 0 && day <= 31){
            this.day = day; // check if the month has the day
        }
        var specdt = new Date(); specdt.setFullYear(this.year); specdt.setMonth(this.month-1); specdt.setDate(1);
        var weekday_first = specdt.getDay();
        for(var i=0;i<42;i++){
            if(i == this.day-1+weekday_first){ $("d_"+i).addClass("selday"); }
            else{ $("d_"+i).removeClass("selday"); }
        }
    },
    selectMonth : function(month){
        this.showMonth(month);
        if(this._options.onlyMonth == true){
            // write value into controls of parentdiv
            var datevalue = this.year + "-" + ((this.month < 10) ? '0' + this.month : this.month);
            this.relativeTo.value = datevalue;
            this.close();
        }
    },
    selectDay : function(day){
        if(!$chk2(day)) return;
        this.showDay(day);
        // write value into controls of parentdiv
        var datevalue = String.format('{0}-{1}-{2}',this.year,this.month<10 ? '0'+this.month : this.month,this.day<10 ? '0'+this.day : this.day);
        this.relativeTo.value = datevalue;
        this.close();
        var callback = this.callback || null;
        if (callback){(callback)()}
    },
    leap : function(year){
        var result = false;
        if(year % 4 == 0){
            if(year % 100 == 0){
                if(year % 400 == 0) result = true;
                else  result = false;
            }else  result = true;
        }else  result = false;
        return result;
    },
    close: function(){
        if($chk2(this._shadow)) this._shadow.destroy();
        if($chk2(this._container)) this._container.destroy();
    }
});
/**
 * @class form submitted through ajax
 * @param options option parameters
 * <p><b>form: </b>the container name of the whole form</p>
 * <p><b>submitButton: </b>submit button</p>
 * <p><b>enterSubmit: </b>if submit the form when user press enter, default is false</p>
 * <p><b>beforeSend: </b>function fired before the form send</p>
 * <p><b>onComplete: </b>function fired after the form returned</p>
 * <p><b>keywords of the html elements</b>evalid(valid keywords when doing valid) / evalidfunc(valid function fired when doing valid)</p>
 * <p><b>keywords of valid(canbe serveral):</b>required/ int / uint / float / ufloat / date/ ym / time / email</p>
 */
var echoForm = new Class({
    _form:null, _options:{}, _topMostTip:false, _submitButton:null,
    _beforeSend:function(){return true;}, _onComplete:function(response){},
    initialize: function(options){
        if(options.form) this._form = $(options.form);  if(!this._form) return;
        var self = this; this._options = options;
        var subtn = null;
        if(options.submitButton) this._submitButton = $(options.submitButton);
        if(!$chk2(this._submitButton)) this._submitButton = this._form.getElement('input[type=submit]');
        if(this._submitButton) this._submitButton.addEvent('click',function(){self.send();});
        // give every input priviledge to press enter to submit
        if(options.enterSubmit){
            var elems = this._form.getElements('input');
            var self = this;
            for (var i = 0; i < elems.length; i++) {
                if(!elems[i]) continue;
                elems[i].addEvent('keypress',function(e){
                    var evt = new Event(e);
                    if(evt.key == 'enter'){ self.send(); }
                });
            }
        }
        if(options.beforeSend) this._beforeSend = options.beforeSend;
        if(options.onComplete) this._onComplete = options.onComplete;
        this.initItems();
    },
    showTip: function(relativeTo,content,cssClass){
        if(!relativeTo) return;
        if(relativeTo._tipBox){ relativeTo._tipBox.close(); relativeTo._tipBox = null; }
        if(this._topMostTip)
            new TipBox({relativeTo:relativeTo,content:content,direction:'right',remove_close:true,cssClass:cssClass,
                offset:{x:5,y:0}});
        else
            new TipBox({relativeTo:relativeTo,content:content,direction:'right',remove_close:true,cssClass:cssClass,
                    offset:{x:5,y:0}, zIndex:65000});
    },
    initItems: function(){
        var self = this;
        var elems = this._form.getElements('input|textarea');
        for(var i=0; i<elems.length;i++){
            elems[i].msg = elems[i].get('etip');
            if(elems[i].msg) {
                elems[i].addEvent('focus', function(){ self.showTip(this,this.msg,'mTips'); });
            }
            if (this._options.singleValid) {
                elems[i].addEvent('blur', function(){ self.checkItemValid(this); });
            }
        }
    },
    checkItemValid: function(item){
        if(!item) return false;
        // first check if has evalidfunc, if have, ignore evalid
        var errMsg = '';
        var vafuncstr = item.get('evalidfunc');
        if(vafuncstr){
            var funcs = vafuncstr.split(',');
            for(var i=0; i<funcs.length; i++){
                var func = funcs[i];
                if($defined(func)) {
                    var obj = eval(func+'()');
                    if(obj.result == false){ errMsg = obj.message; break; }
                }
            }
            if(errMsg != ''){ this.showTip(item, errMsg, 'mWrong'); item.addClass('inputWrong'); return false; }
        }else{
            var value = item.value; var valid = item.get('evalid');
            if(!$chk2(valid)) return true;
            var res = $ifValid(value,valid);
            if(res != ''){
                var msg = item.get('ewrong'); if(!msg) msg = res; this.showTip(item,msg,'mWrong');item.addClass('inputWrong');
                return false;
            }else{
                // check if have relation with others
                var ref = item.get('eref'); var relation = item.get('erel');
                var rel_error = item.get('erefwrong');
                if($chk2(ref) && $chk2(relation) && $chk2(rel_error)){
                    var refitem = $(ref);
                    if(refitem && (refitem.tagName.toLowerCase() == 'input' || refitem.tagName.toLowerCase() == 'textarea')){
                        var refValue = refitem.value;
                        if(relation == 'equal'){
                            if(value != refValue){ this.showTip(item,rel_error,'mWrong'); item.addClass('inputWrong'); return false; }
                        }else{} //.. other relation
                    }
                }
            }
        }
        var msg = item.get('eright');
        if(msg) {
            this.showTip(item,msg,'mRightIcon');
            item.removeClass('inputWrong');
        }
        return true;
    },
    checkValid: function(){
        var focus_ctrl = null; var result = true;
        var elems = this._form.getElements('input|textarea');
        for(var i=0;i<elems.length;i++){
            if(this.checkItemValid(elems[i])) continue;
            if(!focus_ctrl){
                focus_ctrl = elems[i]; result = false;
            }
        }
        if(focus_ctrl) focus_ctrl.focus();
        return result;
    },
    getQuery: function(){
        if(!this._form) return;
        var queryString = [];
        this._form.getElements('input, select, textarea', true).each(function(el){
            if (!el.name || el.type == 'button' || el.type == 'submit' || el.type == 'reset' || el.type == 'file') return;
            var value = (el.tagName.toLowerCase() == 'select') ? Element.getSelected(el).map(function(opt){
                return opt.value;
            }) : ((el.type == 'radio' || el.type == 'checkbox') && !el.checked) ? null : el.value;
            $splat(value).each(function(val){
                if (typeof val != 'undefined') queryString.push(el.name + '=' + encodeURIComponent(val));
            });
        });
        return queryString.join('&');
    },
    send: function(){
        var self = this;
        if(!this.checkValid()) return;
        if(!this._beforeSend()) return;
        var params = this.getQuery();
        var url = this._form.action ? this._form.action: this._form.get('action');
        var type = this._options.type || 'JSON';
        var method = this._form.get('method') || 'post';
        if(!$chk2(url)) url = window.location.href;
        if(self._submitButton) $enableButton(self._submitButton,false);
        new echoAjax({url:url,params:params,method:method,type:type,
            onSuccess:function(response){
                $enableButton(self._submitButton,true);
                self._onComplete(response);
            }
        }).fire();
    }
});
/**
 * @class build a list using given objects and store values after select some objects
 * @param options option parameters
 * <p><b>objects: </b>the objects to show, object format:{name,value,desc,url}</p>
 * <p><b>htmlContainer: </b>html container to host the list result</p>
 * <p><b>textContainer </b>container to store text of the selected objects</p>
 * <p><b>valueContainer </b>container to store value of the selected objects</p>
 * <p><b>checkType: </b>select type, maybe 'no|radio|checkbox'</p>
 * <p><b>cellPerRow: </b>how many columns in the list table</p>
 */
var List = new Class({
    _checkType: 'no', _objects:null, _htmlContainer:null, _textContainer:null, _valueContainer:null, _cellPerRow:3,
    initialize: function(options){
        if(!options || !options.objects || !options.htmlContainer) return;
        this._objects = options.objects;
        this._htmlContainer = options.htmlContainer;
        this._textContainer = options.textContainer;
        this._valueContainer = options.valueContainer;
        if(options.checkType) this._checkType = options.checkType;
        if(options.cellPerRow) this._cellPerRow = options.cellPerRow;
        this.createBox();
    },
    createBox: function(){
        var cellPerRow = this._cellPerRow;
        var tb = new Element('table',{'class':'sTable'}); var list = this;
        var header = tb.insertRow(0);
        var hcell = header.insertCell(0);
        hcell.colSpan = cellPerRow;
        hcell.innerHTML = String.format('共找到{0}项',this._objects.length);
        var row;
        for(var i=0;i<this._objects.length;i++){
            if(i % cellPerRow == 0) row = tb.insertRow(tb.rows.length);
            var obj = this._objects[i];
            var cell = row.insertCell(row.cells.length);
            switch(this._checkType){
                case 'no': break;
                case 'radio':
                    var chk = new Element('input',{'type':'radio','value':obj.value,'vname':obj.name,'autocomplete':'off'});
                    chk.addEvent('click',function(){$selRadio(tb,this);list.setText(this.get('vname')); list.setValue(this.get('value'));});
                    cell.appendChild(chk); break;
                case 'checkbox':
                    var chk = new Element('input',{'type':'checkbox','value':obj.value,'autocomplete':'off'});
                    chk.addEvent('click',function(){var val = $getCheckValues(tb,''); list.setValue(val);});
                    cell.appendChild(chk); break;
            }
            var lnk = new Element('a',{'href':obj.url,'title':obj.desc,'target':'_blank'});
            lnk.appendText(obj.name);
            cell.appendChild(lnk);
        }
            while(row.cells.length < cellPerRow){ row.insertCell(row.cells.length);}
        $(this._htmlContainer).appendChild(tb);
    },
    setText: function(text){
        if(this._textContainer && $(this._textContainer)){
            var c = $(this._textContainer);
            if(c.type == 'text' || c.type == 'textarea') c.value = text;
            else c.innerHTML = text;
        }
    },
    setValue: function(val){
        if(this._valueContainer && $(this._valueContainer)){
            var c = $(this._valueContainer);
            if(c.type == 'text' || c.type == 'textarea' || c.type == 'hidden') c.value = val;
            else c.innerHTML = val;
        }
    }
});
/**
 * @class build a list via content got from server
 * @params options option parameters
 * <p><b>url: </b>the objects to show, object format:{name,value,desc,url}</p>
 * <p><b>params: </b>parameters passed to server</p>
 * <p><b>htmlContainer: </b>html container to host the list result</p>
 * <p><b>textContainer </b>container to store text of the selected objects</p>
 * <p><b>valueContainer </b>container to store value of the selected objects</p>
 * <p><b>checkType: </b>select type, maybe 'no|radio|checkbox'</p>
 * <p><b>cellPerRow: </b>how many columns in the list table</p>
 */
var ServerList = new Class({
    _checkType: 'no', _url:'',_params:'', _htmlContainer:null, _textContainer:null, _valueContainer:null, _cellPerRow:3,
    initialize: function(options){
        if (!options || !options.url || !options.htmlContainer) return;
        if (options.checkType) this._checkType = options.checkType;
        this._url = options.url;
        if (options.params) this._params = options.params;
        this._htmlContainer = $(options.htmlContainer);
        if (options.textContainer) this._textContainer = $(options.textContainer);
        if (options.valueContainer) this._valueContainer = $(options.valueContainer);
        if(options.cellPerRow) this._cellPerRow = options.cellPerRow;
    },
    getList: function(){
        var self = this;
        self._htmlContainer.innerHTML = "正在检索...";
        var ajax = new echoAjax({ url: self._url, params: self._params,
            onSuccess: function(response){
                // {result:false/true, items:[{value:$value,name:$name,desc:$desc,url:$url},{}...]}
                if (response.result == "true" || response.result == true) {
                    self._htmlContainer.innerHTML = '';
                    var items = response.items;
                    if (!items || items.length == 0) self._htmlContainer.innerHTML = "没有找到";
                    else {
                        new List({ objects: items, htmlContainer: self._htmlContainer, textContainer: self._textContainer,
                            valueContainer: self._valueContainer, checkType: self._checkType, cellPerRow:self._cellPerRow
                        });
                    }
                }
                else self._htmlContainer.innerHTML = response.message;
            },
            onFailure: function(){
                new MsgBox({ message: "网络连接超时,请重新查找" });
            }
        }).fire();
    }
});

var PageBox = new Class({
  _options:{}, _control:[],
  initialize: function(options){
    if(!options || !options.control) return;
    this._control = options.control;
    this.attachEvt();
  },
  attachEvt: function(){
    var self = this;
    var current_span = this._control.getElement('span');
    var pre_a = current_span.getPrevious();
    var next_a = current_span.getNext();
    $(document.body).addEvent('keydown', function(event){
      if(event.key=='left'){
        if(pre_a) window.location.href = pre_a.get('href').toString();
      };
      if(event.key=='right'){
        if(next_a) window.location.href = next_a.get('href').toString();
      };
    });
    }
});

/**
*  MD5 (Message-Digest Algorithm)
**/
var MD5 = function (string) {
    function RotateLeft(lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }
    function AddUnsigned(lX,lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) { return (lResult ^ 0x80000000 ^ lX8 ^ lY8); }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) { return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);}
            else { return (lResult ^ 0x40000000 ^ lX8 ^ lY8); }
        } else { return (lResult ^ lX8 ^ lY8); }
    }
    function F(x,y,z) { return (x & y) | ((~x) & z); }
    function G(x,y,z) { return (x & z) | (y & (~z)); }
    function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }
    function FF(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
    function GG(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
    function HH(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
    function II(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };
    function WordToHex(lValue) {
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++) {
            lByte = (lValue>>>(lCount*8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
    };
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) { utftext += String.fromCharCode(c); }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22; var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23; var S41=6, S42=10, S43=15, S44=21;
    string = Utf8Encode(string); x = ConvertToWordArray(string);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    for (k=0;k<x.length;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=AddUnsigned(a,AA);
        b=AddUnsigned(b,BB);
        c=AddUnsigned(c,CC);
        d=AddUnsigned(d,DD);
    }
    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
    return temp.toLowerCase();
}
/**
*
*  Secure Hash Algorithm (SHA1)
*  http://www.webtoolkit.info/
*
**/
 
//function SHA1 (msg) {
var SHA1 = function (msg) {
 
  function rotate_left(n,s) {
    var t4 = ( n<<s ) | (n>>>(32-s));
    return t4;
  };
 
  function lsb_hex(val) {
    var str="";
    var i;
    var vh;
    var vl;
 
    for( i=0; i<=6; i+=2 ) {
      vh = (val>>>(i*4+4))&0x0f;
      vl = (val>>>(i*4))&0x0f;
      str += vh.toString(16) + vl.toString(16);
    }
    return str;
  };
 
  function cvt_hex(val) {
    var str="";
    var i;
    var v;
 
    for( i=7; i>=0; i-- ) {
      v = (val>>>(i*4))&0x0f;
      str += v.toString(16);
    }
    return str;
  };
 
 
  function Utf8Encode(string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
 
    for (var n = 0; n < string.length; n++) {
 
      var c = string.charCodeAt(n);
 
      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
 
    }
 
    return utftext;
  };
 
  var blockstart;
  var i, j;
  var W = new Array(80);
  var H0 = 0x67452301;
  var H1 = 0xEFCDAB89;
  var H2 = 0x98BADCFE;
  var H3 = 0x10325476;
  var H4 = 0xC3D2E1F0;
  var A, B, C, D, E;
  var temp;
 
  msg = Utf8Encode(msg);
 
  var msg_len = msg.length;
 
  var word_array = new Array();
  for( i=0; i<msg_len-3; i+=4 ) {
    j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
    msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
    word_array.push( j );
  }
 
  switch( msg_len % 4 ) {
    case 0:
      i = 0x080000000;
    break;
    case 1:
      i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
    break;
 
    case 2:
      i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
    break;
 
    case 3:
      i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8  | 0x80;
    break;
  }
 
  word_array.push( i );
 
  while( (word_array.length % 16) != 14 ) word_array.push( 0 );
 
  word_array.push( msg_len>>>29 );
  word_array.push( (msg_len<<3)&0x0ffffffff );
 
 
  for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
 
    for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
    for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
 
    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;
 
    for( i= 0; i<=19; i++ ) {
      temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B,30);
      B = A;
      A = temp;
    }
 
    for( i=20; i<=39; i++ ) {
      temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B,30);
      B = A;
      A = temp;
    }
 
    for( i=40; i<=59; i++ ) {
      temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B,30);
      B = A;
      A = temp;
    }
 
    for( i=60; i<=79; i++ ) {
      temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B,30);
      B = A;
      A = temp;
    }
 
    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;
 
  }
 
  var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
 
  return temp.toLowerCase();
 
}
