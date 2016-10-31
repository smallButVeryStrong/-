var view = (function(){
    return {
         //根据数据，生成一个文件的结构
        createFileConstruct:function (item){

            
            var html = '<div class="file-item" data-file-id='+item.id+'>'
                    +'<div class="item">'
                        +'<lable class="checkbox"></lable>'
                        +'<div class="file-img">'
                            +'<i></i>'
                        +'</div>'
                        +'<p class="file-title-box">'
                            +'<span class="file-title">'+item.title+'</span>'
                            +'<span class="file-edtor">'
                                +'<input class="edtor" type="text"/>'
                            +'</span>'
                        +'</p>'
                    +'</div>'
               +' </div>';

            return html;    
        },
        //文件导航区
        createPathNavConstruct: function (datas,id){
                var parents = dataAction.getParentsById(datas,id).reverse();
                var str = '';
                var zIndex = parents.length+10;
               for( var i = 0; i < parents.length-1; i++ ){
                   str += '<a href="javascript:;"'
                   +' style="z-index:'+(zIndex--)+'" data-file-id="'+parents[i].id+'">'+parents[i].title+'</a>';
                                             
               }
               str += '<span class="current-path" style="z-index:'+zIndex+'" data-file-id="'+parents[parents.length-1].id+'">'+parents[parents.length-1].title+'</span>';   
               return str;
        },
        //生成一个li
        createTreeLi:function (datas,tree_childs){
            var level = dataAction.getLevel(datas,tree_childs.id);
            var hasChild = dataAction.hasChilds(datas,tree_childs.id);

            var treeContro = hasChild ? "" : "tree-contro-none";
            var html = '';
            html += '<li>'
                +'<div data-file-id="'+tree_childs.id+'" class="tree-title '+treeContro+'" style="padding-left:'+level*14+'px;">'
                    +'<span>'
                        +'<strong class="ellipsis">'+tree_childs.title+'</strong>'
                        +'<i class="ico"></i>'
                    +'</span>'
                +'</div>'

            html += view.createTreeHtml(datas,tree_childs.id);

            html += '</li>'
            return html;     
        },
        //生成整个树形菜单
        createTreeHtml : function (datas,id){
            var tree_childs = dataAction.getChildsById(datas,id);

            var html =   '<ul>';

                for( var i = 0; i < tree_childs.length; i++ ){

                  html += view.createTreeLi(datas,tree_childs[i]);

                }


             html += '</ul>';

             return html;
        },
        //生成移动剪影
        moveFileShadow:function (){
            var newDiv = document.createElement("div");
            newDiv.className = 'drag-helper ui-draggable-dragging';

            var html = '<div class="icons">'
                            +'<i class="icon icon0 filetype icon-folder"></i>'  
                        +'</div>'
                        +'<span class="sum">1</span>';

            newDiv.innerHTML = html;
            return newDiv;
        },
        //文件区域 当点击进入下一级后 如果下一级文件里边内容为空 则显示微云图像 提示传入内容 结构如下
        emptyFile:function(){
            var html = '<div class="file-list-tip">\
                            <div></div>\
                            <p>暂无文件</p>\
                            <p>请点击左上角"上传"按钮添加</p>\
                        </div>'
            return html;
        },
        //生成登陆框
        logInBox:function(){
                   
                     var html = ` <div class="DivImg">
                                            <ul class="bgImg">
                                                <li>
                                                    <img src="img/banner_1.png">
                                                </li>
                                                <li>
                                                    <img src="img/banner_2.png">
                                                </li>
                                            </ul>
                                        </div>
                                        <div id="wrapper">
                                            <div id="login" class="form">
                                                      <form  action="#" autocomplete="on"> 
                                                                <h1>登录框</h1> 
                                                                <p> 
                                                                        <label for="username" class="uname" data-icon="u" >请输入邮箱或者用户名</label>
                                                                        <input id="username" name="username" required="required" type="text" placeholder="myusername or mymail@mail.com"/>
                                                                </p>
                                                                <p> 
                                                                        <label for="password" class="youpasswd" data-icon="p"> 请输入密码 </label>
                                                                        <input id="password" name="password" required="required" type="password" placeholder="eg. X8df!90EO"/>
                                                                </p>
                                                                <p class="login button"> 
                                                                        <span class="loginTipMask"></span>
                                                                        <span class="loginTip">点击登陆关闭该窗口>></span>
                                                                        <input type="button" value="登陆"/> 
                                                                </p>
                                                      </form>
                                            </div>
                                        </div>`;

                    return html;
                  
        }

    }
}())