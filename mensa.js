const { JSDOM } = require("jsdom");

// URL for retrieving the mensa menus
const BASE_URL = 'https://www.seezeit.com/essen/speiseplaene/';

// Tag abbreviations to full text
const TAGS = {
  'Sch': 'Schwein',
  'R': 'Rind oder Kalb',
  'G': 'Geflügel',
  'L': 'Lamm',
  'W': 'Wild',
  'F': 'Fisch oder Meeresfrüchte',
  'Vegan': 'Vegan',
  'Veg': 'Vegetarisch'
};

// URL suffixes for different mensas
const MENSA_EXT = {
  'gießberg': 'menseria-giessberg',
  'weingarten': 'mensa-weingarten',
  'htwg': 'mensa-htwg',
  'friedrichshafen': 'mensa-friedrichshafen',
  'ravensburg': 'mensa-ravensburg'
};

// To turn function arguments into an array
const toArray = a => Array.prototype.slice.call(a);

function loadData(ext) {
  let url = BASE_URL + MENSA_EXT[ext];
  // Use this for testing:
  // return JSDOM.fromFile('./example.html').then(parseHTML);
  return JSDOM.fromURL(url).then(parseHTML);
}

// Parses the HTML into an object
function parseHTML(dom) {
  let dates = toArray(dom.window.document.querySelectorAll("div.tabs > a.tab > span"))
              .map(e => parseDate(e.textContent));
  let content = toArray(dom.window.document.querySelectorAll("div.contents"))
              .map(c => parseContent(c));
  return dates.reduce((memo, date, i) => Object.assign(memo, {[date]: content[i]}), {});
}

// Brings the date in a tab in a format we can work with
function parseDate(txt) {
  let date = txt.trim().split(' ')[1].split('.');
  let day = date[0];
  let month = date[1];
  return `${(new Date()).getFullYear()}-${month}-${day}`;
}

// Parses the meals of a day
function parseContent(element) {
  let cats = toArray(element.querySelectorAll('div.speiseplanTagKat'));
  return cats.reduce((memo, c) => {
    let name = c.querySelector('.category').textContent.toLowerCase();
    let text = parseText(c.querySelector('.title').textContent);
    let tags = parseTags(c.querySelectorAll('.speiseplanTagKatIcon'));
    return Object.assign(memo, {[name]: {text, tags}});
  }, {});
}

function parseTags(elements) {
  return toArray(elements)
          .map(e => e.className.replace('speiseplanTagKatIcon', '').trim().split(/\s+/)).filter(a => a)
          .reduce((m, e) => m.concat(e), [])
          .map(t => TAGS[t]);
}

// Parses the text content of a meal title
function parseText(txt) {
  // Remove everything in brackets
  return txt.replace(/\([^\)]+\)/g, '')
    // Remove price from title
    .replace(/([0-9]+g\s\/\s)?[0-9]+(,[0-9]+)?\sEuro/g, '')
    // Collapse whitespaces
    .replace(/\s+/g, ' ')
    .trim()
}

module.exports = {
  loadData
}
