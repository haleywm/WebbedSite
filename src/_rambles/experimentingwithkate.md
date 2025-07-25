---
title: "Experimenting with Kate"
description: "My experience trying to learn a new Text Editor."
published: false
---

For a long time I've been using VSCode. It's well made, has a massive number of plugins made for it, and has the backing of Microsoft to help it integrate really well into a lot of tools that I use. Especially back when I was developing on Windows, it was really great for being able to run it on windows, but have it connect over to WSL so that I can get linux development on windows.

But recently I've switched to linux on my coding laptop, with a decent chunk of my motivation for that being that I'm trying to get away from the AI stuff they keep pushing before it gets worse. But VSCode, as a different microsoft product, isn't exempt from all the AI stuff, and even having disabled and turned off as much of it as I can, even the new window welcome page asks you if you want to create a file with Copilot, and that doesn't seem to be removable. It looks like the integration with AI is only going to continue to become more ingrained into VSCodes identity so I'm looking into jumping ship while I can.

While reading a summary page of KDE, I noticed it advertising the [Kate text editor](https://kate-editor.org/), and I thought to myself that it looked an awful lot like what you can do in VSCode. So the next day I installed it and tried to fiddle around with what it can do.

## Colour Schemes

My first moments weren't ideal, I've been trying out a light theme lately, and I wasn't impressed with any of the built in light themes. I flat out couldn't find any third party themes made for the editor at all, but after some hunting, I found the documentation of the light mode colour scheme I've been trying, [Rosé Pine](https://rosepinetheme.com/palette/), as well as [documentation](https://docs.kde.org/stable5/en/kate/katepart/color-themes.html) for which colour scheme variables were necessary (the build in schemes I looked at have built in colour codes for every single specific language and I'm not putting in that much effort), and what every other colour scheme meant. I also needed to be able to style the base window, but some hunting on the Rosé Pine website found a partially finished, but good enough, [colour scheme for KDE](https://github.com/ashbork/kde).

After seeing that the KDE theme used a tool to assemble Rosé Pine themes from a [template file](https://github.com/rose-pine/build), I set to adapting a KDE theme to match this, and after some testing, I think I've made something that works pretty well.

## Code Suggestions

This is where things got a bit more awkward. Kate supports code-suggestions, but they're much fiddlier than with VSCode, where they're either built into the engine, or you're auto-suggested an extension which does most of the work for you (with the occasional having to spend 2 minutes to hunt down something like the really useful [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one), which makes editing markdown in VSCode a joy. Granted, I could get used to editing my markdown in Obsidian and copying it over when I'm done, but I guess I'll have to adjust to that if I want to make the move).

Installing language servers (referred to in Kate as LSPs) is a bit fiddly. You can look through to Kate's settings menu and find it's default LSP config to find out what tool the Kate devs would recommend for you, and then you have to go hunting to find the actual tool, as some tools like the HTML server are simply a reference to the one that's used by VSCode, and to actually use it requires you to find someone else who has extracted the tool and made it available for download. If this extracted version has a slightly different name, then you'll have to copy that part of the JSON and overwrite it with your own to correct the name. I also encountered an issue that took me some time to figure out where it wasn't able to find anything. It turns out that Kate doesn't read any of your files to assemble a PATH and instead only looks through a couple of global paths, so I had to copy most of my PATH into a setting in the "Behaviour" area of the settings. This wasn't too difficult, but it confused me and google wasn't any help, so some text in the dialogue could have been helpful.

## Current Experience

After setting up some LSPs, twiddling with some settings, and twiddling with my theme to better suit my preferences, Kate isn't all too bad. It has some quality of life pieces that are missing from VSCode, but that's largely down to the lack of community making plugins for Kate. For now I might stick with VSCode simply because it's more comfortable to me, and I've messed around outside of my comfort zone enough for one week, but it's nice to know that the alternatives outside of VSCode aren't *that* bad. If I get tired of working on my own stuff I could see myself looking into how to contribute to it's development to help smooth out the rough edges, because with a better system to automatically download LSPs for use within Kate, and a markdown plugin that modifies behaviour when editing markdown files, (plus if I can figure out whatever's going on with the session system) then I could see it being a really serviceable code editor for me.
