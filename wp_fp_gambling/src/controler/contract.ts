import { eq } from "drizzle-orm";
import { db } from "@/db";
import { contractTable } from "@/db/schema";
import z from "zod";

export enum ContractType {
  sport = "sport",
  weather = "weather",
  marketing = "marketing",
}

const PostContractsSchema = z.object({
  id: z.string(),
  type: z.enum(["sport", "weather", "marketing"]),
  title: z.string(),
  description: z.string(),
  optionA: z.string(),
  optionB: z.string(),
  optionC: z.string(),
  blockDate: z.string(),
  updateDate: z.string(),
});
type PostContractsType = z.infer<typeof PostContractsSchema>;

export enum OptionType {
  optionA = "optionA",
  optionB = "optionB",
  optionC = "optionC",
}
const PutConractSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
  open: z.boolean().optional(),
  outcome: z.enum(["optionA", "optionB", "optionC"]).optional(),
  dollar: z.number().optional(),
  option: z.enum(["optionA", "optionB", "optionC"]).optional(),
});
type PutConractType = z.infer<typeof PutConractSchema>;

export async function postContract(data: PostContractsType) {
  try {
    PostContractsSchema.parse(data);
  } catch (error) {
    return "Post data does not match schema";
  }
  const {
    id,
    type,
    title,
    description,
    optionA,
    optionB,
    optionC,
    blockDate,
    updateDate,
  } = data as PostContractsType;
  console.log(data);
  try {
    const newContract = await db
      .insert(contractTable)
      .values({
        id: id,
        type: type,
        title: title,
        description: description,
        optionA: optionA,
        optionB: optionB,
        optionC: optionC,
        blockDate: blockDate,
        updateDate: updateDate,
      })
      .returning()
      .execute();
    console.log(newContract);
    return newContract;
  } catch (error) {
    return "Post contract failed";
  }
}

export async function putContract(data: PutConractType) {
  try {
    PutConractSchema.parse(data);
  } catch (error) {
    return "Put data does not match schema";
  }
  const {
    id,
    open,
    outcome,
    dollar,
    option,
  } = data as PutConractType;
  console.log(data);

  try {
    if(option) {
      if (option === "optionA") {
        const contract = await db
        .select({
          optionADollar: contractTable.optionADollar,
          totalDollar: contractTable.totalDollar,
          attendees: contractTable.attendees,
        })
        .from(contractTable)
        .where(eq(contractTable.id, id))
        .execute();
        console.log(contract);
        let optionADollar = contract[0].optionADollar;
        optionADollar! += dollar!;
        const updateContract = await db
          .update(contractTable)
          .set({
            totalDollar: contract[0].totalDollar! + dollar!,
            optionADollar: optionADollar,
            attendees: contract[0].attendees! + 1,
          })
          .where(eq(contractTable.id, id))
          .returning()
          .execute();
        console.log(updateContract);
        return updateContract;
      } else if (option === "optionB") {
        const contract = await db
        .select({
          totalDollar: contractTable.totalDollar,
          optionBDollar: contractTable.optionBDollar,
          attendees: contractTable.attendees,
        })
        .from(contractTable)
        .where(eq(contractTable.id, id))
        .execute();
        console.log(contract);
        let optionBDollar = contract[0].optionBDollar;
        optionBDollar! += dollar!;
        const updateContract = await db
          .update(contractTable)
          .set({
            totalDollar: contract[0].totalDollar! + dollar!,
            optionBDollar: optionBDollar,
            attendees: contract[0].attendees! + 1,
          })
          .where(eq(contractTable.id, id))
          .returning()
          .execute();
        console.log(updateContract);
        return updateContract;
      } else if (option === "optionC") {
        const contract = await db
        .select({
          optionCDollar: contractTable.optionCDollar,
          totalDollar: contractTable.totalDollar,
          attendees: contractTable.attendees,
        })
        .from(contractTable)
        .where(eq(contractTable.id, id))
        .execute();
        console.log(contract);
        let optionCDollar = contract[0].optionCDollar;
        optionCDollar! += dollar!;
        const updateContract = await db
          .update(contractTable)
          .set({
            totalDollar: contract[0].totalDollar! + dollar!,
            optionCDollar: optionCDollar,
            attendees: contract[0].attendees! + 1,
          })
          .where(eq(contractTable.id, id))
          .returning()
          .execute();
        console.log(updateContract);
        return updateContract;
      }
    } else {
    const contract = await db
      .select({
        totalDollar: contractTable.totalDollar,
        optionADollar: contractTable.optionADollar,
        optionBDollar: contractTable.optionBDollar,
        optionCDollar: contractTable.optionCDollar,
      })
      .from(contractTable)
      .where(eq(contractTable.id, id))
      .execute();
    console.log(contract);
    const updateContract = await db
      .update(contractTable)
      .set({
        open: open,
        outcome: outcome,
      })
      .where(eq(contractTable.id, id))
      .returning()
      .execute();
    console.log(updateContract);
    return updateContract;
    }
  } catch (error) {
    return "Put contract failed";
  }
}
