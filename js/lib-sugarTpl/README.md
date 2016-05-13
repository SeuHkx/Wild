## sugarTpl 超轻量简单快速的JS模版引擎

+ 简洁的语法,支持嵌套语法
+ 体积超轻量
+ 满足日常所需
+ 编译速度快
+ 麻麻再也不用担心我拼写字符串拉

### 语法

```javascript
<script type="template/html" id="template">
	//if
	{@if(//todo)
		//code
		${name}
	}@/if}
	
	//for
	{@for(//todo){
		//code
		${age}
	}@/for}
	
	//if else
	{@if(//todo){
		//code
		${handsome}
	}@/if}{@else{
		//code
		${beauty}
	}@/else}
</script>
```

### API
* `sugarTpl(template)`
* `sugarTpl(template).compile(json,fn)`

```javascript
//获取当前的模版 <script type="template/html" id="template"></script>的内容
var template = document.getElementById('template').innerHTML;
//获取要渲染模版的位置
var view = document.getElementById('view');
//加载模版
var stpl = sugarTpl(template);
//进行渲染
stpl.compile(json,function(tpl){
	view.innerHTML = tpl;
})
//也可以这样渲染
var tpl = stpl.compile(json);
view.innerHTML = tpl;
```
### DEMO
参考index.html
