---
title: 详解String类中两种对象实例化的区别
date: 2017-11-08 10:48:01
update: 2017-11-08 10:48:01
tags: javaEE
categories: java基础
copyright: true
top:
---


<img src="http://ou7wdump3.bkt.clouddn.com/pexels-photo-356043.jpeg" width = "750" height = "450" alt="照片"  >

<!-- more -->

博客1：
java基础：详解String类中两种对象实例化的区别

1.问题导入
2.分析解决
3.总结建议

equals和==

1.堆栈内存不同导致的==问题


手工入池：

intern：对内存进行操作
native:调用C/C++方法的修饰符



相关问题：如何理解字符串常量不可变更？

实际上是指内存内容不变


字符串常量一直没有改变，只是字符串对象的引用一直在变化（图）

导致垃圾内存过多，严重浪费内存空间。
垃圾内存：指堆上分配的没有被栈上内存指向的空间

后边基本数据类型转换为字符串时的valueof函数不会产生垃圾

引出字符串使用原则