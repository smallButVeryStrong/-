;(function(){
	var oCalendar = $("#calendar");
	var list2 = $(".list2")[0];
	var newTime = $(".newTime")[0];
	var newDate = $(".newDate")[0];
	var checkDate = $(".checkDate")[0];
	var oStrong = $("strong",checkDate)[0];
	var upBtn = $(".upBtn")[0];
	var downBtn = $(".downBtn")[0];
	var set = $(".set")[0]; 

	//初始化页面高度
	oCalendar.style.height = document.documentElement.clientHeight + "px";
	//改变屏幕大小的时候
	window.onresize = function(){
		oCalendar.style.height = document.documentElement.clientHeight + "px";
	}

	var arrWeek = ['日','一','二','三','四','五','六'];
	var d = new Date();
	var oldYear = d.getFullYear();
	var oldMonth = d.getMonth();
	//获取当前日期
	var oldDate = d.getDate();//原先位置在封装函数里边？？
	//设置现在的时分秒
	function addZero(time){
		return time >= 10 ? time : "0" + time;
	}
	function allTime(){
		newDate.innerHTML = d.getFullYear()+'年'+addZero((d.getMonth()+1))+'月'+addZero(d.getDate())+'日'+' 星期'+ arrWeek[d.getDay()];
		oStrong.innerHTML = d.getFullYear()+'年'+addZero((d.getMonth()+1))+'月';
	}
	//allTime调用 显示所有时间
	allTime();
	timer = setInterval(function(){
		var d = new Date();
		newDate.innerHTML = d.getFullYear()+'年'+addZero((d.getMonth()+1))+'月'+addZero(d.getDate())+'日'+' 星期'+ arrWeek[d.getDay()];
	},1000);
	//调用函数 显示当前时间 以及 日历
	calendar(d.getFullYear(),d.getMonth(),oldDate);
	//点击单个日期改变颜色
	function fn(){
		var calendarLi = $("li",$(".list2")[0]);
		//week + howMuchDaysThisMonth只有当前月份的日期才能够点击
		//上一个月或者下一个月显示在该月的日期不能点击，不能改变其颜色
		for( var i = week;i < week + howMuchDaysThisMonth;i++ ){
			calendarLi[i].index = i;
			//点击日期，给日期添加背景颜色，并改变其文字的颜色
			calendarLi[i].onclick = function(ev){
				for( var j = week;j < week + howMuchDaysThisMonth;j++ ){
					calendarLi[j].className = "";
					calendarLi[j].style.color = "#575757"
				}
				calendarLi[this.index].className = "nowDateLiStyle";
				calendarLi[this.index].style.color = "#fff";
				
			}
		}
	}
	//点击改变对应li的样式
	fn();
	//点击上一月
	var M = d.getMonth();
	upBtn.onclick = function(){
		M++;
		var nowDate = 1;
		if( M > 11 ){
			d.setMonth(M);
			M = 0;
		}
		if( d.getFullYear() == oldYear && M == oldMonth ){
			nowDate = oldDate;
		}
		oStrong.innerHTML = d.getFullYear()+'年'+addZero(M+1)+'月';	
		calendar(d.getFullYear(),M,nowDate);
		fn();
	}
	downBtn.onclick = function(){
		M--;
		var nowDate = 1;
		if( M < 0 ){
			d.setMonth(M);
			M = 11;
		}
		if( d.getFullYear() == oldYear && M == oldMonth ){
			nowDate = oldDate;
		}
		oStrong.innerHTML = d.getFullYear()+'年'+addZero(M+1)+'月'
		calendar(d.getFullYear(),M,nowDate);
		fn();
	}
	//定义成全局变量  以便更改框使用
	var howMuchDaysThisMonth;
	var week;
	function calendar(year,month,nowDate){//month指当前月的下标
		//获取当前月有几天
		var d1 = new Date(year,month+1,1);
		howMuchDaysThisMonth = new Date(d1-1).getDate();
		//获取当前月1号是星期几
		d.setDate(1);
		d.setMonth(month);
		week = d.getDay();
		//获取上个月有几天
		var howMuchDaysLastMonth = new Date(d-86400000).getDate();
		//生成日历基本格式
		var str = "";
		var k = -week;
		var j = 1;
		var m = howMuchDaysLastMonth;
		var n = howMuchDaysThisMonth;
		for( var i = 0 ; i < 42 ;i++ ){
			k++;
			if( k < 1 ){
				str += '<li style="color: #9e9e9e">'+(m+k)+'</li>';
			}else if( k > n){
				str += '<li style="color: #9e9e9e">'+j+'</li>';
				j++;
			}else if( k == nowDate ){
				str += '<li class="nowDateLiStyle" style="color: #fff">'+k+'</li>';
			}else{
				str += '<li>'+k+'</li>';
			}
		}
		list2.innerHTML = str;
	}

	//更改样式 js
	//首先生成下拉菜单里边的选项
	var change = $(".change")[0];
	var chiceYear = $(".chiceYear")[0];
	var chiceMonth = $(".chiceMonth")[0];
	var chiceDate = $(".chiceDate")[0];
	var chiceHours = $(".chiceHours")[0];
	var chiceMinutes = $(".chiceMinutes")[0];
	var changBtn = $(".changBtn")[0];
	var oa = $("a",changBtn);
	var chiceDateValue = d.getDate();//默认为当前日期
	chiceYear.onchange = function(){
		var d2 = new Date(chiceYear.value,chiceMonth.value,1);
		var m = new Date(d2-1).getDate();
		//此处的31需要进行判断，稍后再写！！！
		changeRange(chiceDate,m,1,oldDate);
		if( chiceDateValue > m ){
			chiceDateValue = 1;
		}
		//此处当日期小于10的时候，应该调用addZero函数添加0
		chiceDate.value = addZero(chiceDateValue);
		

	}
	chiceMonth.onchange = function(){
		var d2 = new Date(chiceYear.value,chiceMonth.value,1);
		var m = new Date(d2-1).getDate();
		//次数更改31
		changeRange(chiceDate,m,1,oldDate);
		if( chiceDateValue > m ){
			chiceDateValue = 1;
		}
		//此处当日期小于10的时候，应该调用addZero函数添加0
		chiceDate.value = addZero(chiceDateValue);
		
	}


	//添加日期选择
	chiceDate.onclick = function(){
		chiceDateValue = chiceDate.value;
		
	}
	


	changeRange(chiceYear,2030,1990,d.getFullYear());
	changeRange(chiceMonth,12,1,d.getMonth()+1);
	//已经把howMuchDaysThisMonth弄成了一个全局变量 这个变量代表当前月有多少天
	changeRange(chiceDate,howMuchDaysThisMonth,1,oldDate);
	changeRange(chiceHours,23,0,d.getHours());
	changeRange(chiceMinutes,59,0,d.getMinutes());
	function changeRange(obj,start,end,now){
		var html = ""; 
		for( var i = start;i >= end;i-- ){
			if( i == now ){
				html += '<option selected>'+addZero(i)+'</option>'
			}else{
				html += '<option>'+addZero(i)+'</option>'
			}	
		}
		obj.innerHTML = html;
	}
	//显示更改时间模块
	set.onclick = function(){
		change.style.display = "block";
	}
	//点击更改
	oa[1].onclick = function(){
		oldYear = chiceYear.value;
		oldMonth = chiceMonth.value-1;
		//点击切换月份中  oldDate 更改值
		oldDate = chiceDateValue;
		//停止之前控制时间的定时器
		clearInterval(timer);
		d.setFullYear(chiceYear.value);
		d.setMonth(chiceMonth.value-1);
		d.setDate(chiceDate.value);
		d.setHours(chiceHours.value);
		d.setMinutes(chiceMinutes.value);
		nowDate = d.getDate();
		//更改M的值  此处还应该是下标值
		M = d.getMonth();
		var oldTimeStamp = d.getTime();
		//调用函数，重新走时间
		allTime();
		var j = 0;
		timer = setInterval(function(){
			j += 1000;
			//此处重新声明变量  所以以后变量名尽量不要重复
			var d = new Date( oldTimeStamp + j );//此处有问题？？？？
			newTime.innerHTML = addZero(d.getHours())+':'+addZero(d.getMinutes())+':'+addZero(d.getSeconds());
			newDate.innerHTML = d.getFullYear()+'年'+addZero((d.getMonth()+1))+'月'+addZero(d.getDate())+'日'+' 星期'+ arrWeek[d.getDay()];
		},1000);
		calendar(d.getFullYear(),d.getMonth(),nowDate);
		change.style.display = "none";
		fn();
	}
	oa[0].onclick = function(){
		change.style.display = "none";
	}
})();