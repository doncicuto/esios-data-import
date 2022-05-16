import test from "tape";
import { getDataFromESIOS } from "./getDataFromESIOS";
import { DateTime } from "luxon";

test("Get ESIOS data should return values", async (t: test.Test) => {
  const dateRef = DateTime.local().setZone("Europe/Madrid").startOf("day");
  const todaysStartUTC = dateRef.toUTC().toISO(); // Today's data start at 00:00 local time
  const todaysEndUTC = dateRef.plus({ hours: 23 }).toUTC().toISO(); // Today's data ends at 23:00 local time

  const data = await getDataFromESIOS({
    startUTC: todaysStartUTC,
    endUTC: todaysEndUTC,
  });
  t.notEqual(data, null, "ESIOS should not return a null value");
  t.equal(Array.isArray(data), true, "ESIOS should return an array");
  t.ok((data?.length || 0) > 0, "ESIOS should return several values");
  t.ok(
    data && data[0].value && data[1].value,
    "ESIOS should have valid values"
  );
  t.end();
});
