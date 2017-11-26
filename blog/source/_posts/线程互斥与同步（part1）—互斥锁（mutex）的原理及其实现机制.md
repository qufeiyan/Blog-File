---
title: 线程互斥与同步（part1）—互斥锁（mutex）的原理及其实现机制
date: 2017-08-10 21:55:50
update: 2017-08-10 21:55:50
tags: [线程,互斥锁]
categories: 操作系统
copyright: true
top:
---

![题图](http://ou7wdump3.bkt.clouddn.com/%E4%BA%92%E6%96%A5%E9%94%81.jpg)

## 一段代码引发的问题 ##


首先，我们来编写一段代码，它的目的是定义一个全局变量，创建两个线程对其进行5000++的操作。


<!-- more -->

![1](http://img.blog.csdn.net/20170525215908084?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

运行结果如下：
![2](http://img.blog.csdn.net/20170525215956554?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

当然，目前来看，这段程序并没有任何的问题。

然而，对于此程序，结合线程的特点，我们需要明确两点：

 - 局部变量 i **不是共享**的，因为它在栈中
 
 - gCount是**共享**的，因为它是全局变量，属于代码段。

我们知道，只要是共享的资源，那么它就可以看作**临界资源**，而临界资源的访问需要**同步与互斥机制**才能维持正常访问。否则可能会出现**数据不一致**的问题。


----------


下面，我们来讨论一种情况：

假设上边的程序中，线程1先运行。

它在物理内存中读到gcount=0后被切换出去（保存上下文信息）。当线程1重新换回来时，还认为gcount是0，因为它不会再从物理内存中读取。

而此时，线程2开始运行，它在物理内存中也读到gcount=0然后将gcount加到5000，接着又被切换出去。
然后线程1再接着运行，将gcount加到1。又被切换了出去。

最后，线程2再运行时也不会再从物理内存中读取gcount的值，它从上下文信息中得知gcount的值为1。
这样问题就出现了，本来线程2已经将gcount加到了5000，现在它又从5000变成了1。如此下去，gcount的值就是不确定的。

**为什么会出现这样的问题呢？**

这是因为对gcount计数器的操作是非原子性的，所以导致了数据不一致的问题。

多个线程同时访问共享数据时可能会冲突。

比如上边的两个线程都要把全局变量增加1,这个操作在某平台需要三条指令完成:  

1. 从内存读变量值到寄存器
2.  寄存器的值加1 
3. 将寄存器的值写回内存
  
假设两个线程在多处理器平台上同时执行这三条指令,则可能导致最后变量只加了一次而非两次。 

**那为什么上边的程序结果无误呢？**

其实如果是以前的电脑，可能会出错。然而现在的计算机计算速度太快了，线程之间的干扰不够严重。

为了证明确实会出现这种数据不一致的问题，我们对程序进行改造，加大线程之间的干扰力度。

如何加大线程之间的干扰力度呢？有一种比较重要且容易实现的手段：**触发线程间切换**


----------


**知识科普**

*内核态*：操作系统的模式，如果用户或某程序进入了内核态，那么它的权限就会不受约束，可以做任何事。操作系统向外提供系统调用接口方便进行用户态到内核态的转变。

*用户态*：一般用户的模式，用户或某程序在此状态下只能调用用户代码，权限受约束。当用户想调用系统接口，执行内核代码，就要从用户态变成内核态。

*触发线程间切换*：在线程执行函数代码中多次进行系统调用，使其不断地从用户态到内核态。这样多个线程之间就会相互干扰。

科普结束。。。


----------

让我们回到问题中，其实上边的程序代码中有一个系统调用：printf

![2](http://img.blog.csdn.net/20170526103450937?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

但它调用的次数不够，而且代码也不够复杂，所以对代码进行改造，在“读取全局变量gCount的值”和“把变量的新值保存回去”这两步操作之间插入一个printf调用。它会执行write系统调用进内核，为内核调度别的线程执行提供了一个很好的时机。一个循环中重复上述操作几千次,就会观察到访问冲突的现象。  

加入局部变量tmp，使其代替gCount进行++操作，将数据++的过程分成两部分，增加系统调用的次数。改造后的代码如下：

![3](http://img.blog.csdn.net/20170526103742187?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

接下来再运行程序，就会出现上述数据不一致导致的错误结果。而且多运行几次，它的结果也是不确定的。

![4](http://img.blog.csdn.net/20170526103919423?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

![5](http://img.blog.csdn.net/20170526103936549?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

![6](http://img.blog.csdn.net/20170526103955924?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

好了，折腾了半天，终于找到了问题。那么如何解决这个问题呢？

解铃还须系铃人，要解决问题，归根结底就是要解决线程之间互相干扰的问题，从而保证临界资源的原子性。

**互斥锁（mutex）**就是这里的解铃人。


----------

## 互斥锁（mutex) ##




对于多线程的程序,访问冲突的问题是很普遍的,解决的办法是引入**互斥锁**(Mutex,Mutual Exclusive Lock)。

获得锁的线程可以完成“读-修改-写”的操作,然后释放锁给其它线程,没有获得锁的线程只能等待而不能访问共享数据。这样“读-修改-写”三步操作组成一个原子操作,要么都执行,要么都不执行,不会执行到中间被打断,也不会在其它处理器上并行做这个操作。 

Mutex⽤用pthread_mutex_t类型的变量表示。

相关函数如下表：

![5](http://img.blog.csdn.net/20170526113231919?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

有了互斥锁的概念，下面我们来利用它解决上边的问题，在程序中用宏PTHREAD_MUTEX_INITIALIZER初始化lock互斥锁，并加入加锁解锁函数。修改后代码如下：

![6](http://img.blog.csdn.net/20170526113459204?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

我们再来运行代码：

![7](http://img.blog.csdn.net/20170526113546718?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

结果正确，说明互斥锁的却解决了问题。

其实，如果我们将代码中循环次数变大，即使没有系统调用触发进程间切换，也会出错。
![8](http://img.blog.csdn.net/20170526113841396?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

上边的程序中，将循环次数加到5亿，代码运行结果也是错的。
![9](http://img.blog.csdn.net/20170526113942860?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

接着我们加入互斥锁
![11](http://img.blog.csdn.net/20170526114024673?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

程序运行结果再次恢复正常（此过程时间较长，因为加锁占用系统资源，程序运行时性能变低（线程在加琐时是串行运行））。
![12](http://img.blog.csdn.net/20170526114144634?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

到这里，我们已经解决了问题。


----------
## lock和unlock实现原理 ##


刚才我们用互斥锁解决了进程切换引发程序运行错误的问题，那么Mutex的两个基本操作lock和unlock是如何实现的呢?

假设Mutex变量的值为1表示互斥锁空闲，这时某个进程调用lock可以获得锁。而Mutex的值为0表示互斥锁已经被某个线程获得,其它线程再调用lock只能挂起等待。

基于此，我们先来看第一种lock和unlock实现的伪代码：

![11](http://img.blog.csdn.net/20170526114927457?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

因为unlock过程一定是原子的，所以我们把视线主要集中在lock过程。

我们知道，unlock操作中唤醒等待线程的步骤可以有不同的实现，可以只唤醒一个等待线程，也可以唤醒所有等待该Mutex的线程。然后让被唤醒的这些线程去竞争获得这个Mutex，竞争失败的线程继续挂起等待。  

然而仔细观察我们就可以发现问题：上述为代码中lock函数里对Mutex变量的读取、判断和修改并非原子操作。
如果两个线程同时调用lock,这时Mutex是1，而两个线程都判断mutex>0成立。然后其中一个线程置 mutex=0，而另一个线程并不知道这一情况,也置mutex=0,于是两个线程都以为⾃⼰获得了锁。  这种情况类似于刚才对全局变量gCount的操作。

因为线程在任何时候都可能被触发导致切换，而在每个线程运行时，mutex都会首先被读到CPU里。这将导致mutex的副本过多，数据依然无法保持一致性。所以这种伪代码的实现是错误的。

下面我们来看另一种实现方法：

![18](http://img.blog.csdn.net/20170526141938160?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

首先利用汇编指令xchdb将已置0的寄存器a1与互斥量mutex值进行交换。
只对寄存器操作，所以就不会产生物理内存中的mutex副本。
这样即使线程在执行xchgb指令和条件判断时被切换出去，也是没有任何意义的，对程序结果并没有影响。
unlock中的释放锁操作同样只用一条指令实现,以保证它的原子性。  所以这才是lock和unlock的实现原理。


注：为了实现互斥锁操作,⼤大多数体系结构都提供了swap或exchange指令,该指令的作用是把寄存器和内存单元的数据相交换,由于只有一条指令,保证了原子性,即使是多处理器平台,访问内存的总线周期也有先后,一个处理器上的交换指令执行时另一个处理器的交换指令只能等待总线周期。 

**知识点：上述为代码中挂起等待和唤醒等待线程操作的实现机制：**

每个Mutex都有一个等待队列，一个线程要在Mutex上挂起等待，首先要把自己（pcb）加入等待队列中,然后置线程状态为睡眠状态。然后调用调度器函数切换到别的线程。一个线程要唤醒等待队列中的其它线程，只需从等待队列中取出一 项,把它的状态从睡眠改为就绪，加入就绪队列。那么下次调度器函数执行时就有可能切换到被唤醒的进程。


----------
## 死锁(Deadlock)##



正所谓“一波未平，一波又起”，世界上并没有完美的东西。

所以尽管我们能用互斥锁解决线程互斥，但同时互斥锁的引入也会导致另外的问题。这就是**死锁**。

如果你要问我一个互斥锁会不会产生死锁，我的答案是当然会。试想一下，一个人走在路上自己都能把自己绊倒。那么互斥锁么，呵呵......

**死锁产生原因**

情形一：竞争资源

如果同一个线程先后两次调用lock，在第二次调用时，由于锁已经被占用，该线程会挂起等待别的线程释放锁；然而锁正是被自己占用着的，该线程又被挂起而没有机会释放锁,。因此就永远处于挂起等待状态了。叫做死锁(Deadlock)。

![1](http://img.blog.csdn.net/20170528120743212?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

情形二：线程推进顺序不当

假设线程A获得了锁1，线程B获得了锁2。这时线程A调用lock试图获得锁2，结果是需要挂起等待线程B释放锁2，而这时线程B也调用lock试图获得锁1，结果是需要挂起等待线程A释放锁1。于是线程A和B都永远处于挂起状态了。

![2](http://img.blog.csdn.net/20170528121817507?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
 

**死锁产生条件**

1.互斥
2.请求与保持
3.不可抢占锁资源
4.循环等待

不难想象，如果涉及到更多的线程和更多的锁。死锁的问题将会变得更加复杂和难以判断。 

所以，为了避免死锁的产生，使用互斥锁时应尽量避免同时获得多个锁，且应遵循以下原则：

线程在**需要多个锁时都按相同的先后顺序(常见的是按Mutex变量的地址顺序)获得锁**。
⽐如一个程序中用到锁1、锁2、锁3，它们所对应的Mutex变量的地址是锁1<锁2<锁3, 那么所有线程在需要同时获得2个或3个锁时都应该按锁1、锁2、锁3的顺序获得。

**尽量使用pthread_mutex_trylock调用代替 pthread_mutex_lock 调用**


----------
## The End ##



尽管我们可以遵循上面的原则，但还是不能完全避免死锁的产生。

为了解决死锁的问题，需要引入更多的线程互斥与同步机制，如**条件变量**等。敬请期待Part2.
