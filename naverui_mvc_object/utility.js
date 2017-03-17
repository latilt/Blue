var newsURL = "data/newslist.json";

var ajax = {
  sending : function(url, func) {

    var res = new XMLHttpRequest();
    res.addEventListener("load", func);
    res.open("GET", url);
    res.send();
  }
}
