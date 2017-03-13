네이버메인페이지에서 특정 엘리멘트를 찾아서 class네임에 -, _ 이 있는 엘리먼트의 갯수찾기와
그 엘리멘트들의 class 를 지우는 함수를 만들어보자

```js
function naver(test) {
	var index = 0;
	document.querySelectorAll(test).forEach(function(val) {
		if(/-|_/.test(val.className)) {
			cssDelete(val);
			index++;
        }
    });

	console.log(index);
}

function cssDelete(ele) {
	ele.classList.remove(ele.className.match(/\w+-\w+|\w+_\w+/));
}
```
