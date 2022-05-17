import { DateTime } from "luxon";
import { PrismaClient } from "@prisma/client";
import { getDataFromESIOS } from "./getDataFromESIOS";

const db = new PrismaClient();

async function main() {
  console.log(
    "##################################################################################"
  );
  console.log(` ${DateTime.now().toISO()} - Job starting....`);
  console.log(
    "----------------------------------------------------------------------------------"
  );

  const dateRef = DateTime.local().setZone("Europe/Madrid").startOf("day");
  const todaysStartUTC = dateRef.toUTC().toISO(); // Today's data start at 00:00 local time
  const todaysEndUTC = dateRef.plus({ hours: 23 }).toUTC().toISO(); // Today's data ends at 23:00 local time
  const today20h = dateRef.plus({ hours: 20 }); // Data should not be available before 20:00
  const tomorrowsStartUTC = dateRef.plus({ day: 1 }).toUTC().toISO(); // Tomorros's data start at 00:00 local time
  const tomorrowsEndUTC = dateRef.plus({ day: 1, hours: 23 }).toUTC().toISO(); // Tomorrow's data ends at 23:00 local time

  // Delete records older than today
  await db.electricityPrice.deleteMany({
    where: {
      tz_time: { lt: todaysStartUTC },
    },
  });

  const todayData = await db.electricityPrice.findFirst({
    where: { tz_time: todaysStartUTC },
  });

  if (!todayData) {
    const esiosData = await getDataFromESIOS({
      startUTC: todaysStartUTC,
      endUTC: todaysEndUTC,
    });
    if (esiosData && esiosData.length > 0) {
      const esiosDbData = await db.electricityPrice.findFirst({
        where: { tz_time: esiosData[0].tz_time },
      });

      if (!esiosDbData) {
        console.log(
          ` ${DateTime.now().toISO()} - insert today's ESIOS data in db`
        );
        console.log(
          "----------------------------------------------------------------------------------"
        );
        await db.electricityPrice.createMany({ data: esiosData });
        console.log(
          ` ${DateTime.now().toISO()} - new today's ESIOS data inserted`
        );
        console.log(
          "----------------------------------------------------------------------------------"
        );
      } else {
        console.log(
          ` ${DateTime.now().toISO()} - weird, I already have that data for today`
        );
        console.log(
          "----------------------------------------------------------------------------------"
        );
      }
    } else {
      console.log(
        ` ${DateTime.now().toISO()} - I could not get today's data from ESIOS`
      );
      console.log(
        "----------------------------------------------------------------------------------"
      );
    }
  } else {
    console.log(` ${DateTime.now().toISO()} - no need to add today's data`);
    console.log(
      "----------------------------------------------------------------------------------"
    );
  }

  const tomorrowData = await db.electricityPrice.findFirst({
    where: { tz_time: tomorrowsStartUTC },
  });

  const nowLocalTime = DateTime.local().setZone("Europe/Madrid");

  // Get data if we don't have today's data or if local time is greater than 20h and we don't have tomorrow's data
  if (nowLocalTime > today20h && !tomorrowData) {
    console.log(` ${DateTime.now().toISO()} - get tomorrow's ESIOS data`);
    console.log(
      "----------------------------------------------------------------------------------"
    );

    const esiosData = await getDataFromESIOS({
      startUTC: tomorrowsStartUTC,
      endUTC: tomorrowsEndUTC,
    });
    if (esiosData && esiosData.length > 0) {
      const esiosDbData = await db.electricityPrice.findFirst({
        where: { tz_time: esiosData[0].tz_time },
      });

      if (!esiosDbData) {
        console.log(
          ` ${DateTime.now().toISO()} - insert tomorrow's ESIOS data in db`
        );
        console.log(
          "----------------------------------------------------------------------------------"
        );
        await db.electricityPrice.createMany({ data: esiosData });
        console.log(
          ` ${DateTime.now().toISO()} - new tomorrow's ESIOS data inserted`
        );
        console.log(
          "----------------------------------------------------------------------------------"
        );
      } else {
        console.log(
          ` ${DateTime.now().toISO()} - weird, I already have that data for tomorrow`
        );
        console.log(
          "----------------------------------------------------------------------------------"
        );
      }
    } else {
      console.log(
        ` ${DateTime.now().toISO()} - I could not get tomorrow's data from ESIOS`
      );
      console.log(
        "----------------------------------------------------------------------------------"
      );
    }
  } else {
    console.log(` ${DateTime.now().toISO()} - no need to add tomorrow's data`);
    console.log(
      "----------------------------------------------------------------------------------"
    );
  }

  return;
}

main()
  .then(() => {
    console.log(` ${DateTime.now().toISO()} - Job finishing....`);
    console.log(
      "##################################################################################"
    );
  })
  .catch((error) => console.error(error));
