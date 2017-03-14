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
  index : 0,
  listTotal : 0,
  data : null,

  deleteBtn : function() {
    var btn = document.querySelector(".content");

    btn.addEventListener("click", function(evt) {
      if(evt.target.tagName !== "A" && evt.target.tagName !== "BUTTON") return;

      var target = evt.target.closest(".title").querySelector(".newsName").innerText;
      var liList = document.querySelectorAll(".mainArea nav ul li");
      liList.forEach(function(val, index) {
        if(val.innerText === target) {
          val.remove();
          this.data.splice(index, 1);
        }
      }, this);

      this.loadContent(this.data[0]);
      this.changeCurrentNumber(1);
      this.listTotal = this.listTotal - 1;
      this.changeTotalNumber(this.listTotal);
    }.bind(this));
  },

  clickBtn : function() {

      var btns = document.querySelector(".btn");

      btns.addEventListener("click", function(evt) {

        var target = evt.target;
        if(evt.target.tagName === "A") target = target.parentNode;
        ajax.sending(newslist, function(res){
          var json = JSON.parse(res.target.response);
          if(target.classList.contains("left")) {
            if(this.index === 0) {
              this.index = this.listTotal-1;
            } else {
              this.index = this.index - 1;
            }
          }
          else if(target.classList.contains("right")) {
            if(this.index === this.listTotal-1) {
              this.index = 0;
            } else {
              this.index = this.index + 1;
            }
          }

          this.loadContent(json[this.index]);
          this.changeCurrentNumber(this.index+1);
        }.bind(this));
      }.bind(this));
  },

  linkMainArea : function() {

    var mainArea = document.querySelector(".mainArea nav ul");
    mainArea.addEventListener("click", function(evt) {
      if(evt.target.tagName !== "LI") return;
      ajax.sending(newslist, news.clickMainAreaLi.bind(evt.target));
    });
  },

  clickMainAreaLi : function(res) {

    var json = JSON.parse(res.target.response);

    var target = json.findIndex(function(val) {
      return val.title === this.innerText;
    }, this);

    news.index = target;
    news.changeCurrentNumber(target+1);
    news.loadContent(json[target]);
  },

  changeCurrentNumber : function(number) {
    var current = document.querySelector(".current");
    current.innerText = number;
  },

  changeTotalNumber : function(number) {
    var total = document.querySelector(".total");
    total.innerText = number;
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

      this.changeTotalNumber(json.length);
      this.listTotal = json.length;

      this.data = json;
    }

    ajax.sending(newslist, load.bind(this));
    this.clickBtn();
    this.deleteBtn();
  }
}
