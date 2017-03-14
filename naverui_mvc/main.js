var newslist = "http://localhost:8000/data/newslist.json";

document.addEventListener("DOMContentLoaded", function() {
  news.init();
});

var ajax = {
  sending : function(url, func) {

    var res = new XMLHttpRequest();
    res.addEventListener("load", func);
    res.open("GET", url);
    res.send();
  }
}

var news = {

  clickBtn : function() {

      var btns = document.querySelector(".btn");

      var index;
      btns.addEventListener("click", function(evt) {
        var newsName = document.querySelector(".newsName").innerText;
        var target = evt.target;
        if(evt.target.tagName === "A") target = target.parentNode;
        ajax.sending(newslist, function(res){
          var json = JSON.parse(res.target.response);
          for(var i = 0; i < json.length; i++){
            if(newsName === json[i]["title"]){
              if(target.className.includes("left")){
                if(i === 0) index = json.length - 1;
                else index = i - 1;
                break;
              }else if(target.className.includes("right")) {
                if(i === json.length - 1) index = 0;
                else index = i + 1;
                break;
              }
            }
          }
          news.loadContent(json[index]);
        });
      });
  },

  linkMainArea : function() {

    var mainArea = document.querySelector(".mainArea ul");
    mainArea.addEventListener("click", function(evt) {
      if(evt.target.tagName !== "LI") return;
      ajax.sending(newslist, news.clickMainAreaLi.bind(evt.target));
    });
  },

  clickMainAreaLi : function(res) {

    var json = JSON.parse(res.target.response);

    var target = json.find(function(val) {
      return val.title === this.innerText;
    }, this);

    news.loadContent(target);
  },

  loadMainArea : function(json) {

    var mainArea = document.querySelector(".mainArea ul");

    var titleList = "";

    json.forEach(function(val) {
      titleList = titleList + "<li>" + val.title + "</li>";
    });

    mainArea.innerHTML = titleList;
    this.linkMainArea();
  },

  loadContent : function(json) {

      var content = document.querySelector(".content");
      var template = document.querySelector("#newsTemplate").innerHTML;

      template = template.replace("{title}", json.title);
      template = template.replace("{imgurl}", json.imgurl);
      template = template.replace("{newsList}", "<li>" + json.newslist.join("</li><li>") + "</li>")

      content.innerHTML = template;

      // var source = document.querySelector("#newsTemplate").innerHTML;
      // var template = Handlebars.compile(source);
      //
      // content.innerHTML = template(json);
  },

  init : function() {

    function load(res) {
      var json = JSON.parse(res.target.response);
      this.loadMainArea(json);
      this.loadContent(json[0]);

    }

    ajax.sending(newslist, load.bind(this));
    this.clickBtn();
  }
}
