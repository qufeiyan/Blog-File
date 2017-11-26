---
title: linux线程剖析（Part1）—1个假的tcb
date: 2017-08-24 13:46:46
update: 2017-08-24 13:46:46
tags: 线程
categories: 操作系统
copyright: true
top:
---

![dn](http://ou7wdump3.bkt.clouddn.com/v2-5798bd0125dfbce624cebf1efd1afdb6_r.jpg)


线程基本概念介绍
<!-- more -->


----------


## linux的“假”线程 ##



先说一句废话：**线程是在进程内部运行的一个执行分支**。

这是现在大多数计算机书籍对线程概念的描述。然而，对大多数人来说（比如我），仍然不(yi)知(lian)所(meng)云(bi)。

为了深刻理解这句话背后的含义，我们先来看一张图：

![1](http://img.blog.csdn.net/20170525103828168?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

我们知道，vfork函数是用来创建子进程的。且该函数创建出的子进程与父进程共用一个地址空间。

所以，可以将父进程中的代码和函数分解，并分别交给这些子进程并行执行。这种方式相较于普通进程执行的方案更为高效。

事实上，我们可以将这些子进程看作**线程**，而把上图中的father和child统称为一个进程。这样，我们就可以知道线程在进程和OS中扮演的角色。

**那为什么说linux的线程是“假”的呢？**

这是因为在linux中，线程和进程共用了一种数据结构（task_struct）。也就是说，linux并没有为线程设计另外的数据结构。linux中的线程是由进程模拟的。所以，linux中没有真正意义上的线程，相当于“假”的线程。

注：windows操作系统中，线程就是真正意义上的线程。每一个线程都有一个"tcb"，每一个进程则都有一个"pcb"，两者各有自己的数据结构来表示。

**轻量级线程**：如果有一个进程，它只有一个线程（一个pcb），这种进程就叫做“单进程”，所以，linux中的某些进程也可以当作线程来看待。正是这一点决定了linux进程比其他系统的进程量级清，粒度小。因此，linux下的进程又叫做”轻量级进程“。

那么进程和线程之间有什么区别呢？我们通过一张表来加深理解：

![2](http://img.blog.csdn.net/20170525111626643?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

**线程的共有/私有资源**

由于同⼀进程的多个线程共享同⼀地址空间,因此Text Segment、Data Segment都是共享的。如果定义⼀个函数,在各线程中都可以调用；如果定义一个全局变量,在各线程中都可以访问到。

所以，线程强调资源共享并不是一句空话。但由于线程是进程独立的分支，所以即使线程与进程公用地址空间，有些资源也是线程私有的。具体请看下表：

![3](http://img.blog.csdn.net/20170525203458345?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
注：**虽然线程对于数据区（代码区）也是共享的，但线程只会执行它该执行的一部分。**


----------

## 线程创建 ##

在编写创建线程代码之前，我们需要了解以下几点：

1.线程库函数是由**POSIX**标准定义的,称为POSIX thread或者pthread。在Linux 上线程函数位于libpthread共享库中,因此在编写makefile编译代码时要加上**-lpthread**选项，编写代码时也要加上**pthread.h**头文件。

2.这里的pthread.h并不是真正的libpthread共享库，前者只是对后者的一种**模拟**，相当于高仿。在此库下模拟出的线程叫做**“用户级线程”**。

3.创建线程函数**pthread_create**
函数表达式：
![3](http://img.blog.csdn.net/20170526154258483?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

返回值:成功返回0,失败返回错误号。错误号保存在全局变量errno中,而pthread库的函数都是通过返回值返回错误号,虽然每个线程也都 有 一个errno,但这是为了兼容其它函数接口而提供的,pthread库本身并不使⽤用它,通过返回值返回错误码更加清晰。 

明确了这几点，接下来编写代码创建线程。

编写makefile：

![13](http://img.blog.csdn.net/20170526174125168?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

编写代码：

![5](http://img.blog.csdn.net/20170526160825811?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

代码运行结果：

![6](http://img.blog.csdn.net/20170526160945450?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

我们可以看到，两个线程同属pid为9204的一个进程，线程有独立的tid。

注：**代码中的tid只在该进程内有效，操作系统并不承认这个tid,只因我们是在模拟库pthread.h中编写的代码。**


----------
## 查看线程 ##


除了可以创建线程外，还可以在系统中查看线程。

因为我们模拟出来的线程只在进程运行过程中存在，所以对代码做如下改造。让其死循环，使进程一直在运行当中。这样就便于我们查看系统中的线程。

![8](http://img.blog.csdn.net/20170526163638604?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

程序运行效果（当然它是一直在跑的）：

![9](http://img.blog.csdn.net/20170526170638406?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

这说明两个线程都属于pid为9430的进程。

指令ps -aL | grep 进程名（一般为可执行文件）可以用来显示正在运行的轻量级进程（线程）

![10](http://img.blog.csdn.net/20170526172503245?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

在这张图中，我们需要注意的是：

1.主进程，新进程按照LWP调度
2.单进程的LWP和PID一样
3.由于资源共享，CPU不会给子进程/线程分配新的时间片，只会将其对应的父进程/进程的时间片分割给他们使用。

我们还可以查看进程信息，可以证明其父进程是bash
![11](http://img.blog.csdn.net/20170526172719451?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

这是进程的另一种查看方式：
![12](http://img.blog.csdn.net/20170526172839108?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)


