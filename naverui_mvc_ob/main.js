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
  this._subscribedList = [];
  this._currentPageNumber = 0;
  this._totalPageNumber = 0;

  this.currentPageNumberChanged = new Event(this);
  this.dataRemoved = new Event(this);
  this.subscribedChanged = new Event(this);
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

  setTotalPageNumber : function() {
    this._totalPageNumber = this._subscribedList.length;
  },

  removeData : function(number) {
    this.toggleSubscribedByTitle(this._subscribedList[number].title);
    this._subscribedList.splice(number, 1);
    this._currentPageNumber = 0;
    this._totalPageNumber--;
    this.dataRemoved.notify();
  },

  getDataAll : function() {
    return this._datas;
  },

  getDataByNumber : function(number) {
    return this._datas[this._subscribedList[number].index];
  },

  getDataIndexByTitle : function(title) {
    return this._subscribedList.findIndex(function(e) {
      return e.title === title;
    });
  },

  getDataTitles : function() {
    var titleArray = [];
    var key;
    for( key in this._subscribedList ) {
      if(this._subscribedList.hasOwnProperty(key)) {
        titleArray.push(this._subscribedList[key].title);
      }
    }

    return titleArray;
  },

  toggleSubscribedByTitle : function(title) {
    var targetObj = this._datas.find(function(e) {
      return e.title === title;
    });

    targetObj.subscribed = (targetObj.subscribed) ? false : true;
    this.subscribedChanged.notify({title : title});
  },

  setSubscribedList : function() {
    this._subscribedList = [];
    this._datas.forEach(function(e,i) {
      if(e.subscribed) {
        this._subscribedList.push({title : e.title, index : i});
      }
    }, this);

    console.log(this._subscribedList);
  }
}

function NewsView(model, elements) {
  this._model = model;
  this._elements = elements;
  this.template = document.querySelector("#newsTemplate").innerHTML;

  this.leftButtonClicked = new Event(this);
  this.rightButtonClicked = new Event(this);
  this.pressButtonClicked = new Event(this);
  this.myNewsButtonClicked = new Event(this);
  this.listTitleClicked = new Event(this);
  this.delButtonClicked = new Event(this);
  this.pressListClicked = new Event(this);

  var _this = this;

  this._model.currentPageNumberChanged.attach(function() {
    _this.changeCurrentPageNumber();
    _this.changeNewsContent();
  });
  this._model.dataRemoved.attach(function() {
    _this.changeNewsList();
    _this.changeNewsContent();
    _this.changeCurrentPageNumber();
    _this.changeTotalPageNumber();
  });
  this._model.subscribedChanged.attach(function(sender, args) {
    _this.togglePressSubscribed(args.title);
  });

  // header eventlistener
  this._elements.header.querySelector(".left > a").addEventListener("click", function(evt) {
    _this.leftButtonClicked.notify();
  });
  this._elements.header.querySelector(".right > a").addEventListener("click", function(evt) {
    _this.rightButtonClicked.notify();
  });
  this._elements.header.querySelector(".press").addEventListener("click", function(evt) {
    _this.pressButtonClicked.notify();
  });
  this._elements.header.querySelector(".myNews").addEventListener("click", function(evt) {
    _this.myNewsButtonClicked.notify();
  });
  // nav eventlistener
  this._elements.nav.addEventListener("click", function(evt) {
    if(evt.target.tagName !== "LI") return;
    _this.listTitleClicked.notify({title : evt.target.innerText});
  });
  // content eventlistener
  this._elements.content.addEventListener("click", function(evt) {
    if(evt.target.tagName !== "BUTTON" && evt.target.tagName !== "A") return;
    _this.delButtonClicked.notify({title : evt.target.closest(".title").querySelector(".newsName").innerText})
  });
  // mainPress eventlistener
  this._elements.mainPress.addEventListener("click", function(evt) {
    if(evt.target.tagName !== "IMG") return;
    _this.pressListClicked.notify({title : evt.target.id});
  })
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

  toggleMainPressDisplay : function(display) {
    this._elements.mainPress.style.display = (display === "block") ? "block" : "none";
  },

  changeMainPress : function() {
    var newsArray = this._model.getDataAll();
    var pressList = "";

    newsArray.forEach(function(e) {
      pressList = pressList + "<li><img id='" + e.title + "' src='" + e.imgurl + "' style='border-color:" + ((e.subscribed) ? "red" : "black") + "'/></li>"
    });

    this._elements.mainPress.querySelector("ul").innerHTML = pressList;
  },

  togglePressSubscribed : function(title) {
    var target = this._elements.mainPress.querySelector("#"+title);
    var color = target.style.borderColor;
    target.style.borderColor = (color === "red") ? "black" : "red";
  },

  toggleMainAreaDisplay : function(display) {
    this._elements.mainArea.style.display = (display === "block") ? "block" : "none";
  },

  changeNewsList : function() {
    var titleArray = this._model.getDataTitles();

    this._elements.nav.innerHTML = "<li>" + titleArray.join("</li><li>") + "</li>";
  },

  changeNewsContent : function() {
    var currentPageNumber = this._model.getCurrentPageNumber();
    var newsObj = this._model.getDataByNumber(currentPageNumber);
    var newContent = this.template.replace("{title}", newsObj.title).replace("{imgurl}", newsObj.imgurl).replace("{newsList}", "<li>" + newsObj.newslist.join("</li><li>") + "</li>");

    this._elements.content.innerHTML = newContent;
  },

  togglePaging : function(display) {
    this._elements.header.querySelector(".paging").style.display = (display === "block") ? "block" : "none";
  },

  toggleButton : function(display) {
    this._elements.header.querySelector(".btn").style.display = (display === "block") ? "block" : "none";
  },

  init : function() {
    // this.changeNewsList();
    // this.changeNewsContent();
    // this.changeCurrentPageNumber();
    // this.changeTotalPageNumber();
    this._model.setSubscribedList();
    this._model.setTotalPageNumber();
    this.changeMainPress();
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
  this._view.pressButtonClicked.attach(function() {
    _this.clickPressButton();
  });
  this._view.myNewsButtonClicked.attach(function() {
    _this.clickMyNewsButton();
  });
  this._view.listTitleClicked.attach(function(sender, args) {
    _this.clickListTitle(args.title);
  });
  this._view.delButtonClicked.attach(function() {
    _this.clickDelButton();
  });
  this._view.pressListClicked.attach(function(sneder, args) {
    _this.clickPressList(args.title);
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

  clickPressButton : function() {
    this._view.toggleMainPressDisplay("block");
    this._view.toggleMainAreaDisplay();
    this._view.togglePaging();
    this._view.toggleButton();
    this._view.changeMainPress();
  },

  clickMyNewsButton : function() {

    this._view.toggleMainPressDisplay();
    this._view.toggleMainAreaDisplay("block");
    this._view.togglePaging("block");
    this._view.toggleButton("block");


    this._model.setSubscribedList();
    this._view.changeNewsList();


    this._model.setTotalPageNumber();
    this._view.changeTotalPageNumber();
    var targetPageNumber = 0;
    this._model.setCurrentPageNumber(targetPageNumber);
  },

  clickPressList : function(title) {
    this._model.toggleSubscribedByTitle(title);
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
  var mainArea = document.querySelector(".mainArea");
  var mainPress = document.querySelector(".mainPress");
  var nav = mainArea.querySelector("nav > ul");
  var content = document.querySelector(".content");


  ajax.sending(newsURL, function(res) {
    var json = JSON.parse(res.target.response);

    var myModel = new NewsModel(json);
    var myView = new NewsView(myModel, {header : header, mainArea : mainArea, content : content, mainPress : mainPress, nav : nav});
    var myController = new NewsController(myModel, myView);

    myView.init();
  });
});
