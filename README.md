## [Wild CSS](https://github.com/SeuHkx/Wild "Wild CSS")

基于谷歌Material-Design设计语言结合实际应用情况而诞生的超轻量级CSS框架。丰满健壮的组件以及灵活的定制性，跨屏幕的响应式、低耦合的设计。良好的兼容性，模块式的管理，让你更快速的搭建一个，漂亮，美观，跨屏幕的响应式应用。

+ 响应式
+ 兼容性高(支持无耻的IE7:joy:)
+ 定制性高、轻量级
+ 支持高分辨率屏
+ 极其简单的结构
+ 组件之间的相互嵌套与结合
+ 更漂亮,美观,时尚

### Quick Start

+ 下载Wild CSS，引入当前的应用中，也可以git clone下来。
+ 快速查看各个组件模块结构以及部分简单示例，点击查看[规范](https://github.com/SeuHkx/Wild/docs "规范")

####1. 命令行工具
环境依赖
* git
* node [官网](http://nodejs.org "官网")
* gulp (npm install -g gulp) 请参考[官网](http://gulpjs.com/ "官网")

####2. 使用Bower快速安装

```
bower install Wild
```

关于如何使用bower，请参考[官网](http://bower.io/)

####3. 文档示例
```css
<link rel="stylesheet" href="Wild.css">
```

如果按模块引入，必须有基础模块，有一定的依赖顺序:
```css
<link rel="stylesheet" href="widget/wild.reset.css">
<link rel="stylesheet" href="widget/wild.type.css">
```
字体模块可根据当时情况来判定是否引入。

* [参考文档](https://github.com/SeuHkx/Wild/tree/master/docs)

####4. 关于dist目录

```html
---
    |--- dist/
        |--- Wild.css       // Developer
        |--- Wild.min.css   // compress     
    |--- widget/
```

经过编译好的压缩和未压缩的文件。也可以使用widget目录下面的模块来进行按需引用。通过上线再进行压缩。维护也得到了保证。

####5. 定制Sass组件

```html
---
    |--- sass/
        |--- ui/
        |--- variables/
```
使用Compass
* 可以使用compass的函数来进行更好的定制，例如颜色。也可以自定义。如果需要使用compass，需要修改一定的config.rb文件。

定制
* 通过修改内部的变量来进行定制。参考对应的文档代码。

####6. 关于布局结构以及栅格系统

##### 使用[Sweet](https://github.com/SeuHkx/Sweet)
单独使用栅格系统,可以搭建你基础的布局框架.可以引入任何的ui框架来作为搭配.目前Sweet为流式布局.
也可以通过sass来定制你的栅格系数.默认为12,16,24.

#### 通过Bower快速安装

```
bower install Sweet
```

+ 使用方法详见[Sweet](http://github.com/SeuHkx/Sweet)

####7. 兼容性

+ IE7+
+ FF38+
+ Chrome43+
+ Safari8+
+ Opera31+
+ Android2.3+
+ IOS6.1+

####8. Screenshot
+ 下图是通过Wild打造的示例。
+ ![](我)

### License

基于 MIT License 开源。感谢bootstrap开源软件的贡献。
