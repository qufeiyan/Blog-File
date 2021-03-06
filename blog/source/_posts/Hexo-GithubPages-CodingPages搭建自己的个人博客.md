---
title: Hexo+GithubPages&CodingPages搭建自己的个人博客
date: 2017-08-06 22:27:56
update: 2017-08-06 22:27:56
tags: [Hexo,GithubPages,CodingPages]
categories: 学习小记
copyright: true
top: 1
---


![hexo](http://ou7wdump3.bkt.clouddn.com/hexo.PNG) 



> 首先声明：这并不是一篇教程。


<!-- more -->


这不是一篇教程，原因有4个：

- 博主太懒了，而且文笔也很差。
- 写教程需要把之前的过程再过一遍，博主没有时间也没有耐心。
- 中间要在github上创建个人的github.io库，而这个库每个账号只能有一个。为了写教程再去申请账号太麻烦了。
- 最后一点，也是最重要的一点：网上的教程已经很多了，而且有的文章写的确实不错。我的博客就是参考网上的教程搭建的，既然我没有人家写得好，就没有必要写。

我想有的人会问了：那这篇文章是干嘛的呢？

**问得好。**

我想在你看到我的这篇文章之前，各位小可爱一定还见过或者收藏了其他关于搭建博客的的文章，以便对比，查漏补缺式的开始搭建。博主搭建博客的时候也是这么做的。

所以，本文将把我从开始想搭建博客，到最后搭建成功的整个过程中，用到的所有文章链接做一个汇总。这样可以减少你在网上搜索教程，过滤有用文章的时间。而且还方便博主以后查看，让一切变得简单。

怎样汇总呢？

我是这样做的，把文章分为5个部分。根据我的经验，这5个部分是你整个博客搭建过程中必须要思考和实践的：

- 前言：搭建博客难吗 & 为什么要搭建博客 
- 背景知识：Hexo & Github & GithubPages & CodingPages
- 搭建过程：重头戏
- 个性化：本文链接最多的一个部分，原因你懂的
- 我的建议和踩过的坑

最后一个部分穿插在前4个部分中，能让你更快的进行博客搭建，所以不作为单独的目录出现。

>如果你不想了解前两个部分，可以直接跳到第3部分。


**好了，废话就不多说了，开车!**



----------


# 前言 #



## 搭建博客难吗？ ##

我可以很负责人的告诉你：**不仅不难，而且还很简单。**

那么，只有程序员才能搭建博客吗？


或许你不相信，但我确实见过有许多非互联网行业的人也搭建了自己的博客。所以在搭建博客这件事上，确实没有专业之分。

说白了，搭建博客就是用一堆别人的东西，来做一个你自己的东西：Hexo、主题、GithubPages、CodingPages，这些没一样是你的。而且这些都是免费的，除了买域名要花一只棒棒糖的钱（我搭建博客一共就花了3块钱）

所以，人家设计的东西，你只要拿来用就可以了。

## 需要自己知道一些背景知识吗？ ##

上边说了，搭建博客是没有专业之分的。你可以不知道什么是Github,hexo,GithubPages/CodingPages。甚至在技术方面什么也不懂。


可能你不相信，但结合我的搭建过程，我可以先给你说说他们都是怎么用的：

- Github：只是建立了一个github.io的库，没有账号的话可以注册一个。所以你有没有账号，会不会操作Github都没有关系。
- Hexo：只是下载了它的安装包和主题，你只需要知道一些部署博客的命令（不超过5条）。这些命令你也可以不会，因为文档里都有。
- GithubPages：是Github推出的功能，只要你建立了github.io库，就默认在使用。它相当于一个服务器，可以保存你的所有博客文件，是你电脑上博客站点的一份备份。也不用你了解。
- CodingPages：跟GithubPages作用相同，也是为了备份。所以你可以不用这个。但这个是国内的。为了双重保障和你的博客运行速度。建立还是设置下它。

它们的概念下边会详细介绍。

当然，搭建博客时你可以什么都不懂。但为了以后能更好的操作你的博客，建议在搭建成功之后，好好学习一下Github的使用。网上的教程也有很多，这里就不再赘述。

虽然你可以什么都不懂，但以下3样东西你必须要有：

- 耐心：搭建博客是一件非常折腾的事情，所以耐心很重要
- 细心：一定要细心，确保每一步都是正确的。
- 一定的学习能力和钻研精神，遇到困难一定要面对它，主动解决。



## 为什么搭建博客？ ##

这个问题相信你已经有了自己的答案，但我还是建议你看看这2篇文章：



- [我为什么坚持写博客？](https://mp.weixin.qq.com/s?__biz=MzA4NTQwNDcyMA==&mid=402564613&idx=1&sn=d2b7c75b11046a0dcf8df77e737d2b4c#rd "我为什么坚持写博客？")
- [为什么你要写博客？](https://zhuanlan.zhihu.com/p/19743861?columnSlug=cnfeat "为什么你要写博客？")


## 搭建博客需要多长时间？ ##

这个因人而异，在我看来，有这么几种：

- 半天：只是搭建，不涉及到换域名和个性化，并且了解背景知识。那么只要半天便可以搭建完成
- 一天：需要了解背景知识，并且换了域名和主题，但没有太多的个性化
- 两天：设置了评论，字数统计等各种个性化设置（比如我）
- 三天甚至更多：各种找个性化插件和设置，一直在折腾的人

当然，前两种都是你没有遇到太大的坑或者困难所给出的估计时间。如果你在搭建的时候碰到了很多的问题，那么这个时间就得延长了。因为这种问题一般不好查。

----------


# 背景知识 #

搭建博客之前，你应该知道自己在做的是什么。先把事情做对，再把事情做好。所以你需要了解一些背景知识。

## 建立博客的渠道 ##


>通常来说，建立博客的通常渠道包括以下3种：


- 在博客平台上注册，比如 博客园、CSDN、新浪博客 等。
- 利用博客框架搭建，如 WordPress、Jekyll、hexo 等。
- 自己用代码写一个。

其中，第一种最简单，也最受限，说不定还会被删帖删号（我就遇到过这种情况）。第二种稍复杂，另外需要自己找部署的服务器，但可定制化较高，是很多人的选择。最后一种，是在重复造轮子，不过从另一个方面来看，倒是锻炼编程能力的好方式。

而我们要做的，就是第二种：既不受限，难度也不大。

## 为什么选择GithubPages和Hexo ##

用第二种方式搭建博客也有很多方法，但主流的有两种：

- Wordpress
- GitHub Pages+Hexo

很多人用 Wordpress，为什么我要用 GitHub Pages 来搭建？

- 开始我也不知道用哪个，但在网上搜了教程后，发现wordpress比Hexo要麻烦很多。
- Hexo是开源在Github上的，而且轻快便捷
- GitHub Pages 有 300M 免费空间，资料自己管理，保存可靠。
- 学着用 GitHub，享受 GitHub 的便利，上面有很多大牛，眼界会开阔很多
- 顺便看看 GitHub 工作原理，最好的团队协作流程
- GitHub 是趋势



## 概念介绍 ##

### HEXO ###

Hexo 是一个简单、快速、强大的静态博客框架，基于Node.js。由台湾大学生tommy351创建。并把它开源到了Github上，这里是它在Github上的地址：[HexoGithub](https://github.com/hexojs/hexo "HexoGithub")，它主要有以下优点：

- 极速生成静态页面
- 一键部署博客
- 丰富的插件支持
- 支持 Markdown

更多内容可以查看Hexo的官方文档，建议你只看看介绍部分，其它的你现在也看不太懂。等你搭建好了博客再去详细了解其他的内容就会轻松很多：[Hexdocs](https://hexo.io/docs/ "Hexo")


### GitHub ###

GitHub是一个代码托管网站和社交编程网站。这里聚集了世界上各路技术牛叉的大牛，和最优秀的代码库。是全球程序员的天堂。因为是国外的，所以界面全是英文。博主英语过了六级刚开始接触的时候心都突突，不过不要怕，不是还有翻译么，

也有好多人调侃它是全球同性交友平台，其实我不太懂这个梗（女程序员也是很多的好么）


### GitHub Pages ###

GitHub Pages是用来托管 GitHub 上静态网页的免费站点，其他的不多说。

### CodingPages ###

和GithubPages功能相同，其对应的Coding平台也可以实现和Github相似的功能。但没有后者那么出名。是香港的公司，也算是国内的。

看了这些，我相信你一定还是一脸懵逼的。但你可以简单理解成下边的的一段话：

> 利用Hexo和GithubPages/CodingPages搭建博客，实际上就是利用Hexo在本地（你的电脑上）生成一个博客站点，然后利用网络将它传输到Github/Coding上进行拷贝和备份。再由Github和Coding提供的GithubPages/CodingPages服务将博客部署到网上，这样你的博客就可以作为一个独立的站点被别人浏览（正式上线）。同时你也可以在Github和Coding上管理你的博客。


如果你还想了解更多背景知识，可以看看这篇文章：[搭建个人博客，你需要知道这些](http://www.jianshu.com/p/0c3663c4f0ef)

----------


# 搭建过程 #


## 搭建步骤 ##

一般来说，搭建博客有以下几个步骤：


1. 获得个人网站域名
2. GitHub创建个人仓库
3. 安装Git
4. 安装Node.js
5. 安装Hexo
6. 推送网站
7. 绑定域名
8. 在Coding上部署你的网站

**其中，1.7.8你可以不做。但剩下的必须要做，一步都不能少，也不能错。在你看下边推荐的博客的时候，不要忘记看看我下边的建议。**

1-7步请看：这篇博客不只前7步，如果你做完了就可以往下做，因为后边的都是属于个性化部分，所以博主在这里没有显示。[GitHub+Hexo 搭建个人网站详细教程](https://zhuanlan.zhihu.com/p/26625249?utm_source=qq&utm_medium=social "搭建博客")

第8步请看：这篇博客是在你做完了前7步的基础上做的。[hexo干货系列：（四）将hexo博客同时托管到github和coding](http://www.jianshu.com/p/25587e049d54 "双部署")，这篇博客也讲了怎么在CodingPages部署，可以和上一篇对照着看：[我的Hexo博客站的创建历程(一)【Github&Coding双管齐下部署Hexo】](http://redredleaf.me/%E6%88%91%E7%9A%84Hexo%E5%8D%9A%E5%AE%A2%E7%AB%99%E5%88%9B%E5%BB%BA%E5%8E%86%E7%A8%8B%E4%B8%80.html#more)



## 我的建议和踩过的坑 ##



> 第一篇：

- 域名建议买.top，比较便宜。当然，土豪随意。
- 下载Node.js或Git时，由于众所周知的原因，下载速度会很慢。这时你需要看Hexo的官方文档，上边给出了离线下载的地址：[Hexdocs](https://hexo.io/docs/ "Hexo")
- 在安装Hexo这一步，hexo init blog及其之后的命令都是在Blog/blog这个目录下进行的，一定要注意，不能弄错了。博主刚开始就是搞错了路径，结果一直报错。。。
- 在初始化这一步，如果报出了“Please tell me who you are”的错误，要下载Github桌面程序来解决。这样初始化时就会自动弹出登录窗口，直接登录就可以了。又是因为众所周知的原因，官方下载会很慢，所以博主分享了离线版：[点击下载](http://pan.baidu.com/s/1qYoIhvI)
- 如果你在安装Hexo或者之前的步骤中有报错，建议你重新下载安装。因为这之前的过程全是安装的部分，一旦出错，没有别的原因，一定是你的操作有问题。而且你解决错误的时间一定要比重新安装耗费的时间长。
- 关于Markdown，建议用文中推荐的markdownPad2，下载后预览功能不能使用的问题需要下载插件,部分功能要升级到专业版才可以使用。这两个问题都可以百度解决。


> 第二篇：

1.关于域名绑定，再次说明。血的教训告诉我们，Only需要添加两个解析。没有A记录，like this：

![与，ing](http://ou7wdump3.bkt.clouddn.com/%E5%9F%9F%E5%90%8D.PNG)

之后可以在[此网站](http://ping.chinaz.com/)对你的博客进行测试，看看你的博客是否可以在国内解析到Coding，国外解析到Github。访问速度是否得到提升。以下是博主的测试结果：

![wE](http://ou7wdump3.bkt.clouddn.com/%E6%B5%8B%E8%AF%95%E7%BB%93%E6%9E%9C.PNG)

2.coding配置完成后，加载博客时会出现其广告界面：

![RB ](http://ou7wdump3.bkt.clouddn.com/%E5%B9%BF%E5%91%8A.PNG)

如果你想去掉呢，coding也给出了解决办法。但是你不觉得这个界面做的很小清新吗，还可以提升逼格。所以博主就不去掉啦٩(๑>◡<๑)۶ 





----------


# 个性化 #



> 终于到了万众瞩目的个性化步骤了，到这里，想必你已经根据博主推荐的链接成功搭建好了博客。

下面来具体说说个性化。

## 主题选择 ##

如果你按照上边搭建博客时推荐的文章那样，选择了next主题。那就不用多说。如果你觉得next主题不符合你的Style，可以参考这篇文章选择你喜欢的主题：[Hexo博客主题推荐](http://www.jianshu.com/p/bcdbe7347c8d)

但我还是推荐你用next主题，原因：

- next主题是github上最流行的主题，star和fork的数量远远超过了别的主题。所以相信群众的选择。
- next主题的主题配置文件本就内置了许多插件，在个性化的过程中你只需要把flase改成true或者加上对应服务的id就可以直接使用。极为方便。这是其他很多主题没有做到的一点
- next主题内部还分为4个主题方案：Muse、Mist、Pisces、Gemini，可以自由选择，更加多元化。我选择的是Pisces。
- 界面高端大气，配色低调奢华。


**ps：如果你没有用next主题，那么以下个性化设置就不用看了。因为它们都是next的配置。**


## 按照主题文档设置 ##

选定了主题后，建议先看看主题的文档进行个性化设置。里面是最基本的标签、分类设置，还有第三方服务设置：[next主题配置](http://theme-next.iissnan.com/theme-settings.html)



## 其他的个性化设置 ##

因为用的是next主题，所以这里也是针对于next主题的个性化配置。我博客的所有个性化都是来自这些链接：

- 网易云音乐链接设置，参考博客搭建时推荐的第一篇博客
- 这一篇看它的个性化设置部分：[Hexo搭建博客教程](https://thief.one/2017/03/03/Hexo%E6%90%AD%E5%BB%BA%E5%8D%9A%E5%AE%A2%E6%95%99%E7%A8%8B/)
- [RSS和High特效](http://www.iamlj.com/2016/08/add-special-effect-harlem-shake-for-hexo/)
- 这篇真的厉害了，有30种特效：[hexo的next主题个性化教程:打造炫酷网站](https://zhuanlan.zhihu.com/p/28128674)
- 主讲第3方服务：[配置第三方服务](https://zhuanlan.zhihu.com/p/22745430)
- 这个也很方便，创建新文章后不用再去找了：[Hexo添加文章时自动打开编辑器](https://notes.wanghao.work/2015-06-29-Hexo%E6%B7%BB%E5%8A%A0%E6%96%87%E7%AB%A0%E6%97%B6%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E7%BC%96%E8%BE%91%E5%99%A8.html)
- 创建一个菜单页面作为文章目录：[hexo下新建页面下如何放多个文章](https://www.zhihu.com/question/33324071)
- 博客加密：[加密插件Github，issue里有解决next主题兼容的方法](https://github.com/MikeCoder/hexo-blog-encrypt)

上边这些链接里的设置，均为博主亲测有效。从这些链接可以看出，博主也是折腾了很久的。。。

鬼知道我经历了什么

## 在Github上看issue或者提issue ##

如果你还想折腾，还有两种途径：



- 可以看看next在Github上的issue：这些都是别人提的，可能会有你想要的设置。如果你遇到了问题，也可以自己提issue。这是网址：[next/issues](https://github.com/iissnan/hexo-theme-next/issues)
- 去Hexo的官方插件页面找，这里的插件很多。只有你想不到，没有你找不到：[Hexo插件](https://hexo.io/plugins/ "Hexo插件")

## 我的建议 ##


- 个性化固然好，但是在设置的时候一定要细心，这些都是要打开代码文件去修改的。建议不要用记事本或写字板打开，可以用VS编辑器打开，不仅方便查错和回退，还便于查找。这里举一个在VS查找的例子：

比如你要设置字数统计功能，你不知道在哪找，但你看到对应的文章中有这样一行:#Post wordcount display settings，你就可以点击右上方的查找图标，输入这行代码，选择全部匹配。就可以定位到你要设置的那部分。

- 如果你在个性化设置的时候碰到了中文乱码的问题，也可以在VS中点击文件->高级保存选项->把编码改成unicodeutf8选项即可
- 评论功能我推荐来必力和畅言，前者不需要域名备案，直接就可以使用，但界面较丑。后者要进行域名备案才能使用，但界面美观大气，看你怎么选。
- 关于图床，还是建议用七牛，这也是大多数人的选择，但得到图片外链要4步，很麻烦。网上也有人用插件直接拖拽图片上传得到外链，但好像没有windows平台的。反正我没有找到，麻烦就麻烦一点吧。如果你找到了，可以在下方给我留言。
- 一定要细心，建议改一项个性化，先不要关闭你改过的文件，在重新生成部署没有错之后在关闭，这样出错了也好改回去。博主有一次就是不知道自己改了啥，结果出错了，幸好根据出错信息定位到了两个文件，然后重新下载了一份干净的next文件作对比，才改过来。所以，一定不要作死。
- 虽然个性化是可以让你的博客看起来高大上许多，但是不要太过了。忘了自己搭建博客的初心，只有文章才是最重要的，而且太多的个性化会影响博客的加载速度，得不偿失。
- **强烈建议：**把站点文件做一个备份，like this：

![本身](http://ou7wdump3.bkt.clouddn.com/%E5%A4%87%E4%BB%BD.PNG)

这样做可以方便你查错，而且一旦你操作出错，至少还有一个可以运行成功的站点。不用再担惊受怕(・ω<)。还可以将这两个文件都上传到云上，推荐坚果云。因为它可以自动监测更改的文件，并将更改上传到云上。

## 网站链接 ##

>下面是博客搭建过程中用到的一些平台和网站的链接，比如Livere提供的评论功能，七牛图床等：



- Hexo: [https://hexo.io/](https://hexo.io/) 
- 阿里云: [https://www.aliyun.com/](https://www.aliyun.com/)
- Livere: [https://livere.com/ ](https://livere.com/ )
- Leancloud: [https://leancloud.cn/](https://leancloud.cn/)
- 七牛: [https://www.qiniu.com/ ](https://www.qiniu.com/ )



----------

# The End #

终于写完啦，如果除了文中博主提到的点。你还有其它问题，可以在评论区留言，我每一条都会回复哦~

ps:近来发现文中有的链接已经失效啦，小伙伴们可以自行搜索哈。。。


