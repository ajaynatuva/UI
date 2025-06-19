import { configureStore } from '@reduxjs/toolkit';
import NewPolicyReducer from './reducers/NewPolicyTabReducers/NewPolicyReducer';
import ClaimReducer from './reducers/ClaimsReducer/ClaimReducer';
import CrawlerReducer from './reducers/CrawlerReducer/CrawlerReducer';
import CustomPolicyReducer from './reducers/CustomPolicyReducer/CustomPolicyReducer';
import ReferentialDataReducer from './reducers/ReferentialDataReducer/ReferentialDataReducer';
import TaskReducer from './reducers/TaskReducer/TaskReducer';
import TestingReportReducer from './reducers/TestingReportReducer/TestingReportReducer';
import UserReducers from './reducers/UserReducer/UserReducer';
import { persistReducer, persistStore } from 'redux-persist';
import MetaDataLoaderReducer from './reducers/MetaLoaderReducer/MetaDataLoaderReducer';
import AggridReducer from './reducers/AgGridReducer/AggridReducer';
import ClientPolicyReducer from './reducers/ClientPolicyReducer/ClientPolicyReducer';
// import LoadConfigStateReducer from './reducers/LoadLkpReducer/LoadConfigReducer';
import LookUpReducer from './reducers/LookUpReducer/LookUpReducer';
import NewClientSetUpReducer from './reducers/NewClientSetUpReducer/NewClientSetUpReducer';
import PolicyViewReducer from './reducers/PolicyViewReducer/PolicyViewReducer';
import SearchPolicyReducer from './reducers/SearchPolicyReducer/SearchPolicyReducer';
import SpinnerReducer from './reducers/SpinnerReducer/SpinnerReducer';
import sessionStorage from 'redux-persist/es/storage/session';
import NewPolicyFormFieldReducer from './reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer';
import DescriptionTabFieldReducer from './reducers/NewPolicyTabReducers/DescriptionTabFieldsReducer';
import { DetailsTabfieldsReducer } from './reducers/NewPolicyTabReducers/DetailsTabFieldsReducer';
import { ChangesTabFieldsReducer } from './reducers/NewPolicyTabReducers/ChangesTabFieldsReducer';
import CategoryReducer from './reducers/NewPolicyTabReducers/CategoryReducer';
import NewPolicyPopReducer from './reducers/NewPolicyTabReducers/NewPolicyPopReducer';
import DialogReducer from './reducers/DiaglogBoxReducer/DialogState';
import BillTypeTabReducer from './reducers/NewPolicyTabReducers/BillTypeReducer';
import { ConditionCodeTabFieldsReducer } from './reducers/NewPolicyTabReducers/ConditionCodeTabFieldsReducer';
import validatePolicyReducer from './reducers/NewPolicyTabReducers/ValidateFieldsReducer';
import TaxIdReducer from './reducers/NewPolicyTabReducers/TaxIdReducer';
import ClientAssignmentTabReducer from './reducers/NewPolicyTabReducers/ClientAssisgnmentTabReducer';
import NPIReducer from './reducers/NewPolicyTabReducers/NPIReducer';
import { DaignosisTabFieldsReducer } from './reducers/NewPolicyTabReducers/DiagnosisReducer';

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
};
//----------------------------------------------------------------------------------------
// store data in persistance to avoid data loss on refresh
const persistConfigForPolicy_Policy = { key: 'policyFieldsRedux', storage: sessionStorage };
const persistConfigForPolicy_DescTab = { key: 'DescTabFieldsRedux', storage: sessionStorage };
const persistConfigForPolicy_Details = { key: 'DetailsTabFieldsRedux', storage: sessionStorage };
const persistConfigForPolicy_Changes = { key: 'ChangesTabFieldsRedux', storage: sessionStorage };
const persistConfigForPolicy_Condition = { key: 'conditionCodeTabFieldsRedux', storage: sessionStorage };
const persistConfigForPolicy_BillTypeTab = { key: 'billTypeTabFieldsRedux', storage: sessionStorage };
const persistConfigForPolicy_ClientAssignmentTab = { key: 'clientAssignmentTabRedux', storage: sessionStorage };
const persistConfigForPolicy_CatTab = { key: 'catTabRedux', storage: sessionStorage };

const policyPersistancedReducer = persistReducer(persistConfigForPolicy_Policy, NewPolicyFormFieldReducer);
const DescTabPersistancedReducer = persistReducer(persistConfigForPolicy_DescTab, DescriptionTabFieldReducer);
const DetailsTabPersistancedReducer = persistReducer(persistConfigForPolicy_Details, DetailsTabfieldsReducer);
const ChangesTabPersistancedReducer = persistReducer(persistConfigForPolicy_Changes, ChangesTabFieldsReducer);
const ConditionCodeTabPersistancedReducer = persistReducer(persistConfigForPolicy_Condition, ConditionCodeTabFieldsReducer);
const billTypeTTabPersistancedReducer = persistReducer(persistConfigForPolicy_BillTypeTab, BillTypeTabReducer);
const clientAssignmentTabPersistancedReducer = persistReducer(persistConfigForPolicy_ClientAssignmentTab, ClientAssignmentTabReducer);
const catTabPersistancedReducer = persistReducer(persistConfigForPolicy_CatTab, CategoryReducer);

//--------------------------------------------------------------------------------------  

const crawlerPersistedReducer = persistReducer(persistConfig, CrawlerReducer);
const TasksReducer = persistReducer(persistConfig, TaskReducer);
const userPersistReducer = persistReducer(persistConfig, UserReducers);
const claimReducers = persistReducer(persistConfig, ClaimReducer);
const testingReducer = persistReducer(persistConfig, TestingReportReducer);
const ReferentialReducer = persistReducer(persistConfig,ReferentialDataReducer);
const customPolicyReducer = persistReducer(persistConfig, CustomPolicyReducer);
const newPolicyPopCreationReducer = persistReducer(persistConfig,NewPolicyPopReducer);

export const store = configureStore({
  reducer: {
    newPolicy: NewPolicyReducer,
    policyFieldsRedux: policyPersistancedReducer,
    DescTabFieldsRedux: DescTabPersistancedReducer,
    DetailsTabFieldsRedux: DetailsTabPersistancedReducer,
    ChangesTabFieldsRedux: ChangesTabPersistancedReducer,
    catTabFieldsRedux: catTabPersistancedReducer,
    validatePolicyFieldsRedux: validatePolicyReducer,
    conditionCodeTabFieldsRedux: ConditionCodeTabPersistancedReducer,
    billTypeTabFieldsRedux: billTypeTTabPersistancedReducer,
    clientAssignmentTabFieldsRedux: clientAssignmentTabPersistancedReducer,
    // newPolicyForm: persistedReducer,
    TaxIdFieldsRedux: TaxIdReducer,
    NPIFieldsRedux: NPIReducer,
    DiagnosisFieldsRedux: DaignosisTabFieldsReducer,
    metaDataLoader: MetaDataLoaderReducer,
    // loadConfigLoader: LoadConfigStateReducer,
    taskReducer: TasksReducer,
    crawlerReducer: crawlerPersistedReducer,
    userReducer: userPersistReducer,
    lookupReducer: LookUpReducer,
    testingReportReducer: testingReducer,
    spinnerReducer: SpinnerReducer,
    searchPolicyReducer: SearchPolicyReducer,
    claimReducer: claimReducers,
    policyViewReducer: PolicyViewReducer,
    gridState: AggridReducer,
    clientPolicy: ClientPolicyReducer,
    ReferentialDataReducer: ReferentialReducer,
    customPolicy: customPolicyReducer,
    policyCreation: newPolicyPopCreationReducer,
    newClientSetUp: NewClientSetUpReducer,
    diaglogBoxReducer: DialogReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
export const persistor = persistStore(store);
