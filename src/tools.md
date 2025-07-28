---
title: "Tools"
description: "Various tools that I made."
---

Here are some tools that I've made, or that I'm currently working on. They'll become available as they're made, although maybe if I end up making something a bit too resource-intensive I might end up having to stick a password on it to keep it friends-only, but I'd like to try to keep things lightweight enough that that's not a worry.

{% for tool in site.tools %}
- [{{ tool.title }}]({{ tool.url }})
    - {{ tool.longdescription | markdownify }}
{% endfor %}
