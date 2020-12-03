# How to use
Choc-server is a local development tool, include dictorey listing、local server starting.
## create static server
```
# create static server, use process.cwd() as default
npx choc-server
# create static server with specify directory and port
npx choc-server dir=~/Downloads/ port=8080
```

## execute remote script
```
# exec remote script, make sure it is exist
node node_modules/.bin/exec url=http://localhost:8080/index.js
```

# choc-server VS http-server
<img alt="vs http-server" src="https://qiyukf.nosdn.127.net/urchin/screen.jpg" />
