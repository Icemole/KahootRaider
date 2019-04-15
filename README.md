# KahootRaider

A JavaScript / Node.js utility to raid Kahoot! games with usernames provided by the user.

This program uses [Google Chrome's Puppeteer](https://github.com/GoogleChrome/puppeteer)'s library in order to create Kahoot! tabs, which will be (correctly, hopefully!) filled in with the PIN and nickname provided when executing the program.

In order to execute the program, you will need node.js installed, which you can [get here](https://nodejs.org/). You will also want to install Puppeteer; you can see the details and steps to take to install it [here](https://github.com/GoogleChrome/puppeteer#installation), but basically insert this on your terminal of choice (which will install Puppeteer):

```
npm i puppeteer
```

Puppeteer takes quite a lot of space (from 150MB to 300MB depending on your operating system), so take this into account when using the program.

The program logs some instructions to the console when executing it, I don't find it hard to follow them. However, I was the one who programmed it, so if you find something unclear about the instructions please let me know through an issue.

If you find any bug, feel free to open an issue.

---

## TODO
Description | Done?
----------- | -----
Basic program functionality | :heavy_check_mark:
Make the code more readable (wrap into functions) | :x:
Visual interface | :question:
Parallelization | :question:


---

**DISCLAIMER: don't use this for wrong things (in essence, when you know someone will get annoyed or hurt), instead use it for everyone's enjoyment, such as in a cool classroom you are attending. You are responsible of the bad stuff you make with this. Don't make everyone (including me) sad and use it for the greater good :)**
