---
title: 10min搞定vim配置
date: 2017-08-24 13:16:38
update: 2017-08-24 13:16:38
tags: vim
categories: 工具使用
copyright: true
top:
---

![vim](http://ou7wdump3.bkt.clouddn.com/vim.jpg)


Vim是linux操作系统的一款非常强大的编辑器，**配置Vim就是要让其形成一个像VS一样的IDE集成环境**。所以为了能在linux下实现高效编程和开发，Vim的配置是必须要完成的一项任务。

<!-- more -->

然而，对linux初学者而言，这无非是一个难度不小的挑战。但几乎每个初学者接触linux时，都会被要求配置vim，在网上搜索“vim配置”就会出现很多文章：

![1](http://img.blog.csdn.net/20170612092727582?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

网上诸如此类的教程有很多，给出的效果图也很高大上（所有在你看来高大上的东西归根结底就是因为你的无知。）但总是在安装过程中出现很多的问题（对初学者来说是问题）。而这些问题常常难以找出解决方法，只能再点开更多的文章。于是配置vim经常会花费初学者们很多的时间。

所以，本文是一个初学者配置vim后的总结篇，也希望其他的初学者也能快速配置好vim，不再迷茫。

相信我，这一切，只需要10分钟~

----------
# 概要 #


本文主要内容有：

1.vim安装

2.vim配置,包括



-  .vimrc配置
-     gcc/g++安装
-        gdb安装 
-         ctags、taglist安装  
-          winmanager安装

2中安装配置的文件和插件是vim最基本的配置。其他插件如有需要可以自行百度安装。

本文将从4个方面来描述安装配置的过程：**安装配置文件/插件的概念（what）、为什么要安装（why）、安装过程（how）、安装完成后的效果**。

博主使用的是centos虚拟机系统，以下安装均在此系统内进行。

----------


# vim安装 #



**What？**

文章开头已经说过了，vim是一款编辑器。其实它相当于windows里的记事本一样，能编辑文字。但不同的是它可以通过配置编写运行代码，进行linux下的开发。

但百度过的小伙伴肯定也听过vi这个概念，其实简单点来说，它们都是多模式编辑器，不同的是vim是vi的升级版本。它不仅兼容vi的所有指令，而且还有一些新的特性在里面。例如语法加亮，可视化操作不仅可以在终端运行，也可以运行于x window、 mac os、 windows。 

**Why？**

vim是编写代码的地方，所以当然要先安装它了。否则更别谈配置了。。

**How？**

首先cd ~进入用户主工作目录，然后在命令行输入“vi”后双击tab键，可以看到系统中是否安装了vim：

![2](http://img.blog.csdn.net/20170612103212935?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

如果出现的内容如上图，说明系统中已经安装了vim，就不必再重复安装了。

如果不是，请点击这里：[vim安装](http://jingyan.baidu.com/article/046a7b3efd165bf9c27fa915.html)，完成后重复上述命令。检查是否安装完成。

如果你的yum install命令失败，那就是你的yum源太老，不支持此条命令。此时可以更新它来进行vim安装。点击这里解决问题：[yum更新](http://blog.csdn.net/manongdeyipiant/article/details/68495013)

**效果**

安装好vim后，在命令行输入vim  test.c新建一个vim文件，此时你的vim编辑器界面是这样的：

![3](http://img.blog.csdn.net/20170612103927398?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

然后按下键盘esc键，输入“:（英文模式）”，此时界面左下角出现“:”，表示进入vim的命令模式。输入"wq"（保存退出），即可退出vim编辑器返回到命令行界面。

![4](http://img.blog.csdn.net/20170612104426123?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

此时输入ls命令即可看到系统中多了一个test.c文件

![5](http://img.blog.csdn.net/20170612104530653?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

----------
# .vimrc配置 #



**What？**

我们常常在网上看到程序员们各种酷炫拽的代码编辑界面。由于配色方案的不同，各种颜色的代码交织在一起，仿佛置身于一个奇妙的世界。

![6](http://img.blog.csdn.net/20170612111855748?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

这是我在网上截的大神图，怎么样，是不是牛逼的惊天地，泣鬼神。。这就是程序员装逼大法之“.vimrc"文件的配置

.vimrc文件是vim的专用配置文件，在里面可以设置各种编辑格式和其他插件的设置。一共有两个：

1.根目录下的.vimrc文件，其设置对所有用户均有效

2.当前用户目录下的.vimrc文件，其设置只对指定（当前）用户有效


**而我们要设置的就是当前用户的.vimrc文件**

**Why？**

配置这个当然是为了装逼啦，不过，其它插件的设置也在.vimrc里。

**How？**

cd ~进入当前用户的主工作目录，直接输入命令vim .vimrc新建文件。按I键进入insert模式，将下面的基础设置输入你的文件，最后"wq"保存退出即可。

![7](http://img.blog.csdn.net/20170612141913606?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

每一项博主都有注释的哦：

![8](http://img.blog.csdn.net/20170612142235216?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

![9](http://img.blog.csdn.net/20170612142249248?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

![12](http://img.blog.csdn.net/20170612142859693?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

博主只演示3个输入效果：

![10](http://img.blog.csdn.net/20170612142701113?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

此时，再打开test.c文件，就变成了：

![11](http://img.blog.csdn.net/20170612142745751?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

**效果**

将以上列出的全部配置输入成功后，你的vim就会有如下效果：

![13](http://img.blog.csdn.net/20170612143515608?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

----------
# gcc/g++安装 #


**What？**

编译是代码运行成功的前一步，gcc/g++就是linux中的编译器，前者是C语言的编译器，后者是C++的编译器。

**Why？**

为了能在linux中实现代码编译，安装他们是势在必行的。

**How？**

首先检查自己的系统中有没有安装gcc和g++：

![14](http://img.blog.csdn.net/20170612151958824?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

如果没有，直接输入：

1、yum install gcc

2、yum install gcc-c++

这两条命令就可以安装成功了。

**效果**

安装好之后，你就可以编写程序并运行了。打开test.c文件，输入源程序，保存退出：

![15](http://img.blog.csdn.net/20170612152813562?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

紧接着用gcc进行编译运行：

![16](http://img.blog.csdn.net/20170612152853930?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

----------
# gdb安装 #




gdb是linux的代码调试器，关于其安装可以用以下命令：

yum install gdb（事实上，yum就是linux的安装命令）

直接安装，也可以点击这里：[linux下gdb的安装方法](http://blog.csdn.net/summy_J/article/details/72846978) 进行安装

至于其效果，在这里就不演示了，调试命令需要大家自己练习掌握。。

----------
# ctags、taglist安装 #


**What？**

TagList插件是一款基于ctags，在vim代码窗口旁以分割窗口形式显示当前的代码结构概览，增加代码浏览的便利程度的vim插件。所以，要安装taglist就得先安装ctags.

**Why？**

此插件可以方便代码浏览，所以下载百利而无一害

**How？**

首先下载ctags：

直接在命令行输入：yum install ctags即可安装

最后用unzip命令解压安装完成。

然后下载taglist:

这里是官方下载地址：http://www.vim.org/scripts/script.php?script_id=273      

下载taglist_xx.zip ，用unzip命令解压完成。这里是linux各种后缀压缩文件的解压方法：

![20](http://img.blog.csdn.net/20170612153901427?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

用unzip命令解压后，将解压出来的doc的内容放到～/.vim/doc, 将 解压出来的plugin下的内容拷贝到～/.vim/plugin （此举是为了访问文件安全）
，如图：

![21](http://img.blog.csdn.net/20170612160310971?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)


最后，打开.vimrc文件，在里面输入如下几行（红框内），保存退出：

![23](http://img.blog.csdn.net/20170612154453546?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

当然，其他的配置可以选择输入

**效果**

下载好之后，打开test.c文件，就会有如下效果：

![21](http://img.blog.csdn.net/20170612154145010?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

右边的main函数高亮表示当前在main函数的编辑区内。

----------

# winmanager安装 #



**What？**

winmanager是vim中的文件资源管理器。

**Why？**

有了它，我们可以看到当前工作目录下的文件。便于操作

**How？**

winmanager的安装和taglist类似。

这里是下载的官方链接： [http://www.vim.org/scripts/script.php?script_id=95](http://www.vim.org/scripts/script.php?script_id=95 "win")

建议下载winmanager.zip，2.X版本以上的

下载安装包后用unzip命令解压，同样将解压出来的doc的内容放到～/.vim/doc, 将 解压出来的plugin下的内容拷贝到～/.vim/plugin 。

这样，加上先前的taglist，.vim目录下就会有如下内容：

![25](http://img.blog.csdn.net/20170612162346772?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

好了，接下来同样在.vimrc文件里加入下面几句：
![30](http://img.blog.csdn.net/20170612163005968?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

这样在vim的正常模式下按F2就可以直接打开winmanager，再次按F2就可以关闭它。

如果你刚才将taglist图中的所有配置全输入进去，此时你打开test.c文件，按F2打开winmanager的时候，效果是这样的：

![31](http://img.blog.csdn.net/20170612164254584?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

但这样在命令行输入多次“:q”才能退出vim，而且窗口太多有点烦。

当然，你也可以通过更改.vimrc配置来改变taglist和winmanager两个窗口的位置：

更改一：把winmanager作为独立的窗口，和taglist一左一右

![32](http://img.blog.csdn.net/20170612164324345?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

效果：
![33](http://img.blog.csdn.net/20170612164341053?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

这样虽然窗口少了一点，但退出时还是要在命令行输入多次“:q”

所以博主推荐这种做法，把taglist的自动打开屏蔽掉，这样按F2就可以一次性打开/关闭2个窗口。退出时也不麻烦：

![35](http://img.blog.csdn.net/20170612164354158?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)



![34](http://img.blog.csdn.net/20170612164405893?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

**效果**

下载好之后，就会有如下效果：

![26](http://img.blog.csdn.net/20170612162408012?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

其中FileList界面就是winmanager显示出的效果，怎么样，是不是有点酷炫拽的意思了。图中点击node_p就可以直接跳转到它的定义处。所以你知道taglist是实现代码跳转的了吧。

![27](http://img.blog.csdn.net/20170612162557560?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

同样在FileList中点击makefile就可以直接跳转到它的界面，想必你也知道winmanager文件资源管理器的深刻含义了。


----------
# The End #



当然，除了上面讲的插件。还有很多的vim插件，但对于小白来说，这些插件已经足够了。如果想在安装别的插件，可以自行百度。而.vimrc的配置也绝不是文中列举的那些，还有很多个性化的配置方案。有余力者也可以百度下载。
