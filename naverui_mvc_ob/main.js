function Event(sender) {
    this._sender = sender;
    this._listeners = [];
}

Event.prototype = {
    attach : function (listener) {
        this._listeners.push(listener);
    },
    notify : function (args) {
        var index;

        for (index = 0; index < this._listeners.length; index += 1) {
            this._listeners[index](this._sender, args);
        }
    }
}

function NewsModel(datas) {
  this._datas = datas;
  this._currentPageNumber = 0;
  this._totalPageNumber = datas.length;

  this.currentPageNumberChanged = new Event(this);
  this.totalPageNumberChanged = new Event(this);
  this.dataRemoved = new Event(this);
}

NewsModel.prototype = {
  getCurrentPageNumber : function() {
    return this._currentPageNumber;
  },

  setCurrentPageNumber : function(number) {
    this._currentPageNumber = number;
    this.currentPageNumberChanged.notify();
  },

  getTotalPageNumber : function() {
    return this._totalPageNumber;
  },

  setTotalPageNumber : function(number) {
    this._totalPageNumber = number;
    this.totalPageNumberChanged.notify();
  },

  removeData : function(number) {
    this._datas.splice(number, 1);
    this._currentPageNumber = 0;
    this._totalPageNumber--;
    this.dataRemoved.notify();
  },

  getData : function(number) {
    return this._datas[number];
  },

  getDataIndexByTitle : function(title) {
    return this._datas.findIndex(function(e) {
      return e.title === title;
    });
  },

  getDataTitles : function() {
    var titleArray = [];
    var key;
    for( key in this._datas ) {
      if(this._datas.hasOwnProperty(key)) {
        titleArray.push(this._datas[key].title);
      }
    }

    return titleArray;
  }
}

function NewsView(model, elements) {
  this._model = model;
  this._elements = elements;
  this.template = document.querySelector("#newsTemplate").innerHTML;

  this.leftButtonClicked = new Event();
  this.rightButtonClicked = new Event();
  this.listTitleClicked = new Event();
  this.delButtonClicked = new Event();

  var _this = this;

  this._model.currentPageNumberChanged.attach(function() {
    _this.changeCurrentPageNumber();
    _this.changeNewsContent();
  });
  this._model.totalPageNumberChanged.attach(function() {
    _this.changeTotalPageNumber();
  });
  this._model.dataRemoved.attach(function() {
    _this.changeNewsList();
    _this.changeNewsContent();
    _this.changeCurrentPageNumber();
    _this.changeTotalPageNumber();
  });

  this._elements.header.querySelector(".left > a").addEventListener("click", function(evt) {
    _this.leftButtonClicked.notify();
  });
  this._elements.header.querySelector(".right > a").addEventListener("click", function(evt) {
    _this.rightButtonClicked.notify();
  });
  this._elements.nav.addEventListener("click", function(evt) {
    if(evt.target.tagName !== "LI") return;
    _this.listTitleClicked.notify({title : evt.target.innerText});
  });
  this._elements.content.addEventListener("click", function(evt) {
    if(evt.target.tagName !== "BUTTON" && evt.target.tagName !== "A") return;
    _this.delButtonClicked.notify({title : evt.target.closest(".title").querySelector(".newsName").innerText})
  });
}

NewsView.prototype = {
  changeCurrentPageNumber : function() {
    var currentPageNumber = this._model.getCurrentPageNumber();
    this._elements.header.querySelector(".current").innerText = currentPageNumber + 1;
  },

  changeTotalPageNumber : function() {
    var totalPageNumber = this._model.getTotalPageNumber();
    this._elements.header.querySelector(".total").innerText = totalPageNumber;
  },

  changeNewsList : function() {
    var titleArray = this._model.getDataTitles();

    this._elements.nav.innerHTML = "<li>" + titleArray.join("</li><li>") + "</li>";
  },

  changeNewsContent : function() {
    var currentPageNumber = this._model.getCurrentPageNumber();
    var newsObj = this._model.getData(currentPageNumber);
    var newContent = this.template.replace("{title}", newsObj.title).replace("{imgurl}", newsObj.imgurl).replace("{newsList}", "<li>" + newsObj.newslist.join("</li><li>") + "</li>");

    this._elements.content.innerHTML = newContent;
  },

  init : function() {
    this.changeNewsList();
    this.changeNewsContent();
    this.changeCurrentPageNumber();
    this.changeTotalPageNumber();
  }
}

function NewsController(model, view) {
  this._model = model;
  this._view = view;

  var _this = this;

  this._view.leftButtonClicked.attach(function() {
    _this.clickLeftButton();
  });
  this._view.rightButtonClicked.attach(function() {
    _this.clickRightButton();
  });
  this._view.listTitleClicked.attach(function(sender, args) {
    _this.clickListTitle(args.title);
  });
  this._view.delButtonClicked.attach(function() {
    _this.clickDelButton();
  });
}

NewsController.prototype = {
  clickLeftButton : function() {
    var currentPageNumber = this._model.getCurrentPageNumber();
    var totalPageNumber = this._model.getTotalPageNumber();
    currentPageNumber--;
    if(currentPageNumber < 0) {
      currentPageNumber = totalPageNumber - 1;
    }

    this._model.setCurrentPageNumber(currentPageNumber);
  },

  clickRightButton : function() {
    var currentPageNumber = this._model.getCurrentPageNumber();
    var totalPageNumber = this._model.getTotalPageNumber();
    currentPageNumber++;
    if(currentPageNumber >= totalPageNumber) {
      currentPageNumber = 0;
    }

    this._model.setCurrentPageNumber(currentPageNumber);
  },

  clickListTitle : function(title) {
    var targetPageNumber = this._model.getDataIndexByTitle(title);

    this._model.setCurrentPageNumber(targetPageNumber);
  },

  clickDelButton : function() {
    var targetPageNumber = this._model.getCurrentPageNumber();

    this._model.removeData(targetPageNumber);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  var header = document.querySelector("header");
  var nav = document.querySelector(".mainArea nav ul");
  var content = document.querySelector(".content");

  ajax.sending(newsURL, function(res) {
    var json = JSON.parse(res.target.response);

    var myModel = new NewsModel(json);
    var myView = new NewsView(myModel, {header : header, nav : nav, content : content});
    var myController = new NewsController(myModel, myView);

    myView.init();
  });
});
