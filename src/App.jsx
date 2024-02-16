import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
	const [todos, setTodos] = useState(null);

	// 비동기 함수 만들기 asnyc/await로- db 서버 통신한다는 자체가, 비동기를 의미
	// 비동기 통신, 제어권이 나한테 없는. 서버의 상태를 기다려야해서.
	const fetchTodos = async () => {
		// * async 블럭 안에서, awiat 를 만나면 (아래) 해당 줄이 끝날때까지 기다림
		// const response = await axios.get("http://localhost:4001/todos");
		const { data } = await axios.get("http://localhost:4001/todos"); //구조분해할당
		// 받아온 거 (response라고하면)의 key값 data 이름으로..  그 안의 value(배열)를 받아오기?
		// 그냥 콘솔로 찍으면, Promise <pending> 으로 뜸-응답받기전에 console찍어서 그럼
		// 그래서 응답받을때까지 기다려줘야하니까 위에 await 적기
		// console.log("response", response);
		console.log("data", data);
		setTodos(data); // data넣어주기   todos에

		// * 터미널 두개 따로 열고, 하나는 json server, 하나는 yarn start(dev등) !
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
		// 아래 렌더링되고나서, 위가 async니까..얘가 돌아갈때까지  return아래가 기다리지않아
		// 아래 먼저 실행돼, todos가 null일 수 있다 => optional chaining ? 넣기! (그래야 에러 x)
		// (todos가 있으면 map으로 돌린다)
		<div>
			{todos?.map((item) => {
				return (
					<div key={item.id}>
						{/* map함수는 항상 돌릴때 아이템마다 key!*/}
						{item.id} : {item.title}
					</div>
				);
			})}
		</div>
	);
}

export default App;
