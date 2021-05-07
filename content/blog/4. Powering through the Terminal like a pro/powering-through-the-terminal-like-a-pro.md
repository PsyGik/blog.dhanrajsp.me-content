---
title: "The Lazy Developer Series: E1 — Powering through the Terminal like a pro."
author: "Dhanraj Padmashali"
tags: ["The Lazy Developer Series"]
image: "./images/terminal.png"
date: "2021-04-17T12:13:29.018Z"
draft: false
permalink: "powering-through-the-terminal-like-a-pro..md"
excerpt: 'In this episode of The Lazy Developer Series, we will be shaving off precious seconds by using shortcuts for our most used terminal commands.'
---

Welcome to the first episode of *The Lazy Developer Series.* In this episode I'll share some handy terminal hacks to get things done faster using *Alias*. 

# What is an Alias?

Alias is like a shortcut to an actual command. Say you want to `cd` into a really long directory,

```bash
$ cd go/to/a/really/long/directory/from/where/ever/i/am/right/now
```

Remembering this path is a challenge (Unless ones got a photographic memory). Let's make it short. Fire up the terminal and type 

```bash
$ code ~/.bash_profile
```  

> Note: I am using VS Code to edit these files. One can use vim, nano or whatever edits their code.

Let's add our alias

```bash
alias goto_dir='cd go/to/a/really/long/directory/from/where/ever/i/am/right/now'
```    

Now save the file and type,

```bash
$ source ~/.bash_profile
```

This will pickup any changes we did to our `bash_profile`. Let's goto that really long directory once again, but this time using the alias we just wrote. 

```bash
$ goto_dir
```

***et voilà***! We now executed the really long command using a shortcut.

> Bonus point: We can type some characters and press tab for auto complete to type our alias.

Now that we've discovered what an alias does, let me share,  how I've configured my `bash_profile` for different uses.

# Finder Alias

The first two lines I always have are:

```bash
alias edit_bash="code ~/.bash_profile"
alias source_bash="source ~/.bash_profile"
```    

I use these to edit my `bash_profile` whenever I feel like adding a shortcut and then source it as soon as I edit it.

## Finding stuff

These are some of the commands I use to quickly list and browse through the system using the terminal.  

I also have setup some directory shortcuts (like how we saw with the really long example), to quickly navigate to the directory of choice


> Pro-tip: Set this up when you know that the directory is never going to move from that path. I've set this up against my dev directories. And some more which I'm not gonna share for obvious reasons.

## Going back in time

Sometimes I type lot of commands and then I need to execute a command which I used in the past. I do remember part of the command, but I'm too lazy to look for it by scrolling up the terminal or by jamming the up arrow. For this I use the handy `history` command with a little help from `grep`.

```bash
alias :=' -s histverify && history | grep '
```

Now I just type `$ : fire` and this will list out all the command which had the string `fire` in them.

> See the `shopt -s histverify` there? It's there so that I don't accidentally execute any command in a sensitive env (and bring the Internet down). It will always print the command for me before executing. Also, `shopt` is a bash shell command, so zsh users, Google is your friend. 

# Functions as Alias? Sure.

The thing about alias is that, we can also add a function block to accept inputs and do some additional stuff which cannot be done using a one-liner.

Let's start with a simple one. Most of the time when I use `mkdir` I always do a `cd` after. Seeing as to how lazy we are, let's save some time with this. Add this to your `bash_profile` :

```bash
mcd () { mkdir -p "$1" && cd "$1"; }
```

`$1` here indicates the first argument we pass to the function. Now just type 

```bash
$ mdc new-folder
```

and we have created the folder and made it the current working directory.

Now what if we want to search a git commit by part of it's commit message?

```bash
# Git log find by commit message
function glf() { git log --all --grep="$1"; }
```    

Now all I've gotta do is type 

```bash
$ glf missing
```

and it'll list out the commits with the string missing in them. 

# Remembering the alias?

The above alias were just a couple of examples. In reality, I have over 30 alias defined, and it often happens that I forget what the actual alias was. So here's another alias to find me that alias. 

```bash
#   aliasw: to remind yourself of an alias (given some part of it)
aliasw () { /usr/bin/grep --color=always -i -a1 $@ ~/.bash_profile | grep -v '^\s*$' | less -FSRXc ; }
```    

Now we have to type 

```bash
$ aliasw web
```

and it will list all the alias which have the word web in them.

That's all folks! 

Until next time! ✌🏽
