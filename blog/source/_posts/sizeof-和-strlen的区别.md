---
title: sizeof 和 strlen的区别
date: 2017-08-11 17:15:37
update: 2017-08-11 17:15:37
tags: [sizeof,strlen]
categories: C/C++基础
copyright: true
top:
---
![wenti](http://ou7wdump3.bkt.clouddn.com/mmexport1502445514715.jpg)

先来看一段代码：

<!-- more -->

```C++
    char* p1 = "helloworld";
	char p2[] = "helloworld";
	printf("%d, %d, %d, %d\n", sizeof(p1), strlen(p1), sizeof(p2), strlen(p2));
```
运行结果：

    4 10 11 10

没错，这就是sizeof和strlen的区别，在字符串长度的计算中。strlen不会加上'\0'.