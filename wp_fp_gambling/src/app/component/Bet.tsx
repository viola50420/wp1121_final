"use client";
import Link from "next/link";
import React from "react";
type BetItemTypes = {
  id: number;
  contractId: string;
  title: string;
  type: string;
  option: string;
  optionA: string;
  optionB: string;
  optionC: string;
  blockDate: string;
  updateDate: string;
  dollar: number;
  status: boolean;
};
export default function Bet({
  id,
  contractId,
  title,
  type,
  option,
  dollar,
  status,
  optionA,
  optionB,
  optionC,
  blockDate,
  updateDate,
}: BetItemTypes) {
  if (option) {
    if (option === "optionA") {
      option = optionA;
    } else if (option === "optionB") {
      option = optionB;
    } else if (option === "optionC") {
      option = optionC;
    }
  }

  let winOrLose;
  if (new Date(updateDate) < new Date()) {
    winOrLose = status ? "贏" : "輸";
  } else {
    winOrLose = "押注";
  }

  return (
    <Link href={`/contract/${contractId}`} className="text-black">
    <div key={id}>
      <div className="row d-flex align-items-center justify-content-between">
        {/* <div className="col-lg-3 col-md-12">
          <div className="bg-image rounded" data-mdb-ripple-color="light">
            <img
                src={item.image}
                // className="w-100"
                alt={item.title}
                width={100}
                height={75}
            />
          </div>
        </div> */}
        <div className="col-lg-5 col-md-6 ml-2 font-weight-bold text-nowrap">
        {type === "marketing" && (
            <p className="inline-block text-xl border-t border-2 border-red-700 rounded-lg text-center bg-red-300 mb-2 px-2 py-1">
            {type}
            </p>
        )}
        {type === "sport" && (
            <p className="inline-block text-xl border-t border-2 border-green-700 rounded-lg text-center bg-green-300 mb-2 px-2 py-1">
            {type}
            </p>
        )}
        {type === "weather" && (
            <p className="inline-block text-xl border-t border-2 border-blue-700 rounded-lg text-center bg-blue-300 mb-2 px-2 py-1">
            {type}
            </p>
        )}
          <p className="text-xl">
            {title}
          </p>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="d-flex mb-2  text-nowrap" style={{ maxWidth: "300px" }}>
            <p className="mr-2 text-lg">你選了</p>
            <p className="ml-2 text-lg text-green-500">${option}</p>
          </div>
          <p className="text-start text-md-center text-lg">
            <strong>
            {winOrLose}
            <span className="text-muted ml-4">
              ${dollar}
            </span> 
            </strong>
          </p>
        </div>
      </div>

      <hr className="my-4" />
    </div>
    </Link>
  );
}
