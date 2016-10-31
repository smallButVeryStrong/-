(function(){

//获取元素部分----------------------------------------------------------------------
	var footerNav = $("#nav");//获取导航标签nav
	var footerNavAllLi = $("#nav li");//获取导航部分的所有Li标签
	var footerNavAllSpan = $("#nav span");//获取导航部分的所有span标签
	var navHeighline = $("#nav-heighline");//获取导航部分的下划线元素

	var buttonDownload = $(".button-download");//获取立即下载这个元素

	var slideBar = $("#slidebar")//获取侧边栏滚动条
	var slideBarAllLi = $("#slidebar li")//获取侧边栏滚动条
	var stageLen = slideBarAllLi.length;

	var buttonNext = $(".button-next");//获取下一个页面按钮

	var jqDock  = $(".jqDock ")
	var jqDockItem = $(".jqDockItem ")
	var stage4Icon = $(".stage-4-icon");
	var stage4IconItem = $(".stage-4-icon-item");
	var stage4Span = $(".stage-4-icon-item span")
	var stage4Img = $(".stage-4-icon-item img");
	
	var stage4Title = $(".stage-4-title");//获取最后一屏的title元素
	var stage4Description = $(".stage-4-description");//获取最后一屏的description元素


//初始化网页部分--------------------------------------------------------------------

//1.初始化导航部分下划线
	
	var navOneL = footerNavAllSpan.offset().left;//获取导航部分第一个span的初始位置left值

	var navOneW = footerNavAllSpan.width();//获取导航部分第一个span的初始位置width值

	navHeighline.css({left: navOneL,width: navOneW });//给定下划线元素初始位置 和 宽度



//功能交互部分---------------------------------------------------------------------------

//1.footer部分  导航下划线js  给nav添加移入、移出
	var navW = 0;
	var navL = 0;
	footerNav.on("mouseover",function(ev){
		var $target = $(ev.target);
		if( $target.is("a") ){
			navW = $target.children().width();
			navL = $target.children().offset().left;
			navHeighline.css({left: navL,width: navW })
		}
	})

	footerNav.on("mouseleave",function(){
		var timer =  setInterval( function(){
			if( navHeighline.offset().left == navL ){
				navHeighline.css({left: navOneL,width: navOneW });
				clearInterval(timer);
			}
		},16)
	})

//2.给#stages添加滚轮事件处理
	
	var onOff = false;
	buttonDownload.eq(0).on("webkitAnimationEnd",function(){
		$("#stage-1").addClass(" stage-state-in ")
		onOff = true;	
	})

	for( var i = 0;i < buttonDownload.length;i++ ){	
		fn(i)
	}

	function fn(i){
		buttonDownload.eq(i).on("webkitTransitionEnd",function(){
			onOff = true;
		})
	}

	var pagesNum = 0;
	var pageArr = [1,5,2,3,4];

	mouseWheel(document,upFn,downFn);//滚轮事件处理函数 upFn向上处理函数  downFn向下处理函数

//3.点击侧边栏任意li，切换到相应的stage上去
	slideBar.on("click",function(ev){
		var $target = $(ev.target);
		if( onOff ){
			jqDock.off( "mousemove" );
			var oldPagesNum = pagesNum;
			if( $target.is("li")){//a标签跳转
				pagesNum = $target.index();
			}else if( $target.is("span") ){
				pagesNum =$target.parents("li").index();
			}
			
			if( oldPagesNum < pagesNum ){
				if(  pagesNum <= buttonDownload.length - 1 ){
					for( var i = 0;i < pagesNum;i++ ){
						$( "#stage-"+pageArr[i] ).addClass(" stage-state-in stage-state-out").removeClass("stage-state-out-in");
					}
					slideBarAllLi.eq(oldPagesNum).removeClass("slidebar-active");
					$( "#stage-"+pageArr[pagesNum]).addClass(" stage-state-in ")
					slideBarAllLi.eq(pagesNum).addClass("slidebar-active");
					onOff = false;
				}
			}
			if( oldPagesNum > pagesNum ){
				if(  pagesNum >=0 ){
					for( var i = stageLen;i > pagesNum;i-- ){
						$( "#stage-"+pageArr[i] ).removeClass("stage-state-in stage-state-out stage-state-out-in");
					}
					slideBarAllLi.eq(oldPagesNum).removeClass("slidebar-active");
					$( "#stage-"+pageArr[pagesNum]).removeClass("stage-state-out").addClass("stage-state-out-in ");
					slideBarAllLi.eq(pagesNum).addClass("slidebar-active");
					onOff = false;
				}
			}
			hasIn();
		}
	})
	
//4.添加下一个按钮的点击事件处理、
	buttonNext.on("click",function(ev){
		hasIn();
		 downFn(); 
	})

	$(document).on("mousedown",function(ev){//阻止浏览器默认行为
		ev.preventDefault();
	})

//5.给页面stage-5里边的图片添加mouseover、mouseout事件处理
	
	var len = stage4Title.children().length;
	var oldIndex = len - 1;//记录上一个下标

	stage4IconItem.on("webkitTransitionEnd",function(){
		if( $("#stage-4").hasClass("stage-state-in") ){
			jqDock .on("mousemove",function(ev){
				var $target = $(ev.target);
				if( $target.is(".jqDockItem") || $target.parents(".jqDockItem")  ){
					var targetEle = $target.is(".jqDockItem") ? $traget : $target.parents(".jqDockItem");
					if( oldIndex != targetEle.index() ){	
						stage4Title.children().eq( oldIndex ).animate({
							opacity:0
						},20,function(){
							$(this).hide();
						})
						stage4Description.children().eq( oldIndex ).animate({
							opacity:0
						},20,function(){
							$(this).hide();
						})
						stage4Title.children().eq( targetEle.index() ).show().animate({
							opacity:1
						},20)
						stage4Description.children().eq( targetEle.index() ).show().animate({
							opacity:1
						},20)
						oldIndex = targetEle.index();
					}
					var d=0;
					var iMax=400;
					var i=0;
					var arr = [];
					var maxH = 0;
					for( ;i < stage4Img.length; i++ ){
						stage4Img.eq(i).css({
							transition:"none"
						})
						//鼠标的位置与图片的中间位置差多少距离  X轴方向
						var l = ev.clientX - (stage4Img.eq(i).offset().left + stage4Img.eq(i).width()/2);
						//鼠标的位置与图片的中间位置差多少距离 Y轴方向
						var t = ev.clientY - ( stage4Img.eq(i).offset().top + stage4Img.eq(i).height()/2);
						//Math.pow(l,2) 代表l的平方  d是鼠标距离每个图片中心点的位置
						var d = Math.sqrt(Math.pow(l,2) + Math.pow(t,2));
						//d取两个值中间的最小值
						d=Math.min(d, iMax);
						var W = ((iMax-d)/iMax)*70+90;
						
						arr.push(W);
						maxH = Math.max.apply(null,arr);
						//图片的宽度
						// stage4Img.eq(i).css("width",W);
						stage4Img.eq(i).css({
							"width":W,
							verticalAlign: "text-bottom"
						});
					}
					 stage4Span.css({
					 	display:"inline-block",
					 	height:maxH,
					 	lineHeight: maxH
					 })

				}
			})
		}
	})

	//当鼠标移出oDiv时，所有图片恢复初始尺寸
	var timer = null;
	jqDock .on("mouseleave", function(){
		for( var i = 0;i < stage4Img.length;i++ ){
			stage4Img.eq(i).css({
				width:"90",
				transition:".2s"
			})
		}
		timer = setTimeout(function(){
			for( var i = 0;i < stage4Img.length;i++ ){
				stage4Img.eq(i).css({
					transition:"none"
				})
				
			}
		},200)
	})
		

//函数封装部分------------------------------------------------------------------------------------------------------
//1.判断滚轮是向上滚动 还是向下滚动
	function mouseWheel(element,upFn,downFn){
		element.onmousewheel = wheelFn
		if( element.addEventListener ){
			element.addEventListener("DOMMouseScroll",wheelFn,false);
		}

		function wheelFn(ev){
			var direction = true;
			if(ev.wheelDelta){  //ie和chrome
				direction = ev.wheelDelta > 0 ? true : false;
			}else if(ev.detail){ //FF
				direction = ev.detail < 0 ? true : false;
			}

			if( direction ){  //向上
				typeof upFn === "function" && upFn();
			}else{  //向下
				typeof downFn === "function" && downFn();
			}

			ev.preventDefault();
		}

	}

//2.滚轮向下滚动执行的函数
	function downFn(){
		if(  onOff ){
			if(  pagesNum != buttonDownload.length - 1 ){
				$( "#stage-"+pageArr[pagesNum] ).addClass("stage-state-out");
				slideBarAllLi.eq(pagesNum).removeClass("slidebar-active");
				pagesNum++;
				$( "#stage-"+pageArr[pagesNum]).addClass(" stage-state-in ");
				slideBarAllLi.eq(pagesNum).addClass("slidebar-active");
				onOff = false;
			}
			hasIn();
		}
	}

//3.滚轮向上滚动执行的函数
	function upFn(){
		if( onOff ){
			if(  pagesNum >=1 ){
				$( "#stage-"+pageArr[pagesNum] ).removeClass("stage-state-in stage-state-out stage-state-out-in");
				slideBarAllLi.eq(pagesNum).removeClass("slidebar-active");
				pagesNum--;
				$( "#stage-"+pageArr[pagesNum]).removeClass("stage-state-out").addClass(" stage-state-out-in ");
				slideBarAllLi.eq(pagesNum).addClass("slidebar-active");
				onOff = false;
			}
			jqDock.off( "mousemove" );
		}
	}
//4.监测page4是否由stage-state-in这个class
	function hasIn(){
		if($("#stage-4").hasClass("stage-state-in")){
			jqDock.off( "mousemove" );
		}
	}

})();