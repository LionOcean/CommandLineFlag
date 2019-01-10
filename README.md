# CommandLineFlag
An easy tool for generating CLI and controling command params

> version: 0.0.5

> Date: 2019/1/10

> 提供命令行参数注册解析，和输出cli文档功能

<div align="center">

[![](assets/logo.png)](https://www.npmjs.com/package/@alanchenchen/commandlineflag)

[![Build Status](https://travis-ci.com/LionOcean/CommandLineFlag.svg?branch=master)](https://travis-ci.com/LionOcean/CommandLineFlag)
[![](https://img.shields.io/npm/v/@alanchenchen/commandlineflag.svg)](https://www.npmjs.com/package/@alanchenchen/commandlineflag)
![](https://img.shields.io/node/v/@alanchenchen/commandlineflag.svg)
![](https://img.shields.io/npm/dt/@alanchenchen/commandlineflag.svg)
![](https://img.shields.io/github/license/LionOcean/CommandLineFlag.svg)

</div>

## Feature
* 通过简单的api调用，可以快速实现cli搭建。
* flag模块用于解析命令行参数，并注册回调函数来解析参数。
* output模块用于输出格式化的帮助文档信息。
* 两个模板均完全解耦，可以独立使用。也支持flag实例注入output实例，用于快速生成command或option帮助文档。
* 模仿commander的api风格，几乎所有的api支持链式调用(flag的run方法和output的render方法不支持)。

## Dictionary tree
``` bash
    ├─example  // 例子demo
    |─src       
    │  └─core  // 源码
    └─test     // 测试用例
```

## Usage

1. `yarn add @alanchenchen/commandlineflag` or `npm install --save @alanchenchen/commandlineflag` 安装包
2. npm包默认导出一个对象，包含2个方法，分别是
    * `flag` 解析注册命令行参数模块
    * `output` 输出格式化帮助文档字符串模块

## Options
## flag模块
#### flag方法
方法每调用一次都会返回一个Flag实例。

#### Flag实例方法
1. param 解析命令行参数的原始函数,返回Flag实例。参数如下：
    * opts `[Object]`， 目前支持3个可选key。
        * index `[Number]` 参数索引，默认undefined
        * flag `[String]` 参数标志位名称，默认undefined
        * action `[Function]` 匹配成功后触发的函数。有2个参数:
            * 第一个参数为对象，包含两个key，index表示触发函数的当前参数索引。param表示为具体的参数名称。
            * 第二个参数为数组，表示所有参数的列表。
            * 函数触发规则：
                1. 只有index时，只要index对应索引的参数存在，触发
                2. 只有flag时，只要参数列表中存在flag，flag不需要索引匹配，触发
                3. index和flag均存在，必须同时匹配索引和名称，触发
            
2. command 专门用于解析命令(索引为0)参数，返回Flag实例。参数如下：
    * flag `[String]` 标志位名称，必选
    * desc `[String]` 帮助文档信息
    * action `[Function]` 匹配flag成功触发的函数，返回参数同上
    > 如果只有两个参数，第二个参数必须为action，如果有三个参数，则第二个参数为desc，第三个参数为action。
3. option 专门用于解析标志位(索引不定，只匹配flag)参数，返回Flag实例。参数如下：
    * flag `[String]` 标志位名称，必选
    * desc `[String]` 帮助文档信息
    * action `[Function]` 匹配flag成功触发的函数，返回参数同上
    > 如果只有两个参数，第二个参数必须为action，如果有三个参数，则第二个参数为desc，第三个参数为action。
4. version 专门用于解析版本号标志位(索引不定，只匹配flag)参数，返回Flag实例。并输出版本号字符串。参数如下：
    * desc `[String]` 版本号信息
    * flag `[String]` 触发版本号标志位名称，可选，用于重写默认的标志位 '-V | --version'
5. register 全局注册实例方法，返回Flag实例。例如command、option和version方法均是register实现。参数如下：
    * name `[String]` 需要注册的新方法名称，必选
    * handler `[Function]` 当使用实例的name方法时触发的函数，一般会使用param方法处理部分逻辑。例：
        ```js
        const program = new Flag()
        program.register('help', info => {
            // 如果需要help方法链式调用，只需要返回program.param()或program
            return program.param({
                flag: '--help',
                action() {
                    console.log(info)
                }
            })
        })
        
        // 一旦注册成功，任何Flag实例都可以使用help方法。
        program.help('你启用了help文档')
        ```
6. inject 注入Output实例，并且在run的过程中根据命令参数输出文档信息，返回Flag实例。参数如下：
    * OutputInstancen `[Object]` 需要注册的Output实例，必选
7. run 运行,通过命令行参数列表来匹配执行注册到实例的action函数，无返回值。
> 必须调用run方法，否则命令行不会被解析 

## output模块
#### output方法 
方法每调用一次都会返回一个Output实例。

#### Output实例方法
1. writeUsage 输出usage信息，返回Output实例。参数如下：
    * usageInfo `[String]` usage直接打印出来的信息
    * description `[String]` usage下方换行显示的cli的说明信息，可选
2. writeCommands 输出command命令的信息，可以多次调用，多次调用会叠加而不会覆盖，返回Output实例。参数如下：
    * 当只有一个参数时: 
        * info `[Array]` 数组项包含2个key: title(左侧的command名称)和desc(右侧的描述)
    * 当有两个参数时:
        * commandInfo `[String]` 左侧的command名称
        * description `[String]` 右侧的描述
3. writeOptions 输出option标志位的信息，可以多次调用，多次调用会叠加而不会覆盖，返回Output实例。参数如下：
    * 当只有一个参数时: 
        * info `[Array]` 数组项包含2个key: title(左侧的option名称)和desc(右侧的描述)
    * 当有两个参数时:
        * optionInfo `[String]` 左侧的option名称
        * description `[String]` 右侧的描述
4. write 插入文档尾部的信息，自定义文档信息，可以多次调用，多次调用会叠加而不会覆盖，返回Output实例。参数如下：
    * desc `[String]` 自定义信息，支持多个参数
5. render 渲染帮助文档信息，返回文档的字符串。参数如下：
    * isShowLog `[Boolean]` 决定是否渲染文档并输出到stdout，默认为true
> 必须调用render方法，否则文档不会被渲染输出，如果搭配Flag模块，并且Flag实例inject(注入)了Output实例，那么不需要调用render。因为Flag实例默认实现了该方法   


## Unit test
* test目录里目前只有一个测试用例，分别测试了`Flag`实例的`command()`、`option()`和`version()`方法。
* 测试框架为mocha，如果需要增加测试用例，操作如下：
    1. `git clone git@github.com:LionOcean/CommandLineFlag.git`
    2. 在test目录里新增测试文件，约定测试文件必须是`*.test.js`后缀格式，必须在js后缀前加test后缀
    3. `yarn`或`npm install`安装开发依赖mocha
    4. `npm test`在终端terminal查看测试结果

## Attentions
1. 在Flag实例的多个方法里，如果存在flag标志位，flag目前只支持字符串写法，但是支持管道字符串，例如`-V | --version`(管道符支持空格)。善用管道字符串可以快速解析多个标志位。
2. 当Flag实例的方法链式调用时，会将匹配到的action方法存到一个数组内维护，action方法支持异步函数，因为Flag的run方法也是异步，每个action触发的顺序以链式调用顺序作为标准。

## license
* MIT

