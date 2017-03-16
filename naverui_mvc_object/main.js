document.addEventListener("DOMContentLoaded", function() {
  Controller();
});

function Header() {

}

Header.prototype = {
  curPage : document.querySelector(".current"),
  totalPage : document.querySelector(".total"),

  changeCurrentPageNumber : function(currentInt) {
    this.curPage.innerText = currentInt+1;
  },

  changeTotalPageNumber : function(totalInt) {
    this.totalPage.innerText = totalInt;
  }
}

function Nav() {

}

Nav.prototype = {
  newsList : document.querySelector(".mainArea nav ul"),

  changeNewsList : function(titleArray) {
    var titleList = "";

    titleArray.forEach(function(e) {
      titleList = titleList + "<li>" + e + "</li>";
    });

    this.newsList.innerHTML = titleList;
  }
}

function Content() {

}

Content.prototype = {
  content : document.querySelector(".content"),
  template : document.querySelector("#newsTemplate").innerHTML,

  changeNewsContent : function(newsObj) {
    newContent = this.template.replace("{title}", newsObj.title).replace("{imgurl}", newsObj.imgurl).replace("{newsList}", "<li>" + newsObj.newslist.join("</li><li>") + "</li>");

    this.content.innerHTML = newContent;
  }
}

function Controller() {
  var myHeader = new Header();
  var myNav = new Nav();
  var myContent = new Content();
  var myData = new Data();

  var index = 0;
  var length = 0;

  /* init */
  ajax.sending(newsURL, function(res) {
    var json = JSON.parse(res.target.response);
    myData.setNewsData(json);
    length = json.length;

    myNav.changeNewsList(myData.getNewsTitleAll());
    myContent.changeNewsContent(myData.getNewsObjByIndex(0));
    myHeader.changeCurrentPageNumber(index);
    myHeader.changeTotalPageNumber(length);
  });

  var leftBtn = document.querySelector(".left > a");
  leftBtn.addEventListener("click", function(evt){
    index--;
    if(index < 0) {
      index = length-1;
    }

    myHeader.changeCurrentPageNumber(index);
    myContent.changeNewsContent(myData.getNewsObjByIndex(index));
  });

  var rightBtn = document.querySelector(".right > a");
  rightBtn.addEventListener("click", function(evt){
    index++;
    if(index >= length) {
      index = 0;
    }

    myHeader.changeCurrentPageNumber(index);
    myContent.changeNewsContent(myData.getNewsObjByIndex(index));
  });

  var listClick = document.querySelector(".mainArea nav ul");
  listClick.addEventListener("click", function(evt){
    if(evt.target.tagName !== "LI") return;

    var newsDataIndex = myData.getNewsIndexByTitle(evt.target.innerText);
    index = newsDataIndex;
    myContent.changeNewsContent(myData.getNewsObjByIndex(newsDataIndex));
    myHeader.changeCurrentPageNumber(newsDataIndex);
  });

  var deleteClick = document.querySelector(".content");
  deleteClick.addEventListener("click", function(evt){
    if(evt.target.tagName !== "BUTTON" && evt.target.tagName !== "A") return;

    var newsDataTitle = evt.target.closest(".title").querySelector(".newsName").innerHTML;

    myData.deleteNewsDataByTitle(newsDataTitle);
    myNav.changeNewsList(myData.getNewsTitleAll());
    myContent.changeNewsContent(myData.getNewsObjByIndex(0));

    index = 0;
    myHeader.changeCurrentPageNumber(index);
    length--;
    myHeader.changeTotalPageNumber(length);
  });
}

function Data() {
  this.newsData = [];
}

Data.prototype = {
  setNewsData : function(json) {
    this.newsData = JSON.parse(JSON.stringify(json));
  },

  getNewsObjByIndex : function(index) {
    return this.newsData[index];
  },

  getNewsTitleAll : function() {
    var titleArray = [];

    this.newsData.forEach(function(e) {
      titleArray.push(e.title);
    });

    return titleArray;
  },

  getNewsIndexByTitle : function(title) {
    var findNewsIndex = this.newsData.findIndex(function(e) {
      return e.title === title;
    })
    return findNewsIndex;
  },

  deleteNewsDataByTitle : function(deleteNewsTitle) {
    this.newsData.forEach(function(e, i, a) {
      if(e.title === deleteNewsTitle) {
        a.splice(i, 1);
      }
    });
  }
}
