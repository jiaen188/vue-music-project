<h3>一、前言</h3>

&nbsp;&nbsp;这个项目是我在工作之余学习vue过程中，尝试实现一个音乐播放器，基于vue-cli脚手架的环境搭建。尝试与当前ionc3/angular4做比较，体验vue的组件化、模块化、可读性、复用性，感受到vue对于中小型项目的易管理、维护。

&nbsp;&nbsp;所以，这次vue全家桶尝试一个比较完整的小项目的开发，在使用过程中进一步学习vue。

大致面板四个，推荐、歌手、排行榜、搜索。主要功能，组件（页面间的切换），音乐播放，基础组件，公共数据、状态管理。完成这个项目可以体验到：

	1、vue-cli 的环境搭建，快速初始化项目。
	2、学习组件化、模块化开发。
	3、学习 vue 全家桶：vue-router 路由、vuex 状态管理。
	4、了解 webpack 的压缩、打包。

<hr/><h3>二、技术栈</h3>

	vue + vue-router + vuex + axios

<hr/><h3>三、项目启动</h3>

``` bash
git clone git@github.com:jiaen188/vue-music-project.git

cd vue-music-project

npm install

npm run dev
```

<hr><h3>四、目录结构</h3>

```
|——build                                                //构建              

|——config                                               //配置

|——node_modules                                         //npm项目依赖

|——src	
	|——api——                                            //请求接口
|			  |——config.js                              //接口公共参数配置文件
	|
|			  |——rank.js                               //排行榜面板接口
	|		
|			  |——recommend.js                          //推荐面板接口
	|
|			  |——search.js                             // 搜索面板接口
	|
|			  |——singer.js                            //歌手面板接口
	|
|			  |——song.js                              //歌词接口
	|
|
    |——base——                                         //基础组件 
|			  |——confirm                              //确认弹窗组件
	|
|			  |——listview                             //歌手面板包裹组件
	|		
|			  |——loading                              //加载进度组件
	|
|			  |——no-result                             //返回数据为空时的提示组件
    |
|             |——progress-bar                          //页面级播放器歌曲进度条组件
	|
|			  |——progress-circle                       //迷你播放器歌曲进度条组件
	|		
|			  |——scroll                                //滚动组件
	|
|			  |——search-box                            //搜索框组件
	|
|			  |——search-list                           //搜索结果展示组件
	|		
|			  |——slider                                //轮播图组件
	|
|		      |——song-list        
    |
|
    |——common——                                       //公共模块部分 
|			  |——fonts                                //字体
	|
|			  |——image                                //图片资源
	|		
|			  |——js                                  //处理公共的请求业务比如转化响应的数据singer类和song类，mixin，jsonp处理
	|
|			  |——stylus                             //样式文件
	|
|
	|——components——                                  //业务组件
|			  |——disc                                //歌单描述组件
	|
|			  |——m-header                            //头部组件
	|		
|			  |——music-list                          //歌曲列表组件
	|
|			  |——player                             //播放器组件
	|
|			  |——playlist                           //播放的歌曲列表组件
	|
|			  |——rank                               //排行榜面板组件
	|		
|			  |——recommend                          //推荐面板组件
	|
|			  |——search                             //搜索面板组件
    |
|			  |——singer                             //歌手面板组件
	|
|			  |——singer-detail                      //歌手详情组件
	|		
|			  |——suggest                            //搜索列表的包裹组件
	|
|			  |——tab                               //四个面板的导航栏组件
    |
|			  |——top-list                          //歌单的遮罩组件
    |
|
	|——router——                                    //路由
|		      |——index.js
    |	
|
	|——store——                                     //vuex状态管理
|		     |——action.js
	|						
|		     |——getter.js
	|
|		     |——index.js
	|
|		     |——mutation-types.js
	|
|		     |——mutations.js
    |
|		     |——state.js
	|
|
	|——app.vue                                            //主文件
|			
	|——main.js                                            //主文件入口
|——static
	
|——index.html	                                          //首页

|——package.json

|——README.md	
```

**github 上的 README.md 持续的会完善 ... ...**

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
