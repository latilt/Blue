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
    this.currentPageNumberChanged.notify();
  },

  setTotalPageNumber : function(number) {
    this._totalPageNumber = number;
    this.totalPageNumberChanged.notify();
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

  var _this = this;


}

NewsVeiw.prototype = {

}

function NewsController(model, view) {
  this._model = model;
  this._view = view;

  var _this = this;
}

NewsController.prototype = {

}
