How to use

```
# create static server
npx chock-server dir=~/Downloads/ port=8080
# exec remote url as script, make sure index.js is exist
node node_modules/.bin/exec url=http://localhost:8080/index.js
```