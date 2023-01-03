import Papa, { ParseStepResult, Parser } from "papaparse";

type CsvRow = { [column: string]: string | number };

export const getRowsFromCsv = (file: File, rowCount = 3): Promise<CsvRow[]> => {
  return new Promise(async (resolve, reject) => {
    const rows: CsvRow[] = [];

    const onStep = (
      { data, errors, meta }: ParseStepResult<CsvRow>,
      parser: Parser
    ) => {
      if (errors.length) {
        parser.abort();
        reject(
          new Error(errors[0].message || `Unable to read file: ${file.name}`)
        );
      } else {
        if (rows.length >= rowCount) {
          parser.abort();
          return resolve(rows);
        }
        rows.push(data);
      }
    };

    const onFinish = () => {
      console.log("Finished Parsing CSV");
    };

    const onError = (error: Error) => {
      reject(new Error(error.message || `Unable to read file: ${file.name}`));
    };

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      step: onStep,
      complete: onFinish,
      error: onError,
    });
  });
};
