import { NextResponse } from "next/server";
import { contractTable } from "@/db/schema";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import {
  postContract,
  ContractType,
  putContract,
  OptionType,
} from "@/controler/contract";
import { getBet, forWhat, putBet } from "@/controler/bet";
import { addDollar } from "@/controler/user";

// 建立公司名稱、代碼字典
const companyArray = ["長榮(2603)", "台積電(2330)", "開發金(2883)"];
const companyCodeArray = ["2603", "2330", "2883"];

// 建立昨天、今天、明天、後天的日期
const today = new Date();
const yesterday = new Date().setDate(today.getDate() - 1);
const tomorrow = new Date().setDate(today.getDate() + 1);
const theDayAfterTomorrow = new Date().setDate(today.getDate() + 2);
const DateArray = [yesterday, today, tomorrow, theDayAfterTomorrow];

// 建立 NBA 隊伍名稱字典
interface Dictionary {
  [key: string]: string;
}
const NBATeamNameDictionay: Dictionary = {
  "nba.t.1": "亞特蘭大老鷹",
  "nba.t.2": "波士頓塞爾提克",
  "nba.t.3": "新奧爾良鵜鶘",
  "nba.t.4": "芝加哥公牛",
  "nba.t.5": "克里夫蘭騎士",
  "nba.t.6": "達拉斯獨行俠",
  "nba.t.7": "丹佛金塊",
  "nba.t.8": "底特律活塞",
  "nba.t.9": "金州勇士",
  "nba.t.10": "休士頓火箭",
  "nba.t.11": "印第安納溜馬",
  "nba.t.12": "洛杉磯快艇",
  "nba.t.13": "洛杉磯湖人",
  "nba.t.14": "邁阿密熱火",
  "nba.t.15": "密爾瓦基公鹿",
  "nba.t.16": "明尼蘇達灰狼",
  "nba.t.17": "布魯克林籃網",
  "nba.t.18": "紐約尼克",
  "nba.t.19": "奧蘭多魔術",
  "nba.t.20": "費城76人",
  "nba.t.21": "鳳凰城太陽",
  "nba.t.22": "波特蘭拓荒者",
  "nba.t.23": "沙加緬度國王",
  "nba.t.24": "聖安東尼奧馬刺",
  "nba.t.25": "奧克拉荷馬雷霆",
  "nba.t.26": "猶他爵士",
  "nba.t.27": "華盛頓巫師",
  "nba.t.28": "多倫多暴龍",
  "nba.t.29": "曼菲斯灰熊",
  "nba.t.30": "夏洛特黃蜂",
};

//格式化全局日期 YYYY-MM-DD
function formateDate(DateArray: Array<string | number | Date>) {
  const formatedDateArray = [];
  for (let i = 0; i < DateArray.length; i++) {
    const date = new Date(DateArray[i]);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    formatedDateArray[i] = `${year}-${month}-${day}`;
  }
  return formatedDateArray;
}

// 建立天氣合約
async function postWeatherContract(formatedDateArray: Array<string>) {
  // 格式化天氣日期 YYYYMMDD
  const weatherDateArray = [];
  for (let i = 0; i < DateArray.length; i++) {
    const weatherDate = formatedDateArray[i].replace(/-/g, "");
    weatherDateArray.push(weatherDate);
  }
  // 調取明天中午 12 點的氣溫預測
  const response = await fetch(
    `https://www.cwa.gov.tw/Data/js/3hr/ChartData_3hr_T_63.js?T=${weatherDateArray[1]}00-0`,
  );
  const textdata = await response.text();
  const forcastDegree = Number(
    textdata.split("\n\n")[2].split("\n")[9].split("[")[1].split(",")[12],
  );
  console.log(forcastDegree);

  // 建立合約
  const postData = {
    id: `w.${formatedDateArray[2]}.${forcastDegree}`, // ex: w.2021-09-30.12
    type: ContractType.weather,
    title: `台北市大安區 ${formatedDateArray[2]} 中午 12 點氣溫`,
    description: "你覺得明天的氣溫會是多少呢？",
    optionA: `${forcastDegree}度以下`,
    optionB: `${forcastDegree}度`,
    optionC: `${forcastDegree + 1}度以上`,
    blockDate: formatedDateArray[2],
    updateDate: formatedDateArray[3],
  };
  const newContract = await postContract(postData);
  console.log(newContract);
  return newContract;
}

// 建立 NBA 合約
async function postNBAContract(formatedDateArray: Array<string>) {
  // 調取明天 NBA 明天賽程
  const response = await fetch(
    `https://api-secure.sports.yahoo.com/v1/editorial/s/scoreboard?&region=TW&tz=Asia%2FTaipei&ysp_redesign=1&leagues=nba&date=${formatedDateArray[2]}`,
  );
  const data = await response.json();
  const games = data.service.scoreboard.games;
  if (!games) {
    return "There isn't any game tomorrow";
  }
  console.log(games);

  // 建立合約
  const gamesArray = Object.values(games);
  const postNBAReses = gamesArray.map(async (game: any) => {
    const postData = {
      id: game.gameid, // ex: nba.g.20231222318
      type: ContractType.sport,
      title: `${formatedDateArray[2]} ${
        NBATeamNameDictionay[game.home_team_id]
      } VS ${NBATeamNameDictionay[game.away_team_id]}`,
      description: "你覺得哪一隊會贏呢？",
      optionA: `${NBATeamNameDictionay[game.home_team_id]}`,
      optionB: `平手`,
      optionC: `${NBATeamNameDictionay[game.away_team_id]}`,
      blockDate: formatedDateArray[2],
      updateDate: formatedDateArray[3],
    };
    const newContract = await postContract(postData);
    return newContract;
  });
  console.log(postNBAReses);
  return postNBAReses;
}

// 建立股價合約
async function postMarketingContract(formatedDateArray: Array<string>) {
  const weekDay = new Date(formatedDateArray[2]).getDay();
  if (weekDay === 0 || weekDay === 6) {
    return "It's weekend";
  }
  const postMarketingReses = companyArray.map(async (company: string) => {
    const companyCode = company.split("(")[1].split(")")[0];
    const postData = {
      id: `m.${formatedDateArray[2]}.${companyCode}`, // ex: m.2021-09-30.2330
      type: ContractType.marketing,
      title: `${formatedDateArray[2]} ${company} 股價漲跌`,
      description: `你覺得明天 ${company} 股價漲跌多少 %?`,
      optionA: `-1.5% 以下`,
      optionB: `-1.5% ~ 1.5%`,
      optionC: `1.5% 以上`,
      blockDate: formatedDateArray[2],
      updateDate: formatedDateArray[3],
    };
    const newContract = await postContract(postData);
    return newContract;
  });
  console.log(postMarketingReses);
  return postMarketingReses;
}

// 鎖住合約
async function blockContract(formatedDateArray: Array<string>) {
  const blockDate = formatedDateArray[1];
  await db
    .update(contractTable)
    .set({
      open: false,
    })
    .where(eq(contractTable.blockDate, blockDate))
    .execute();
}

// 執行天氣合約
async function executeWeatherContract(formatedDateArray: Array<string>) {
  const weatherContract = await db
    .select({
      id: contractTable.id,
      optionADollar: contractTable.optionADollar,
      optionBDollar: contractTable.optionBDollar,
      optionCDollar: contractTable.optionCDollar,
      totalDollar: contractTable.totalDollar,
    })
    .from(contractTable)
    .where(
      and(
        eq(contractTable.updateDate, formatedDateArray[0]),
        eq(contractTable.type, "weather"),
      ),
    )
    .execute();

  // 獲取昨日氣溫資料
  const response = await fetch(
    `https://www.cwa.gov.tw/Data/js/GT/ChartData_GT24hr_T_63.js?T=${DateArray[1]}00-0`,
  );
  const data = await response.text();

  // 獲取昨日中午 12 點 Index
  const twelveOclockIndex = Number(
    data
      .split("\n\n")[1]
      .split("[")[1]
      .split("]")[0]
      .split(",")
      .findIndex((time) => time.startsWith("'12 ")),
  );
  console.log(twelveOclockIndex);

  // 獲取昨日中午 12 點氣溫
  const twelveOclockDegree = data
    .split("\n\n")[2]
    .split("}},")[2]
    .split("[")[1]
    .split("]")[0]
    .split(",")[twelveOclockIndex];
  console.log(twelveOclockDegree);

  // 獲取天氣合約預測氣溫
  const forcastDegree = weatherContract[0].id.split(".")[2];
  console.log(forcastDegree);

  let outcome;
  // 判斷昨日中午 12 點氣溫是否符合預測
  if (twelveOclockDegree < forcastDegree) {
    outcome = OptionType.optionA;
  } else if (twelveOclockDegree == forcastDegree) {
    outcome = OptionType.optionB;
  } else {
    outcome = OptionType.optionC;
  }

  // 輸入結果
  const putData = {
    id: weatherContract[0].id,
    outcome: outcome,
  };
  await putContract(putData);

  // 計算天氣合約賠率
  const totalDollar = weatherContract[0].totalDollar;
  const outcomeDollar = weatherContract[0][`${outcome}Dollar`];
  const odds = totalDollar! / outcomeDollar!;

  // 獲取天氣合約下注資料
  const getBetData = {
    contractId: weatherContract[0].id,
    outcome: outcome,
    forWhat: forWhat.contract,
  };
  const betArray = await getBet(getBetData);
  console.log(betArray);

  if (betArray === "Get data does not match schema") {
    return "There isn't any bet";
  } else if (betArray === "Get bet failed") {
    throw new Error("Get bet failed");
  }

  // 計算天氣合約獲利
  const profitReses = betArray.map(async (bet) => {
    const profit = Math.round(bet.dollar! * odds);
    const putUserData = {
      userId: bet.userId!,
      dollar: profit,
    };
    await addDollar(putUserData);
    const putBetData = {
      id: bet.id!,
      status: true,
      dollar: profit,
    };
    await putBet(putBetData);
  });
  console.log(profitReses);
}

// 執行 NBA 合約
async function executeNBAContract(formatedDateArray: Array<string>) {
  const NBAContractArray = await db
    .select({
      id: contractTable.id,
      optionADollar: contractTable.optionADollar,
      optionBDollar: contractTable.optionBDollar,
      optionCDollar: contractTable.optionCDollar,
      totalDollar: contractTable.totalDollar,
    })
    .from(contractTable)
    .where(
      and(
        eq(contractTable.updateDate, formatedDateArray[0]),
        eq(contractTable.type, "sport"),
      ),
    )
    .execute();
  if (!NBAContractArray) {
    return "There isn't any NBA contract";
  }

  // 調取昨天 NBA 對戰結果
  const response = await fetch(
    `https://api-secure.sports.yahoo.com/v1/editorial/s/scoreboard?&region=TW&tz=Asia%2FTaipei&ysp_redesign=1&leagues=nba&date=${formatedDateArray[0]}`,
  );
  const data = await response.json();
  const games = data.service.scoreboard.games;
  if (!games) {
    return "There isn't any game yesterday";
  }
  console.log(games);

  const gamesArray = Object.values(games);
  const putNBAReses = gamesArray.map(async (game: any) => {
    const gameid = game.gameid;
    const winner = game.winning_team_id;
    const OTorNot = game.status_display_name;
    let outcome;
    // 判斷昨日 NBA 結果
    if (OTorNot !== "Final") {
      outcome = OptionType.optionB;
    } else if (winner === game.home_team_id) {
      outcome = OptionType.optionA;
    } else {
      outcome = OptionType.optionC;
    }
    // 輸入結果
    const putData = {
      id: gameid,
      outcome: outcome,
    };
    await putContract(putData);

    // 獲取 NBA 合約勝隊賠率
    const theContract = NBAContractArray.find(
      (contract) => contract.id === gameid,
    );
    const totalDollar = theContract!.totalDollar;
    const outcomeDollar = theContract![`${outcome}Dollar`];
    const odds = totalDollar! / outcomeDollar!;
    console.log(odds);

    // 獲取 NBA 合約下注資料
    const getBetData = {
      contractId: theContract!.id,
      outcome: outcome,
      forWhat: forWhat.contract,
    };
    const betArray = await getBet(getBetData);
    console.log(betArray);

    if (betArray === "Get data does not match schema") {
      return "There isn't any bet";
    } else if (betArray === "Get bet failed") {
      throw new Error("Get bet failed");
    }

    // 計算 NBA 合約獲利
    const profitReses = betArray.map(async (bet) => {
      const profit = Math.round(bet.dollar! * odds);
      const putUserData = {
        userId: bet.userId!,
        dollar: profit,
      };
      await addDollar(putUserData);
      const putBetData = {
        id: bet.id!,
        status: true,
        dollar: profit,
      };
      await putBet(putBetData);
    });
    console.log(profitReses);
  });
  console.log(putNBAReses);
}

// 執行股價合約
async function executeMarketingContract(formatedDateArray: Array<string>) {
  const marketingContractArray = await db
    .select({
      id: contractTable.id,
      optionADollar: contractTable.optionADollar,
      optionBDollar: contractTable.optionBDollar,
      optionCDollar: contractTable.optionCDollar,
      totalDollar: contractTable.totalDollar,
    })
    .from(contractTable)
    .where(
      and(
        eq(contractTable.updateDate, formatedDateArray[0]),
        eq(contractTable.type, "marketing"),
      ),
    )
    .execute();

  if (!marketingContractArray) {
    return "There isn't any marketing contract";
  }

  const marketingContractReses = companyCodeArray.map(async (companyCode) => {
    // 調取開盤股價及漲跌幅
    const yaerMonth = formatedDateArray[0].split("-").slice(0, 2).join("");
    const response = await fetch(
      `https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY?date=${yaerMonth}&stockNo=0050&response=json`,
    );
    const data = await response.json();
    const yesterdayData = data.data[data.data.length - 1];
    console.log(yesterdayData);
    const initialPrice = yesterdayData[3];
    console.log(initialPrice);

    // 計算漲跌幅
    const change = yesterdayData[7];
    const changePercent = Math.round((change / initialPrice) * 100);
    console.log(changePercent);

    let outcome;
    // 判斷漲跌幅
    if (change < -1.5) {
      outcome = OptionType.optionA;
    } else if (change >= -1.5 && change <= 1.5) {
      outcome = OptionType.optionB;
    } else {
      outcome = OptionType.optionC;
    }

    // 輸入結果
    const putData = {
      id: `m.${formatedDateArray[0]}.${companyCode}`,
      outcome: outcome,
    };
    await putContract(putData);

    // 獲取股價合約賠率
    const theContract = marketingContractArray.find(
      (contract) => contract.id === `m.${formatedDateArray[0]}.${companyCode}`,
    );
    const totalDollar = theContract!.totalDollar;
    const outcomeDollar = theContract![`${outcome}Dollar`];
    const odds = totalDollar! / outcomeDollar!;
    console.log(odds);

    // 獲取股價合約下注資料
    const getBetData = {
      contractId: theContract!.id,
      outcome: outcome,
      forWhat: forWhat.contract,
    };
    const betArray = await getBet(getBetData);
    console.log(betArray);

    if (betArray === "Get data does not match schema") {
      return "There isn't any bet";
    } else if (betArray === "Get bet failed") {
      throw new Error("Get bet failed");
    }

    // 計算股價合約獲利
    const profitReses = betArray.map(async (bet) => {
      const profit = Math.round(bet.dollar! * odds);
      const putUserData = {
        userId: bet.userId!,
        dollar: profit,
      };
      await addDollar(putUserData);
      const putBetData = {
        id: bet.id!,
        status: true,
        dollar: profit,
      };
      await putBet(putBetData);
    });
    console.log(profitReses);
  });
  console.log(marketingContractReses);
}

export async function GET() {
  console.log("GET");
  const formatedDateArray = formateDate(DateArray);
  const weatherContract = await postWeatherContract(formatedDateArray);
  const NBAContract = await postNBAContract(formatedDateArray);
  const marketingContract = await postMarketingContract(formatedDateArray);
  // await blockContract(formatedDateArray);
  const data = {
    weatherContract: weatherContract,
    NBAContract: NBAContract,
    marketingContract: marketingContract,
  };
  try {
    return NextResponse.json({ data: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
      },
    );
  }
}

export async function POST() {
  console.log("POST");
  const formatedDateArray = formateDate(DateArray);
  const weatherContract = await postWeatherContract(formatedDateArray);
  const NBAContract = await postNBAContract(formatedDateArray);
  const marketingContract = await postMarketingContract(formatedDateArray);
  await blockContract(formatedDateArray);
  await executeWeatherContract(formatedDateArray);
  await executeNBAContract(formatedDateArray);
  await executeMarketingContract(formatedDateArray);
  const data = {
    weatherContract: weatherContract,
    NBAContract: NBAContract,
    marketingContract: marketingContract,
  };
  try {
    return NextResponse.json({ data: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
      },
    );
  }
}
