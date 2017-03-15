오늘 쓸 라이브러리 : 핸들바

템플릿을 쓰는 방법 :
>스크립트 태그안에 숨겨 놓는 방법

>서버에서 html 문자열로 저장해 놓는 방법

ajax : 페이지 리프레쉬 없이 서버와 통신해서 데이터를 가져 오고 싶을때 사용하는 방법.

즉시실행 함수를 쓸때 자주 쓰이는 document나 window를 넘겨줘서 좀더 빨리 쓸 수 있는 방법.
```js
(function(doc, win) {
  console.log(doc.body);
  var div = doc.querySelector("div");
  console.log(div);
})(document, window);
```

bind 로 넘겨주는 법
bind 첫 인자는 context, 그 다음부터 넘겨줄수 있는 매개변수들
```js
arrowLeft.addEventListener("click", moveLR.bind(null, jsonObj, "L" ,currrentIdx));

function moveLR(jsonObj, direction, idx){
    if(idx == jsonObj.length-1){
        if(direction == "R"){
            idx = 0;
        } else {
            idx--;
        }
    }
    if(idx == 0){
        if(direction == "L"){
            idx = jsonObj.length - 1;
        } else {
            idx++;
        }
    }
    updateContent(jsonObj, idx);
}
// bind를 쓰지 않고 함수선언으로 비슷하게 하는 방법.
arrowLeft.addEventListener("click", function() {
  moveLR(jsonObj, "L" ,currrentIdx);
});
```
