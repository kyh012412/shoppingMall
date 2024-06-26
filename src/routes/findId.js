import { useNavigate } from 'react-router-dom';
import '../css/findId.css';
import { useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { Myalter } from '../components/Myalter';
import { Footer } from '../components/footer';

export const FindId = () => {
  const navigate = useNavigate();
  const goback = () => {
    navigate(-1);
  };
  console.log();

  const [findUser, setFindUser] = useState({
    userName: '',
    email: '',
    number: '',
  });

  // 이름, 이메일 일치여부
  const [isSend, setIsSend] = useState(false);
  // 인증번호
  const [passNum, setPassNum] = useState();
  // 인증번호 성공여부
  const [passResult, setPassResult] = useState(false);
  // 유저 아이디
  const [userId, setUserId] = useState('');

  const valueChange = (e) => {
    const { name, value } = e.target;
    setFindUser({ ...findUser, [name]: value });
  };

  const emailButton = async (e) => {
    e.preventDefault();

    if (!findUser.userName) {
      Myalter('warning', '아이디 찾기 가이드', '이름을 입력하시오');
    } else if (!findUser.email) {
      Myalter('warning', '아이디 찾기 가이드', '이메일을 입력하시오');
    } else {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER}/findId/`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(findUser),
          }
        );
        if (!response.ok) {
          throw new Error('서버에서 응답을 받을 수 없습니다');
        } else {
          const result = await response.json();
          if (result.message) {
            setIsSend(result.message);
            setPassNum(result.passNum);
            setUserId(result.userId);
            Swal.fire({
              icon: 'success',
              title: '아이디 찾기 가이드',
              text: '해당 이메일로 인증번호 발송',
            });
          } else {
            Swal.fire({
              icon: 'warning',
              title: '아이디 찾기 가이드',
              text: '이름 혹은 이메일이 다릅니다',
            });
          }
        }
      } catch (error) {
        Swal.fire({
          icon: 'warning',
          title: '아이디 찾기 가이드',
          text: '아이디 찾기 중 오류가 발생했습니다',
        });
      }
    }
  };

  const numButton = (e) => {
    e.preventDefault();
    if (passNum == findUser.number) {
      Swal.fire({
        icon: 'success',
        title: '아이디 찾기 가이드',
        text: '인증성공',
      });
      setPassResult(true);
    } else {
      Swal.fire({
        icon: 'warning',
        title: '아이디 찾기 가이드',
        text: '인증번호가 일치하지않습니다',
      });
    }
  };

  const placeRef = useRef();
  const placeRef2 = useRef();
  const placeRef3 = useRef('test');

  const inputFocus = (e) => {
    if (e.target.name === 'userName') {
      placeRef.current.style.top = '7px';
    } else if (e.target.name === 'email') {
      placeRef2.current.style.top = '7px';
    } else {
      placeRef3.current.style.top = '7px';
    }
  };

  const inputBlur = (e) => {
    if (e.target.name === 'userName' && !e.target.value) {
      placeRef.current.style.top = '25px';
    } else if (e.target.name === 'email' && !e.target.value) {
      placeRef2.current.style.top = '25px';
    } else if (e.target.name === 'number' && !e.target.value) {
      placeRef3.current.style.top = '25px';
    }
  };

  return (
    <div className="findId">
      <div className="div">
        <div className="textWrapper">아이디 찾기</div>
        <form className="findUserIdBox">
          <div className="inputBox">
            <div className="inputUsername">
              <label htmlFor="userName" className="place1" ref={placeRef}>
                이름
              </label>
              <input
                id="userName"
                type="text"
                className="textWrapper2"
                onChange={valueChange}
                name="userName"
                onFocus={inputFocus}
                onBlur={inputBlur}
              ></input>
            </div>
            <div className="inputUserEmail">
              <label htmlFor="email" className="place2" ref={placeRef2}>
                이메일
              </label>
              <input
                id="email"
                type="email"
                className="textWrapper2 email"
                onChange={valueChange}
                name="email"
                onFocus={inputFocus}
                onBlur={inputBlur}
              ></input>
              <button className="emailButton" onClick={emailButton}>
                인증번호 받기
              </button>
            </div>
            {isSend ? (
              <div className="inputNum">
                <label htmlFor="inputNum" className="place3" ref={placeRef3}>
                  인증번호
                </label>
                <input
                  id="inputNum"
                  type="text"
                  className="inputNumWrapper"
                  name="number"
                  onChange={valueChange}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                ></input>
                <button
                  className="inputNumButton"
                  type="button"
                  onClick={numButton}
                >
                  인증번호 확인
                </button>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="buttonBox">
            <button
              className="submitButton"
              type="button"
              onClick={() => {
                navigate('/findPassword');
              }}
            >
              비밀번호 찾기
            </button>
            <button className="cancelButton" type="button" onClick={goback}>
              취소
            </button>
          </div>
        </form>
        {passResult ? (
          <div className="result">아이디 : {userId}</div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};
