import fetch from "node-fetch";
import { DateTime } from "luxon";
import { ElectricityPrice, PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const getDataFromESIOS = async () => {
  const res = await fetch("https://api.esios.ree.es/indicators/1001", {
    method: "GET",
    headers: {
      Accept: "application/json; application/vnd.esios-api-v2+json",
      "Content-Type": "application/json",
      Host: "api.esios.ree.es",
      Authorization: `Token token=${process.env.ESIOS_KEY}`,
    },
  });

  const json: {
    indicator: { values_updated_at: string; values: ElectricityPrice[] };
  } = await res.json();

  if (
    json.indicator &&
    json.indicator.values &&
    Array.isArray(json.indicator.values)
  ) {
    return json.indicator.values;
  }

  return null;
};

async function main() {
  const todayUTC = DateTime.local().startOf("day").toUTC();
  const tomorrowUTC = DateTime.local().plus({ day: 1 }).startOf("day").toUTC();

  // Delete records older than today
  await db.electricityPrice.deleteMany({
    where: {
      tz_time: { lt: todayUTC.toISO() },
    },
  });

  const todayData = await db.electricityPrice.findFirst({
    where: { tz_time: todayUTC.toISO() },
  });

  const tomorrowData = await db.electricityPrice.findFirst({
    where: { tz_time: tomorrowUTC.toISO() },
  });

  const nowLocalTime = DateTime.local().setZone("Europe/Madrid");
  const today20h = DateTime.local()
    .setZone("Europe/Madrid")
    .startOf("day")
    .plus({ hours: 20 });

  console.log("#########################################");
  console.log(` ${DateTime.now().toISO()} - Job starting....`);
  console.log("-----------------------------------------");

  // Get data if we don't have today's data or if local time is greater than 20h and we don't have tomorrow's data
  if (!todayData || (nowLocalTime > today20h && !tomorrowData)) {
    console.log(` ${DateTime.now().toISO()} - get ESIOS data`);
    console.log("-----------------------------------------");

    const esiosData = await getDataFromESIOS();
    if (esiosData) {
      const esiosDbData = await db.electricityPrice.findFirst({
        where: { tz_time: esiosData[0].tz_time },
      });

      if (!esiosDbData) {
        console.log(` ${DateTime.now().toISO()} - insert ESIOS data in db`);
        console.log("-----------------------------------------");
        await db.electricityPrice.createMany({ data: esiosData });
        console.log(` ${DateTime.now().toISO()} - new ESIOS data inserted`);
        console.log("-----------------------------------------");
      }
    }
  }

  return;
}

main()
  .then(() => {
    console.log(` ${DateTime.now().toISO()} - Job finishing....`);
    console.log("#########################################");
  })
  .catch((error) => console.error(error));
