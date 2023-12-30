import React, { useState, useEffect } from 'react';
import { Footer } from "../component";
import Header from "../component/Header";
import AddCoin from "../component/AddCoin";
import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import { usersTable } from "@/db/schema";
// import EmptyCart from "./cart_client";
import { auth, UserButton } from "@clerk/nextjs";
export default async function AboutPage() {
  const { userId } = auth();
  console.log(userId);
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


  return (
    <>
      <Header userId={userId!} dollarnum={dollarNum} />
      <AddCoin id={userId!} dollar={dollarNum || 0} />
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
