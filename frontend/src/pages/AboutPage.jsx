import React, { useState, useEffect } from 'react';
import { Footer, Navbar } from "../components";

const getRandomVideoId = () => {
  // 在這裡實現取得隨機影片 ID 的邏輯，你可以從你的影片集合中選擇一個影片 ID
  const videoIds = ['JCz-R4ZEzVU&ab_channel=%E6%9B%BE%E5%8D%9A%E6%81%A9', 'zGrYK1VTIjs&list=RDMMIslhmC1Sw-I&index=8&ab_channel=%E5%A5%BD%E6%A8%82%E5%9C%98GoodBand', 'Ywm2dEUDAzI&ab_channel=%E4%BB%80%E9%BA%BC%E6%84%8F%E6%80%9D', 'vS7OXYDycgw&ab_channel=%E9%98%BF%E7%BF%B0po%E5%BD%B1%E7%89%87'];
  const randomIndex = Math.floor(Math.random() * videoIds.length);
  return videoIds[randomIndex];
};

const getRandomWatchTime = () => {
  // 取得觀看時間，這裡設定為 10 到 40 秒之間
  return Math.floor(Math.random() * (40 - 10 + 1)) + 10;
};

export default function AboutPage() {
  const [points, setPoints] = useState(0);
  const [watchTime, setWatchTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (watchTime > 0) {
        setWatchTime((prevWatchTime) => prevWatchTime - 1);
      } else {
        // 觀看時間結束，增加點數
        setPoints((prevPoints) => prevPoints + 100);
        // 取得新的觀看時間和影片 ID
        setWatchTime(getRandomWatchTime());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [watchTime]);

  const handleVideoClick = () => {
    // 在這裡處理影片點擊的邏輯，可能是打開一個新的窗口或導向到影片頁面
    window.open(`https://www.youtube.com/watch?v=${getRandomVideoId()}`, '_blank');

    // 設定新的觀看時間
    setWatchTime(getRandomWatchTime());
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Add Coins !</h1>
        <hr />
        <p className="lead text-center">
          沒錢了嗎? 沒關係! 這裡有一個影片，看完就可以得到 100 點!
        </p>

        {/* <h2 className="text-center py-4">Our Products</h2> */}
        <div className="row">
          <div className="col-md-3 col-sm-6 mb-3 mx-auto">
            <div className="card h-100">
              <iframe
                title={`Video`}
                width="100%"
                height="160"
                src={`https://www.youtube.com/embed/${getRandomVideoId()}`}
                frameBorder="0"
                allowFullScreen
              ></iframe>
              <div className="card-body">
                <h5 className="card-title text-center">Video</h5>
                <p className="text-center">Watch for {watchTime} seconds</p>
                <button onClick={handleVideoClick}>Watch and Earn</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 換行 */}
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Footer />
    </>
  );
}
