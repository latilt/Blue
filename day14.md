spring tools suite https://spring.io/tools
visual studio code https://code.visualstudio.com/
bear http://www.bear-writer.com/


메모리 구조

cpu의 clock : 컴퓨터가 일을 처리하는 단위

1초에 전기적 신호를 몇번 생성하는가 -> Hz

하나의 명령어를 몇Hz에 처리 할 수 있는가. 명령어마다 처리되는 클락수가 다르다.

둘다 중요하다.

프로그램은 메모리에 올라가야 실행할 수 있다.

메모리에 올라간 프로그램은 프로세스라 한다.

컴퓨터는 메모리에 4byte씩 프로그램의 코드를 올리고 위에서 부터 아래로 한줄씩 읽어서 실행한다.

PC : Program Counter, 프로세스 코드가 어디까지 실행되었는지 저장하고 있는 레지스터

레지스터 : cpu가 직접적으로 계산하는 영역

32bit : 다리 32개를 동시에 처리 할 수 있다. 4byte = word

프로세스 하나당 보통 4GB를 차지한다. 하지만 실제로는 4GB 전부 사용하지 않는다.

가상메모리 : 멀티태스킹을 하기위해 사용하는 방법. 프로세스가 차지하지 않는 물리메모리 공간을 사용하기 위해 가상메모리를 생성 가상의 주소 사용

프로그램의 가상메모리 구조
Code : 컴파일된 기계어
Data : static, 전역변수
Stack : 지역변수, 콜스택
Heap : 동적할당영역, 객체

가비지콜렉터는 heap을 잘 정리해준다.
