---
title: 用arp.sh脚本文件抓取局域网内所有主机的IP和MAC地址
date: 2017-08-17 10:05:06
update: 2017-08-17 10:05:06
tags: [IP,ARP]
categories: 网络
copyright: true
top:
---



![s](http://ou7wdump3.bkt.clouddn.com/1502896542318.jpg)

>本篇博文主要介绍以下内容：



- **1. ARP协议简介**
- **2. 小程序：抓取局域网内所有主机的IP和MAC地址**


<!-- more -->


----------
# ARP协议 #


----------

## Concept ##

先来一波文字(oﾟ▽ﾟ)o  ：

在网络通讯时，源主机的应用程序知道目的主机的IP地址和端口号。却不知道目的主机的硬件地址（MAC地址）,而数据包首先是被网卡接收到再去处理上层协议的，如果接收到的数据包的硬件地址与本机不符，则直接丢弃。



**因此在通讯前必须获得目的主机的MAC地址，ARP协议就起到这个作用**

>它的工作步骤如下：

**Step1：**源主机发出ARP请求，询问“IP地址是192.168.0.1的主机的硬件地址是多少”,并将这个请求广播到本地网段(以太⽹网帧首部的硬件地址填FF:FF:FF:FF:FF:FF表示广播)

**Step2：**目的主机接收到广播的ARP请求，发现其中的IP地址与本机相符；则发送一个ARP应答数据包给源主机,将⾃己的硬件地址填写在应答包中。   

注：每台主机都维护一个ARP缓存表,可以用arp -a命令查看：

![5](http://img.blog.csdn.net/20170701155010628?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)


    为了降低对内存的占用，缓存表中的表项都有过期时间(一 般为20分钟)，如果20分钟内没有再次使用某个表项，则该表项失效。下次还要发ARP请求来获得目的主机的硬件地址。 


**所以ARP协议的作用就是在局域网内实现从IP地址到MAC地址的转换**


## ARP报文格式 ##

ARP数据报的格式如下所示: 

![2](http://img.blog.csdn.net/20170701153952280?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)


图中：

  1. 源MAC地址、目的MAC地址在以太网首部和ARP请求中各出现⼀次，对于链路层为以太网的情况是多余的。但如果链路层是其它类型的网络则有可能是必要的。  
 2.  硬件类型指链路层网络类型，1为以太网。协议类型指要转换的地址类型，0x0800为IP地址。后面两个地址长度对于以太网地址和IP地址分别为6和4(字节)。
 3. op字段为1表示ARP请求,op字段 2表示ARP应答。 


          在ARP协议实际工作中，先关心OP字段是APR请求1还是应答2，然后是目的IP地址/发送端IP地址。最后发送前边的数据报。


----------
#Code ##


----------
>下面编写脚本文件arp.sh实现对局域网内所有主机IP和MAC地址的抓取。

**Step1：touch arp.sh脚本文件，用vim编辑完成后，更改权限至可执行文件**

![36](http://img.blog.csdn.net/20170701161809977?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

**Step2：编辑源程序**

以下为源程序：

![16](http://img.blog.csdn.net/20170702141509193?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

注：里边的**ip_head**是博主虚拟机的所在局域网的网络号，读者想要抓取，就要更改其为自己所在局域网的ip地址，在命令行输入ifconfig命令就可以看到：

![20](http://img.blog.csdn.net/20170702141634458?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

**Step3：sh arp.sh运行程序抓取到了局域网内所有应答成功主机的IP和MAC地址**

运行程序：

![6](http://img.blog.csdn.net/20170702142313497?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

得到以下结果：

![28](http://img.blog.csdn.net/20170702142238370?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

>其中，2是博主手机的ip和MAC地址：

![0](http://img.blog.csdn.net/20170702142613638?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

这个在手机设置里的关于手机现象就可以看到。

>1是博主电脑的ip和MAC地址：

![25](http://img.blog.csdn.net/20170702142022875?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

这个在wimdows里打开cmd窗口输入“ipconfig /all”命令就可以看到：

![65](http://img.blog.csdn.net/20170702142811548?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)



----------
# Expand： tcpdump&nmap #


>其实，上边的方法是有很大弊端的，现在网络加密技术发达，简单的抓包的方法已经不能满足网络分析的需求，基于此，Linux提供了**抓包工具tcpdump和namp**。

## 1.tcpdump ##

### 1. What？ ###

>tcpdump是一个用于截取网络分组，并输出分组内容的工具。

tcpdump凭借强大的功能和灵活的截取策略，使其成为类UNIX系统下用于网络分析和问题排查的首选工具。它提供了源代码，公开了接口，因此具备很强的可扩展性，对于网络维护和入侵者都是非常有用的工具。

在命令行输入**tcpdump -h**就可以查看它的基本语法：

![10](http://img.blog.csdn.net/20170701163349207?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

上边显示了各种选项的含义。

       tcpdump存在于基本的Linux系统中，由于它需要将网络界面设置为混杂模式，普通用户不能正常执行，但具备root权限的用户可以直接执行它来获取网络上的信息。因此系统中存在网络分析工具主要不是对本机安全的威胁，而是对网络上的其他计算机的安全存在威胁。

### 2.How？ ###

博主对tcpdump没有深入的了解，也没有找到优秀的文章讲解，感兴趣的小伙伴可以自行百度٩(๑>◡<๑)۶ 

## 2.nmap ##

### what & how

这个工具是需要下载的，想了解的小伙伴可以自己百度。。


----------
# Other #



>虚拟机联网的四种方式

博主刚开始运行程序的时候并没有成功，是因为**没有把虚拟机的联网方式改为桥接模式**，这样虚拟机会共享其所在电脑主机的ip地址。所以不能抓取，解决方法就是把联网方式改为桥接模式：


![100](http://img.blog.csdn.net/20170702143643034?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
打开虚拟机的设置界面，在网络适配选项选中桥接模式。完成后重启虚拟机再运行程序就不会有问题了

**事实上，虚拟机的联网方式常用的是就是图中前两种形式，主要看你的上网环境。**

>如果你是外网环境，建议你使用NAT模式，此时虚拟机和客户机共享ip地址上网。就出现了抓取不到的问题。
>如果你是局域网环境建议使用桥接，就是第二种模式，该模式下虚拟机和你局域网中的其他实体计算机在网络状态上完全一样，你完全可以把他当作是局域网中的另一台实体计算机。

至于剩下的两种就不怎么常用了，读者有兴趣的话可以自己找资料查下，网上有很多。 

>外网和内网

至于桥接模式和NAT模式所涉及的外网和内网的概念，博主也找到了一篇不错的文章了解了一下，感兴趣的小伙伴请戳这里：

[关于内网和外网区别 ](http://blog.csdn.net/w124374860/article/details/52641851)

