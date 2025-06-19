
export const AccessForExport=(exportData, role)=>{
    let flag=false;
    if(role >0 ){
      
      if(exportData.length >0){
      flag = true;
      }  
    }else{
      flag = false;
    }
    return flag;
}