import test from "tape";
import { getDataFromESIOS } from "./getDataFromESIOS";

test("Get ESIOS data should return values", async (t: test.Test) => {
  const data = await getDataFromESIOS();
  t.notEqual(data, null, "ESIOS should not return a null value");
  t.equal(Array.isArray(data), true, "ESIOS should return an array");
  t.ok((data?.length || 0) > 0, "ESIOS should return several values");
  t.ok(
    data && data[0].value && data[1].value,
    "ESIOS should have valid values"
  );
  t.end();
});
