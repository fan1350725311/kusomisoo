//const { push } = require("methods");

/**
 * Created by Yilan丶 on 2018/12/16.
 */
window.addEventListener("DOMContentLoaded",function(){
    //渲染所有商品数据
    var article = document.querySelector("#big>section>article");
    //htmlStr用来存储要渲染的html结构
    let htmlStr = "";
    //用来存储每个种类的商品数
    let goods_list_num_arr = [];
    for(let Obj_value1 in goods){
        let i = 0;
        for( let Obj_value2 in goods[Obj_value1]){
            //console.log(goods[key1][key2].name);
            htmlStr += `
            <div>
                <figure><img src="${goods[Obj_value1][Obj_value2].src}"></figure>
                <section>
                    <h4>${goods[Obj_value1][Obj_value2].name}</h4>
                    <mark>${goods[Obj_value1][Obj_value2].price}</mark>
                    <div class="goods_num">
                        <span class="minus"></span>
                        <b>0</b>
                        <span class="plus"></span>
                    </div>
                </section>
            </div>`;
            i++;
        }
        goods_list_num_arr.push(i)
    }
    article.innerHTML=htmlStr;
    

    //所在标签下所有li对象
    var kind=document.querySelectorAll("#big>section>nav>ul>li");
    //所在标签下所有div对象---所有商品数**
    var div=document.querySelectorAll("#big>section>article>div>div");
    //所在标签下所有图片对象
    var img=document.querySelectorAll("#big>section>article>div>figure>img");
    //所在标签下所有菜名对象
    var name=document.querySelectorAll("#big>section>article>div>section>h4");
    //所在标签下所有价格对象
    var price=document.querySelectorAll("#big>section>article>div>section>mark");
    //所在标签下所有+号对象
    var plus=document.querySelectorAll(".plus");
    //所在标签下所有-号对象
    var minus=document.querySelectorAll(".minus");
    //所在标签下所有单价--商品总数量
    var count=document.querySelectorAll("#big>section>article>div>section>div>b");
    //购物车数量
    var num=document.querySelector("#big>footer>figure>b");


    //遍历所有+号对象并增加click事件
    var n=0;        //用来储存当前购物车数量
    for (var i = 0; i < plus.length; i++) {
        plus[i].index=i;
        plus[i].addEventListener('click', function () {
            //购物车数量+1
            n++;
            //赋值给num对象
            num.innerHTML=n;
            //购物车数量显示并执行go动画
            num.style.visibility="visible";
            num.style.animation="go 1s";

            //单件商品-号与数量显示---先显示在获取text,隐藏会获取不到
            count[this.index].style.visibility="visible";
            minus[this.index].style.visibility="visible";
            //单件数量+1
            var c=parseInt(count[this.index].innerText);
            count[this.index].innerHTML=c+1;

        });
    }

    //遍历所有-号对象并增加click事件
    for (var i = 0; i < minus.length; i++) {
        minus[i].index=i;
        minus[i].addEventListener('click', function () {
            //大于1---购物车数量-1
            if(n>1)
            {   //购物车数量-1
                n--;
                //赋值给num对象
                num.innerHTML=n;
            }
            //否则--购物车数量图标隐藏
            else{
                n=0;
                num.style.visibility="hidden";
                //购物车数量图标动画为空;
                num.style.animation="";


            }

            //获取当前单价商品数量
            var c=parseInt(count[this.index].innerText);
            //大于1---商品数量-1
            if(c>1)
            {
                count[this.index].innerHTML=c-1;
            }
            //否则---商品数量为0，并隐藏-号与商品数量
            else
            {   count[this.index].innerHTML=0;
                count[this.index].style.visibility="hidden";
                minus[this.index].style.visibility="hidden";
            }


        });
    }

    //跳转到shopping_trolley页
    let btn_jump_shopping = document.querySelector("#btn_jump_shopping");
    let shopping_trolley_goods =[];
    btn_jump_shopping.addEventListener("click",function(){
        for(let i = 0;i<count.length;i++){
            //"商品名称-价格-数量-img"
            //表示商品被选中
            if(parseInt(count[i].innerHTML)>=1){
                let o_goods = {               
                    name: name[i].innerHTML,
                    price: parseInt(price[i].innerHTML)*parseInt(count[i].innerHTML),  //单价*数量=>单件总价
                    num: count[i].innerHTML,
                    src: img[i].src
                };
                shopping_trolley_goods.push(o_goods);
            }
        }
        window.sessionStorage.setItem("shopping_trolley_goods_data",JSON.stringify(shopping_trolley_goods));
        //console.log(JSON.stringify(shopping_trolley_goods));
        if(shopping_trolley_goods.length>=1){
            location.href = "./shopping_trolley.html";
        }
    })

    //跳转到menu页
    //遍历其所有对象并增加click事件
    for (var i = 0; i < name.length; i++) {
        var item = name[i];
        item.addEventListener('click', function () {
            //获取点击的h4文本
            var str=this.innerText;
            //跳转menu页，并把str传到地址栏上去
            window.location.href='menu.html?name='+str;
        });
    }
    li_active(0);

    //商品高度-height---80
    let goods_height = 84;
    //var h_li = document.querySelector("#big>section>article>div");
    //var sn =h_li.offsetHeight;
    //当前滚动高度（被卷去的部分）
    let s_top = 0;
    var arr_sum = [];
    //使用reduce累加goods_list_num_arr数组元素，并把每次的累加值加入新的数组中
    goods_list_num_arr.reduce(function(prev,next){
        //把累加的结果加入arr_sum数组，并把结果返回
        return arr_sum.push(prev+next)&&prev+next;
        //注意：prev返回的是上一次迭代的返回值
    },0); 

    console.log(arr_sum)

    
    let fd = true;
    //商品种类点击事件
    for(let i = 0;i<kind.length;i++){
        kind[i].addEventListener("click",()=>{
            //点击元素更改背景颜色
            li_active(i);
            document.documentElement.scrollTop = i==0?0:arr_sum[i-1]*goods_height;
            console.log(document.documentElement.scrollTop)
            //let scroll_y = i==0?0:arr_sum[i-1]*goods_height;
            //window.scrollTo(0,scroll_y)
        })
    }
    //最大的滚动高度
    let scroll_max_height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    //节流阀
    var timer = null;
    console.log(scroll_max_height+"----");
    //添加滚动监听事件
    window.addEventListener("scroll",function(){
        //若timer有值，则说明正在进行滚动监听，节流返回
        if(timer){return}
        timer = window.setTimeout(function(){
            s_top = document.documentElement.scrollTop; 
            if(s_top>=0&&s_top<arr_sum[0]*goods_height){
                li_active(0);
            }
            else if(s_top>=arr_sum[0]*goods_height&&s_top<arr_sum[1]*goods_height){
                li_active(1);
            }
            else if(s_top>=arr_sum[1]*goods_height&&s_top<arr_sum[2]*goods_height){
                li_active(2);
            }
            else if(s_top>=arr_sum[2]*goods_height&&s_top<arr_sum[3]*goods_height){
                li_active(3);
            }
            else if(s_top>=arr_sum[3]*goods_height&&s_top<arr_sum[4]*goods_height){
                li_active(4);
            }
            else if(s_top>=arr_sum[4]*goods_height&&s_top<scroll_max_height-20){
                //-20+10都是为了减少误差
                li_active(5);
            }
            else if(s_top+10>=scroll_max_height){
                li_active(6);
            }
            console.log(s_top)
            timer = null;
        },100)
        
    })

    //种类li的排他思想
    function li_active(index){
        for(let i = 0;i<kind.length;i++){
            kind[i].style.backgroundColor = "white";
        }
        kind[index].style.backgroundColor = "#F0EFF5";
    }
})
