#### 조직 배열의 구조 

   ```javascript
      {dept_name:"학부,IT학부,게임컨텐츠과(3년제)",dept_no: "학부-IT학부-게임컨텐츠과(3년제)" },
   ```

   - dept_name : root로부터 자기 자신까지를 ,로 연결한 string 
   - dept_no : 부서의 유일한 ID (현재는 root로부터 자기 자신까지를 -로 연결한 string)

#### 함수들 

   ##### 1. createDeptTree(targetID, dept_data, clickHandler, type = "") 

   부서 트리를 생성함 

   - targetID : 부서트리를 생성할 root 엘리먼트의 ID (ol 이어야 함) 
   - dept_data : 부서 이름과 부서 코드를 가진 객체의 배열 
   - clickHandler : 부서 이름을 클릭할 경우 실행되는 함수 ( dept_no를 넘겨줌 )
   - type : 필요한 경우 부서 트리의 css클래스를 넘겨줌

   ##### 2. openDeptTree(targetID, deptName) 

   부서 트리 내에 특정 부서를 표시함 (경로에 해당되는 모든 디렉터리를 염) 

   - targetID : 부서트리의 ID 
   - deptName : 대상 부서의 이름 

### 동작 코드 
[링크](./main.html)