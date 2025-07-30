import { useState } from "react";
import * as XLSX from "xlsx";

const ExcelReaderColumnWise = () => {
  const [columnData, setColumnData] = useState({});

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const rowData =
        XLSX.utils.sheet_to_json<Record<string, string>>(worksheet); // row-wise
      const columnWise = {};

      if (rowData.length > 0) {
        Object.keys(rowData[0]).forEach((key) => {
          columnWise[key] = rowData.map((row) => row[key]);
        });
      }

      setColumnData(columnWise);
    };
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4"
      />
      <pre>{JSON.stringify(columnData, null, 2)}</pre>
    </div>
  );
};

export default ExcelReaderColumnWise;
