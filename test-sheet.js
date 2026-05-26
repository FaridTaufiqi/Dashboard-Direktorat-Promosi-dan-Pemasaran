const fetch = require('node-fetch');
fetch('https://docs.google.com/spreadsheets/d/16uQIT5riOor66rsf01sosstgCjTtOg28-zRAf7TVeQo/gviz/tq?tqx=out:csv&sheet=final').then(r => r.text()).then(t => console.log(t.substring(0, 200)));
