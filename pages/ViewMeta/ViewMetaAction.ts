
import { ViewMetaConstants } from './viewMetaConstants';

export const Source = [
    { value: "MFS", label: "MFS" },
    { value: "OCE-HCPCS", label: "OCE-HCPCS" },
    { value: "CPT/HCPCS", label: "CPT/HCPCS" },
    { value: "ADD ON CODES", label: "ADD ON CODES" },
    { value: "CCI", label: "CCI" },
    { value: "ICD", label: "ICD" },
    { value: "MAX UNITS", label: "MAX UNITS" },
    { value: "BW Pairs", label: "BW PAIRS" },
    { value: "MFS DATE BINDED", label: "MFS DATE BINDED" },
    { value: "OCE-HCPCS DATE BINDED", label: "OCE-HCPCS DATE BINDED" },
    { value: "APC DATE BINDED", label: "APC DATE BINDED" },
    { value: "CAPC DATE BINDED", label: "CAPC DATE BINDED" },
    { value: "GPCI DATE BINDED", label: "GPCI DATE BINDED" },
    { value: "ZIP 5 DATE BINDED", label: "ZIP 5 DATE BINDED" },
    { value: "ZIP 9 DATE BINDED", label: "ZIP 9 DATE BINDED" },
    { value: "GPCI", label: "GPCI" },
    { value: "ZIP 5", label: "ZIP 5" },
    { value: "ZIP 9", label: "ZIP 9" },
    { value: "CLIENT SPECIFIC",label:"CLIENT SPECIFIC"}
  ];

  export const SearchFields =[
        "CPT/HCPCS",
        "ADD ON CODES",
        "CCI",
        "ICD",
        "MAX UNITS",
        "BW Pairs",
        "MFS DATE BINDED",
        "OCE-HCPCS DATE BINDED",
        "APC DATE BINDED",
        "CAPC DATE BINDED",
        "GPCI DATE BINDED",
        "ZIP 5 DATE BINDED",
        "ZIP 9 DATE BINDED",
        "CLIENT SPECIFIC"
      ];

const dropSources = [
  ViewMetaConstants.MAX_UNITS,
  ViewMetaConstants.BW_Pairs,
  ViewMetaConstants.CCI,
  ViewMetaConstants.GPCI,
  ViewMetaConstants.MFS,
  ViewMetaConstants.HCPCS,
  ViewMetaConstants.ZIP_5,
  ViewMetaConstants.ZIP_9,
  ViewMetaConstants.OCE_HCPCS
];

export function showDrop(source) {
  return dropSources.includes(source);
}
export function showLookUpOptions(Source, maxUnitLookUP, BW_PAIRS, Quarters, Cci_Keys) {
  const optionsMap = {
    [ViewMetaConstants.MAX_UNITS]: maxUnitLookUP,
    [ViewMetaConstants.BW_Pairs]: BW_PAIRS,
    [ViewMetaConstants.CCI]: Cci_Keys,
    [ViewMetaConstants.GPCI]: Quarters,
    [ViewMetaConstants.MFS]: Quarters,
    [ViewMetaConstants.HCPCS]: Quarters,
    [ViewMetaConstants.ZIP_5]: Quarters,
    [ViewMetaConstants.ZIP_9]: Quarters,
    [ViewMetaConstants.OCE_HCPCS]: Quarters,
  };

  return optionsMap[Source];
}

export function showSourceDropDown(source) {
  let flag = false;
  if (
    source == ViewMetaConstants.CCI ||
    source == ViewMetaConstants.ADD_ON_CODES ||
    source == ViewMetaConstants.CPT ||
    source == ViewMetaConstants.MFS ||
    source == ViewMetaConstants.OCE_HCPCS ||
    source == ViewMetaConstants.MAX_UNITS ||
    source == ViewMetaConstants.ICD ||
    source == ViewMetaConstants.MFS_DATE_BINDED ||
    source == ViewMetaConstants.HCPCS_DATE_BINDED ||
    source == ViewMetaConstants.APC_DATE_BINDED ||
    source == ViewMetaConstants.CAPC_DATE_BINDED ||
    source == ViewMetaConstants.ZIP_5_DATE_BINDED ||
    source == ViewMetaConstants.ZIP_9_DATE_BINDED ||
    source == ViewMetaConstants.ZIP_5 ||
    source == ViewMetaConstants.ZIP_9 ||
    source == ViewMetaConstants.BW_Pairs ||
    source == ViewMetaConstants.CLIENT_SPECIFIC
  ) {
    flag = true;
  } else {
    flag = false;
  }

  return flag;
}
export function showSecondLabelDrop(source) {
    let flag = false;
  if (
    source == ViewMetaConstants.CCI ||
    source == ViewMetaConstants.ADD_ON_CODES
    ) {
        flag = true;
      } else {
        flag = false;
      }
    
      return flag;
}
export function SearchFirstLabel(source) {
  switch(source){
    case ViewMetaConstants.ADD_ON_CODES:{
        return "PRIMARY CODE"        
    }
    case ViewMetaConstants.BW_Pairs:{
        return "Deny Code"
    }
    case ViewMetaConstants.CCI:{
        return "COLUMN I"
    }
    case ViewMetaConstants.CPT:{
    return "CPT/HCPCS"
    }
    case ViewMetaConstants.MFS:{
        return "CPT/HCPCS"
    }
    case ViewMetaConstants.OCE_HCPCS:{
        return "CPT/HCPCS"
    }
    case ViewMetaConstants.MAX_UNITS:{
        return "CPT/HCPCS"
    }
    case ViewMetaConstants.ICD:{
        return "ICD CODE"
    }
    case ViewMetaConstants.MFS_DATE_BINDED:{
        return "CPT/HCPCS"
    }
    case ViewMetaConstants.HCPCS_DATE_BINDED:{
        return "CPT/HCPCS"
    }
    case ViewMetaConstants.APC_DATE_BINDED:{
        return "APC"
    }
    case ViewMetaConstants.CAPC_DATE_BINDED:{
        return "HCPCS"
    }
    case ViewMetaConstants.ZIP_5:{
        return "ZIP CODE"
    }
    case ViewMetaConstants.ZIP_5_DATE_BINDED:{
        return "ZIP CODE"
    }
    case ViewMetaConstants.ZIP_9:{
        return "ZIP CODE"
    }
    case ViewMetaConstants.ZIP_9_DATE_BINDED:{
        return "ZIP CODE"
    }
    case ViewMetaConstants.CLIENT_SPECIFIC:{
      return "Client Group Code"
      }
  }
}



export function SearchSecondLabel(source) {
    switch(source){
        case ViewMetaConstants.ADD_ON_CODES:{
            return "ADD ON CODE"
        }

        case ViewMetaConstants.CCI:{
            return "COLUMN II"
        }
    }
}
