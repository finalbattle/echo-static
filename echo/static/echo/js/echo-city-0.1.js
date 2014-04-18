/*
Script: echo-city.js
	Echo - City info handler
*/
var CityPicker = new Class({
	_options:null, _host:null, _msgBox:null, _controlBox:null, _provinceBox:null, _cityBox:null,
	initialize: function(options){
		if(!$chk2(options) || !$chk2(options.host)) return;
		this._options = options; this._host = $(options.host); 
		if(!$chk2(this._host)) return; 
		var self = this; //self.createBox(); self.initCity();
		this._host.onclick = this.createBox.bindWithEvent(this);
	},
	createBox: function(){
		var self = this; var box = new Element('div',{'class':'cityBox'}); this._controlBox = box;
		var provinceBox = new Element('div',{'class':'province'}); this._provinceBox = provinceBox;
		var par = _provinceArray;
		for(var i=0;i<par.length;i++){
			var span = new Element('span',{'index':i});
			span.appendText(par[i]);
			span.addEvent('click',function(){ self.selProvince(this); });
			provinceBox.grab(span);
		}
		var cityBox = new Element('div',{'class':'city','style':'display:none;'}); this._cityBox = cityBox;
		box.grab(provinceBox); box.grab(cityBox);
		this._msgBox = new TipBox({host:this._host, relativeTo:this._host,position:'leftBottom',edge:'leftBottom',coverBg:true,cssClass:'cityPopup',style:{'width':'400px'}});
		this._msgBox.setChild(this._controlBox);
		this.initCity();
	},
	initCity: function(){
		var val = this._host.value;
		if(!$chk2(val)) return;
		var citys = _cityArray; var _index = -1; var _drCity = false;
		for(var i=0;i<citys.length;i++){ // search province citys
			if(citys[i].contains(val)) { _index = i; break; }
		}
		if(_index == -1){ _index = _provinceArray.indexOf(val); if(_index>=0) _drCity = true; }
    if(_index == -1) return new MsgBox({message:"index = -1"});
		var pro_spans = this._provinceBox.getElements('span');
		this.selProvince(pro_spans[_index],init=true);
		if(!_drCity){
			var city_spans = this._cityBox.getElements('span');
			city_spans.each(function(item,index){ if(item.innerHTML==val) item.addClass('active'); else item.removeClass('active'); });
		}
	},
	selProvince: function(obj,init){
		// set select class
		var spans = this._provinceBox.getElements('span');
		spans.each(function(item,index){ if(item==obj) item.addClass('active'); else item.removeClass('active'); });
		// fill citys
		var index = obj.get('index'); var self = this;
		var city = _cityArray; if(index < 0 || index > city.length) return;
		this._cityBox.empty(); var citys = city[index];
		if(citys.length == 0){
			this._cityBox.setStyle('display','none'); 
			if(!init){ this.setValue(obj.innerHTML); return; }
		}
		else this._cityBox.setStyle('display','');
		for(var i=0;i<citys.length;i++){
			var span = new Element('span');
			span.appendText(citys[i]);
			span.addEvent('click',function(){ self.selCity(this); });
			this._cityBox.grab(span);
		}	
	},
	selCity: function(obj){
		this.setValue(obj.innerHTML);
	},
	setValue: function(val){
		this._host.value = val; this.close();
	},
	close: function(){
		this._msgBox.close(); this._msgBox = null; this._controlBox = null;
		this._provinceBox = null; this._cityBox = null;
	}
});
// database from www.gov.cn
var _provinceArray = ['福建','北京','天津','上海','重庆','河北','山西','内蒙古','辽宁','吉林','黑龙江','江苏','浙江','安徽','江西','山东','河南','湖北','湖南','广东','广西','海南','四川','贵州','云南','西藏','陕西','甘肃','青海','宁夏','新疆','台湾','香港','澳门'];
var _cityArray = [];
_cityArray[_provinceArray.indexOf('北京')] = [];//'东城区','西城区','崇文区','宣武区','朝阳区','丰台区','石景山区','海淀区','门头沟区','房山区','通州区','顺义区','昌平区','大兴区','怀柔区','平谷区','密云县','延庆县'];
_cityArray[_provinceArray.indexOf('上海')] = [];//'黄浦区','卢湾区','徐汇区','长宁区','静安区','普陀区','闸北区','虹口区','杨浦区','闵行区','宝山区','嘉定区','浦东新区','金山区','松江区','青浦区','南汇区','奉贤区','崇明县'];
_cityArray[_provinceArray.indexOf('天津')] = [];//'和平区','河东区','河西区','南开区','河北区','红桥区','塘沽区','汉沽区','大港区','东丽区','西青区','津南区','北辰区','武清区','宝坻区','宁河县','静海县','蓟县'];
_cityArray[_provinceArray.indexOf('重庆')] = [];//'万州区','涪陵区','渝中区','大渡口区','江北区','沙坪坝区','九龙坡区','南岸区','北碚区','万盛区','双桥区','渝北区','巴南区','黔江区','长寿区','江津区','合川区','永川区','南川区','綦江县','潼南县','铜梁县','大足县','荣昌县','璧山县','梁平县','城口县','丰都县','垫江县','武隆县','忠县','开县','云阳县','奉节县','巫山县','巫溪县','石柱土家族自治县','秀山土家族苗族自治县','酉阳土家族苗族自治县','彭水苗族土家族自治县'];
_cityArray[_provinceArray.indexOf('黑龙江')] = ['哈尔滨市','齐齐哈尔市','鸡西市','鹤岗市','双鸭山市','大庆市','伊春市','佳木斯市','七台河市','牡丹江市','黑河市','绥化市','大兴安岭地区'];
_cityArray[_provinceArray.indexOf('吉林')] = ['长春市','吉林市','四平市','辽源市','通化市','白山市','松原市','白城市','延边州'];
_cityArray[_provinceArray.indexOf('辽宁')] = ['沈阳市','大连市','鞍山市','抚顺市','本溪市','丹东市','锦州市','营口市','阜新市','辽阳市','盘锦市','铁岭市','朝阳市','葫芦岛市'];
_cityArray[_provinceArray.indexOf('山东')] = ['济南市','青岛市','淄博市','枣庄市','东营市','烟台市','潍坊市','济宁市','泰安市','威海市','日照市','莱芜市','临沂市','德州市','聊城市','滨州市','菏泽市'];
_cityArray[_provinceArray.indexOf('山西')] = ['太原市','大同市','阳泉市','长治市','晋城市','朔州市','晋中市','运城市','忻州市','临汾市','吕梁市'];
_cityArray[_provinceArray.indexOf('陕西')] = ['西安市','铜川市','宝鸡市','咸阳市','渭南市','延安市','汉中市','榆林市','安康市','商洛市'];
_cityArray[_provinceArray.indexOf('河北')] = ['石家庄市','唐山市','秦皇岛市','邯郸市','邢台市','保定市','张家口市','承德市','沧州市','廊坊市','衡水市'];
_cityArray[_provinceArray.indexOf('河南')] = ['郑州市','开封市','洛阳市','平顶山市','安阳市','鹤壁市','新乡市','焦作市','濮阳市','许昌市','漯河市','三门峡市','南阳市','商丘市','信阳市','周口市','驻马店市'];
_cityArray[_provinceArray.indexOf('湖北')] = ['武汉市','黄石市','十堰市','宜昌市','襄樊市','鄂州市','荆门市','孝感市','荆州市','黄冈市','咸宁市','随州市','恩施州','仙桃市','潜江市','天门市','神农架林区'];
_cityArray[_provinceArray.indexOf('湖南')] = ['长沙市','株洲市','湘潭市','衡阳市','邵阳市','岳阳市','常德市','张家界市','益阳市','郴州市','永州市','怀化市','娄底市','湘西州'];
_cityArray[_provinceArray.indexOf('江苏')] = ['南京市','无锡市','徐州市','常州市','苏州市','南通市','连云港市','淮安市','盐城市','扬州市','镇江市','泰州市','宿迁市'];
_cityArray[_provinceArray.indexOf('江西')] = ['南昌市','景德镇市','萍乡市','九江市','新余市','鹰潭市','赣州市','吉安市','宜春市','抚州市','上饶市'];
_cityArray[_provinceArray.indexOf('广东')] = ['广州市','韶关市','深圳市','珠海市','汕头市','佛山市','江门市','湛江市','茂名市','肇庆市','惠州市','梅州市','汕尾市','河源市','阳江市','清远市','东莞市','中山市','潮州市','揭阳市','云浮市'];
_cityArray[_provinceArray.indexOf('广西')] = ['南宁市','柳州市','桂林市','梧州市','北海市','防城港市','钦州市','贵港市','玉林市','百色市','贺州市','河池市','来宾市','崇左市'];
_cityArray[_provinceArray.indexOf('安徽')] = ['合肥市','芜湖市','蚌埠市','淮南市','马鞍山市','淮北市','铜陵市','安庆市','黄山市','滁州市','阜阳市','宿州市','巢湖市','六安市','亳州市','池州市','宣城市'];
_cityArray[_provinceArray.indexOf('福建')] = ['福州市','厦门市','莆田市','三明市','泉州市','漳州市','南平市','龙岩市','宁德市'];
_cityArray[_provinceArray.indexOf('甘肃')] = ['兰州市','嘉峪关市','金昌市','白银市','天水市','武威市','张掖市','平凉市','酒泉市','庆阳市','定西市','陇南市','临夏州','甘南州'];
_cityArray[_provinceArray.indexOf('贵州')] = ['贵阳市','六盘水市','遵义市','安顺市','铜仁地区','黔西南州','毕节地区','黔东南州','黔南州'];
_cityArray[_provinceArray.indexOf('云南')] = ['昆明市','曲靖市','玉溪市','保山市','昭通市','丽江市','普洱市','临沧市','楚雄州','红河州','文山州','西双版纳州','大理州','德宏州','怒江州','迪庆州'];
_cityArray[_provinceArray.indexOf('浙江')] = ['杭州市','宁波市','温州市','嘉兴市','湖州市','绍兴市','金华市','衢州市','舟山市','台州市','丽水市'];
_cityArray[_provinceArray.indexOf('四川')] = ['成都市','自贡市','攀枝花市','泸州市','德阳市','绵阳市','广元市','遂宁市','内江市','乐山市','南充市','眉山市','宜宾市','广安市','达州市','雅安市','巴中市','资阳市','阿坝州','甘孜州','凉山州'];
_cityArray[_provinceArray.indexOf('海南')] = ['海口市','三亚市','五指山市','琼海市','儋州市','文昌市','万宁市','东方市','定安县','屯昌县','澄迈县','临高县','白沙县','昌江县','乐东县','陵水县','保亭县','琼中县'];
_cityArray[_provinceArray.indexOf('内蒙古')] = ['呼和浩特市','包头市','乌海市','赤峰市','通辽市','鄂尔多斯市','呼伦贝尔市','巴彦淖尔市','乌兰察布市','兴安盟','锡林郭勒盟','阿拉善盟'];
_cityArray[_provinceArray.indexOf('宁夏')] = ['银川市','石嘴山市','吴忠市','固原市','中卫市'];
_cityArray[_provinceArray.indexOf('青海')] = ['西宁市','海东地区','海北州','黄南州','海南州','果洛州','玉树州','海西州'];
_cityArray[_provinceArray.indexOf('新疆')] = ['乌鲁木齐市','克拉玛依市','吐鲁番地区','哈密地区','昌吉州','博尔塔拉州','巴音郭楞州','阿克苏地区','克孜勒苏州','喀什地区','和田地区','伊犁州','塔城地区','阿勒泰地区','石河子市','阿拉尔市','图木舒克市','五家渠市'];
_cityArray[_provinceArray.indexOf('西藏')] = ['拉萨市','昌都地区','山南地区','日喀则地区','那曲地区','阿里地区','林芝地区'];
_cityArray[_provinceArray.indexOf('台湾')] = [];
_cityArray[_provinceArray.indexOf('香港')] = [];
_cityArray[_provinceArray.indexOf('澳门')] = [];
