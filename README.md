# uba lint

## 说明

uba 代码检查插件


## 使用


```bash
uba lint -t react src
```
-t 可指定三个参数 js/react/vue

后面跟的是检查目录，可写多个目录

```bash
uba lint -t react src demo
```

#### 可以在package里面配置

```
"scripts": {
    "dev": "uba server",
    "build": "uba build",
    "lint": "uba lint -t react src"
  },
```
然后在控制台执行
```
npm run lint
```


## 更多

如果想挖掘更多的`uba`插件，请点击[Npmjs for uba-*](https://www.npmjs.com/search?q=uba-)
