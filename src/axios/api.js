import axios from "axios";

const instance = axios.create({
	baseURL: process.env.REACT_APP_SERVER_URL,
	// axios의 기본설정중 timeout 프로퍼티 : 서버에통신요청했을때 (axios call) 몇 초까지 기다릴건지 (그때까지안되면 오류낼거야)
	// 밀리세컨단위- 1000이 1초  (1이 0.001초)
	timeout: 1,
});

// 콘솔 두번 찍히는 건 index.js에서 strictMode 주석처리해주면됨
instance.interceptors.request.use(
	// 인자로 2개 함수
	// 1. 요청을 보내기 전 수행되는 함수
	function (config) {
		console.log("인터셉터 요청 성공!");
		return config;
	},
	// 2. 오류 요청을 보내기 전 수행되는 함수  - 오류처리
	function (error) {
		console.log("인터셉터 요청 오류!");
		return Promise.reject(error); // 에러 객체를 인자로 전달
	}
);

instance.interceptors.response.use(
	// 1. 응답을 내보내기 전 수행되는 함수
	function (response) {
		console.log("인터셉터 응답 받았습니다!");
		return response;
	},
	// 2. 오류응답을 내보내기 전 수행되는 함수
	function (error) {
		console.log("인터셉터 응답 오류 발생");
		return Promise.reject(error);
	}
);
export default instance;
