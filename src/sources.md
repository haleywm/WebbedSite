---
title: "Sources"
description: "The sources for content used around my website."
---

Here are the assets used in my website. If it's not listed here, and I don't acknowledge where it came from where it's used, then hopefully that means I made it and I didn't forget to credit it.

I would like to use more stuff like a lot of the classic web stickers and gifs around my website, but I don't like to feature stuff if I can't share the author, so I've mostly avoided doing that.

- Pogfish: I'm not entirely clear on the origin of this gif. It's been shared around the internet for several years, and originally comes from a cropped video of a [fish having sex](https://www.youtube.com/watch?v=9V-9eOppBkg). This particular video isn't the earliest upload I can find on youtube, but it comes from a nature photographer who claims responsibility for the video, so I assume that it was shared in other places by the photographer earlier. My version came from the nicest gif I could see at a glance on tenor, which I cropped to be a proper square and converted to webp.
- TV Episodes:
    - Data was extracted from [TVMaze](https://www.tvmaze.com/) and exported as json files in the format that I preferred. They have a lovely episode guide with all the information you need about the whole show on just one page.
    - [Star Trek TOS](https://www.tvmaze.com/shows/490/star-trek/episodeguide)
    - [Star Trek The Next Generation](https://www.tvmaze.com/shows/491/star-trek-the-next-generation/episodeguide)
    - [Star Trek Deep Space 9](https://www.tvmaze.com/shows/493/star-trek-deep-space-nine/episodeguide)
    - [Star Trek Voyager](https://www.tvmaze.com/shows/492/star-trek-voyager/episodeguide)
    - [Star Trek Enterprise](https://www.tvmaze.com/shows/714/star-trek-enterprise/episodeguide)
    - [The Simpsons](https://www.tvmaze.com/shows/83/the-simpsons/episodeguide)
- Election Tool:
    - For the front end:
        - [This useful answer](https://stackoverflow.com/a/2450976) on Stackoverflow from [coolaj86](https://stackoverflow.com/users/151312/root-aj) was helpful in allowing me to easily shuffle an array without needing to import an entire 3rd party library.
        - [SortableJS](https://sortablejs.github.io/Sortable/) was a great tool to let me easily make a sortable list, which looks good, and is relatively easy to use. It turned what would have been a really difficult interactive list idea into something that only took 30 minutes to implement.
    - For the web server back end:
        - [Quart](https://github.com/pallets/quart), a handy tool for making an async compatible web server, based on Flask. This let me implement a REST API which handles data in a way that I specify. I had more difficulty when it came to achieving many tasks that weren't discussed in the documentation, but I suspect that was probably because they assume that you're familiar with Flask, and there's probably a well documented way to do it with Flask that works here.
        - [Quart-Schema](github.com/pgjones/quart-schema) does a lot of type checking and conversion for you which is nice, plus it gives you a built in API test tool which was handy for correcting any incorrect assumptions.
        - [Quart-Cors](https://github.com/pgjones/quart-cors) to let me add headers to Quart so that javascript in a browser is happy to talk to it, because security rules to prevent cross-site scripting will get in your way without the web server knowing how to give permission.
        - [Aiofiles](https://pypi.org/project/aiofiles/) because for some reason python doesn't have a proper built-in way to interact with the filesystem using async, even though the point of async is to let you easily multitask with IO bound operations.
        - [Uvicorn](https://www.uvicorn.org/) to make the server faster.
    - For the preferential poll calculations:
        - No libraries were used, I just made it in raw python and never needed any
        - AEC files on counting election results in the [Lower House](https://www.aec.gov.au/learn/files/poster-counting-hor-pref-voting.pdf) and [Upper House](https://www.aec.gov.au/learn/files/poster-count-senate-pref-voting.pdf) were used to help me understand how preferential voting works in more detail. (Note that my transfer value calculation works differently, as I misread the AEC definition, and also the AEC definition doesn't make sense and can have wacky results in weird edge cases. I calculate the transfer value as stated, and multiply every votes existing transfer value (which starts as 1) by the new value. This way, votes that have transferred across multiple candidates slowly get less powerful).
