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
};

function NewsModel(datas) {
  this._datas = datas;
  this._currentPageNumber = 0;
  this._totalPageNumber = 0;

  this.currentPageNumberChanged = new Event(this);
  this.totalPageNumberChanged = new Event(this);
  this.dataAdded = new Event(this);
  this.dataRemoved = new Event(this);
}

NewsModel.prototype = {
  getCurrentPageNumber : function() {
    return this._currentPageNumber;
  },

  setCurrentPageNumber : function(number) {
    this._currentPageNumber = number;
    this.currentPageNumberChanged.notify({number : number});
  },

  setTotalPageNumber : function(number) {
    this._totalPageNumber = number;
    this.totalPageNumberChanged.notify({number : number});
  },

  removeData : function(title) {
    this._datas.forEach(function(e, i, a) {
      if(e.title === title) {
        a.splice(i, 1);
      }
    });
    this.dataRemoved.notify();
  },

  getData : function(number) {
    return this._datas[number];
  },

  getDataTitles : function() {
    var titleArray = [];
    var val;
    for( val in this._datas ) {
      titleArray.push(val.title);
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

  this._model.currentPageNumberChanged.attach(function(sender, args) {
    _this.changeCurrentPageNumber(args.number);
  });
  this._model.totalPageNumberChanged.attach(function(sender, args) {
    _this.changeTotalPageNumber(args.number);
  });
  this._model.dataRemoved.attach(function() {
    _this.changeNewsList();
    _this.changeNewsContent(0);
  });

  this._elements.header.querySelector(".left > a").addEventListener("click", function(evt) {
    _this.leftButtonClicked.notify();
  });
  this._elements.header.querySelector(".right > a").addEventListener("click", function(evt) {
    _this.rightButtonClicked.notify();
  });
  this._elements.nav.addEventListener("click", function(evt) {
    if(evt.target.className !== "LI") return;
    _this.listTitleClicked.notify({title : evt.target.innerText});
  });
  this._elements.content.addEventListener("click", function(evt) {
    if(evt.target.className !== "BUTTON" && evt.target.className !== "A") return;
    _this.delButtonClicked.notify({title : evt.target.closest(".title").querySelector(".newsName").innerText})
  });
}

NewsVeiw.prototype = {
  changeCurrentPageNumber : function(number) {
    this._elements.header.querySelector(".current").innerText = number;
  },

  changeTotalPageNumber : function(number) {
    this._elements.header.querySelector(".total").innerText = number;
  },

  changeNewsList : function() {
    var titleArray = this._model.getDataTitles();

    this._elements.nav.innerHTML = "<li>" + titleArray.join("</li><li>") + "</li>";
  },

  changeNewsContent : function(number) {
    var newsObj = this._model.getData(number);
    var newContent = this.template.replace("{title}", newsObj.title).replace("{imgurl}", newsObj.imgurl).replace("{newsList}", "<li>" + newsObj.newslist.join("</li><li>") + "</li>");

    this._elements.content.innerHTML = newContent;
    }
}

function NewsController(model, view) {
  this._model = model;
  this._view = view;

  var _this = this;
}

NewsController.prototype = {

}
