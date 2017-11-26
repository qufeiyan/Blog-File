---
title: 线程互斥与同步（part3)—解决线程同步的扛把子：单身狗-信号量（ Semaphore）
date: 2017-08-24 13:27:22
update: 2017-08-24 13:27:22
tags: 信号量
categories: 操作系统
copyright: true
top:
---


![xn ](http://ou7wdump3.bkt.clouddn.com/%E4%BF%A1%E5%8F%B7%E9%87%8F.jpg)


本文介绍了线程同步的另一个重要概念：**信号量（ Semaphore）**


<!-- more -->


----------
## 一个游戏 ##



信号量的概念在进程里也有，它是用来**描述临界资源的数目**的，关于信号量最重要的就是它的P\V操作。

其中，P操作代表获得资源。V操作代表释放资源。

>为了更好的理解信号量和它的PV操作，我们先来玩一个游戏（老司机的微笑>.<）

首先，这个游戏需要两个人。一个是博主，一个是正在阅读的你。

然后泥，场景换到操场跑道上。一个人在前边跑，另一个人在后边追（突然感觉这个游戏有点无聊  -_- |||）。好吧，博主愿意牺牲自己去追你（你是风儿，我是傻。缠缠绵绵到天涯~）

游戏规则是这样滴：**慢的人不会超过快的人，快的人也不会把慢的人超一个圈**。也就是说，你不会跑的超过博主，博主也不会超出你一个圈。基本上都是博主在后边追（容易吗我。。。）

![1](http://img.blog.csdn.net/20170531173725869?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

看到这里，想必你已经发现了问题：1和2这两个边界条件特征完全相同，那么如何区分呢？

在回答这个问题之前，让我们把上边游戏中的两个人做一个替换：博主变为生产者，你变为消费者。

>把上边的环形跑道化为一个个的小格子。生产者在格子里生产（放）数据，消费者在格子里消费（取）数据。这样跑道整体就可以看作一个环形队列（先进先出）。

游戏规则不变，但两个临界条件就变为：

消费者消费的数据等于生产者放了的数据。

生产者生产的数据所占格子数等于消费者消费数据格子数再加上环形队列一圈格子数。

在其他情况下，生产者总是先放数据，消费者总是后取数据的。

替换后，上边的问题就变成：**如何判断环形队列是空还是满？**

为了解决这个问题，我们把环形队列里的格子数表示为：blank_sem（它的数目为n），把放的数据数表示为：data_sem。

这样一来，生产者只关心blank_sem的个数。消费者只关心data_sem的个数。data_sem与blank_sem保持同步变化。

![2](http://img.blog.csdn.net/20170602111357358?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
所以，环形队列的空或满就可以用生产者和消费者对应的信号量的取值来表示了，生产者每往格子里放一个数据，blank_sem就减1，data_sem就加1。如此一来，判断环形队列空或满的问题也就迎刃而解了。

把格子当作临界资源，也就能深刻理解信号量是如何描述临界资源数目了。


----------
## Code ##



有了信号量的概念，我们就可以编写代码用信号量实现线程同步了。

在编写代码之前，我们先来分析几种情况：

1.如何保证生产者线程先运行？

最开始，生产者和消费者只有生产者有资源（blank），所以只有生产者（blank_sem）的P操作会成功。然后进行data_sem的V操作，唤醒消费者线程进行data_sem的P操作。最后由消费者线程完成blank_sem的V操作。

2.如何保证即使在2个临界条件下程序也能够运行？

临界条件1（生产者把消费者超了一个环）：生产者一直生产到blank = 0时，因为没有资源（blank_sem = 0），所以它不可能再继续生产,只能挂起等待消费者进行blank_sem的V操作。
临界条件2（消费者赶上了生产者）：消费者一直消费到data = 0时，因为没有资源（data_sem = 0），所以它不可能再继续消费，只能挂起等待生产者进行data_sem的V操作。

3.在1和2的前提下，其他情况下消费者一定在生产者的后边。

接下来，我们需要了解关于信号量的接口函数：
![3](http://img.blog.csdn.net/20170602115149507?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
注：
1.在用完semaphore变量之后应该调用sem_destroy()释放与semaphore相关的资源。 
2. 调⽤用sem_wait()可以获得资源（P操作）,使semaphore的值减1,如果调用sem_wait()时 semaphore的值已经是0,则挂起等待。如果不希望挂起等待,可以调用sem_trywait() 。
3. 调用 sem_post() 可以释放资源（V操作）,使semaphore 的值加1,同时唤醒挂起等待的线程。 
4. 以上函数均包在semaphore.h头文件中


说了这么多，终于要编写代码了（(汗lll￢ω￢) ，还是实现生产者消费者模型，不过交易场所从变为环形队列。

**step1：创建消费者生产者线程，用数组模拟环形队列，数组下标取模来形成环形结构**

![4](http://img.blog.csdn.net/20170602122236892?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
![5](http://img.blog.csdn.net/20170602122250877?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
运行程序：
![6](http://img.blog.csdn.net/20170602122313283?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
![7](http://img.blog.csdn.net/20170602122322844?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

在没有加入信号量之前，两个线程之间没有实现互斥与同步。

**step2：加入信号量及其P\V操作实现同步**

![8](http://img.blog.csdn.net/20170602123826852?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
![9](http://img.blog.csdn.net/20170602123843166?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
![10](http://img.blog.csdn.net/20170602123856024?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
运行结果：
![11](http://img.blog.csdn.net/20170602123916010?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
![12](http://img.blog.csdn.net/20170602123929494?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

可以看出信号量完美解决了线程同步问题。

还可以证明前边分析的第2种情况是对的：

在生产函数中加入sleep(2)，让消费者函数先运行，可以得到如下结果：
![13](http://img.blog.csdn.net/20170602124638956?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
现象是生产一条，消费一条。可见即使消费者先运行，也会因为没有资源而被挂起，让生产者先运行。

还可以证明临界条件下程序的正确运行，以临界条件1为例，在消费函数中加入sleep，可以得到如下结果：
![14](http://img.blog.csdn.net/20170602125512549?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

----------
## The End ##

信号量实现了线程间的互斥与同步。而且它实现互斥是不用加锁的，所以也叫做**“无锁同步”**，和互斥锁条件变量'cp'比，虽然它是单身狗，但它同样是实现线程同步的“扛把子”。



