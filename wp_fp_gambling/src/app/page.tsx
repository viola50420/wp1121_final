import Header from "./component/Header";
import TestAPI from "@/component/TestAPI";
import { auth } from "@clerk/nextjs";
import { Footer } from "./component";
import Main from "./component/Main";
import Contract from "./component/Contract";
import { Suspense } from "react";
import Loading from "./loading";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import { betsTable, contractTable, usersTable } from "@/db/schema";

export default async function Home() {
  const { userId } = auth();
  console.log(userId);

  if (userId) {
    await db
      .insert(usersTable)
      .values({
        id: userId!,
      })
      .onConflictDoNothing()
      .execute();
  }

  const dollar = await db
    .select({
      dollar: usersTable.dollar,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId!))
    .execute();

  let dollarNum;
  if (dollar.length === 0) {
    dollarNum = null;
  } else {
    dollarNum = dollar[0].dollar;
  }

  const betSubquery = db.$with("attend_or_not").as(
    db
      .select({
        contractId: betsTable.contractId,
        option: betsTable.option,
        dollar: betsTable.dollar,
      })
      .from(betsTable)
      .where(eq(betsTable.userId, userId!)),
  );

  const weatherContracts = await db
    .with(betSubquery)
    .select({
      contractId: contractTable.id,
      title: contractTable.title,
      description: contractTable.description,
      optionA: contractTable.optionA,
      optionB: contractTable.optionB,
      optionC: contractTable.optionC,
      totalDollar: contractTable.totalDollar,
      attendees: contractTable.attendees,
      blockDate: contractTable.blockDate,
      option: betSubquery.option,
      dollar: betSubquery.dollar,
    })
    .from(contractTable)
    .where(and(eq(contractTable.open, true), eq(contractTable.type, "weather")))
    .leftJoin(betSubquery, eq(contractTable.id, betSubquery.contractId))
    .execute();

  const MarketingContracts = await db
    .with(betSubquery)
    .select({
      contractId: contractTable.id,
      title: contractTable.title,
      description: contractTable.description,
      optionA: contractTable.optionA,
      optionB: contractTable.optionB,
      optionC: contractTable.optionC,
      totalDollar: contractTable.totalDollar,
      attendees: contractTable.attendees,
      blockDate: contractTable.blockDate,
      option: betSubquery.option,
      dollar: betSubquery.dollar,
    })
    .from(contractTable)
    .where(
      and(eq(contractTable.open, true), eq(contractTable.type, "marketing")),
    )
    .leftJoin(betSubquery, eq(contractTable.id, betSubquery.contractId))
    .execute();

  const sportContracts = await db
    .with(betSubquery)
    .select({
      contractId: contractTable.id,
      title: contractTable.title,
      description: contractTable.description,
      optionA: contractTable.optionA,
      optionB: contractTable.optionB,
      optionC: contractTable.optionC,
      totalDollar: contractTable.totalDollar,
      attendees: contractTable.attendees,
      blockDate: contractTable.blockDate,
      option: betSubquery.option,
      dollar: betSubquery.dollar,
    })
    .from(contractTable)
    .where(and(eq(contractTable.open, true), eq(contractTable.type, "sport")))
    .leftJoin(betSubquery, eq(contractTable.id, betSubquery.contractId))
    .execute();

  console.log(weatherContracts);
  return (
    <>
      <Header userId={userId!} dollarnum={dollarNum} />
      <Main />
      <Suspense fallback={<Loading />} />
      {weatherContracts.length === 0 ? (
        <div className="flex justify-center">
          <p className="text-4xl my-4 font-bold text-gray-400">
            Threre is not any weather contract
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-begin ml-10">
            <p className="text-8xl mt-4 font-bold text-blue-400">Weather</p>
          </div>
          <hr className="border-t border-4 text-blue-400 mt-2 mx-4 rounded-md" />
          <hr className="border-t border-4 text-blue-400 mx-4" />
          <hr className="border-t border-4 text-blue-400 mx-4 rounded-xl" />
          <div className="grid grid-cols-2 gap-4 m-4">
            {weatherContracts.map((contract) => {
              console.log(contract);
              return (
                <Contract
                  contractId={contract.contractId}
                  title={contract.title}
                  description={contract.description}
                  totalDollar={contract.totalDollar!}
                  optionA={contract.optionA!}
                  optionB={contract.optionB!}
                  optionC={contract.optionC!}
                  attendees={contract.attendees!}
                  blockDate={contract.blockDate!}
                  option={contract.option}
                  dollar={contract.dollar}
                />
              );
            })}
          </div>
        </>
      )}
      {MarketingContracts.length === 0 ? (
        <div className="flex justify-center">
          <p className="text-4xl my-4 font-bold text-gray-400">
            Threre is not any marketing contract
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-begin ml-10">
            <p className="text-8xl mt-4 font-bold text-red-400">Marketing</p>
          </div>
          <hr className="border-t border-4 text-red-400 mt-2 mx-4 rounded-md" />
          <hr className="border-t border-4 text-red-400 mx-4" />
          <hr className="border-t border-4 text-red-400 mx-4 rounded-xl" />
          <div className="grid grid-cols-2 gap-4 m-4">
            {MarketingContracts.map((contract) => {
              console.log(contract);
              return (
                <Contract
                  contractId={contract.contractId}
                  title={contract.title}
                  description={contract.description}
                  totalDollar={contract.totalDollar!}
                  optionA={contract.optionA!}
                  optionB={contract.optionB!}
                  optionC={contract.optionC!}
                  attendees={contract.attendees!}
                  blockDate={contract.blockDate!}
                  option={contract.option}
                  dollar={contract.dollar}
                />
              );
            })}
          </div>
        </>
      )}
      {sportContracts.length === 0 ? (
        <div className="flex justify-center">
          <p className="text-4xl my-4 font-bold text-gray-400">
            Threre is not any sport contract
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-begin ml-10">
            <p className="text-8xl mt-4 font-bold text-green-400">Sport</p>
          </div>
          <hr className="border-t border-4 text-green-400 mt-2 mx-4 rounded-md" />
          <hr className="border-t border-4 text-green-400 mx-4" />
          <hr className="border-t border-4 text-green-400 mx-4 rounded-xl" />
          <div className="grid grid-cols-2 gap-4 m-4">
            {sportContracts.map((contract) => {
              console.log(contract);
              return (
                <Contract
                  contractId={contract.contractId}
                  title={contract.title}
                  description={contract.description}
                  totalDollar={contract.totalDollar!}
                  optionA={contract.optionA!}
                  optionB={contract.optionB!}
                  optionC={contract.optionC!}
                  attendees={contract.attendees!}
                  blockDate={contract.blockDate!}
                  option={contract.option}
                  dollar={contract.dollar}
                />
              );
            })}
          </div>
        </>
      )}

      <Footer />

      <TestAPI
        userId={userId!}
        contractId="m.2023-12-27.2330"
        option="optionA"
        dollar={100}
      />
    </>
  );
}
