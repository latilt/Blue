document.addEventListener("DOMContentLoaded", function() {
  Controller(); // 컨트롤러 시작
});

// 헤더 뷰
function Header() {

}

Header.prototype = {
  curPage : document.querySelector(".current"),
  totalPage : document.querySelector(".total"),

  // 현재 페이지 번호 변경 함수
  changeCurrentPageNumber : function(currentInt) {
    this.curPage.innerText = currentInt+1;
  },

  // 전체 페이지 번호 변경 함수
  changeTotalPageNumber : function(totalInt) {
    this.totalPage.innerText = totalInt;
  }
}

// 네비 뷰
function Nav() {

}

Nav.prototype = {
  newsList : document.querySelector(".mainArea nav ul"),

  // 뉴스 리스트 변경 함수
  changeNewsList : function(titleArray) {
    var titleList = "";

    titleArray.forEach(function(e) {
      titleList = titleList + "<li>" + e + "</li>";
    });

    this.newsList.innerHTML = titleList;
  }
}

// 컨텐츠 뷰
function Content() {

}

Content.prototype = {
  content : document.querySelector(".content"),
  template : document.querySelector("#newsTemplate").innerHTML,

  // 뉴스 컨텐츠 변경 함수
  changeNewsContent : function(newsObj) {
    newContent = this.template.replace("{title}", newsObj.title).replace("{imgurl}", newsObj.imgurl).replace("{newsList}", "<li>" + newsObj.newslist.join("</li><li>") + "</li>");

    this.content.innerHTML = newContent;
  }
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

// 컨트롤러
function Controller() {
  // 뷰와 모델
  var myHeader = new Header();
  var myNav = new Nav();
  var myContent = new Content();
  var myData = new Data();
  // 컨트롤러에서 쓰일 index와 length 변수
  var index = 0;
  var length = 0;

  /* init */
  ajax.sending(newsURL, function(res) {
    var json = JSON.parse(res.target.response);
    myData.setNewsData(json);
    length = json.length;

    myNav.changeNewsList(myData.getNewsTitleAll());
    myContent.changeNewsContent(myData.getNewsObjByIndex(index));
    myHeader.changeCurrentPageNumber(index);
    myHeader.changeTotalPageNumber(length);
  });

  // left 버튼이 눌렸을때 이벤트 함수
  var leftBtn = document.querySelector(".left > a");
  leftBtn.addEventListener("click", function(evt){
    index--;
    if(index < 0) {
      index = length-1;
    }

    myHeader.changeCurrentPageNumber(index);
    myContent.changeNewsContent(myData.getNewsObjByIndex(index));
  });

  // right 버튼이 눌렸을때 이벤트 함수
  var rightBtn = document.querySelector(".right > a");
  rightBtn.addEventListener("click", function(evt){
    index++;
    if(index >= length) {
      index = 0;
    }

    myHeader.changeCurrentPageNumber(index);
    myContent.changeNewsContent(myData.getNewsObjByIndex(index));
  });

  // 네비 뷰의 뉴스리스트를 눌렀을때 이벤트 함수
  var listClick = document.querySelector(".mainArea nav ul");
  listClick.addEventListener("click", function(evt){
    if(evt.target.tagName !== "LI") return;

    var newsDataIndex = myData.getNewsIndexByTitle(evt.target.innerText);
    index = newsDataIndex;
    myContent.changeNewsContent(myData.getNewsObjByIndex(newsDataIndex));
    myHeader.changeCurrentPageNumber(newsDataIndex);
  });

  // 콘텐츠 뷰의 x 표시를 눌렀을때 이벤트 함수
  var deleteClick = document.querySelector(".content");
  deleteClick.addEventListener("click", function(evt){
    if(evt.target.tagName !== "BUTTON" && evt.target.tagName !== "A") return;

    var newsDataTitle = evt.target.closest(".title").querySelector(".newsName").innerHTML;

    index = 0;
    length--;
    myData.deleteNewsDataByTitle(newsDataTitle);
    myNav.changeNewsList(myData.getNewsTitleAll());
    myContent.changeNewsContent(myData.getNewsObjByIndex(index));
    myHeader.changeCurrentPageNumber(index);
    myHeader.changeTotalPageNumber(length);
  });
}
