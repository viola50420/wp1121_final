"use client";
import type { PostBetType } from "@/controler/bet";
// 只是用來測試 api 而已
const TestAPI = ({ userId, contractId, option, dollar }: PostBetType) => {
  const handleClick = async () => {
    const response = await fetch("/api/crons", {
      method: "GET",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      // body: JSON.stringify({ userId, contractId, option, dollar }),
    });
    const data = await response.json();
    console.log(data);
  };
  return <button onClick={handleClick}>Click</button>;
};

export default TestAPI;
