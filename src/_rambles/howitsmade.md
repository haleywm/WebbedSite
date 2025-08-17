---
title: "How It's Made"
description: "The tools and services that I use to make and run my website."
date: 2025-08-17
sections:
    - name: "How: Web Hosting"
    - name: "How: Website Making"
    - name: "How: Election Tool"
    - name: "How: Visitor Count"
    - name: "How: Episode Picker"
    - name: "Why: Web Hosting"
    - name: "Why: Website Making"
    - name: "Why: Other Tools"
---

{% include sections.html %}

This is where I'll discuss how I made different bits and pieces of my website. I'm mostly writing this both as a reference for myself when I inevitably forget how I did something, and also for others if they're curious about how any of the stuff in my website works, in case they'd like to see how other people do stuff.

None of the ways that I do things are guaranteed to be the best way of doing a task, and they're generally going to be based on my opinion of what I think is the easiest or most fun way of doing something, but sharing ways to do things will hopefully inspire others to try doing their own projects 😁.

If you're interested in a guide that's more explicitly trying to be a beginner friendly guide for how to get into making your own indie website, I would recommend [The Mozilla Guide](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started) for a very thorough (but very self-guided and expecting you to try things out for yourself) way to do HTML, or maybe the [W3Schools](https://www.w3schools.com/html/html_intro.asp) guide for something slightly more interactive.  
[Petrapixel](https://petrapixel.neocities.org/coding/how-to-make-a-website) has a nice introduction to the overall concept of what you'll be learning, but doesn't suggest any specific resources. You're always welcome to google around for some HTML tutorials and see if there's a way of learning that works for you. Like any art and craft style project, there's a lot of room for different ways to be used to do something, and you can start taking things in your own direction whenever you feel like.

If you would like to see the raw source code, I publish the code for most of my work on the following github links (I am investigating github alternatives following a recent shift by github staff, but haven't made the move yet).

- [WebbedSite](https://github.com/haleywm/WebbedSite)
- [PreferentialPoll](https://github.com/haleywm/PreferentialPoll)
- [CaddyVisitorCount](https://github.com/haleywm/CaddyVisitorCount)

Note that I will not be publishing my configuration file for my Caddy server in case it has secrets in it, but if you know me then I can share it if you ask nicely.

---

This article will be separated into two sections: "How", and "Why".
"How" will give a summary of exactly how things work, and will aim to be concise to communicate information simply to people without going off on tangents.  
"Why" will go into detail about my personal opinions and reasoning for doing things the way that I have, in an attempt to ramble on about my personal opinions for anybody who cares.
## How

### How: Web Hosting
The base website at https://poggers.au is a static website. It is hosted as a simple https file server using [Caddy](https://caddyserver.com/).
Caddy also handles the public facing networking and HTTPS support for my election tool by acting as a reverse-proxy.

### How: Website Making
I have hand-coded as much of my website as I can, by creating my own templates as I go, and tried different things until I was happy with the theme. Absolutely no AI is used in anything that I make.

I use [Jekyll](https://jekyllrb.com/) to build my website, which lets me build a fully themed website very easily. I don't currently use any plugins with it. I write various types of files up in [Visual Studio Code](https://code.visualstudio.com/), and then pass it to Jekyll to generate locally on my development laptop.

I also use the [Obsidian](https://obsidian.md/) text editor for writing up my rambles, which lets me edit files using Markdown. I can then copy-paste these files to a separate markdown file in my website files, add on any front matter needed for Jekyll, and let Jekyll convert it into a full website page.

### How: Election Tool
My election tool uses a python back-end, by running my [PrefentialPoll](https://github.com/haleywm/PreferentialPoll)'s Poller program on my server, which handles storing polls and votes, and calculates the result of polls as needed by running the Teller program in the same project.

Teller provides a JSON API, which is spoken to by the user interface that I have created at the [Preferential Poll](https://poggers.au/tools/preferential-poll/) page on my website. The interface is created by a mostly vanilla Javascript script which is loaded by the preferential poll page. The script makes web requests to the API endpoint, and uses the output to generate page elements for the user to interact with.  
The interface uses the [SortableJS](https://sortablejs.github.io/Sortable/) library to help make the voting interface more user friendly, by allowing users to easily drag and drop their votes, but otherwise no javascript frameworks are used.

### How: Visitor Count
My visitor count works by having using my [CaddyVisitorCount](https://github.com/haleywm/CaddyVisitorCount) tool run. I have configured my Caddy web server to pass request logs over a network socket to my visitor count, which listens for information over this socket, and filters out just the IP addresses of visitors. The tool uses the IP addresses to determine if a request is from a new visitor, or someone it has seen within the past 30 minutes. It outputs this information to a JSON file which states how many total visitors have been seen, and how many current visitors are present.

This file is saved in the website's folder, so that browsers can access it. A script is included on the website which attempts to retrieve this file, and uses the values within to update the visitor count in the sidebar.

### How: Episode Picker
My episode picker tool works by taking a list of different categories of episode for a given show, allowing users to select the categories that they want included (Depending on what categories I have created, such as particular seasons of a show, or particular shows within a larger continuity, etc), and then running a script which merges the selected lists, and then randomly selects an item within this list.

The episode lists are stored separately for each show as fairly large `.json` files.

I generate these files by first locating a summary of all of the episodes for a particular show (I have found the [TVMaze](https://www.tvmaze.com/) episode guides to be really good for this), saving this page, and then using a python script that I cooked up to parse through the webpage using [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/), extract the episode names and descriptions, categorise the episode using additional rules if needed, and then add the episode to a data structure. I can then save this data structure as JSON once the file has been processed.

---

## Why

### Why: Web Hosting
I like to self host stuff, so I try to run things locally on my own server as much as possible! I like to own my own things, and for the time being I haven't gotten burned yet so as long as I follow the cybersecurity rules that feel important to me, I'm not generally too fussed. If someone ever manages to trick my system into running a crypto miner then that's going to significantly reduce what I'm willing to do so hopefully I haven't made any big enough mistakes for that to happen.

I use [Caddy](https://caddyserver.com/) as my web server, because it's the nicest HTTPS server that I've been able to find. The main alternatives that I'm aware of are Nginx and Traefik, however Nginx is notoriously quite complex to configure, and Traefik's documentation just felt a bit inaccessible to me, it doesn't seem interested in establishing exactly what it does and doesn't do, and I personally felt like there was an assumption that if you were on their website, then you must already be familiar with what it does.

Caddy felt much simpler and more accessible to me. It's automatic HTTPS stuff is quite nice, and they have a simple (ish) [getting started](https://caddyserver.com/docs/quick-starts/caddyfile) that walks you through how configuration works, and pretty quickly points you to their [directives](https://caddyserver.com/docs/caddyfile/directives) which is where you really see what it lets you do. I still think that they could make their documentation for new users a lot clearer (For example, it took me a while to realise that Caddy will strictly only match what the user types as the URL to a site address, so if you're hosting a local network server, you probably want to use `:80, :443` for your address, rather than "localhost", because otherwise you'll end up receiving no response rather unexpectedly.)

Once you get the hang of it, Caddy is extremely powerful and lets you do a great deal. I really enjoy being able to use it as a very solid, reliable, and fully featured static file server, as well as a reverse proxy server, simultaneously. Caddyfiles are also genuinely quite fun to write. It's also reasonably battle tested.

### Why: Website Making
You can see my command line process for handling files at [Command Line Tools](/rambles/commandline/).

I'll write up a document about my preferred programming setup down the line once I get time and also decide that I'm happy with my current setup.

Static site generators are really handy for making simple websites. Static websites are websites that are essentially a folder of premade web files, and visitors get served exactly those files. There's no dynamic code which modifies the webpage before it gets served to you, which is how sites like Wordpress run, and there's no algorithm which decides to show different personally tailored content to users on each visit, like how modern social media sites work. A lot of indie websites run using static sites, and I've really enjoyed the revival of them.

Static websites are the only option on sites like [Neocities](https://neocities.org/). If you're facing issues because you have to copy and paste a lot of stuff between all of your pages, and it's becoming a massive hassle to update every single page every time you want to change part of your theme, then static site generators can help automate that work and save you a lot of time.

There are lots of [static site generators](https://github.com/myles/awesome-static-generators) out there, and there's good reasons to use most of them. I see a lot of others using [11ty](https://www.11ty.io/), and I'm sure it's great.
Personally at the moment, I'm using [Jekyll](https://jekyllrb.com/). I'm working with Jekyll because I found that the documentation was a lot easier to follow along. They have a [step by step tutorial](https://jekyllrb.com/docs/step-by-step/01-setup/), and while it assumes that you're familiar with working with HTML already, I found it does a good job at slowly introducing you to the different features that Jekyll has. I've tried to learn 11ty a few times, but I've always struggled a lot more with the tutorials and making sure that I was doing things correctly. This might partially be because 11ty makes a lot less assumptions about how to do things, and tries to give you more freedom, but this also makes it harder to say "Yes I want to achieve X goal, and so I have to do it by using Y feature of Jekyll".

A common criticism of Jekyll is that it's slow, however that hasn't currently been an issue for me, and if it starts to become an issue down the line, then I'll probably try harder to figure out how to port my system over to something faster.

### Why: Other Tools
There's not much to say about why I chose to make my other tools the way I did. I like Python for server side code because it's a language that's easy and fast to develop in, which is nice for my sleepy coding style. Locally I code in javascript because that's really the only option, and last time I checked Webassembly wasn't really good enough to use for all web coding. I considered figuring out Typescript but it seemed like a lot of effort to setup a flow for so I didn't bother, and I haven't run into any complex issues that typing would have helped debug yet.

The difference between typed python and typed javascript has really made me appreciate Pythons built in support for type hinting, even if it doesn't actually validate it. It's much easier when you can test and run the same code, rather than doing typescript's "Write javascript code with type hinting, then run a program which tests the code, and outputs the code with the type hints removed so that it's valid javascript".