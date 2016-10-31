//用函数自执行的方式，将这个函数封闭起来，用来保护函数里边的变量
;(function(){

//-----------获取元素部分----------------------------------------------------

//获取页面的内容区域元素
var weiyunContent = tools.$(".weiyun-content")[0];
//获取页面header
var header = tools.$(".header")[0];
//获取文件区域容器file-list
var fileList = tools.$(".file-list")[0];
//获取文件导航区域容器
var pathNav = tools.$(".path-nav ")[0]; 
//获取树形菜单容器
var treeMenu = tools.$(".tree-menu")[0];
//获取新建文件夹按钮
var create = tools.$(".create")[0];
//获取文件夹的集合
var fileItem = tools.$(".file-item");
//获取所有item
var allItem = tools.$(".item");
//获取导航区域最后一个元素
var currentPath = tools.$(".current-path");
//获取属性菜单中的tree-title
var treeTitle = tools.$(".tree-title");
//获取单选按钮
var checkBox = tools.$(".checkbox");
//获取全选按钮
var checkedAll = tools.$(".checked-all")[0];
//获取小提示框 新建成功等提示框
var fullTipBox = tools.$(".full-tip-box")[0];
//获取删除按钮
var delect = tools.$(".delect")[0];
//获取重命名按钮
var rename = tools.$(".rename")[0];
//获取移动到按钮
var move = tools.$(".move")[0];
//获取遮罩层
var mask = tools.$(".mask")[0];
//获取reload
var reload = tools.$(".reload")[0];
//获取鼠标右键自定义弹框
var mouseTip = tools.$(".mouseTip")[0];
//获取鼠标右键自定义弹框中的重命名的li
var mouseTipRename = tools.$(".mouseTipRename",mouseTip)[0];
//找到搜索框
var searchInput = tools.$("input",tools.$(".beautiful-input")[0])[0];
//定义是不是在拖拽产生剪影  true代表没有
var isDrag = true;
//小提示的内容
var  tipContent = ["新建文件夹成功","请选择文件","删除文件成功","重命名成功","文件名有冲突,请重新命名","只能对一个文件重命名","部分移动失败，重名了"];
//-----------渲染页面区域----------------------------------------------------

//1.让页面的高度自适应，渲染出整个页面

	weiyunContent.style.height = autoHeight(header);

	//改变页面大小时，让页面的高度也自适应
	window.addEventListener("resize",function(){
		weiyunContent.style.height = autoHeight(header);
	},false);

//2.分别渲染出 文件区域  文件导航区域  树形菜单区域  
	//2.1 文件区域，根据已有的数据，渲染出文件区域
	
	//获取数据集合
	var datas = data.files;
	//找到微云下的子数据
	var childs = dataAction.getChildsById(datas,0);
	//渲染出微云下面的子数据
	fileList.innerHTML = childsFiles(childs);

	//2.2 导航区域 根据文件区域显示的文件来渲染
	pathNav.innerHTML = view.createPathNavConstruct(datas,0);

	//2.3 生成属性菜单区域 全部渲染出来
	//最顶层id为-1
	treeMenu.innerHTML = view.createTreeHtml(datas,-1);
	//声明变量，记录上一个元素
	var prev = treeTitle[0];
	//树形菜单添加点击状态 初始化微云下子元素显示 其余闭合
	treeInit(treeTitle);

//-----------功能区域--------------------------------------------------------

//1.点击文件区域文件夹，能够渲染出该文件夹的子级
	
	//采用事件委托的方式，将该事件处理绑定到其父级fileList上
	tools.addEvent(fileList,"click",function(ev){
		//控制鼠标右键弹框的显示隐藏
		if( mouseTip.style.display == "block" ){
			mouseTip.style.display = "none";
			mouseTipRemove.style.display = "block";
		}
		if( !create.statues  ){//判断是不是正在新建
			//如果正在新建，点击不能进入子级
			//找到要点击的file-item
			if( ev.target.nodeName != "LABLE" &&
				ev.target.nodeName != "INPUT" &&
				isDrag
			){//为什么阻止冒泡没有用	
				var target = tools.parents(ev.target,".file-item");
				if( target ){
					//点击同步函数
					opposite(target);	
					//给渲染的子级加状态
					checkBoxStatues(checkBox);
					//点击渲染树形菜单上没有展开的部分对应展开
					//找到点击元素的id
					var targetId = target.dataset.fileId;
					//找到该树形菜单下该id对应的元素
					var targetTreeElement = tools.getTreeById("tree-title",targetId);
					//看一下该元素的状态，如果是没有展开，则展开
					if( targetTreeElement.statues ){
						if( targetTreeElement.nextElementSibling.children.length ){//如果该元素有子集	
							childsUlShow(targetTreeElement);
							targetTreeElement.statues = false;
						}
					}
					//全选按钮不勾选
					tools.removeClass(checkedAll,"checked");	
				}
			}else if( ev.target.nodeName == "INPUT" ){
				//如果是input的话阻止冒泡
				ev.stopPropagation();
			}
				
		}			
	})
	//当鼠标摁下时阻止冒泡
	tools.addEvent(fileList,"mousedown",function(ev){
		var target = ev.target;
		if( tools.parents(target,".file-item") ){
			ev.stopPropagation();
			//阻止默认行为
			ev.preventDefault();
		}
	})
//2.移入、移出fileList 采用事件委托方式
	//给所有单选按钮添加状态  true代表没有被选中
	checkBoxStatues(checkBox);
	//移入
	tools.addEvent(fileList,"mouseover",function(ev){
		var target = tools.parents(ev.target,".file-item");
		var checkbox = tools.$(".checkbox",target)[0];
		//!isDrag在拖拽产生剪影
		if( target && checkbox.statues && isDrag){//如果没有移入到file-item里边，target是不存在的
			tools.addClass(target,"file-checked");
		}
	})
	//移出
	tools.addEvent(fileList,"mouseout",function(ev){
		var target = tools.parents(ev.target,".file-item");
		var checkbox = tools.$(".checkbox",target)[0];
		if( target && checkbox.statues ){
			tools.removeClass(target,"file-checked");
		}
	})
//3.全选、单选功能  也采取事件委托的方式
	//单选
	tools.addEvent(fileList,"click",function(ev){
		var target = ev.target;
		if( target.nodeName == "LABLE" ){//点击的如果是选中按钮
			if( !tools.hasClass(target,"checked") ){
				tools.addClass(target,"checked");
				target.statues = false;
			}else{
				tools.removeClass(target,"checked");
				target.statues = true;
			}
			var whoSelectArr = whoSelect(checkBox);
			if( whoSelectArr.length == checkBox.length && whoSelectArr.length == 0){
				tools.addClass(checkedAll,"checked");
			}else{
				if( tools.hasClass(checkedAll,"checked") ){
					tools.removeClass(checkedAll,"checked");
				}
			}
		}
	})
	//全选
	tools.addEvent(checkedAll,"click",function(){
		//如果全选按钮没有选中
		if( !tools.hasClass(checkedAll,"checked") ){
			tools.addClass(checkedAll,"checked");
			for( var i = 0;i < checkBox.length;i++ ){
				if( !tools.hasClass(checkBox[i],"checked") ){
					tools.addClass(tools.parents(checkBox[i],".file-item"),"file-checked");
					tools.addClass(checkBox[i],"checked");
					checkBox[i].statues = false;
				}
			}
		}else{//如果全选按钮选中
			tools.removeClass(checkedAll,"checked");
			for( var i = 0;i < checkBox.length;i++ ){
				if( tools.hasClass(checkBox[i],"checked") ){
					tools.removeClass(tools.parents(checkBox[i],".file-item"),"file-checked");
					tools.removeClass(checkBox[i],"checked");
					checkBox[i].statues = true;
				}
			}
		}
	})
	
//4.点击导航区域 渲染出相应的文件区域
	//采用事件委托方式
	tools.addEvent(pathNav,"click",function(ev){
		var target = tools.parents(ev.target,"a");

		//点击同步函数	
		opposite(target);
		checkBoxStatues(checkBox);
		//处理bug 当全选时，点击导航菜单，全选消失
		tools.removeClass(checkedAll,"checked");
	})
	//当鼠标摁下时阻止冒泡
	tools.addEvent(pathNav,"mousedown",function(ev){
		ev.stopPropagation();
		ev.preventDefault();
	})
//5.点击树形菜单区域 同样采用事件委托
	tools.addEvent(treeMenu,"click",function(ev){
		var target = tools.parents(ev.target,"div");
		//点击同步函数
		if( target != treeMenu ){//如果点击的不是最大的树形菜单容器treeMenu 如果是treeMenu报错
			//点击树形菜单 让树形菜单、导航、文件区域对应
			opposite(target);
			//给点选按钮添加状态
			checkBoxStatues(checkBox);
			//给属性菜单添加 点击展开 闭合事件
			if( target.nextElementSibling.children.length ){
				if( target.statues ){//如果状态为真，代表没有展开
					childsUlShow(target);
				}else{//否则 已经代表展开  点击ico小图标闭合
					if( tools.parents(ev.target,".ico") ){
						childsUlHide(target);
					}
				}
			}
		}
	})
	//阻止默认行为
	tools.addEvent(treeMenu,"mousedown",function(ev){
		ev.preventDefault();
	})
//6.新建文件夹功能
	create.statues = null;//新建的状态
	tools.addEvent(create,"click",function(ev){
		//新建的时候 给create按钮添加一个自定义属性
		create.statues = true;
		//声明一个新对象，来储存新建的这条信息
		var dataobj = {
			id:tools.uuid()
		};
		fileList.innerHTML = view.createFileConstruct(dataobj) + fileList.innerHTML;
		//titleInput 使 title 隐藏 input 显示并获取焦点
		titleInput(fileItem[0]);
		
		//给单选框添加状态
		checkBoxStatues(checkBox);
		//给input绑定事件，当mousedown时，阻止冒泡
		var edtor = tools.$(".edtor",fileItem[0])[0];
		tools.addEvent(edtor,"mousedown",function(ev){
			ev.stopPropagation();
		})
		
	})
	
//7.在document上的mousedown事件处理  新建文件夹成功  重命名是不是成功
	var timer = null;
	var pid = null;//记录当行区域最后一一个元素的id
	tools.addEvent(document,"mousedown",function(ev){
		//首先判断是不是正在新建
		if( create.statues ){//如果正在新建
			//看看edtor里边的是不是有内容 首先获取这个input
			var edtor = tools.$(".edtor",fileItem[0])[0];
			if( edtor.value.trim() ){//如果新建成功
				//判断是否重名  每次都会重新获取名字并进行判断
				if( isReName(getName(navPid()),edtor.value.trim()) ){
					//如果重名，弹出小弹框
					littleTip("warn",tipContent[4]);
					//删除新建的这个文件
					fileList.removeChild(fileItem[0]);
					//更改新建文件夹的状态  改成没有在新建的状态
					create.statues = false;
					//然后直接返回，不再执行后边的代码
					return;
				}
				//title显示 input隐藏
				titleInputSucess(fileItem[0]);
				
				//找到新生成这个文件的id
				var fileId = fileItem[0].dataset.fileId;
				//找到新生成文件的父id
				pid = navPid();
				//新建文件夹生成数据
				dataobj = {
					id:fileId,
					//pid:currentPath.dataset.fileId,
					pid:pid,
					title:edtor.value.trim(),
					type:"flie"
				}
				//如果新建，将新建按钮状态也改为false
				create.statues = false;
				//将新生成的数据，放到datas里边，放到最前边
				datas.unshift(dataobj);
				//依照pid找到树形菜单中对应的元素
				var treeElement = tools.getTreeById("tree-title",pid);
				//给这个元素加上小三角，代表有子集
				tools.addClass(treeElement,"tree-contro");
				tools.removeClass(treeElement,"tree-contro-none");
				//找到这个元素的下一个兄弟节点
				var treeUl = treeElement.nextElementSibling;
				//在其下边生成结构
				treeUl.innerHTML += view.createTreeLi(datas,dataobj);
				//新建成功 全选按钮不选中
				if( tools.hasClass(checkedAll,"checked") ){
					tools.removeClass(checkedAll,"checked");
				}
				//新建文件夹成功，出现小提示框
				littleTip("ok",tipContent[0]);

			}else{//否则 新建不成功，删除刚才新建的那个文件
				fileList.removeChild(fileItem[0]);
				//如果新建不成功，将新建按钮状态改为false
				create.statues = false;
			}
		}
		//判断是不是正在重命名
		if( rename.statues ){//如果正在重命名
			//获取正在重命名的input
			var edtor = tools.$(".edtor",renameFile)[0];
			if( edtor.value.trim() == "" ){
				edtor.value = renameDataTitle;	
			}else{
				var newTitleName = edtor.value.trim();
				//判断是否重名
				if( isReName(showFileTitle,newTitleName) ){
					//如果重名，弹出小弹框
					littleTip("warn",tipContent[4]);
					//名字依旧是之前的名字
					edtor.value = renameDataTitle;
				}
			}
			//title显示 input隐藏
			titleInputSucess(renameFile);
			rename.statues = true;//更改重命名按钮状态
			//根据重命名元素的id，找到树形菜单中对应的元素，更新其title
			//树形菜单对应的元素
			var treeReName = tools.getTreeById("tree-title",renameId);
			//找到treeReName里边控制名字的元素  并更改其名称
			tools.$(".ellipsis",treeReName)[0].innerHTML = renameData.title;
		}	
	});
	//当mousemove时，组织默认行为
	tools.addEvent(document,"mousemove",function(ev){
			ev.preventDefault();
	})
//8.框选  采用事件委托
	var newDiv = null;
	var disX = 0;
	var disY = 0;
	tools.addEvent(document,"mousedown",function(ev){

		var target = ev.target;
		//当点击新建等功能按钮时，阻止生成选框，但是组织冒泡为什么没有用？？？
		if( tools.parents(target,".handleFile") || 
        	tools.parents(target,".tree-menu")  ||
        	tools.parents(target,".lay-aside")	||
        	tools.parents(target,".checkbox")	||
        	tools.parents(target,".checked-all")	||
        	tools.parents(target,".edtor")	||
        	tools.parents(target,".header") ||
        	tools.parents(target,"input") ||
        	tools.parents(target,".explain") ||
        	target == tools.$(".explain")[0]

    	){
			return;
		}
		newDiv = document.createElement("div");
		document.body.appendChild(newDiv);
		tools.addClass(newDiv,"selectTab");
		//鼠标down的坐标
		disX = ev.clientX;
		disY = ev.clientY;
		newDiv.style.left = disX + "px";
		newDiv.style.top = disY + "px";
		tools.addEvent(document,"mousemove",moveSelectBox);
		tools.addEvent(document,"mouseup",upSelectBox);
		//点击document空白区域 取消选中
		for( var i = 0; i < fileItem.length; i++ ){
            tools.removeClass(fileItem[i],"file-checked");
            tools.removeClass(checkBox[i],"checked");
            checkBox[i].statues = true;
        }
        tools.removeClass(checkedAll,"checked");
        checkedAll.statues = true;
		ev.preventDefault();
	})
//9.删除 文件夹deleteFiles
	tools.addEvent(delect,"click",deleteFiles);

//10.对已有文件夹重命名
	rename.statues = false;//没有重命名的状态是false
	var renameFile = null;//声明变量 定义重命名的元素
	var renameData = null;//获取重命名文件的数据{}
	var renameDataTitle = null;//记录重命名元素之前的title
	var showFileTitle = null;//记录渲染区域title的集合
	var renameId = null;//记录更改元素的id
	tools.addEvent(rename,"click",renameFiles);


//11.移动到 绑定click事件处理  点击移动到按钮	还没有处理重名的情况？？？？？？？？
	tools.addEvent(move,"click",moveFiles);

//12.移动到 在文件夹上直接拖拽 生成剪影 移动到下一个文件上  依然采用事件委托
	//一个元素上有 mousedown 和 click  这会产生怎么样的效果？？？？？？？？？？？？
	
	tools.addEvent(fileList,"mousedown",function(ev){
		var target = ev.target;
		if( tools.parents(target,".file-item") && 
			target.nodeName != "LABLE"
			){
			//记录当前鼠标的位置
			disX = ev.clientX;
			disY = ev.clientY;
			//绑定mousemove事件处理
			newDiv = null;
			tools.addEvent(document,"mousemove",shadowMouseMove);
			tools.addEvent(document,"mouseup",shadowMouseUp);
		}
	})

//13.网页上的搜索框添加属性
	//获取搜索框的容器
	var beautifulInput = tools.$(".beautiful-input")[0];
	//获取input框
	var searchInput = tools.$("input",beautifulInput)[0];
	//阻止冒泡  
	tools.addEvent(searchInput,"mousedown",function(ev){
		ev.stopPropagation();
	})

//14.遮罩层点击阻止冒泡 mask
	tools.addEvent(mask,"click",function(ev){
		ev.stopPropagation();
	})
	tools.addEvent(mask,"mousedown",function(ev){
		ev.stopPropagation();
	})
	
//15.点击鼠标右键,出现右键菜单,把系统默认的右键菜单给屏蔽掉
	tools.addEvent(fileList,"contextmenu",function(ev){
		//阻止默认的浏览器右键行为
		ev.preventDefault();
		//阻止冒泡
		ev.stopPropagation();
		var targetItem = tools.parents(ev.target,".file-item");
		//判断点击的是不是文件夹
		if( targetItem ){
			//如果正在新建
			if( create.statues ){
				//删除新建的这个文件
				fileList.removeChild(fileItem[0]);
				//更改新建文件夹的状态  改成没有在新建的状态
				create.statues = false;
				//然后直接返回，不再执行后边的代码
				return;
			}
			//如果正在重命名
			if( rename.statues ){
				//找到正在重命名这个元素
				var renameNow = whoSelect(checkBox)[0];
				//找到正在重命名文件夹下的title 和 input
				var nowInput = tools.$(".file-edtor",renameNow)[0];
				var title = tools.$(".file-title",renameNow)[0];
				nowInput.style.display = "none";
				title.style.display = "block";
			}
			//判断点击的是不是右键，如果是右键，自定义右键菜单显示
			if( ev.button == 2 ){
				//找到targetItem里边的勾选按钮
				var targetCheckBox = tools.$(".checkbox",targetItem)[0];
				//如果右击的元素没有被选中
				if( !tools.hasClass(targetCheckBox,"checked")){
					//清空所有选中的文件
					var selectArr = whoSelect(checkBox);
					var len = whoSelect(checkBox).length;
					for( var i = 0;i < len;i++ ){
						tools.removeClass(selectArr[i],"file-checked");
						tools.removeClass(tools.$(".checkbox",selectArr[i])[0],"checked");
						targetCheckBox.statues = true;
					}
					tools.addClass(targetItem,"file-checked");
					tools.addClass(targetCheckBox,"checked");

					mouseTipRename.style.display = "block";
					//更改其状态
					targetCheckBox.statues = false;	
				}
				if( tools.hasClass(targetCheckBox,"checked") ){
					//判断一下当前选中文件夹的数量，如果选中文件夹数量> 1的话，
					//鼠标右键弹框没有 重命名 这一项
					if( whoSelect(checkBox).length > 1 ){
						mouseTipRename.style.display = "none";
					}
				}
					mouseTip.style.display = "block";
				//给定鼠标右键弹出框的left 和 top 值
				mouseTip.style.left = ev.clientX + 5 + "px";
				mouseTip.style.top = ev.clientY + 5 + "px";
			}
		}
	});
	//鼠标右键弹出框 上右键点击 阻止冒泡
	tools.addEvent(mouseTip,"mousedown",function(ev){
		//点击鼠标右键弹出框 阻止冒泡
		ev.stopPropagation();
	})
	//鼠标右键弹出框 上右键点击 阻止默认行为
	tools.addEvent(mouseTip,"contextmenu",function(ev){
		ev.preventDefault();
	})
//16.给document绑定点击事件，如果mouseTipRemove显示，那么就让这个元素隐藏
	tools.addEvent(document,"mousedown",function(){
		if( mouseTip.style.display == "block" ){
			mouseTip.style.display = "none";
			mouseTipRename.style.display = "block";
		}
	})

//17.给鼠标右键小弹框mouseTip的每一项绑定事件处理，依旧采用事件委托的方式
	tools.addEvent(mouseTip,"click",function(ev){
		var target = ev.target;
		//如果点击的是-----删除-----按钮
		if( tools.parents(target,".mouseTipDelete") ){
			deleteFiles();
		}
		//如果点击的是-----移动到----按钮
		if( tools.parents(target,".mouseTipMove") ){
			moveFiles();
		}
		//如果点击的是----重命名-----按钮
		if( tools.parents(target,".mouseTipRename") ){
			renameFiles();
		}
		//将右键小弹框隐藏
		mouseTip.style.display = "none";
	})
	
//18.点击document 搜索框失去焦点
	tools.addEvent(document,"mousedown",function(){
		searchInput.blur();
	})

//19.点击按钮reload 刷新页面
	tools.addEvent(reload,"click",function(){
		//在当前页面刷新页面
		window.open("index.html","_self");
	})
	


//-----------功能实现函数封装----------------------------------------------

//1.自适应高度
function autoHeight(obj){
	return document.documentElement.clientHeight - obj.offsetHeight + "px";
}

//2.渲染文件夹下的子数据 datas 是子数据的集合

function childsFiles(datas){
	var str = "";
	for( var i = 0;i < datas.length;i++ ){
		str += view.createFileConstruct(datas[i]);
	}
	return str;
}

//3.事件委托 点击文件导航 文件 树形菜单让三者同步
//opposite 单词 同步的意思

function opposite(target){
	//找到这个文件夹身上的子数据
	if( target ){//如果id存在，如果找到的是document则id不存在
		var targetId = target.dataset.fileId;
		//找到点击文件的子数据
		var childs = dataAction.getChildsById(datas,targetId);
		//渲染出子数据
		if( childs.length ){
			fileList.innerHTML = childsFiles(childs);
		}else{
			fileList.innerHTML = view.emptyFile();
		}
		//渲染导航区域  targetId点击元素的id
		pathNav.innerHTML = view.createPathNavConstruct(datas,targetId);
		//依照点击的id 找到树形菜单上对应的元素，并加上class
		var treeLi = tools.getTreeById("tree-title",targetId,treeMenu);
		//如果prev存在的话
		if( prev ){
			tools.removeClass(prev,"tree-nav");
		}
		tools.addClass(treeLi,"tree-nav");
		prev = treeLi;
	}
}

//4.给单选按钮添加状态
function checkBoxStatues(obj){
	for( var i = 0;i < obj.length;i++ ){
		if( !tools.hasClass(obj[i],"checked") ){//如果没有被选中的就重新添加其状态
			obj[i].statues = true;
		}
	}
}

//5.封装函数 whoselect 
function whoSelect(obj){
	var arr = [];
	for( var i = 0;i < obj.length;i++ ){
		if( tools.hasClass(obj[i],"checked") ){
			arr.push(tools.parents(obj[i],".file-item"));
		}
	}
	return arr;
}

//6.选框函数  mousemove  mouseup
//mousemove
function moveSelectBox(ev){
	newDiv.style.left = Math.min(ev.clientX,disX) + "px";
	newDiv.style.top = Math.min(ev.clientY,disY) + "px";
	newDiv.style.width = Math.abs(ev.clientX - disX) + "px";
	newDiv.style.height = Math.abs(ev.clientY - disY) + "px";
	//碰撞检测
	for( var i = 0;i < fileItem.length;i++ ){
		//如果发生碰撞
		if( tools.duang(newDiv,fileItem[i]) ){
			tools.addClass(fileItem[i],"file-checked");
			tools.addClass(checkBox[i],"checked");
			checkBox[i].statues = false;
		}else{
			tools.removeClass(fileItem[i],"file-checked");
			tools.removeClass(checkBox[i],"checked");
			checkBox[i].statues = true;
		}
	}
}
//mouseup  框选mouseup
function upSelectBox(){
	if( newDiv ){
		document.body.removeChild(newDiv);
		newDiv = null;
	}
	//鼠标抬起的时候判断是不是全选
	if( whoSelect(checkBox).length == checkBox.length && whoSelect(checkBox).length != 0){
		
		tools.addClass(checkedAll,"checked");
	}
	tools.removeEvent(document,"mousemove",moveSelectBox);
	tools.removeEvent(document,"mouseup",upSelectBox);
}

//7.记录导航区域最后一个元素的id值
function navPid(){
	return pathNav.children[pathNav.children.length-1].dataset.fileId;
}

//8.新建文件夹成功 删除文件夹成功等小提示框 tip
//className 相应的class  TipInnerHTML内容
function littleTip(className,TipInnerHTML){
	//给出弹出框 提示没有选中文件
	clearTimeout(timer);
	fullTipBox.style.transition = "none";
	fullTipBox.style.top = "-32px";
	fullTipBox.className = "full-tip-box";
	tools.addClass(fullTipBox,className);
	setTimeout(function(){
		fullTipBox.style.transition = ".3s";
		fullTipBox.style.top = 0;
	},16)
	timer = setTimeout(function(){
		fullTipBox.style.top = "-32px";
	},2000)
	var text = tools.$(".text",fullTipBox)[0];
	text.innerHTML = TipInnerHTML;
}

//9.获取当前fileList区域的  title
function getName(id){
	var fileTitle = [];//记录当前渲染文件夹的title
	//找到第一层的子数据 展示出来的数据
	var showData = dataAction.getChildsById(datas,id);
	for( var i = 0;i < showData.length;i++ ){
		fileTitle.push(showData[i].title);
	}
	return fileTitle;
}

//10.对比 当前渲染去的title 看看文件名是否冲突
//渲染区域 已有数据title的集合  newTitle新建文件夹名字
//如果重名返回 true  不重名 返回false
function isReName(fileTitleArr,newTitle){
	//对比文件夹的名字，如果有重名，则弹出提示框，不执行新建成功代码
	for( var i = 0;i < fileTitleArr.length;i++ ){
		if( newTitle == fileTitleArr[i] ){
			return true;
			break;
		}
	}
	return false;
}

//11.新建文件夹时，title隐藏 input显示 并获取焦点
//obj是当前input的父级元素 其nodeName是div
function titleInput(obj){
	//获取新建文件夹里边的input
	var fileEdtor = tools.$(".file-edtor",obj)[0];
	//获取input
	var edtor = tools.$(".edtor",obj)[0];
	//获取标题
	var fileTitle = tools.$(".file-title",obj)[0];
	fileEdtor.style.display = "block";
	//input获取焦点
	edtor.focus();
	//标题隐藏
	fileTitle.style.display = "none";
	//"undefined" 注意 这个字符串转换成布尔值也是真
	if( fileTitle.innerHTML != "undefined" ){//如果title有内容
		edtor.value = fileTitle.innerHTML;
	}
	//input里边的内容自动选中
	edtor.select();
}

//12.如果新建成功 或者 重命名成功 点击document title显示 input隐藏
function titleInputSucess(obj){
	//获取新建文件夹里边的input
	var fileEdtor = tools.$(".file-edtor",obj)[0];
	var edtor = tools.$(".edtor",obj)[0];
	//获取标题
	var fileTitle = tools.$(".file-title",obj)[0];
	fileEdtor.style.display = "none";
	fileTitle.style.display = "block";
	fileTitle.innerHTML = edtor.value.trim();
	//更改相应的title
	if( rename.statues ){//如果正在重命名
		renameData.title = edtor.value.trim();
	}
}

//13.拖动显示 剪影
var item = null;
var dragHelper = null;//剪影
function shadowMouseMove(ev){	
	//如果移动的距离大于10 就生成剪影
	if( Math.abs(ev.clientX - disX) > 10 || Math.abs(ev.clientY - disY) > 10 ){
		isDrag = false;//代表正在拖拽产生剪影
		//生成小剪影 并放到body中
		if( !newDiv ){
			newDiv = view.moveFileShadow();
			document.body.appendChild(newDiv);
			//将点中这个文件选中 //获取点中的这个文件中的勾选按钮
			var checkBoxNow = tools.$(".checkbox",tools.parents(ev.target,".file-item"))[0];
			//给选中框添加选中class  使该框处于选中状态
			if( !tools.hasClass(checkBoxNow,"checked") ){
				//首先清空所有的已选中的按钮 并 改变其状态
				for( var i = 0;i < checkBox.length;i++ ){
					if( tools.hasClass(checkBox[i],"checked") ){
						tools.removeClass(checkBox[i],"checked");
						tools.removeClass(fileItem[i],"file-checked");
						checkBox[i].statues = true;
					}
				}	
			}
			//添加class 使处于选中状态
			tools.addClass(checkBoxNow,"checked");
			//更改其状态 保证不会触发mouseout
			checkBoxNow.statues = false;
		}
		//定义生成的div相对于鼠标的left值 和 top值
		if( newDiv ){
			newDiv.style.display = "block";
			newDiv.style.left = ev.clientX + 10 + "px";
			newDiv.style.top = ev.clientY + 10 +"px";
		}
		//定义鼠标样式
		document.body.style.cursor = "default";
		//清除浏览器默认属性
		ev.preventDefault();

		//在剪影拖拽时，根据选中文件的数量不同，给该div添加不同的class生成不同形式的剪影
		//获取剪影父级icons
		var icons = tools.$(".icons")[0];
		var sum = tools.$(".sum")[0];
		var str = "";
		var len = whoSelect(checkBox).length;
		//num显示拖动出现剪影的文件夹的数量
		sum.innerHTML = len;
		if( len > 4 ) len = 4;
		for( var i = 0;i < len;i++ ){
			str += '<i class="icon icon'+i+' filetype icon-folder"></i>';
		}
		icons.innerHTML = str;

		//鼠标移动的时候的碰撞检测  使用duang函数来进行判断是否碰撞
		//获取剪影文件夹
		dragHelper = tools.$(".drag-helper")[0];
		//循环所有的fileItem     dragHelper是剪影元素
		for( var i = 0;i < fileItem.length;i++ ){
			//如果碰撞到了fileItem   碰撞检测
			item = tools.$(".item",fileItem[i])[0];
			var checkBoxNow = tools.$(".checkbox",fileItem[i])[0];
			if( tools.duang(dragHelper,fileItem[i]) ){
				//循环整个被选中的元素fileItem
				for( var j = 0;j < whoSelect(checkBox).length;j++ ){
					//如果碰到的是选中的元素  那么就停止执行以下代码
					if( fileItem[i] == whoSelect(checkBox)[j] ){
						return;
					}	
				}
				//如果有相同的  就直接停止以下两句的执行
				item.style.background = "#c0eaf4";
			}else{
				item.style.background = "";
			}
		}
	}
}

//14.拖动剪影 mouseup
function shadowMouseUp(){
	//当mouseup的时候，将选中的文件移动到当前碰撞的文件里边
	//当mouseup时，如果检测是否碰撞到元素
	for( var i = 0;i < fileItem.length;i++ ){//循环当前文件去渲染出来的文件
		if( dragHelper ){
			if( tools.duang(dragHelper,fileItem[i]) ){//如果没有碰到元素什么也不干
				//如果tools.duang(dragHelper,fileItem[i]）是真，也就是检测到碰撞
				//判断一下碰撞到的元素是不是自身
				for( var j = 0;j < whoSelect(checkBox).length;j++ ){
					if( fileItem[i] != whoSelect(checkBox)[j] ){//如果该元素不是选中的元素
						//找到fileItem[i]的id
						var duangElementId = fileItem[i].dataset.fileId;
						//找到被碰撞到的元素的子数据
						var duangElementData = dataAction.getChildsById(datas,duangElementId);
				
						//得到duangElementData的数据的title的一个集合
						var duangDateTitle = [];
						for( var k = 0;k < duangElementData.length;k++ ){
							duangDateTitle.push(duangElementData[k].title);
						}
						//找到被选中元素对应的数据
						var whoSelectArr = whoSelect(checkBox);
						for( var k = 0,len = whoSelect(checkBox).length;k < len;k++ ){
							//找到被选中元素的数据
							var selectData = dataAction.getDataById(datas,whoSelectArr[k].dataset.fileId);
							//将选中元素的父级id改成碰撞元素的id
							if( isReName(duangDateTitle,selectData.title) ){
								//如果是真，代表重名 那么就生成小tip 提示文件名有冲突
								littleTip("warn",tipContent[6]);

							}else{
								//如果不重名 更改id
								selectData.pid = duangElementId;
								//相应的删除这个元素
								fileList.removeChild(whoSelectArr[k]);
							}
						}
						//重新渲染属性菜单
						treeMenu.innerHTML = view.createTreeHtml(datas,-1);
						//记录当前位置 给添加相应的class 显示出背景颜色
						//依照点击的id 找到树形菜单上对应的元素，并加上class
						var treeLi = tools.getTreeById("tree-title",navPid(),treeMenu);
						//如果prev存在的话
						if( prev ){
							tools.removeClass(prev,"tree-nav");
						}
						tools.addClass(treeLi,"tree-nav");
						prev = treeLi;	
					}
					break;//找到对应元素之后，打断循环
				}
			}
		}
	}
	//将dragHelper清空
	dragHelper = null;
	//如果存在剪影 就删除剪影
	if( newDiv ){
		//获取生成的剪影
		document.body.removeChild(newDiv);
		newDiv = null;
	}
	//开启定时器，稍微延迟
	setTimeout(function(){
		//改回没有拖拽产生剪影的状态 恢复移入移出事件
		isDrag = true;
	},0);
	//将最后一个碰到的元素背景颜色清除
	for( var i = 0;i < allItem.length;i++ ){
		allItem[i].style.background = "";
	}
	document.removeEventListener("mousemove",shadowMouseMove,false);
	document.removeEventListener("mouseup",shadowMouseUp,false);
}

//15.点击treeMenu，显示标题下的ul
function childsUlShow(target){
	//让这个标题下的ul显示
	target.nextElementSibling.style.display = "block";
	//改变class 使小图标显示为展开状态
	tools.removeClass(target,"tree-contro-none");
	//添加class 使小图标显示为展开状态
	tools.addClass(target,"tree-contro");
	//更改状态
	target.statues = false;
}

//16.点击treeMenu，隐藏标题下的ul
function childsUlHide(target){
	//让这个标题下的ul显示
	target.nextElementSibling.style.display = "none";
	//改变class 使小图标显示为展开状态
	tools.removeClass(target,"tree-contro");
	//更改状态
	target.statues = true;
}

//17.树形菜单添加点击状态 初始化微云下子元素显示 其余闭合
//treeTitle 树形菜单标题 
function treeInit(treeTitle){
	//给treeTitle添加状态
	for( var i = 0;i < treeTitle.length;i++ ){
		treeTitle[i].statues = true;//代表没有展开
	}
	//因为微云下的ul已经展开，因此状态设为false
	treeTitle[0].statues = false;
	//给treeTitle第一个微云加上背景色
	tools.addClass(treeTitle[0],"tree-nav");
	//初始化树形菜单 使初始时，只有微云下的元素展开
	//获取标题 微云 下的ul元素
	var treeUl = treeTitle[0].nextElementSibling;
	//给微云的标题添加class 代表展开小图标
	tools.addClass(treeTitle[0],"tree-contro");
	//获取treeUl下的所有子级ul
	var childUl = tools.$("ul",treeUl);
	for( var i = 0;i < childUl.length;i++ ){
		childUl[i].style.display = "none";
	}
}

//18.点击删除按钮 删除文件夹 程序封装
function deleteFiles(){
	//首先调用whoSelect 看看有没有选中的文件
	if( !whoSelect(checkBox).length ){//如果没有选中任何文件
		littleTip("warn",tipContent[1]);
	}else{
		//如果删除的时候有文件选中
		//首先出现弹出框 看看是否要删除
		dialog.dialog({
			title:"删除文件",
			tip:"鼠标摁下可在此处拖动弹框",
			content:'<p class="sureDelete">\
            			<strong class="contentIco"></strong>\
            		确定要产出这个文件夹吗？</p>\
        			<p class="findDelete">已删除的文件可在回收站找到</p>',
			okFn:function(){//这个地方能找到各种全局变量？？？？？？？？？？？？？？？
				var selectArr = whoSelect(checkBox);
				//记录选中id的数组
				var selectId = [];
				for( var i= 0;i < selectArr.length;i++ ){
					//找到要删除的文件的id
					var fileId = selectArr[i].dataset.fileId;
					//得到选中的数据的id的数组集合
					selectId.push( fileId );
					//删除相应的文件
					fileList.removeChild(selectArr[i]);
					//如果点击弹出框的确定按钮，表示删除文件成功
					//给出弹出框 提示没有选中文件
					littleTip("ok",tipContent[2]);
				}
				//删除文件成功后，全选框不勾选
				if( tools.hasClass(checkedAll,"checked") ){
					tools.removeClass(checkedAll,"checked");
				}
				//删除datas中 选中的数据及其所有子数据
				dataAction.batchDelect(datas,selectId);
				//重新渲染属性菜单
				treeMenu.innerHTML = view.createTreeHtml(datas,-1);
				//给树形菜单重新定位
				//找到树形菜单对应的元素
				var treeTitleNow = tools.getTreeById("tree-title",navPid());
				//给树形菜单对应位置加上背景色
				tools.addClass(treeTitleNow,"tree-nav");
				//记录上一个
				prev = treeTitleNow;
				//点击移出生成的小弹出框
				var fullPop = tools.$(".full-pop")[0];
				document.body.removeChild(fullPop);
			}
		});
		mask.style.display = "block";
		//获取弹框 确定 取消 x 按钮
		var cancel = tools.$(".cancel")[0];
		var close = tools.$(".close")[0];
		var confirm = tools.$(".confirm")[0];
		//绑定事件处理
		tools.addEvent(cancel,"click",function(){
			mask.style.display = "none";
		})
		tools.addEvent(close,"click",function(){
			mask.style.display = "none";
		})
		tools.addEvent(confirm,"click",function(){
			mask.style.display = "none";
		})
	}
}

//19.点击移动到按钮 移动文件夹 封装
function moveFiles(){
	//首先判断有没有选中文件
	if( !whoSelect(checkBox).length ){//如果没有选中任何文件
		littleTip("warn",tipContent[1]);
	}else{
		//如果删除的时候有文件选中
		//首先出现弹出框 看看是否要删除
		dialog.dialog({
			title:"选择存储位置",
			tip:"鼠标摁下可在此处拖动弹框",
			content:'<p class="dir-file">\
		                <span class="file-img"></span>\
		                <span class="file-name">我的文档</span>\
		                <span class="file-detail"></span>\
		            </p>\
		            <div class="dir-box">\
		                <div class="cur-dir">\
		                    <span>移动到：</span><span class="fileMovePathTo"></span>\
		                </div>\
		                <div class="dirTree"></div>\
		            </div> ',
			okFn:function(){
				//如果通过提示框树形菜单的检验 则证明数据可以被移动到选中的
				//文件夹下 那么点击确定 函数就执行okFn里边的函数
				if( isMove ){//如果通过判断验证
					//点击确定 提示框从body里边删除
					document.body.removeChild(fullPop);
					//遮罩层隐藏
					mask.style.display = "none";
					//改变选中文件夹的父id即可  循环选中的元素selectArr
					for( var i = 0; i < selectArr.length ;i++ ){
						//得到当前选中元素的id
						var selectId = selectArr[i].dataset.fileId;
						//通过id找到对应的数据  并改变数据的pid
						dataAction.getDataById(datas,selectId).pid = targetId;
						//重新渲染fileList里边的数据
						fileList.innerHTML = childsFiles(dataAction.getChildsById(datas,navPid()));
						//重新渲染左侧树形菜单
						treeMenu.innerHTML = view.createTreeHtml(datas,-1);
						//给treeTitle第一个微云加上背景色
						tools.addClass(tools.getTreeById("tree-title",navPid()),"tree-nav");
						//声明变量，记录上一个元素
						prev = tools.getTreeById("tree-title",navPid());
					}
					//给所有的文件夹重新添加状态 因为删除之后文件的状态好像乱了？？？？
					for( var i = 0;i < checkBox.length;i++ ){
						checkBox[i].statues = true;
					}
				}
				
			}
		});
		//获取弹框 确定 取消 x 按钮
		var cancel = tools.$(".cancel")[0];
		var close = tools.$(".close")[0];
		//绑定事件处理
		tools.addEvent(cancel,"click",function(){
			mask.style.display = "none";
		})
		tools.addEvent(close,"click",function(){
			mask.style.display = "none";
		})
		//遮罩层显示
		mask.style.display = "block";
		//弹框样式已经渲染，首先获取弹框full-pop
		var fullPop = tools.$(".full-pop")[0];

		//因删除文件夹弹框 和 移动文件夹弹框width不一样，因此重置移动弹框宽度
		fullPop.style.width = "450px";
		//获取弹框里的dirTree,将属性菜单当内容添加进去
		var dirTree = tools.$(".dirTree",fullPop)[0];
		//给小弹框树形菜单容器添加class 使其和左侧属性菜单样式相同
		tools.addClass(dirTree,"tree-menu-comm");
		//渲染弹框里的树形菜单
		dirTree.innerHTML = view.createTreeHtml(datas,-1);
		//获取treeTitle
		var treeTitle = tools.$(".tree-title",dirTree);
		//初始化弹框功能
		treeInit(treeTitle);
		tools.addEvent(dirTree,"click",function(ev){
			var target = tools.parents(ev.target,".tree-title");
			if( target ){
				if( target.statues ){
					if( target.nextElementSibling.children.length ){//如果该元素有子集	
						//显示子元素
						childsUlShow(target);
					}
				}else{
					if( tools.parents(ev.target,".ico") ){
						childsUlHide(target);
					}
				}
			}
		})

		//获取弹框里边的file-name 表示被选中文件夹名字的元素
		var fileName = tools.$(".file-name",fullPop)[0];
		//找到被选中的元素的集合
		var selectArr = whoSelect(checkBox);
		//把选中的第一个元素的title 赋值给fileName
		fileName.innerHTML = dataAction.getDataById(datas,selectArr[0].dataset.fileId).title;
		//获取详细信息file-detail
		var fileDetail = tools.$(".file-detail",fullPop)[0];
		//给fileDetail添加内容
		if( selectArr.length > 1 ){
			fileDetail.innerHTML = '等'+selectArr.length+'个文件';
		}

		//弹框树形菜单绑定click事件处理  采用事件委托的方式
		//定义局部变量，用来记录上一个点击的元素 开始默认选中的是标题微云
		var prevTip = tools.$(".tree-title",dirTree)[0];
		var isMove = false;//不能移动
		var targetId = null;//点击的目标元素的id
		//点击tree-title，该元素身上要加上背景颜色
		tools.addEvent(dirTree,"click",function(ev){
			var target = ev.target;
			//如果点击的是tree-title元素
			if( tools.parents(target,".tree-title") ){
				//根据目标元素找到tree-title
				var target = tools.parents(target,".tree-title");
				//找到该元素身上的id
				targetId = target.dataset.fileId;
				//找到该元素的所有父级元素的数据集合 数组
				var parentData = dataAction.getParentsById(datas,targetId);
				//获取显示移动路径的元素fileMovePathTo
				var fileMovePathTo = tools.$(".fileMovePathTo")[0];

				//给该元素写入innerHTML
				var str = "";
				for( var i = parentData.length - 1;i >= 0;i-- ){
					str += parentData[i].title + "\\";
				}
				fileMovePathTo.innerHTML = str.slice(0,-1);

				//如果上一个存在，就清除上一个上的背景颜色
				if( prevTip){
					tools.removeClass(prevTip,"tree-nav");
				}
				//给当前点击的添加背景颜色
				tools.addClass(target,"tree-nav");
				//记录当前点击元素
				prevTip = target;

				//找到选中元素的父级id
				var selectParentId = navPid();
				//获取错误提示元素
				var error = tools.$(".error",fullPop)[0];
				//判断点击的元素 是不是要移动元素的父级
				if( selectParentId == targetId ){
					error.innerHTML = '文件已经在该文件夹下了';
					isMove = false;
				}else{
					error.innerHTML = '';
					//通过验证 则能删除
					isMove = true;
				}

				//判断点击的元素 是不是要移动元素的自身 或者 子孙元素
				//循环选中的元素selectArr
				for( var i = 0;i < selectArr.length;i++ ){
					//得到当前选中元素的id
					var selectId = selectArr[i].dataset.fileId;
					//得到所有选中元素的子数据 根据id 数组
					var childsId = dataAction.getChildsAll(datas,selectId);
					for( var j = 0;j < childsId.length;j++ ){
						if( childsId[j].id == targetId ){//targetId是当前要移动到元素的id
							error.innerHTML = '不能将文件移动到自身或其子文件夹下';
							isMove = false;
							break;
						}
					}
				}
			}
		})

		//给弹框绑定onmousedown事件处理，阻止冒泡fullPop
		tools.addEvent(fullPop,"mousedown",function(ev){
			ev.stopPropagation();
		})
			
	}	
}

//20.点击重命名文件夹 重命名文件 封装
function renameFiles(){
	//如果点击重命名 则其状态改变为false
	rename.statues = true;
	var renameArr = whoSelect(checkBox);
	if( renameArr.length == 0){//如果没有选中的文件 出现弹框
		littleTip("warn",tipContent[1]);
		rename.statues = false;
	}else if( renameArr.length > 1 ){//如果选中的是多个文件 出现弹框
		littleTip("warn",tipContent[5]);
		rename.statues = false;
	}else{//如果只对选中的一个文件重命名
		renameFile = renameArr[0];//获取重命名的元素
		renameId = renameFile.dataset.fileId;//获取该元素id
		//获取数据
		renameData = dataAction.getDataById(datas,renameId)

		//得到该元素的title
		renameDataTitle = renameData.title;
		//得到当前展示文件的title集合
		showFileTitle = getName(navPid());
		//将renameDataTitle 从 showFileTitle 中除去
		for( var i = 0;i < showFileTitle.length;i++ ){
			if( renameDataTitle == showFileTitle[i] ){
				//删除重命名的file的名字
				showFileTitle.splice(i,1);
				break;
			}
		}
		//重命名时，title隐藏 input显示 并获取焦点
		titleInput(renameFile);
	}
}

}());