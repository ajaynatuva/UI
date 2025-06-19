import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const fileType =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

export const exportedExcelFileData = (inputData, fileName, sheetType) => {
  let objectKeysToLowerCase = function (input) {
    if (typeof input !== 'object') return input;
    if (Array.isArray(input)) return input.map(objectKeysToLowerCase);
    return Object.keys(input).reduce(function (newObj, key) {
      let val = input[key];
      let newVal =
        typeof val === 'object' && val !== null
          ? objectKeysToLowerCase(val)
          : val;
      newObj[key.toLocaleUpperCase()] = newVal;
      return newObj;
    }, {});
  };
  let newObj = objectKeysToLowerCase(inputData);

  const ws = XLSX.utils.json_to_sheet(newObj);
  const wb = {
    Sheets: { [sheetType.toString()]: ws },
    SheetNames: [sheetType.toString()],
  };
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
};

// for tax id tab and npi tab 
export function createExcelFile(data: any[]): Promise<File> {
      return new Promise((resolve) => {
        // Create a new workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
  
        // Append worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
        // Write workbook to binary format
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
  
        // Create a Blob with Excel data
        const fileBlob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
  
        // Convert Blob to File
        const file = new File([fileBlob], "updated_data.xlsx", {
          type: fileBlob.type,
          lastModified: new Date().getTime(), // Required for File type
        });
  
        resolve(file);
      });
    }
