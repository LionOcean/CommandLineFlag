# CommandLineFlag
An easy tool for generating CLI and controling command params

> version: 0.0.6

> Date: 2019/1/17

> Support parsing command line arguments and outputting doc quickly 

<div align="center">

[![](assets/logo.png)](https://www.npmjs.com/package/@alanchenchen/commandlineflag)

[![Build Status](https://travis-ci.com/LionOcean/CommandLineFlag.svg?branch=master)](https://travis-ci.com/LionOcean/CommandLineFlag)
[![](https://img.shields.io/npm/v/@alanchenchen/commandlineflag.svg)](https://www.npmjs.com/package/@alanchenchen/commandlineflag)
![](https://img.shields.io/node/v/@alanchenchen/commandlineflag.svg)
![](https://img.shields.io/npm/dt/@alanchenchen/commandlineflag.svg)
![](https://img.shields.io/github/license/LionOcean/CommandLineFlag.svg)

</div>

[中文文档](READEME_zh.md)

## Feature
* easy api, fast CLI initialization
* flag module could parse command line arguments and call registered function
* output module could output formatted helpInfo doc。
* absolute seperation among modules although you can inject output instance to flag instance to generate helpInfo about command or option conveniently
* similar api to [commander](https://github.com/tj/commander.js) ，nearly all api support chain call(flag's run method and output's render method not support)

## Directory tree
``` bash
    ├─example  // demo
    |─src       
    │  └─core  // source code
    └─test     // test
```

## Usage

1. `yarn add @alanchenchen/commandlineflag` or `npm install --save @alanchenchen/commandlineflag` 
2. npm package export an object including two methods:
    * `flag` resolve command line arguments
    * `output` output formatted helpInfo doc

## Options
## flag module
#### flag method
method returns a Flag instance

#### Flag instance method
1. `param` basic function that parse cmd arguments, returns a Flag instance。Function arguments：
    * opts `[Object]`
        * index `[Number]` cmd argument index，default is undefined
        * flag `[String]` cmd argument flag name，default is undefined
        * action `[Function]` callback function while matching cmd argument successfully
            * first argmuent is an object inculding two keys，index and param
            * second argument is an array that show a list including all cmd arguments
            * callback function trigger rule：
                1. only index, if cmd argument of index exsit, trigger
                2. only flag, if cmd argument of flag exsit, trigger. flag should not match the index.
                3. both index and flag, should match cmd argument of index and cmd argument of flag, trigger
            
2. `command` parse command (index is 0)，returns a Flag instance。Function arguments：
    * flag `[String]` command name，required
    * desc `[String]` command helpInfo 
    * action `[Function]` callback function while matching cmd argument successfully
    > if there are two arguments，the second one must be action，if three，the second one must be desc，the third one must be action。
3. `option` parse option (only flag)，returns a Flag instance。Function arguments：
    * flag `[String]` option name，required
    * desc `[String]` option helpInfo 
    * action `[Function]` callback function while matching cmd argument successfully
    > if there are two arguments，the second one must be action，if three，the second one must be desc，the third one must be action。
4. `version` parse version option，returns a Flag instance and output version message。Function arguments：
    * desc `[String]` version message
    * flag `[String]` version flag，default is '-V | --version', you could rewrite it
5. `register` register prototype method globally，returns a Flag instance。command、option and version method are all implemented by register。Function arguments：
    * name `[String]` method name，required
    * handler `[Function]` trigger function while you use the register method, usually use param method to implenment it。Such as ：
        ```js
        const program = new Flag()
        program.register('help', info => {
            // if you want help method to be chain called，return program.param() or program
            return program.param({
                flag: '--help',
                action() {
                    console.log(info)
                }
            })
        })
        
        // now，any Flag instance could include help method 
        program.help('help info')
        ```
6. `inject` inject Output instance，would output doc while running，returns a Flag instance。Function arguments：
    * OutputInstancen `[Object]` Output instance which would be injectd，required
7. `run` run the Flag instance, no return value。
> must call run method otherwise the cmd arguments would not be parsed 

## output module
#### output method
method returns a Output instance。

#### Output instance method
1. `writeUsage` output usage info，returns a Output instance。Function arguments：
    * usageInfo `[String]` main usage info
    * description `[String]` usage description bellow usageInfo，optional
2. `writeCommands` output command helpInfo，returns a Output instance。Function arguments：
    * if there is only one argument: 
        * info `[Array]` array item is an object including title(command name) and desc(command description)
    * if there are two arguments:
        * commandInfo `[String]` command name
        * description `[String]` command description
3. `writeOptions` output option helpInfo，returns a Output instance。Function arguments：
    * if there is only one argument: 
        * info `[Array]` array item is an object including title(command name) and desc(command description)
    * if there are two arguments:
        * optionInfo `[String]` option name
        * description `[String]` option description
4. `write` info at the end of doc，returns a Output instance。Function arguments：
    * desc `[String]` customed info ，support multiple arguments
5. `render` generate helpInfo doc，returns a string of doc。Function arguments：
    * isShowLog `[Boolean]` whether output doc to stdout，default is true
> must call render method otherwise the doc would not be generated. If you inject Output instance to Flag instance, render method is not necessary since Flag instance implement render method

## Example
> see [hotload-cli](https://github.com/alanchenchen/hotload-cli/blob/master/bin/hotload)

## Unit test
* there is only one test about `command()`、`option()`and `version()` of `Flag` instance
* the test framework is mocha，if you want to add unit tests，follow ：
    1. `git clone git@github.com:LionOcean/CommandLineFlag.git`
    2. add js which should have `*.test.js` extname
    3. `yarn` or `npm install` install devdependences mocha
    4. `npm test` open terminal to see result

## license
* MIT

