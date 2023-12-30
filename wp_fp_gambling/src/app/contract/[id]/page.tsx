"use client";
import React, { useState, useEffect, useContext, use } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../component/Header';
import Marquee from "react-fast-marquee";
import bet from './api/bet';
import Image from 'next/image';
import { useUser } from "@clerk/nextjs";
import { ContractContext } from './api/useContract';
import { set } from 'zod';

function Contract () {
  const { user } = useUser();
  const { contract, contracts, setContractId, setContractType, dollar, setDollar, setUserId, bets, setBets } = useContext(ContractContext);
  const params = useParams();
  const paramsContractId = params.id as string;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<number | "">(0);
  const [block, setBlock] = useState(false);
  const [totalDollar, setTotalDollar] = useState(0);
  const [attendees, setAttendees] = useState(0);


  useEffect(() => {
    setContractId(paramsContractId);
    let type
    if (paramsContractId.split(".")[0] === "w") {
      type = "weather"
    } else if (paramsContractId.split(".")[0] === "nba") {
      type = "sport"
    } else if (paramsContractId.split(".")[0] === "m") {
      type = "marketing"
    }
    console.log(type)

    setContractType(type!);
    if (user) {
      setUserId(user.id);
      console.log(user.id);
    }
    console.log(bets);
  },[paramsContractId, user]);

  useEffect(() => {
    console.log("Bets:", bets);
    if(!bets) return;
    if (bets!.contractId === paramsContractId) {
      setBlock(true);
    }
    console.log("Block:", block)
  }, [bets, paramsContractId]);

  useEffect(() => {
    if (contract) {
      setAttendees(contract.attendees);
      setTotalDollar(contract.totalDollar);
    }
  }, [contract]);


  const handleSaveAnswer = (selectedOption: string) => {
    setSelectedOption(selectedOption);
  };

  const handlePlaceBet = () => {
    if (selectedOption === null) {
      alert("請選擇投注選項");
      return;
    }
    if (typeof betAmount !== "number") {
      setBetAmount(0);
      alert("下注金額不能為空");
      return;
    }
    if (betAmount > dollar!) {
      setBetAmount(dollar!);
      alert("下注金額不能大於您的餘額");
      return;
    }
    if (betAmount === 0) {
      setBetAmount(0);
      alert("下注金額不能為0");
      return;
    }
    // if (selectedOption) {
    //   if (betAmount >= 0) {
    //     bet(contract!.id, selectedOption, betAmount, user!.id, );
    //   }
    // };
    bet(contract!.id, selectedOption, betAmount, user!.id, );
    setBlock(true);
    setTotalDollar(totalDollar + betAmount);
    setAttendees(attendees + 1);
    setDollar(dollar! - betAmount);
    setBets({
      id: paramsContractId,
      contractId: paramsContractId,
      userId: user!.id,
      option: selectedOption!,
      dollar: betAmount,
    });
  }
  const ShowSimilarContract = () => {
    return (
      <>
        <div className="py-2">
          <div className="d-flex">
            {contracts ? (
              <>
              {contracts.map((contract) => {
                return (
                  <div key={contract.id} className="card mx-4 text-center">
                    {/* <img
                      className="card-img-top p-3"
                      src={item.image}
                      alt="Card"
                      height={300}
                      width={300}
                    /> */}
                    <Link href={"/contract/" + contract.id} className="btn btn-dark m-1">
  
                    <div className="card-body">
                      <h5 className="card-title">
                        {contract.title.substring(0, 15)}...
                      </h5>
                    </div>
                    
                      </Link>
                  </div>
                );
              })}
              </>
              ) : (
                <p>正在加載數據...</p>
              )}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {user ? (
        <>
          <Header userId={user.id} dollarnum={null}/>
        </>
      ) : (
          <p>正在加載數據...</p>
      )}
      {contract && (
        <>
          <div className="p-4" />
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-sm-12 pt-3">
              <Image
                src="/assets/IMG_1.PNG"
                alt="Card"
                width={500}
                height={500}
                layout="responsive"
                />
              </div>
              <div className="col-md-6 col-md-6 pt-20">
              <p className="display-5 font-bold" style={{ fontSize: '2.3rem' }}>{contract.title}</p>
                <p className="lead"></p>
                <p className="display-6 my-4" style={{ fontSize: '1.9rem' }}>投注池中總金額 $ {totalDollar}</p>
                <p className="display-6 my-4" style={{ fontSize: '1.9rem' }}>投注人數 {attendees}</p>
                <p className="lead">{contract.description}</p>
                <div className="my-3">
                  <div className="row">
                    <div className="col-md-4">
                      <button
                        className={`btn btn-outline-dark btn-block ${selectedOption === 'optionA' || bets?.option === 'optionA' ? 'selected' : ''}`}
                        onClick={() => handleSaveAnswer('optionA')}
                        disabled={block}
                      >
                        {contract.optionA}
                      </button>
                    </div>
                    <div className="col-md-4">
                      <button
                        className={`btn btn-outline-dark btn-block ${selectedOption === 'optionB' || bets?.option === 'optionB' ? 'selected' : ''}`}
                        onClick={() => handleSaveAnswer('optionB')}
                        disabled={block}
                      >
                        {contract.optionB}
                      </button>
                    </div>
                    <div className="col-md-4">
                      <button
                        className={`btn btn-outline-dark btn-block ${selectedOption === 'optionC' || bets?.option === 'optionC' ? 'selected' : ''}`}
                        onClick={() => handleSaveAnswer('optionC')}
                        disabled={block}
                      >
                        {contract.optionC}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="my-3">
                  <label htmlFor="betAmount" className="form-label">
                    下注金額：
                  </label>
                  { block ? (
                      <input
                      type="number"
                      id="betAmount"
                      value={bets?.dollar.toString() || betAmount}
                      className="form-control"
                      disabled
                    />
                  ) : (
                    <input
                    type="number"
                    id="betAmount"
                    value={betAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      setBetAmount(value === '' ? '' : Math.max(0, Number(value)));
                    }}
                    className="form-control"
                  />
                  )}
                </div>
                { block ? (
                  <p className="text-danger">您已投注，請等待結果揭曉</p>
                ) : (
                  <button
                  className={`btn btn-outline-dark w-100`} // w-100 for full width
                  onClick={handlePlaceBet}
                >
                  下注
                </button>
                )}

              </div>
            </div>
          </div>
          <div className="container">
        <div className="row">
          <div className="d-none d-md-block">
            <h2 className="">You may also Like</h2>
            <Marquee pauseOnHover={true} pauseOnClick={true} speed={50}>
                <ShowSimilarContract />
            </Marquee>
          </div>
        </div>
        </div>
        </>
      )}
    </>
  );

  
 
};

export default Contract;