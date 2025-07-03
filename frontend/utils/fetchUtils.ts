export const fetchHandler = async (url: string, options = {}) => {
  try {
    const response = await fetch(url, options);
    const { ok, status, headers } = response;
    if (!ok) {
      throw new Error(
        `Error fetching from url: ${url} responded with status - ${status}`
      );
    }

    const isJson = (headers.get("content-type") || "").includes(
      "application/json"
    );
    const responseData = await (isJson ? response.json() : response.text());
    return [responseData, null];
  } catch (error) {
    console.warn(error);
    return [null, error];
  }
};

export const basicFetchOptions = {
  method: "GET",
  credentials: "include",
};

export const getPostOptions = (body: any) => ({
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
