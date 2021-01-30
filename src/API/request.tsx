/*tslint:disable*/

import axios, { AxiosInstance, AxiosPromise } from "axios";
export default class API {
  public static getInstance() {
    if (!this.instance) {
      this.instance = new API();
    }
    return this.instance;
  }
  private static instance: API;
  private baseURL: string =
    // "https://puzzle.mead.io/puzzle?wordCount=${wordCount}";
    "https://puzzle.mead.io/puzzle?";
  private axios: AxiosInstance | undefined;
  private constructor() {
    this.axios = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });
  }
  public axiosWrapper<T>(axiosArgument: any): AxiosPromise<T> {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      this.axios(axiosArgument)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => reject(error));
    });
  }
  public GetPuzzle(params: { wordCount: number }) {
    let path = this.baseURL;
    path = params ? path + `wordCount=${params["wordCount"]}` : path;
    const axiosArgument = {
      method: "GET",
      url: path,
      data: params,
    };
    return this.axiosWrapper<T>(axiosArgument);
  }
}
