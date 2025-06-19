import { default as moment, default as Moment } from 'moment';
import { getClientSpecficCodesReferentialData } from '../../redux/ApiCalls/ReferentialDataApi/ReferentialDataApis';

export const ClientSpecficCodesReferentialData = async (
  dispatch,
  taskStates,
  clientExclusionState
) => {
  let rows = [];
  let clientSpecificCodes = {};

  function GetClientGroupName(id) {
    let clientGroupName = '';
    const d = clientExclusionState.getClientExclusion?.find(
      (a) => a.clientGroupId === id
    );
    if (d != undefined) {
      clientGroupName = d.clientGroupName;
    }
    return clientGroupName;
  }

  function GetClientCode(id) {
    let clientGroupCode = '';
    const d = clientExclusionState.getClientExclusion?.find(
      (a) => a.clientGroupId === id
    );
    if (d != undefined) {
      clientGroupCode = d.clientGroupCode;
    }
    return clientGroupCode;
  }
  let flag = true;
  function GetClientId(clientGroupCode) {
    let clientGroupId = '';
    clientExclusionState.getClientExclusion.forEach((k, l) => {
      if (k.clientGroupCode === clientGroupCode) {
        clientGroupId = k.clientGroupId;
      }
    });
    if (clientGroupCode !== '' && clientGroupId === '') {
      flag = false;
    }
    return clientGroupId;
  }

  clientSpecificCodes = {
    clientGroupId: taskStates.selectedCptCode ? GetClientId(taskStates.selectedCptCode):'',
  };
  if (flag === true) {
    let data = await getClientSpecficCodesReferentialData(
      dispatch,
      clientSpecificCodes
    );
    let mappedData = data.map((ad) => {
      return {
        // clientGroupId: ad.clientGroupId,
        ClientCode: GetClientCode(ad.clientGroupId),
        ClientGroupName: GetClientGroupName(ad.clientGroupId),
        cptCode: ad.cptCode,
        description: ad.description,
        startDate: moment(ad.startDate).format('MM-DD-YYYY'),
        endDate: moment(ad.endDate).format('MM-DD-YYYY'),
        createDate: moment(ad.createDate).format('MM-DD-YYYY'),
        updateDate: moment(ad.updateDate).format('MM-DD-YYYY'),
      };
    });

    rows = mappedData;
    return rows;
  }
};
export default ClientSpecficCodesReferentialData;
