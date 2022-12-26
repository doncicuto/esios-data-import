import { ElectricityPrice } from "@prisma/client";
import fetch from "node-fetch";

export const getDataFromESIOS = async ({
  startUTC,
  endUTC,
}: {
  startUTC: string;
  endUTC: string;
}) => {
  try {
    const res = await fetch(
      `https://api.esios.ree.es/indicators/1001?start_date=${startUTC}&end_date=${endUTC}&geo_ids[]=8741`,
      {
        method: "GET",
        headers: {
          Accept: "application/json; application/vnd.esios-api-v2+json",
          "Content-Type": "application/json",
          Host: "api.esios.ree.es",
          "x-api-key": `${process.env.ESIOS_KEY}`,
        },
      }
    );

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
  } catch (e) {
    return null;
  }
};
