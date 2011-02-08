Four elements of web performance
================================


weight, time, cpu and perception
--------------------------------

When discussing performance on the web, there are exactly four aspects to consider: weight, time, processing and perception. With this post I intend to define a basic vocabulary and to provide differentiation between elemental performance concerns.

- **Weight** is all about HTTP: the number of HTTP requests and the sizes of requests' and responses' headers and bodies. For weight, less is always more.

- **Time** mostly has to do with the network - latency, bandwidth and server response time. The faster, the better, obviously.

- **Processing** accounts for what a browser can do per time slice. The key is to distribute workloads evenly over time, and to delay processing until it's needed.

- **Perception** lies in the eye of the beholder. There are ways to make an experience feel faster and lighter without changing weight, time or processing.

These four aspects together cover all particular performance issues for web sites and web applications. I'll describe each aspect in brief detail, illustrate good practices, and mention how each should be measured.



Weight - is it heavy?
---------------------

The weight of a webpage is roughly equal to the average size of the response bodies plus two times the average size of the headers, all times the number of HTTP requests:

    weight = (avg_size(bodies) + avg_size(headers) * 2) * num(requests)

We double `avg_size(headers)` since the headers go over the wire twice for each request - once for the HTTP request from the client to the server, and once for the HTTP response from the server to the client.

There are three things you can do to reduce weight.

1. You should *always* gzip your content - this decreases `avg_size(bodies)`
1. Cookies, GET and POST parameters all live in the headers and add to `avg_size(headers)`. Eliminate what you don't need and make all key/value pairs short. Cookies are the worst - they get sent with every request!
1. Bundle resources to decrease `num(requests)`. There is no reason to deliver more than one javascript file and one css file on page load! All static images should be embedded in the stylesheets as base64 data URIs (or as mhtml attachments in the case of IE6/7)

Browser caching can make a significant difference between first and subsequent page loads. Use it to your advantage.

The correct way to measure weight is to sniff the network on one of your local machines for all HTTP traffic while loading your web site in a browser. Take note of bodies, headers, and the number of requests to find your bottlenecks. Refresh the page and look for requests that made again but could have been cached from the first time.



Time
----

Time is mostly about the network. While latency and bandwidth play a big role, for most web services you'll want to focus on one thing: server response time. It's pretty simple: just respond faster to each http request.

As an aside, recent technological advances including Bigpipe from Facebook, larger initial TCP window size and SSL optimization from Google suggest that the future of web network performance lies in between the layers of IP, TCP and HTTP. Time with tell. (no pun intended, move along, time is money).

It can be tricky to measure time objectively: you can't control latency or bandwidth, and it's not always clear what time events to measure. HTTP response times? Time until the browser renders? Or until window.onload fires? You'll need to think carefully about what events best describe your web pages. It's why they pay you the big bucks.

There are plenty of services that will load your web pages from different geographical locations with varying network quality and give you detailed reports. Use them.



Processing
----------
Browsers are getting really fast - as they get faster they use significantly more system resources. Loading a complex webpage can suck up quite a bite of memory and even peg the CPU!

After a web page has loaded, relatively little happens in the browser. Take advantage of this! First deliver the bare minimum of HTML, CSS and javascript that will make your page render and register user actions. *Then* download and process the remainder of the javascript that makes your webpage functional. Similarly, wait until the user scrolls to load images that are initially off screen.

The key insight to processing performance is to distribute the work that has to get done over as much time as possible. Considering that the majority of work is done by the browser during page load it boils down to this: do as little as possible up front, and delay as much as possible until it's needed.

The problem with measuring processing is that it's tightly coupled with the machine and browser the webpage runs on. I'm still looking for good ways to measure processing performance. One great approach is to dig up a shitty old machine and load your webpage. Does your browser freeze up or get sluggish during page load? Another approach I haven't played with yet is to monitor the browser's CPU and memory usage and decrease the variance and maximum of both during the life cycle of a page.



Perception
----------
Humans notice a tenth of a second's delay. They get impatient after a second and will close your app at 5 seconds.

The question is, after 5 seconds of what?

Perception of performance comes down to tactful communication of progress. People are happy to wait for something, as long as they are told when they'll get it. On the web, the problem is that we don't know how long a request will take. The Internet is unreliable; it makes no Quality of Service guarantees.

It turns out that a good proxy for promising time of arrival is communicating progress clearly. If you're making great progress, you know you'll get there ASAP. *You're not waiting in vain*.

There are two ways to boost perceived performance:

1. **communicate progress** with the art of spinners, progress bars, and fading content. Two pieces of advice: don't overdo it, and let the user know if you're taking longer than usual (see e.g. gmail's "it's taking longer than usual" and "still loading" messages)
1. **fake delivery** I always call out "dinner's ready!" 3 minutes before the pasta is al dente. If you have a button that requires lots and lots of javascript, just draw the button without all the javascript. Once the button is clicked, you show a spinner, load the javascript, and then execute it.

Quantitatively measuring perceived performance is hard, but you ask someone to talk to you while using your website. Ask them to tell you what they think works well and what doesn't. Take note of the interactions that receive negative descriptions (slow, sluggish, frustrating).


Conclusions
-----------
Everyone knows that Performance is important on the web. As a community, we need to develop more fine grained vocabulary. "Let's improve performance" simply isn't very helpful. I propose we talk about web performance in terms of weight, time, processing and perception, but I'm not married to the terms.