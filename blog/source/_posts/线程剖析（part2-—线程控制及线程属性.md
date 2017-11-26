---
title: 线程剖析（part2)—线程控制及线程属性
date: 2017-08-24 14:04:27
update: 2017-08-24 14:04:27
tags: 线程
categories: 操作系统
copyright: true
top:
---

![2](http://ou7wdump3.bkt.clouddn.com/v2-5ede88ce1599961581d9da7890829040_r.jpg)



本篇博文将重点从两个方面：线程控制（线程等待、线程终止）及线程属性来进一步分析线程特点。
<!-- more -->

----------


## 线程终止 ##




首先，我们需要知道线程终止的几种方式：

1.从线程函数中return（特殊：从main函数中return，代表进程退出，也代表主线程退出。那么此时线程必定被终止。）

2.直接调用pthread_exit函数终止线程（注意：在线程内调用exit终止的是进程而非线程）

3.调用pthread_cancel函数来取消线程，从而终止线程。

与线程终止有关的函数：

![2](http://img.blog.csdn.net/20170526192038453?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

下面我们来编写代码实现线程终止。

用pthread_exit函数终止线程
![1](http://img.blog.csdn.net/20170526193647924?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

运行结果：

![3](http://img.blog.csdn.net/20170526193713852?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

用命令查看，该进程是单进程。

用pthread_cancel函数取消线程

从主线程中取消新线程：
![5](http://img.blog.csdn.net/20170526201109900?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

执行结果：

![6](http://img.blog.csdn.net/20170526201137681?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

线程自己取消自己：

![7](http://img.blog.csdn.net/20170526201858623?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

执行结果：

![8](http://img.blog.csdn.net/20170526201922295?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)


----------
## 线程等待 ##




对于线程等待，我们需要知道以下几点：

1.线程一旦出错，必须由进程承担后果。对于线程，我们只关心它的两种运行情况：


- 代码跑完了，结果正确
- 代码跑完了，结果不正确


如果代码都没跑完，中途退出。这意味着进程也会退出，所以就无法查看其退出原因。

2.线程出错，导致进程退出。则属于该进程的其他线程也会退出，因为线程的资源由进程分配。所以一般多进程比多线程的程序稳定。

因为多线程程序的不稳定性， 如果一个线程结束运行但没有被join，则它的状态类似于进程中的僵尸进程， 即还有一部分资源没有被回收，导致内存泄漏。
所以创建线程者应该调⽤pthread_join来等待线程运行结束，并可得到线程的退出码来回收其资源。   

线程等待函数：**pthread_join**
表达式：
![1](http://img.blog.csdn.net/20170526185436992?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

调⽤用该函数的线程将挂起等待,直到id为thread的线程终止。

若thread线程以不同的方法终止,通过pthread_join得到的终止状态是不同的,总结如下: 

1. 如果thread线程通过return返回retval所指向的单元⾥里存放的是thread线程函数的返回值。 
2. 如果thread线程被别的线程调用pthread_cancel异常终止掉,retval所指向的单元⾥里存放的是常数PTHREAD_CANCELED。 
3. 如果thread线程自己调用pthread_exit终止,retval所指向的单元存放的是传给 pthread_exit的参数。 如果对thread线程的终止状态不感兴趣,可以传NULL给retval参数。  

下面我们来编写程序实现进程等待。

为了对比方便，将上述retval返回值的所有可能情况汇总在一起：

![9](http://img.blog.csdn.net/20170526205739457?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

![10](http://img.blog.csdn.net/20170526205757676?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

得到如下结果：

![12](http://img.blog.csdn.net/20170526210241714?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

至此，线程控制结束。

----------

## 线程属性 ##



总的来说，在任何一个时间点上。线程有两种属性：

1.可结合（joinable）属性：线程的默认属性。能够被其他线程收回其资源和杀死，在被其他线程回收之前，它的存储器资源 （例如栈）是不释放的。

2.分离（detached）属性：不能被其他线程回收或杀死，它的存储器资源在它终止时由系统⾃自动释放。 
    
 注：为了避免存储器泄漏，每个可结合线程都应该要么被显示地回收，即调用pthread_join；要么通过调用pthread_detach函数被分离。   

线程分离函数pthread_detach
![13](http://img.blog.csdn.net/20170526211803669?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

下面通过代码实现线程分离：

![20](http://img.blog.csdn.net/20170526214240556?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

![21](http://img.blog.csdn.net/20170526214302963?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

因为线程分离后就不能再被等待，所以在程序中加入等待函数，如果线程分离成功，就会打印出错信息。

运行结果如下：
![22](http://img.blog.csdn.net/20170526214334816?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3VtbXlfSg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

等待函数打印出错信息，线程分离成功

----------
## The End ##


由于调用pthread_join后，如果该线程没有运行结束，调用者会被阻塞，在有些情况下我们并不希望如此。

  例如，在Web服务器中当主线程为每个新来的连接请求创建⼀个子线程进行处理的时候，主线程并不希望因为调用pthread_join⽽而阻塞（因为还要继续处理之后到来的连接请求）。这时可以在子线程中加入代码     pthread_detach(pthread_self()) 或者主线程调用pthread_detach(thread_id)（非阻塞，可立即返回） 。

  将子线程的状态设置为分离的（detached），如此一来，该线程运行结束后会自动释放所有资源。
