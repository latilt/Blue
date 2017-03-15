### scope

scope는 안에서 밖으로만 이동한다.

자바스크립트는 함수단위의 scope이다. (블럭단위의 scope가 아니다)

자바스크립트의 변수는 블럭 밖에서도 유효하다.

```js
(function home() {
	var homeName = 'my house';
	for(var i = 0; i < 1000; i++) {}
	console.log(i); // i = 1000
})();
```

### 자바스크립트의 호이스팅(hoisting)

자바스크립트는 선언된 변수를 맨위로 끌어올려서 사용한다.
```js
(function home() {
	var homeName = 'my house';
  console.log(i); // undifined
	for(var i = 0; i < 1000; i++) {}
	console.log(i);
})();
// i = 1000
```

```js
(function home() {
	var homeName = 'my house';
  console.log(j); // error
	for(var i = 0; i < 1000; i++) {}
	console.log(i);
})();
```

#### let : Block단위의 scope를 만드는 키워드 (ES6)
```js
(function home() {
	var homeName = 'my house';

	for(let i = 0; i < 1000; i++) {}
	console.log(i); // error
})();
```

#### const : 선언된 변수를 재정의 할 수 없게 하는 키워드
배열과 오브젝트의 값을 변경하는 것은 가능하다.
```js
(function home() {
	const homeName = 'my house';
	homeName = 'your house';
})();
```

### closure
실행이 끝난 함수의 변수를 콜백함수가 부모의 변수를 가지고 있으며 사용할수 있는 영역.

자식은 부모의 값을 참조 하고 있기 때문에 어떤 경우의 수에 따라 바뀔수도 있다.
closure는 scope의 한 영역이다.


##### closure가 공유하는 변수를 특정하게 정의해서 쓰는 방법

함수로 감싸 하나의 변수를 만들어 사용하는 경우
```js
(function() {
  var list = document.querySelectorAll('li');
  var show = document.querySelector('.show');

  for(var i = 0; i < list.length; i++) {
    (function(i) { list[i].addEventListener('click', function() {
      debugger;
      show.innerText = i + 1 + '번째 과일이 선택됐습니다';
    });
  })(i);
  }
})();
```


let을 사용하는 방법
```js
(function() {
  var list = document.querySelectorAll('li');
  var show = document.querySelector('.show');

  for(let i = 0; i < list.length; i++) {
    list[i].addEventListener('click', function() {
      debugger;
      show.innerText = i + 1 + '번째 과일이 선택됐습니다';
    });
  }
})();
```

### 객체형 프로그래밍

자바스크립트의 객체 기본
```js
var healthObj = {
	name : "달리기",
	lastTime : "PM10:12",
	showHealth : function() {
		console.log("오늘은 " + this.lastTime + "까지 " + this.name + " 운동을 하셨네요");
    }
}

healthObj.showHealth();
```

생성자 : new를 사용하면 return this; 를 해준다.
```js
function Health(name, lastTime) {
	this.name = name;
	this.lastTime = lastTime;

  // return this;
}

var health = new Health('john', '13:50');
```

prototype : 생성자로 생성한 객체들의 메소드 중복 생성을 막기위해 prototype이라는 공동의 객체를 사용하는 방법
```js
var healthObj = {
	showHealth : function() {
		console.log("오늘은 " + this.lastTime + "까지 " + this.name + " 운동을 하셨네요");
    }
}

Health.prototype = healthObj; // Health의 prototype 객체를 healthObj 객체로 덮어씌었다.

Health.prototype.showHealth = function() {  // prototype 객체에 showHealth 함수를 추가하였다.
  console.log("오늘은 " + this.lastTime + "까지 " + this.name + " 운동을 하셨네요");
}
}
```

#### prototype 실습1

todolist 기능을 new 키워드와 prototype을 사용해 클래스로 만들어보자

기능 : 추가, 보기, 완료(삭제)
```js
function Todolist() {
	this.list = [];
}

Todolist.prototype.addList = function(data) {
	this.list.push(data);
}

Todolist.prototype.showList = function() {
	return this.list;
}

Todolist.prototype.completeList = function(data) {
	this.list.forEach(function(val, index, array) {
		if(val === data) {
			array.splice(index, 1);
        }
    });
}
```

Object.create() 를 쓰는 방법

객체를 만들어서 객체를 생성하자.

생성자가 없어서 직접 써줘야 한다.
```js
var todoListObj = {
  addList : function(data) {
    this.list.push(data);
  },

  showList : function() {
    return this.list;
  },

  completeList : function(data) {
    this.list.forEach(function(val, index, array) {
  		if(val === data) {
  			array.splice(index, 1);
          }
      });
  }
}

var myList = Object.create(todoListObj);
myList.list = [];
```

setPrototypeOf 메서드를 쓰는 방법
```js
var todoListObj = {
  addList : function(data) {
    this.list.push(data);
  },

  showList : function() {
    return this.list;
  },

  completeList : function(data) {
    this.list.forEach(function(val, index, array) {
  		if(val === data) {
  			array.splice(index, 1);
          }
      });
  }
}

var todoList = {
  list : []
}

Object.setPrototypeOf(todoList, todoListObj);
```

setPrototypeOf 객체 생성 방법으로 개선
```js
var todoListObj = {
  addList : function(data) {
    this.list.push(data);
  },

  showList : function() {
    return this.list;
  },

  completeList : function(data) {
    this.list.forEach(function(val, index, array) {
  		if(val === data) {
  			array.splice(index, 1);
          }
      });
  }
}

function todoList() {
  return { list : [] }
}

var myList = todoList();
Object.setPrototypeOf(myList, todoListObj);
```
