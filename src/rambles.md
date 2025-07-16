---
title: "Rambles"
description: "My collection of rambles about various topics"
---

Here is where I will link my rambles with opinions on different topics. Think of them as a cross between the types of shrines that I see lots of indie web people do on their websites, and blog posts. I like the idea of shrines but don't know if I feel like doing creative enough web design on every single page to go with that, although maybe I'll change my mind down the line.

Rambles:

{% for ramble in site.rambles %}
- [{{ ramble.title }}]({{ ramble.url }}) - {{ ramble.description }}
{% endfor %}
