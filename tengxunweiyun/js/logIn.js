;(function(){
//1.头像抖动函数
	//获取头像
	var logInImg = tools.$(".logInImg")[0];
	//给头像添加抖动效果
	var arr = [];//声明一个数组
	for( var i = 10 ;i > 0; i -= 2 ){
		arr.push(i,-i);
	}
	arr.push(0);
	//获取logInImg的left值和top值
	var logInImgL = logInImg.offsetLeft;
	//给头像添加抖动
	timer1 = setInterval(function(){
		var i = 0;
		timer2 = setInterval(function(){
			logInImg.style.left = logInImgL + arr[i] + "px";
			i++;
			if( i == arr.length ){
				clearInterval(timer2);
			}
		},30)
	}, 3000);

//2.显示登陆框函数
	//点击logInImg显示登录框
	logInImg.onclick = function(){
		//去除头像抖动效果
		clearInterval(timer1);
		//生成div，插入登陆框
		var newlogin = document.createElement("div");
		newlogin.setAttribute("id", "bg");
		newlogin.innerHTML = view.logInBox();
		document.body.appendChild(newlogin);
		$(newlogin).animate({
			opacity: 1
		},1000)
		//获取body的宽度和高度
		var W = document.body.clientWidth;
		var H = document.body.clientHeight;
		var bg = tools.$("#bg");
		bg.style.width = W + "px";
		bg.style.height = H + "px";
		//大小自适应网页高度
		window.addEventListener("resize",function(){
			W = document.body.clientWidth;
			H = document.body.clientHeight;
			bg.style.width = W + "px";
			bg.style.height = H + "px";
		},false);

		//获取图片
		var bgImg = tools.$(".bgImg")[0];
		//获取li
		var allLi = tools.$("li",bgImg);
		//获取图片的数量
		var len = allLi.length;
		//除了第一张图片，给定别的图片left值10000px
		allLi[len-1].style.left = "10000px";
		//获取一张图片的宽度
		var imgW = allLi[0].offsetWidth;

		var message = 0;
		//开启定时器，图片轮播效果
		timer = setInterval(function(){

			var a = message + 1

			if( a > len - 1 ){
				a = 0
			}

			$(allLi).eq(a).css({
				left: imgW
			})
			$(".bgImg").animate({
				left: "-"+imgW
			},function(){
				$(".bgImg").css({
					left: 0
				});
				$(allLi).eq(message).css({
					left: 10000
				});
				$(allLi).eq(a).css({
					left: 0
				});
				if( message != len - 1 ){
					message++;
				}else{
					message = 0;
				}
			})
		},5000)

		//登录框  输入正确的格式
		//获取登录框
		var username = tools.$("#username");
		var password = tools.$("#password");
		var uname = tools.$(".uname")[0];
		var youpasswd = tools.$(".youpasswd")[0];
		

		//验证邮箱的正则表达式
		var reN = /^[\w\.]+@(\d|[a-zA-Z]){2,8}(\.[a-zA-Z]{2,3}){1,3}$/;
		//当输入框失去焦点时 验证邮箱格式是否正确
		username.onblur = function(){
			var val = this.value;
			if( reN.test(val) ){
				uname.innerHTML = "该邮箱可以使用";
				uname.style.color = "";
			}else{
				uname.innerHTML = "请输入正确的邮箱格式";
				uname.style.color = "red";
			}
		}

		//验证密码格式5~10位数字
		var reM = /\d[5,10]/;
		password.onblur = function(){
			var val = this.value;
			if( reM.test(val) ){
				youpasswd.innerHTML = "密码正确";
				youpasswd.style.color = "";
			}else{
				youpasswd.innerHTML = "密码格式错误";
				youpasswd.style.color = "red";
			}
		}

		//获取提示的span标签
		var loginTip = tools.$(".loginTip")[0];
		var loginTipMask = tools.$(".loginTipMask")[0];
		//给提示条添加动画
		setInterval(function(){
			$(loginTip).animate({
				opacity: 0
			},1000,function(){
				$(loginTipMask).css({
					width: 150
				})
				$(loginTip).css({
					opacity: 1
				})
			})

			setTimeout(function(){
				$(loginTipMask).animate({
					width: 0
				},1000)
			},3000)
		},4000)


		//点击登陆按钮，登陆窗口消失，显示微云主页面
		var  login = tools.$(".login")[0];
		var loginBtn = tools.$("input",login)[0];
		//点击登陆按钮，删除登陆框
		loginBtn.onclick = function(){
			document.body.removeChild(bg);
			clearInterval(timer)
		}
	}


//3.侧边栏移入事件
	var navBox = tools.$(".nav-box")[0];
	var navMask = tools.$(".nav-mask")[0];
	tools.addEvent(navBox,"mouseover",function(ev){
		navMask.style.display = "block";
		var target = ev.target;
		var navList = tools.parents(target,".link");
		if( navList ){
			var T = navList.offsetTop;
			navMask.style.top = T + "px";
			setTimeout(function(){
				navMask.style.transition = ".2s";
			},30)
		}
	});
	//mouseleave做移出事件，不用mouseout,这两个事件是由区别的
	tools.addEvent(navBox,"mouseleave",function(ev){
		navMask.style.display = "none";
		navMask.style.transition = "none";
	});


//4.项目说明部分
	//获取项目说明元素
	var explain = tools.$(".explain")[0];
	setTimeout(function(){
		explain.style.display = "block";
		$(explain).animate({
			right: 0
		},1000)
	},2000)
	//获取explain下的span元素
	var spanMask = tools.$("span",explain)[0];
	//获取explain下的div元素
	var spanDiv = tools.$("div",explain)[0];
	//获取该元素的width
	var spanMaskW = parseInt(getComputedStyle(spanDiv).width);
	//给该元素添加动画
	var timer3 = null;
	timer3 = setInterval(function(){
		$(spanMask).animate({
			width: 0
		},2000,function(){
			$(spanMask).css({
				width: spanMaskW
			})
		})
	})

	//给spanDiv添加点击事件处理
	tools.addEvent(spanDiv,"click",function(){
		//explain.style.animation = "bounce 2s ease-in";
		explain.style.right = "-450px";
	})

	//点击explain 让explain显示
	tools.addEvent(explain,"click",function(ev){
		var target = ev.target;
		if( this.style.right == "-450px" && target != spanDiv && target != spanMask){
			//explain.style.animation = "none";
			this.style.right = 0;
		}
	})
	tools.addEvent(explain,"mousemove",function(ev){
		ev.preventDefault();
	})

	
	










})();