---
title: 线程互斥与同步（part2)—互斥锁（Mutex）的cp：条件变量(Condition Variable)
date: 2017-08-14 10:32:05
update: 2017-08-14 10:32:05
tags: [线程,条件变量]
categories: 操作系统
copyright: true
top:
---

![cp](http://ou7wdump3.bkt.clouddn.com/6.jpg)

## 条件变量（Condition Variable）和互斥锁（Mutex）的“cp”关系 ##

<enter>
有句话叫“既生瑜，何生亮”，虽说互斥锁和条件变量都是为了维持线程间的互斥与同步。但他们可不是'瑜'和'亮'的关系。确切的说，他们俩是一对**'cp'**。

<!-- more -->

首先，我们想象这样一个场景，有两个人，一个往盘子里放苹果；另一个从盘子中取苹果。

如果我们将盘子看作临界资源，把这两个人当作两个线程。加入互斥锁后，就形成了对盘子的互斥访问。
如果一个人拿到锁进入临界区放苹果，此时另一个人也来申请锁想拿苹果。那么这个人代表的线程就会被阻塞。在第一个人拿锁和解锁之前的整个过程中，第二个人只能一直申请访问互斥锁，直到第一个人解开锁。


![1](http://img.blog.csdn.net/20170529113252412?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

线程进入临界区之前要先访问互斥锁，像上述例子中由于两个人的优先级不同，优先级高的线程不断重复“**拿锁-进入临界区-放锁**”的过程，且不做实质性的工作（占着茅坑不拉屎）。导致优先级低的线程得不到时间片来访问互斥锁。这样就会形成线程的“**饥饿**”问题。
为了解决这种问题，我们要保证对互斥锁的访问按某种顺序进行；使线程之间协同合作，这就是**线程同步**。

**条件变量**就是保证线程同步的一剂良药。

它提供了一种通知机制：**在优先级高的线程放锁后立即通知别的线程取锁，若优先级高的线程想再次申请锁，只能在条件变量上挂起等待，这样就杜绝了优先级高的线程长时间霸占锁资源，实现线程间同步。**
其实质是用变量的形式来表示当前条件是否成熟，标志资源状态。从而方便线程之间协作运行。

有了条件变量，上边的例子就会变成这样：
![2](http://img.blog.csdn.net/20170529114441839?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

总结一下：**单纯的互斥锁用于短期锁定，主要是用来保证线程对临界区的互斥进入。而条件变量则用于线程的长期等待，直至所等待的资源成为可用的资源。**

所以，一个Condition Variable总是和一个Mutex搭配使用**（地表最强cp）。**

----------
## Code（代码举例） ##


知道了条件变量的概念，下面我们编写代码深入了解其作用。

首先了解一下条件变量主要的**接口函数**

![1](http://img.blog.csdn.net/20170529212009896?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

![2](http://img.blog.csdn.net/20170529212151725?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

一个线程可以调用 pthread_cond_wait函数在一个Condition Variable上阻塞等待,这个函数做以下三步操作: 
 1. 释放Mutex
 2. 阻塞等待
 3. 当被唤醒时,重新获得Mutex并返回 
 
 ![3](http://img.blog.csdn.net/20170529213019494?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

具体唤醒多少线程与问题规模有关。一个线程可以调用 pthread_cond_signal唤醒在某个Condition Variable上等待的另一个线程,也可以调用 pthread_cond_broadcast唤醒在这个Condition Variable上等待的所有线程。  

![4](http://img.blog.csdn.net/20170529212943415?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

代码目的：**实现基于单链表模式的生产者-消费者模型**
利用生产者-消费者模型和链表结构，生产者生产一个结点串在链表的表头上,消费者从表头取走结点。


----------


***科普时间：生产者与消费者模型？***

![5](http://img.blog.csdn.net/20170531092012538?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)


----------
知道了这些基本概念，现在我们来编写代码：

step1: 构建交易场所（临界资源）：链表

![6](http://img.blog.csdn.net/20170531093244873?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
在编写链表基本操作Init,PushHead,PopHead,Destory函数后，运行程序：

![2](http://img.blog.csdn.net/20170531093418218?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

step2:创建生产消费者：2个线程

![7](http://img.blog.csdn.net/20170531094210011?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

step3:保证互斥与同步：加入互斥锁保证线程之间的互斥访问

![8](http://img.blog.csdn.net/20170531094717332?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

![9](http://img.blog.csdn.net/20170531094759771?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

![10](http://img.blog.csdn.net/20170531094831474?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

![11](http://img.blog.csdn.net/20170531094849412?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

运行程序：

![10](http://img.blog.csdn.net/20170531095529530?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

![12](http://img.blog.csdn.net/20170531095545812?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
可以看到，虽然实现了互斥，但生产与消费并非间接进行，所以现象是长时间一直在生产，或一直在消费。这与实际情况不符。

step4:加入条件变量实现线程同步

我们对代码进行改造，如果生产者生产慢（sleep(1)），让消费者一直消费，且是无效消费（-1），
![14](http://img.blog.csdn.net/20170531103549461?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

就会出现下边的情况：

![13](http://img.blog.csdn.net/20170531103027453?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

这是因为虽然消费者是无效消费，但它一直占用锁。导致生产者没有时间生产。这是由于对交易场所的状态一无所知导致的

所以由开始对条件变量作用的分析，结合刚才的结果，可以知道消费者也可能像优先级高的线程那样，有“拿锁-进入临界区（取数据）-放锁”的不断重复过程，但消费者将链表数据取完后就不应该再取了，所以要用条件变量来表示交易场所的状态（链表满或不满）。

所以在程序中加入条件变量，在生产函数里加入唤醒函数，消费函数里加入等待函数：
![14](http://img.blog.csdn.net/20170531104252299?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

程序运行效果如下：

![16](http://img.blog.csdn.net/20170531104315237?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

可以看到，尽管消费函数先运行只，但它在判断链表为空后只能在条件变量上挂起等待。只有在生产者生产后消费者才能消费，且生产一条，消费一条。

注：**这里的pthread_cond_wait函数参数中的锁并非表示线程抱着锁挂起，而是释放锁之后再挂起**。

step4: 另外，如果等待函数调用失败，还是会非法消费，所以加入检测：把 if -> while
![18](http://img.blog.csdn.net/20170531105046420?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

至此，条件变量结束。


----------

## The End ##

其实仔细想想，上边的程序实际上是实现了一个栈，它符合后进先出的原则。

而且上述程序是生产1条，消费1条。且是在生产里边唤醒消费。其实我们还可以实现生产多条，通知1次的机制，只需要在生产函数里加入计数器即可。

另外，还可以实现生产者与消费者的互相通知唤醒机制，只需在程序中再加入一个条件变量，然后在消费函数里加入它的唤醒函数。

虽然 'cp'搭配，干活不累，但有时候单身狗的力量更强大（诶呀，好像剧透了>~<），好吧。本系列下一篇要介绍的就是“单身狗”—**信号量**的故事。

![23](http://img.blog.csdn.net/20170603155702063?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
