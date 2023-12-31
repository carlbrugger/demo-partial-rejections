import { validateEmail, validateNonEmpty } from "./validators";

interface PartialRejection {
  id: string;
  deleteSubmitted?: boolean;
  message?: string;
  sheets: Sheet[];
}

interface Sheet {
  sheetId: string;
  rejectedRecords: RecordError[];
}

interface RecordError {
  id: string;
  values: { field: string; message: string }[];
}

const getRejections = (body: any, validator: any) => {
  const workbook = body.workbook;
  const rejections: PartialRejection = {
    id: workbook.id,
    // message: "Success! All records are valid.",
    // deleteSubmitted: true,
    sheets: [],
  };
  workbook.sheets.forEach((sheet: any) => {
    const rejectedRecords: RecordError[] = [];
    sheet.records.forEach((record: any) => {
      for (const [field, cell] of Object.entries(record.values)) {
        const message = validator(field, cell.value);
        if (message) {
          rejectedRecords.push({
            id: record.id,
            values: [
              {
                field,
                message,
              },
            ],
          });
        }
      }
    });
    rejections.sheets.push({
      sheetId: sheet.id,
      rejectedRecords,
    });
  });

  // if (rejections.sheets.some((sheet) => sheet.rejectedRecords.length > 0)) {
  //   rejections.message = "Some records are invalid.";
  // }
  return rejections;
};

const server = Bun.serve({
  port: 5678,
  async fetch(req: Request) {
    const body = await req.json();
    console.log("------------------- Request ------------------");
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Body:", JSON.stringify(body, null, 2));

    let responseBody = "Success!";
    const url = new URL(req.url);
    if (url.pathname === "/reject-non-flatfile-emails") {
      const rejections = getRejections(body, validateEmail);
      responseBody = JSON.stringify(
        {
          rejections,
        },
        null,
        2
      );
    }
    if (url.pathname === "/reject-empty-cells") {
      const rejections = getRejections(body, validateNonEmpty);
      responseBody = JSON.stringify(
        {
          rejections,
        },
        null,
        2
      );
    }

    return new Response(responseBody);
  },
});

console.log(`Listening on http://${server.hostname}:${server.port} ...`);
