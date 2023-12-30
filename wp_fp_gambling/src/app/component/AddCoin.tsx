"use client";
import React, { useState, useEffect } from 'react';

type AddCoinTypes = {
    id: string;
    dollar: number;
};
const updateDollar = async (id: string, dollar: number) => {
    try {
        // alert({ userId: id, dollar })
        const response = await fetch("/api/user", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: id, dollar }),
        });

        if (!response.ok) {
            throw new Error('Failed to update dollar value');
        }

        const data = await response.json();
        console.log('Dollar updated successfully:', data);
    } catch (error: any) {
        console.error('Error updating dollar value:', error.message);
    }
};
export default function AboutPage({ id, dollar: initialDollar }: AddCoinTypes) {
    const [dollar, setDollar] = useState(initialDollar);
    const [watchTime, setWatchTime] = useState(30);
    const getRandomWatchTime = () => {
        // 取得觀看時間，這裡設定為 10 到 40 秒之間
        // return Math.floor(Math.random() * (4 - 1 + 1)) + 10;
        return Math.floor(Math.random() * (40 - 10 + 1)) + 10;
    };
    const getRandomVideoId = () => {
        // 在這裡實現取得隨機影片 ID 的邏輯，從影片集合中選擇一個影片 ID
        const videoIds = ['IXuhdnB2dAY&list=RDMMIXuhdnB2dAY&start_radio=1&ab_channel=%E5%91%A8%E6%9D%B0%E5%80%ABJayChou', 'zGrYK1VTIjs&list=RDMMIslhmC1Sw-I&index=8&ab_channel=%E5%A5%BD%E6%A8%82%E5%9C%98GoodBand', 'Ywm2dEUDAzI&ab_channel=%E4%BB%80%E9%BA%BC%E6%84%8F%E6%80%9D', 'vS7OXYDycgw&ab_channel=%E9%98%BF%E7%BF%B0po%E5%BD%B1%E7%89%87', 'zGrYK1VTIjs&ab_channel=好樂團GoodBand', 'CUTlxi5DFBo&ab_channel=forgoodmusic', 'Jt_S0in0y-w&ab_channel=9m88'];
        const randomIndex = Math.floor(Math.random() * videoIds.length);
        return videoIds[randomIndex];
    };

    useEffect(() => {
        const timer = setInterval(() => {
            if (watchTime > 0) {
                setWatchTime((prevWatchTime) => prevWatchTime - 1);
            } else {
                clearInterval(timer);
                // 觀看時間結束，增加點數

                setDollar((currentDollar) => {
                    const updatedDollar = currentDollar;
                    updateDollar(id, 3);
                    // return updatedDollar;
                    return 1;
                });
                // 取得新的觀看時間和影片 ID
                setWatchTime(getRandomWatchTime());
                //跳轉到首頁
                window.location.href = "/";
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [id, dollar, watchTime]);

    const handleVideoClick = () => {
        // 在這裡處理影片點擊的邏輯，可能是打開一個新的窗口或導向到影片頁面
        window.open(`https://www.youtube.com/watch?v=${getRandomVideoId()}`, '_blank');

        // 設定新的觀看時間
        setWatchTime(getRandomWatchTime());

    };

    return (
        <>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div key={id} className="container my-3 py-3">
                <p className="text-center font-bold text-4xl z-5 mb-2">Add Coins !</p>

                <hr />
                <br />
                <p className="lead text-center">
                    沒錢了嗎 ? 沒關係 ! 這裡有一個影片，看完就可以得到點數 !
                </p>
                <br />

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
                                <button
                                    onClick={handleVideoClick}
                                    className="btn btn-outline-primary d-block mx-auto"
                                >
                                    Watch and Earn
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
