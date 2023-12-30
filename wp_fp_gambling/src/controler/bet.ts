import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { betsTable } from "@/db/schema";
import z from "zod";

const PostBetSchema = z.object({
  userId: z.string(),
  contractId: z.string(),
  option: z.enum(["optionA", "optionB", "optionC"]),
  dollar: z.number(),
});
export type PostBetType = z.infer<typeof PostBetSchema>;

const PutBetSchema = z.object({
  id: z.number(),
  option: z.enum(["optionA", "optionB", "optionC"]).optional(),
  dollar: z.number().optional(),
  status: z.boolean().optional(),
});
export type PutBetType = z.infer<typeof PutBetSchema>;

export enum forWhat {
  user = "user",
  contract = "contract",
}

const GetBetSchema = z.object({
  userId: z.string().optional(),
  contractId: z.string().optional(),
  outcome: z.enum(["optionA", "optionB", "optionC"]).optional(),
  forWhat: z.enum(["user", "contract"]),
});
type GetBetType = z.infer<typeof GetBetSchema>;

// 下注
export async function postBet(data: PostBetType) {
  try {
    PostBetSchema.parse(data);
  } catch (error) {
    return "Post data does not match schema";
  }
  const { userId, contractId, option, dollar } = data as PostBetType;
  try {
    const newBet = await db
      .insert(betsTable)
      .values({
        userId: userId,
        contractId: contractId,
        option: option,
        dollar: dollar,
      })
      .execute();
    return newBet;
  } catch (error) {
    return "Insert bet failed";
  }
}

// 修改下注
export async function putBet(data: PutBetType) {
  try {
    PutBetSchema.parse(data);
  } catch (error) {
    return "Put data does not match schema";
  }
  const { id, option, dollar, status } = data as PutBetType;
  try {
    const bet = await db
      .update(betsTable)
      .set({
        option: option,
        dollar: dollar,
        status: status,
      })
      .where(eq(betsTable.id, id)) // Convert id to number using parseInt
      .execute();
    return bet;
  } catch (error) {
    return "Put bet failed";
  }
}

// 取得所有下注
export async function getBet(data: GetBetType) {
  try {
    GetBetSchema.parse(data);
  } catch (error) {
    return "Get data does not match schema";
  }
  const { userId, contractId, outcome, forWhat } = data as GetBetType;
  try {
    if (forWhat === "user") {
      const bet = await db
        .select({
          id: betsTable.id,
          userId: betsTable.userId,
          contractId: betsTable.contractId,
          option: betsTable.option,
          dollar: betsTable.dollar,
        })
        .from(betsTable)
        .where(eq(betsTable.userId, userId!))
        .execute();
      return bet;
    } else {
      const bet = await db
        .select({
          id: betsTable.id,
          userId: betsTable.userId,
          contractId: betsTable.contractId,
          option: betsTable.option,
          dollar: betsTable.dollar,
        })
        .from(betsTable)
        .where(
          and(
            eq(betsTable.contractId, contractId!),
            eq(betsTable.option, outcome!),
          ),
        )
        .execute();
      return bet;
    }
  } catch (error) {
    return "Get bet failed";
  }
}
