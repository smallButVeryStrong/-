
/*-------------删除、移动到弹框----------*/
var dialog = (function(){
	return{
		dialog:function(options){//options是一个对象

			options = options || {};

			var defaults = {
				title:options.title || '',
				tip:options.tip || '',
				content:options.content || '',
				okFn:options.okFn || function(){}//返回真假 看看是不是删除
			}

			var dialogObj = {
				//生成结构
				html:function(){
					var newDiv = document.createElement("div");
					var html = '<h3>'
									+'<p class="title">'+defaults.title+'<span class="titleTip">('+defaults.tip+')</span></p>'
									+'<a href="javascript:void(0);" class="close" title="关闭">×</a>'
								+'</h3>'
								+'<div class="content">'
									+defaults.content
								+'</div>'
								+'<div class="pop-btns">'
									+'<span class="error"></span>'
									+'<a href="javascript:;" class="confirm">确定</a>'
									+'<a href="javascript:void(0)" class="cancel">取消</a>'
								+'</div>'
						newDiv.innerHTML = html;
						newDiv.className = "full-pop";
						return newDiv;
				},
				//定义空的key值
				fullDiv:null,
				//初始化结构
				init:function(ev){
					//定义变量，获取元素
					var fullDiv = dialogObj.html();
					//将该变量，放入body里边
					document.body.appendChild(fullDiv);
					//赋值给fullDiv
					dialogObj.fullDiv = fullDiv;//让fullDiv全局都能访问到
					//让该小提示框在可视区居中显示
					dialogObj.setPosition();
					//window大小改变时，小提示框一直居中显示
					dialogObj.addEvent();
					//获取标题
					var h3 = fullDiv.getElementsByTagName("h3")[0];
					//小提示框拖拽
					dialogObj.move({
						dragObj:h3,
						moveObj:fullDiv
					})
				},
				//可视区域的宽高
				view:function(){
					return{
						W:document.documentElement.clientWidth,
						H:document.documentElement.clientHeight
					}
				},
				//定位 使小提示框居中显示
				setPosition:function(ev){
					dialogObj.fullDiv.style.left = (dialogObj.view().W - dialogObj.fullDiv.offsetWidth)/2 + "px";
					dialogObj.fullDiv.style.top = (dialogObj.view().H - dialogObj.fullDiv.offsetHeight)/2 + "px";
				},
				//改变窗口大小的时候，弹出框的位置随之变化
				addEvent:function(){
					//window绑定事件处理，使弹框的位置随window位置改变而改变
					window.addEventListener("resize",dialogObj.setPosition,false);
					//关闭按钮
					var closes = document.getElementsByClassName("close",dialogObj.fullDiv)[0];
					closes.onclick = function(ev){
						document.body.removeChild(dialogObj.fullDiv);
						ev.stopPropagation();
					}
					//阻止mousedown冒泡
					closes.onmousedown = function(ev){
						ev.stopPropagation();
					}
					//点击确定按钮
					var confirm = document.getElementsByClassName("confirm",dialogObj.fullDiv)[0];
					confirm.onclick = function(ev){
						//okFn是一个函数，当点击确定时，给其传入删除选中文件的代码
						//如果点击取消则不执行这个代码
						defaults.okFn();
						ev.stopPropagation();
					}
					//阻止mousedown冒泡
					confirm.onmousedown = function(ev){
						ev.stopPropagation();
					}
					//点击取消按钮
					var cancel = document.getElementsByClassName("cancel",dialogObj.fullDiv)[0];
					cancel.onclick = function(ev){
						document.body.removeChild(dialogObj.fullDiv);
						ev.stopPropagation();
					}
					//阻止mousedown冒泡
					cancel.onmousedown = function(ev){
						ev.stopPropagation();
					}
				},
				//给小窗口添加拖拽事件处理
				move:function (options){//鼠标mousedown标题时，才能拖动
					options = options || {};
					var defaults = {
						dragObj:options.dragObj,//标题
						moveObj:options.moveObj//整个小提示框
					}
					defaults.dragObj.onmousedown  =function (ev){//此时阻止冒泡为什么能阻止选框？？？？？
						var disX = ev.clientX - defaults.moveObj.offsetLeft;
						var disY = ev.clientY - defaults.moveObj.offsetTop;

						document.onmousemove = function (ev){
							var L = ev.clientX - disX;
							var T = ev.clientY - disY;
							//定义弹出框边界 不能超出浏览器区域
							if( L < 0 ){
								L = 0;
							}
							if( T < 0 ){
								T = 0;
							}
							if( L > dialogObj.view().W - defaults.moveObj.offsetWidth ){
								L = dialogObj.view().W - defaults.moveObj.offsetWidth
							}
							if( T > dialogObj.view().H - defaults.moveObj.offsetHeight ){
								T = dialogObj.view().H - defaults.moveObj.offsetHeight
							}
							defaults.moveObj.style.left =  L + "px";
							defaults.moveObj.style.top =  T + "px";		
						};
						document.onmouseup = function (ev){
							document.onmousemove = document.onmouseup = null;	
						}
						//阻止冒泡
						ev.stopPropagation();
						//阻止浏览器默认行为
						ev.preventDefault();
					}
				}
			}
			//自己调用，结构初始化
			dialogObj.init();
		}
	}
}());


