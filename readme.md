Node.js project for loading mensa menus from Seezeit, the canteen provider
around Lake Constance. The program loads the data from the Seezeit website and
parses the HTML.

**Please note: Do not flood the Seezeit website with requests when trying out this script.
Use the provided example.html file instead by using line 33 instead of 34 in mensa.js.**

Usage:

```
const { loadData } = require('./mensa');

loadData('ravensburg').then(console.log);
```
