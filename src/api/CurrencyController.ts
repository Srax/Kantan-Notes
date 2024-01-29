export interface Rate {
  currency: string;
  rate: number;
}

interface ApiResponse {
  date: string;
  rates: Rate[]; // Specify that rates is an array of Rate objects
}

export default async function fetchRate(base: string): Promise<ApiResponse> {
  try {
    const response = await fetch(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${base}.json`
    );
    const data = await response.json();

    // Check if the desired value exists in the response
    if (data.hasOwnProperty(base)) {
      const parsedRates: Rate[] = Object.entries(data[base]) // Get key-value pairs as entries
        .map(([currency, rate]) => ({ currency, rate: parseFloat(rate) })); // Create Rate objects

      const parsedRatesByCurrency: Record<string, Rate> = Object.fromEntries(
        parsedRates.map((rate) => [rate.currency, rate])
      );

      const parsedResponse: ApiResponse = {
        date: data.date,
        rates: parsedRatesByCurrency,
      };
      return parsedResponse;
    } else {
      throw new Error(`Desired value "${base}" not found in API response`);
    }
  } catch (error) {
    console.error("Error fetching rate:", error);
    throw error; // Re-throw the error for proper handling
  }
}
