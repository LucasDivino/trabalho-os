import axios from "axios";

const baseUrl = "http://localhost:8000/";

export const post = async (url, params, headers) => {
  try {
    const response = await axios({
      method: "post",
      url: `${baseUrl}${url}`,
      data: params,
      headers: { "Content-Type": "application/json", ...headers },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const get = async (url) => {
  try {
    const response = await axios({
      method: "get",
      url: `${baseUrl}${url}`,
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
