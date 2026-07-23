import Papa from "papaparse";

export const parseCsv = (file: File): Promise<any[]> =>
  new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results: { data: any[] | PromiseLike<any[]>; }) => resolve(results.data),
      error: (err: any) => reject(err),
    });
  });
