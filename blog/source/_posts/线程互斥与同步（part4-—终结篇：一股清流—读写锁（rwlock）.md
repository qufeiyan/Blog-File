---
title: ' 线程互斥与同步（part4)—终结篇：一股清流—读写锁（rwlock）'
date: 2017-08-24 13:33:28
update: 2017-08-24 13:33:28
tags: 读写锁
categories: 操作系统
copyright: true
top:
---

![du ](http://ou7wdump3.bkt.clouddn.com/%E8%AF%BB%E5%86%99%E9%94%81.jpg)



本文将详细介绍linux线程互斥与同步的最后一个概念：**读写锁（rwlock）**

<!-- more -->

----------
## 一股清流 ##


为什么把读写锁称为一股清流呢？只因它是一种比较特殊的锁。

>那它特殊在哪里呢，我们先来讲一个不悲伤的故事：

王铁锤和李狗蛋是一对好兄弟，铁锤想报答狗蛋上次给他帮的一个大忙，决定中午请他吃饭，李狗蛋欣然答应。

到了中午，铁锤给狗蛋打电话“我到你家楼下了，你下来”，假设狗蛋的回答有两种情况：

1.“我这还有个大Bug没修完，刚有了点头绪，你先在外边等我1个小时，然后咱俩去吃饭。”

2.“行啊，你等我5分钟，我马上就下来。”

对于这两种情况，王铁锤的反应当然也不同。假设对于1，王铁锤听说还要1个小时，就对他说“那我先去旁边的网吧打会LOL，你好了叫我”，于是步行去了网吧开黑。一个小时后，接到李狗蛋电话，两人愉快的去吃饭。

假设对于2，王铁锤听他说马上就下来，掐着表等了5分钟，但李狗蛋还是没下来。就又给他打电话“咋回事啊，不是说5分钟吗”，这时李狗蛋回答“不好意思啊，那啥，我马上就下来，你再等我1分钟”，然后王铁锤又掐着表等了1分钟...，谁知李狗蛋还是没下来。于是又给他打电话“兄弟你行不行啊，咋跟个娘们似的磨磨唧唧”，李狗蛋又回答“实在不好意思，电梯坏了，我走楼梯下来的。你再等30秒，我就下来了啊”。王铁锤不再掐表了，在心里倒数30秒，睁开眼睛李狗蛋已经下来了。两人愉快地去吃饭。

好了，在这个例子中，我们把情况1中王铁锤的表现叫做“**挂起等待**”，它是需要成本的（去网吧，消耗体力）
而把情况2中王铁锤的表现叫做**“自旋”**：周而复始的做某件事情（打电话）

对应的，我们有**挂起等待锁**和**自旋锁**这两个概念。

**自旋锁**：某线程在临界资源里呆的时间比加锁解锁的时间都短，别的线程就不必挂起等待锁资源。此时就要用自旋锁 （一直询问锁资源，而不必挂起等待）

显然，互斥锁是一种挂起等待锁

**那读写锁又是什么呢？**

我们在编写多线程序的时候，有一种情况是十分常见的：

有些公共数据修改的机会比较少，相比较改写，它们读的机会反而高的多。但在读的过程中，往往伴随着查找的操作，中间耗时很长。给这种代码段加锁，会极大地降低我们程序的效率。读写锁就是用来解决这个问题的。

**读写锁实际是一种特殊的自旋锁，它把对共享资源的访问者划分成读者和写者，读者只对共享资源进行读访问，写者则需要对共享资源进行写操作。这种锁相对于自旋锁而言，能提高并发性，因为在多处理器系统中，它允许同时有多个读者来访问共享资源，最大可能的读者数为实际的逻辑CPU数。写者是排他性的，一个读写锁同时只能有一个写者或多个读者（与CPU数相关），但不能同时既有读者又有写者。** 

由读者写者我们就能想到生产者与消费者，那么读者写者模型与生产者消费者模型有什么区别与联系呢？

其实，两者并没有什么太大的区别，读者写者模型同样遵循321原则，不过有了上面的概念，这里的3种关系显然发生了改变：

写-写：互斥

读-读：没关系

读-写：互斥关系，同步关系（读者优先，写者优先）



----------
## Code ##



有了读写锁的概念，我们就可以编写代码来实现**基于读写锁的读者／写者问题**

同样的，在编写代码之前，再了解一下rwlock的接口函数：

![1](http://img.blog.csdn.net/20170602151259375?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
其中，pthread_rwlock_t是读写锁类型。

好了，现在来编写代码：

**step1.创建读者写者线程**

![2](http://img.blog.csdn.net/20170602153559818?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

**step2.创建读者写者，全局变量book（临界资源）**

![3](http://img.blog.csdn.net/20170602153633850?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

**step3.创建读写锁并初始化，在函数内部读实现写锁，非阻塞锁**

![4](http://img.blog.csdn.net/20170602153738459?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
![5](http://img.blog.csdn.net/20170602153857472?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
![6](http://img.blog.csdn.net/20170602153959570?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

**step4：在读者函数和写者函数内部加sleep观察读写锁互斥同步机制**
1.读者先运行，写者后运行

![10](http://img.blog.csdn.net/20170602161451839?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

为了便于观察，将运行结果写入文件rwfile读者先运行，再等待2秒。然后写者得不到锁，非阻塞一直打印读者在读

![9](http://img.blog.csdn.net/20170602161323213?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

现象：读者先运行，等待2秒后再解锁。写者在这2秒中得不到锁，非阻塞挂起一直打印读者在读

2.写者先运行，读者后运行

![7](http://img.blog.csdn.net/20170602160403942?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

现象：写者先运行，等待2秒后解锁。读者得不到锁，非阻塞挂起一直打印写者在写

另外，在没有用sleep条件下，写者先运行。所以读写锁是写者优先的
![12](http://img.blog.csdn.net/20170602163039542?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)



