import { navyColor } from '../../../assets/jss/material-kit-react';
import { CustomSwal } from '../../../components/CustomSwal/CustomSwal';
import * as XLSX from 'xlsx';
interface FileReadResult {
  headers: string[];
  data: any[];
}
export const validateFile = (props) => {
  const allowedFiles = ['.xlsx', '.csv'];
  const regex = new RegExp(
    '([a-zA-Z0-9s_\\.-:()])+(' + allowedFiles.join('|') + ')$'
  );

  if (props) {
    if (!regex.test(props.name.toLowerCase())) {
      CustomSwal('error', `Import Failed.<br> Please Upload the Correct File.`,'navyColor', 'OK', '');
      return false;
    } else {
      return true;
    }
  }
  return false;
};
export const checkCodeIsPresent = (uniqueCodes, value) => {
  const index = uniqueCodes.map(code => code.replace(/\s+/g, '')).indexOf(value.replace(/\s+/g, ''));
  return index >= 0;
};

export const checkCodenull = (value) => {
  if( value === null || value === undefined || (typeof value === "string" && value.trim().length === 0)){
    return true;
  }
};

export const readFile = (props): Promise<{ array: any[]; headers: string[] }> => {
  const formData = new FormData();
  formData.append('uploadfile', props.file);

  if (props.valid) {
    let user = localStorage.getItem('emailId');
    formData.append('email', user);
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(props.file);

    return new Promise((resolve, reject) => {
      fileReader.onload = async () => {
        try {
          let arrayBuffer: any = fileReader.result;
          let uploaddata = new Uint8Array(arrayBuffer);
          let arr: string[] = [];
          
          for (let i = 0; i < uploaddata.length; i++) {
            arr[i] = String.fromCharCode(uploaddata[i]);
          }

          let bstr = arr.join('');
          let workbook = XLSX.read(bstr, { type: 'binary' });
          let first_sheet_name = workbook.SheetNames[0];
          let worksheet = workbook.Sheets[first_sheet_name];

          // Extract headers from the worksheet
          let headers: string[] = (XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          })[0] || []) as string[];

          let data = XLSX.utils.sheet_to_json(worksheet, { raw: true });
          let array: any = [];
          let exportarray: any = [];
          array = exportarray.concat(data);
          resolve({ array, headers });
        } catch (error) {
          reject(error);
        }
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  } else {
    return Promise.reject('Invalid file');
  }
};

// Validates if all required headers are present
export const validateFileHeaders = (headers: string[], requiredHeaders: string[]) => {
  const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
  if (missingHeaders.length > 0) {
    return false;
  }
  return true;
};
// Determines the import policy ID
export const determineImportPolicyId = (data: any[],policyId) => {
  let importPolicyId = undefined;
  for (const record of data) {
    if (policyId !== record.POLICYID) {
      importPolicyId = record.POLICYID ?? -1;
    } else if (importPolicyId === undefined) {
      importPolicyId = policyId;
    }
  }
  return importPolicyId;
};

export const checkLengthCode = (field, size) => {
  const fieldStr = String(field); // Ensure field is a string
  const re = /^[0-9\b]+$/; // Pattern to allow only numbers and hyphens

  // If the length does not match, return true
  if (fieldStr.length !== size) {
    return true;
  }

  // If the field does NOT match the regex, return true
  if (!re.test(fieldStr)) {
    return true;
  }

  return false; // If both conditions pass, return false (valid case)
};


// Displays an error message
export const showImportError = (message: string) => {
  CustomSwal("error", message, navyColor, "Ok", "Error");
};