import React, { useEffect, useRef, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../css/productDetailDescription.css';

//컴포넌트
import { Nav } from '../components/nav';
import { ProductDescription } from '../components/productDescription';
import { ProductReview } from '../components/productReview';
import { Myalter } from '../components/Myalter';
import { Footer } from '../components/footer';

export const ProductDetailDescription = () => {
  const navigate = useNavigate();
  const productId = useParams().id;

  const [product, setProduct] = useState([]);
  const [stock, setStock] = useState(0);
  const [maxStock, setMaxStock] = useState(0);
  const [indexArray, setIndexArray] = useState([0, 1, 2, 3]);
  const [item, setItem] = useState(0);
  const [id, setId] = useState();
  const [isMaster, setIsMaster] = useState(false);
  const [user, setUser] = useState({});
  const [switchBtn, setSwitchBtn] = useState(!true);
  const [color, setColor] = useState([]);
  const [size, setSize] = useState([]);
  const [option, setOption] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const handleChangeSize = (event) => {
    setSelectedSize(event.target.value);
  };

  const handleChangeColor = (event) => {
    setSelectedColor(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isLogin = sessionStorage.getItem('token');
    if (!isLogin) {
      Myalter('warning', '구매 가이드', '로그인 후 사용할 수 있습니다');
      return;
    }
    const { id } = jwtDecode(isLogin);

    if (selectedSize === '') {
      Myalter('warning', '구매 가이드', '사이즈를 선택하세요');
      return;
    } else if (selectedColor === '') {
      Myalter('warning', '구매 가이드', '색상을 선택하세요');
      return;
    } else if (stock == 0) {
      Myalter('warning', '구매 가이드', '수량이 0입니다');
      return;
    } else {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER}/productOption/${productId}`
      );
      const productOptions = await response.json();

      const selectedProductOption = productOptions.find(
        (option) =>
          option.size === selectedSize && option.color === selectedColor
      );

      const updatedFormData = {
        size: selectedSize,
        color: selectedColor,
        user_id: id,
        productOption_id: selectedProductOption.id,
        product_id: productId,
        amount: stock,
      };

      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER}/cart/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedFormData),
        });

        if (!response.ok) {
          throw new Error('서버에서 응답을 받을 수 없습니다');
        } else {
          let no = await response.json();
          if (no.result == false) {
            const alrterResult = await Swal.fire({
              icon: 'question',
              title: '구매 가이드',
              text: '장바구니에 상품을 추가했습니다 장바구니로 이동하시겠습니까?',
              showCancelButton: true,
              confirmButtonText: '확인',
              cancelButtonText: '취소',
            });
            if (alrterResult.isConfirmed) navigate('/cart');
          } else {
            const alrterResult = await Swal.fire({
              icon: 'question',
              title: '구매 가이드',
              text: '장바구니에 상품을 추가했습니다 장바구니로 이동하시겠습니까?',
              showCancelButton: true,
              confirmButtonText: '확인',
              cancelButtonText: '취소',
            });
            if (alrterResult.isConfirmed) navigate('/cart');
          }
        }
      } catch (error) {
        Myalter('warning', '구매 가이드', '오류가 발생했습니다');
      }
    }
  };

  const handlePayment = async (e) => {
    const isLogin = sessionStorage.getItem('token');
    if (!isLogin) {
      Myalter('warning', '구매 가이드', '로그인 후 사용할 수 있습니다');
      return;
    }
    const { id } = jwtDecode(isLogin);

    if (selectedSize === '') {
      Myalter('warning', '구매 가이드', '사이즈를 선택하세요');
      return;
    } else if (selectedColor === '') {
      Myalter('warning', '구매 가이드', '색상을 선택하세요');
      return;
    } else if (stock == 0) {
      Myalter('warning', '구매 가이드', '수량이 0입니다');
      return;
    } else {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER}/productOption/${productId}`
      );
      const productOptions = await response.json();

      const selectedProductOption = productOptions.find(
        (option) =>
          option.size === selectedSize && option.color === selectedColor
      );

      const updatedFormData = {
        ...selectedProductOption.Product,
        size: selectedSize,
        color: selectedColor,
        user_id: id,
        productOption_id: selectedProductOption.id,
        amount: stock,
        stock: selectedProductOption.stock,
        isChecked: false,
      };

      if (updatedFormData) {
        navigate('/payment', { state: { list: [updatedFormData] } });
      } else {
        Myalter('warning', '구매 가이드', '상품을 선택하세요');
      }
    }
  };

  useEffect(() => {
    // productOption 데이터 가져오기
    fetch(`${process.env.REACT_APP_SERVER}/productOption`)
      .then((response) => response.json())
      .then((data) => {
        const productDetail = data.filter(
          (product) => product.product_id == productId
        );
        setOption(productDetail);
        const newSize = productDetail.map((product) => product.size);
        const sizeList = [...new Set(newSize)];
        setSize(sizeList.sort((a, b) => a - b));
        const newColor = productDetail.map((product) => product.color);
        const colorList = [...new Set(newColor)];
        setColor(colorList);
      });
  }, []);

  const getStock = () => {
    let newStock = [{ productStock: 0 }];
    if (selectedSize && selectedColor) {
      newStock = option.filter(
        (product) =>
          product.size == selectedSize && product.color == selectedColor
      );
    }

    if (newStock.length) {
      setMaxStock(newStock[0].stock);
    } else {
      setMaxStock(0);
    }
    setStock(0);
  };

  useEffect(() => {
    getStock();
  }, [selectedColor]);

  const loadProduct = async () => {
    const getProduct = await fetch(
      `${process.env.REACT_APP_SERVER}/product/${productId}`
    ).then((res) => res.json());
    setProduct(getProduct);
  };

  // 받아온패치 실행해서 getUser에 담기
  const getUserTry = async () => {
    const getUser = await fetch(
      `${process.env.REACT_APP_SERVER}/userEdit/${id}`
    ).then((response) => {
      response.json();
    });
    setUser(getUser);
  };

  useEffect(() => {
    setItem(productId);
    loadProduct();
    getUserTry();
    const token = sessionStorage.getItem('token');
    if (!token) {
      setId(999);
    } else {
      const decodeToken = jwtDecode(token);
      setId(decodeToken.id);
      setIsMaster(decodeToken.isMaster);
    }
  }, [id]);

  const increaseStock = () => {
    if (stock < maxStock) {
      setStock(stock + 1);
    }
  };

  const decreaseStock = () => {
    if (stock > 0) {
      setStock(stock - 1);
    }
  };

  const handleInputChange = (e) => {
    const number = Number(e.target.value);
    if (!number) {
      setStock(0);
    } else if (number < 0) {
      setStock(0);
    } else if (number > maxStock) {
      setStock(maxStock);
    } else if (number % 1 == 0) {
      setStock(number);
    }
  };

  const mainRef = useRef(null);

  let photos = [
    product.mainImage,
    product.subImage1,
    product.subImage2,
    product.subImage3,
  ];

  function jump(i) {
    const prevIndexArray = [...indexArray];
    const targetIndex = prevIndexArray.splice(i, 1)[0];
    prevIndexArray.splice(0, 0, targetIndex);
    setIndexArray(prevIndexArray);
  }

  const imgError = (event) => {
    event.target.src = '/img/readyProduct.png';
  };

  const handleSwitchBtn = () => {
    setSwitchBtn(!switchBtn);
  };

  const deleteProduct = async () => {
    const alrterResult = await Swal.fire({
      icon: 'question',
      title: '구매 가이드',
      text: '제품을 정말 삭제하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '예',
      cancelButtonText: '아니오',
    });

    if (!alrterResult.isConfirmed) {
      return;
    }
    try {
      await fetch(
        `${process.env.REACT_APP_SERVER}/productDelete/${productId}`,
        {
          method: 'DELETE',
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res) {
            Myalter('warning', '제품수정 가이드', '제품을 삭제했습니다');
            navigate('/productList');
          } else {
            Myalter(
              'warning',
              '제품수정 가이드',
              '제품을 삭제하는데 실패했습니다.'
            );
          }
        });
    } catch (error) {
      Myalter(
        'warning',
        '제품수정 가이드',
        '제품을 삭제하던 도중 오류가 발생했습니다.'
      );
    }
  };

  return (
    <>
      {product.id ? (
        <div className="parentBox">
          <Nav />
          <div className="productdetail">
            <div className="div">
              <div className="thumbnailBox">
                {photos.map((photo, i) =>
                  i === 0 ? (
                    <img
                      key={i}
                      ref={mainRef}
                      src={
                        photos[indexArray[i]]
                          ? photos[indexArray[i]]
                          : '/img/readyProduct.png'
                      }
                      onError={imgError}
                      alt="제품 메인이미지"
                      className="mainThumbnailWrapper"
                    />
                  ) : (
                    <img
                      key={i}
                      onError={imgError}
                      src={
                        photos[indexArray[i]]
                          ? photos[indexArray[i]]
                          : '/img/readyProduct.png'
                      }
                      alt="제품 서브이미지"
                      onClick={() => jump(i)}
                      className={'subThumbnail' + i}
                    />
                  )
                )}
              </div>
              <form onSubmit={handleSubmit}>
                <div className="infoBox">
                  {isMaster ? (
                    <>
                      <span className="administrator">관리자 권한 </span>
                      <Link to={`/productList/edit/${productId}`}>
                        <button type="button" className="btn">
                          상품수정
                        </button>
                      </Link>
                      <button
                        type="button"
                        className="btn"
                        onClick={deleteProduct}
                      >
                        상품삭제
                      </button>
                    </>
                  ) : (
                    <span className="administrator"> PRODUCT INFO </span>
                  )}
                  <div className="productName">
                    <div className="textWrapper2">제품명</div>
                    <div className="overlap2">
                      <div className="text">{product.name}</div>
                    </div>
                  </div>
                  <div className="productPrice">
                    <div className="textWrapper2">가격</div>
                    <div className="overlap2">
                      <div className="text">{product.price}</div>
                    </div>
                  </div>
                  <div className="productSize">
                    <div className="textWrapper2">사이즈</div>
                    <div className="overlap2">
                      <select
                        className="select"
                        name="productSize"
                        value={selectedSize}
                        onChange={handleChangeSize}
                      >
                        <option value="" disabled>
                          size
                        </option>
                        {size.map((el, i) => {
                          return (
                            <option key={i} value={el}>
                              {el}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="productColor">
                    <div className="textWrapper2">색상</div>
                    <div className="overlap">
                      <select
                        className="select"
                        name="productColor"
                        value={selectedColor}
                        onChange={handleChangeColor}
                      >
                        <option value="" disabled>
                          color
                        </option>
                        {color.map((el, i) => {
                          return (
                            <option key={i} value={el}>
                              {el}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="productCount">
                    <div className="textWrapper2">수량</div>
                    <div className="overlapGroup">
                      <button
                        type="button"
                        onClick={decreaseStock}
                        className="inputMinus"
                      >
                        -
                      </button>
                      <input
                        className="input"
                        type="number"
                        name="number"
                        min={0}
                        max={product.stock}
                        value={stock}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        onClick={increaseStock}
                        className="inputPlus"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="productTotalPrice">
                    <div className="textWrapper2">총액</div>
                    <div className="overlap2">
                      <div className="text">{product.price * stock} 원</div>
                    </div>
                  </div>
                </div>
                <div className="buttonGroup">
                  <button className="clientBtn1">장바구니</button>
                  <button
                    type="button"
                    className="clientBtn2"
                    onClick={() => handlePayment()}
                  >
                    바로결제
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="componentBox">
            {switchBtn ? (
              <ProductDescription
                switchBtn={switchBtn}
                setSwitchBtn={setSwitchBtn}
                handleSwitchBtn={handleSwitchBtn}
                item={item}
                product={product}
              />
            ) : (
              <ProductReview
                switchBtn={switchBtn}
                setSwitchBtn={setSwitchBtn}
                handleSwitchBtn={handleSwitchBtn}
                item={item}
                user={user}
                id={id}
                product={product}
              />
            )}
          </div>
          <Footer></Footer>
        </div>
      ) : (
        <div>해당 상품을 찾을 수 없습니다</div>
      )}
    </>
  );
};
