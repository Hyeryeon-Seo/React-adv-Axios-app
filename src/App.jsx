// import axios from "axios";
import api from "./axios/api"; // 임포트하고 axios썼던부분 api로 바꾸기
import { useEffect, useState } from "react";
import "./App.css";
// * 터미널 두개 따로 열고, 하나는 json server, 하나는 yarn start(dev등) !
function App() {
	const [todos, setTodos] = useState(null);
	const [todo, setTodo] = useState({
		title: "",
	}); // json형식으로 저장할거라서
	// db.json이나 noSQL방식 ..  몽고DB나 이 json-server와 같은 json 데이터베이스방식은, id가 자동입력됨 -  title만 (json 객체형식으로)넣어주면 됨
	const [targetId, setTargetId] = useState("");
	const [contents, setContents] = useState("");

	// GET 조회 함수
	// 비동기 함수(:json-server에 todos를 요청하는 함수) 만들기 asnyc/await로- db 서버 통신한다는 자체가, 비동기를 의미
	// 비동기 통신, 제어권이 나한테 없는. 서버의 상태를 기다려야해서.

	// 새로고침, 화면 렌더링되면서 fetchTodos실행됨 => axios call하며 요청
	const fetchTodos = async () => {
		// * async 블럭 안에서, awiat 를 만나면 (아래) 해당 줄이 끝날때까지 기다림
		// const response = await axios.get("http://localhost:4001/todos");
		const { data } = await api.get(
			"/todos" // api임포트로 바꾼 후, baseURL써준부분 안써도됨
		); //구조분해할당
		// 받아온 거 (response라고하면)의 key값 data 이름으로..  그 안의 value(배열)를 받아오기?
		// 그냥 콘솔로 찍으면, Promise <pending> 으로 뜸-응답받기전에 console찍어서 그럼
		// 그래서 응답받을때까지 기다려줘야하니까 위에 await 적기
		// console.log("response", response);
		console.log("data", data);
		setTodos(data); // data넣어주기   todos에
	};

	// POST 추가 함수
	// (form태그) 추가 버튼 핸들링
	const onSubmitHandler = async (todo) => {
		await api.post("/todos", todo); // await를 써줘야 바로렌더링되면서 추가되는듯
		// await안쓰면 새로고침하면 추가된게 확인되지만 바로 안뜰 때가 있다
		// 새로고침없이 버튼 누르면 바로 렌더링되었으면 함 => state도 같이 렌더링 시켜줘야. state값이 안변해서 안되는것 (화면도, 컴포넌트도 같이 렌더링시켜주기) -> toods도 변경
		// 컴포넌트가 렌더링되는 조건: state변경, props변경, 부모컴포넌트 변경

		// setTodos([...todos, inputValue]);
		// inputValue 가 todo로 변경되어서..

		// => DB에는 자동으로 id입력되지만, state는 이를 알 수 없어 => (추가 시) id가 자동으로 갱신되지 않는 문제
		// - 이 때는 그냥 조회get을 위해 만든fetch..함수로 다시 db 읽어오는게 적합 => id도 바로 갱신되게

		fetchTodos();
	};

	// DELETE 삭제 함수
	// axios 통해서 DB에 있는 아이템 삭제돼야
	const onDeleteButtonClickHandler = async (id) => {
		api.delete(`/todos/${id}`);
		setTodos(
			todos.filter((item) => {
				return item.id !== id;
			})
		);
	};

	// UPDATE - (PATCH) 수정 함수
	const onUpateButtonClickHandler = async () => {
		// 인자로 id, contents 2개 받아야(id와 수정할내용)하지만, state로 갖고있으니 그걸로 하면됨
		api.patch(`/todos/${targetId}`, {
			title: contents, // 여기는 {...item 스프레드연산자 쓸 필요없나보다..!?/ map안돌려서 item이라고 쓸 것도 없기도하고
		});

		// 실시간 변경위해 (새로고침필요없이) set..State - map함수 통해 새로운 배열 리턴
		setTodos(
			todos.map((item) => {
				if (item.id == targetId) {
					// ===(일치연산자)시 형 달라서 에러날 수 (number,string) => ==(동등연산자)로
					return { ...item, title: contents }; // 나머지는 스프레드연산자
				} else {
					return item;
				}
			})
		);
	};

	useEffect(() => {
		// 이부분은 마운팅될 때 실행
		// 최초 마운트 될 때 db로부터 값을 가져올 것
		fetchTodos(); // 마운팅될 때 이 함수 호출 // ,로썼다가 에러
		// return () => {
		//   // 이부분은 언마운팅될 때 실행
		// }
	}, []);

	return (
		// 이 app 컴포넌트가 처음에 렌더링이 됐을 때는 위 실행되기전에 아래 return이 호출됨
		<>
			<div>
				{/* 수정 영역 */}
				<input
					type="text"
					placeholder="수정할 아이디"
					value={targetId}
					onChange={(e) => {
						setTargetId(e.target.value);
					}}
					// (e) => {setTargetId..} 중괄호빼도상관없음 (리턴문한줄이라?)
				/>
				<input
					type="text"
					placeholder="수정할 내용"
					value={contents}
					onChange={(e) => {
						setContents(e.target.value);
					}}
				/>
				{/* 여기서 input이 있다는 건, 이 input에 들어갈 value들을 핸들링할 state가 필요하다는 뜻 > state만들기 */}
				<button onClick={onUpateButtonClickHandler}>수정</button>
				{/* 인자() 안주고 그냥 위처럼 update..함수줘도 됨 */}
				<br />
				<br />
			</div>
			<div>
				{/* INPUT 영역 */}
				<form
					onSubmit={(e) => {
						{
							/* form태그의 onSubmit속성에 - (항상 이벤트를 받아) - 기본새로고침동작막기 > submit 버튼눌러도 새로고침안됨*/
						}
						{
							/* 버튼 클릭 시, input에 들어있는 값(state)을 이용해 DB에 저장(post 요청) */
						}
						e.preventDefault();
						onSubmitHandler(todo);
					}}
				>
					<input
						type="text"
						value={todo.title}
						onChange={(e) => {
							setTodo({ title: e.target.value }); // 객체형태로 똑같이 넣어줘야
						}}
					/>
					{/*onChange는 고유속성이 항상 이벤트받아 */}
					<button type="submit">추가</button>
					{/*form태그 안의 버튼이면, 기본적으로 type=submit 안써도 들어가있다 (submit으로인식됨)*/}
				</form>
			</div>
			{/* // 아래 렌더링되고나서, 위가 async니까..얘가 돌아갈때까지 return아래가 기다리지않아 
			// 아래 먼저 실행돼, todos가 null일 수 있다 => optional chaining ? 넣기! (그래야 에러 x) // (todos가 있으면 map으로 돌린다) */}
			<div>
				{todos?.map((item) => {
					return (
						<div key={item.id}>
							{/* map함수는 항상 돌릴때 아이템마다 key!*/}
							{item.id} : {item.title}
							&emsp;
							<button onClick={() => onDeleteButtonClickHandler(item.id)}>
								삭제
							</button>
							{/*몇번쨰 item 삭제되는지 알려줘야 / onClick에콜백함수없이 그냥 함수써주면,렌더링과정에서 이미 최초에 1번실행하고 렌더링돼버림 */}
						</div>
					);
				})}
			</div>
		</>
	);
}

export default App;
