import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { contractTable } from "@/db/schema";
import { postContract, putContract } from "@/controler/contract";
import { ContractType } from "@/controler/contract";

export async function GET(request: NextRequest) {
  const contractId = request.nextUrl.searchParams.get("contractId");
  const type = request.nextUrl.searchParams.get("type") as ContractType;
  try {
    if (contractId === null) {
      console.log(type);
      const contracts = await db
      .select({
        id: contractTable.id,
        type: contractTable.type,
        title: contractTable.title,
        description: contractTable.description,
        optionA: contractTable.optionA,
        optionB: contractTable.optionB,
        optionC: contractTable.optionC,
        optionADollar: contractTable.optionADollar,
        optionBDollar: contractTable.optionBDollar,
        optionCDollar: contractTable.optionCDollar,
        totalDollar: contractTable.totalDollar,
        attendees: contractTable.attendees,
        blockDate: contractTable.blockDate,
        updateDate: contractTable.updateDate,
        open: contractTable.open,
        outcome: contractTable.outcome,
      })
      .from(contractTable)
      .where(and(
        eq(contractTable.open, true),
        eq(contractTable.type, type)
        ))
      .execute();
      console.log(contracts);
      return NextResponse.json({ data: contracts }, { status: 200 });
    } else {
      const contract = await db
      .select({
        id: contractTable.id,
        type: contractTable.type,
        title: contractTable.title,
        description: contractTable.description,
        optionA: contractTable.optionA,
        optionB: contractTable.optionB,
        optionC: contractTable.optionC,
        optionADollar: contractTable.optionADollar,
        optionBDollar: contractTable.optionBDollar,
        optionCDollar: contractTable.optionCDollar,
        totalDollar: contractTable.totalDollar,
        attendees: contractTable.attendees,
        blockDate: contractTable.blockDate,
        updateDate: contractTable.updateDate,
        open: contractTable.open,
        outcome: contractTable.outcome,
      })
      .from(contractTable)
      .where(eq(contractTable.id, contractId!))
      .execute();
      console.log(contract);
      return NextResponse.json({ data: contract }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  try {
    const newContract = await postContract(data);
    return NextResponse.json({ data: newContract }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const data = await request.json();
  try {
    const updateContract = await putContract(data);
    return NextResponse.json({ data: updateContract }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
