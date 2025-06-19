import { GET_ALL_CRAWLER_DETAILS, GET_CRAWLER_CLASS, GET_FREQUENCY, GET_CRAWLER, SOURCE_NAME, CRAWLER_VALIDATION, URL, XPATHS, XPATHDELIMETER, 
  FREQUENCY, LAST_PUBLISHED_DATE, CRAWLER_CLASS, EMAILID, RESET_CRAWLER_STATE } from "../../ApiCalls/CrawlerApis/CrwalerActionType";

export interface CrawlerState {
  name: String,
  url: String,
  xpaths: String,
  xpathDelimiter: String,
  frequency: any,
  crawlerClass: any,
  emailIds: String,
  crawlers: any[];
  getAllCrawler: any[];
  getFrequency: any[];
  getCrawlerlass: any[];
  errors: {
    name: boolean,
    url: boolean,
    xpaths: boolean,
    xpathDelimeter: boolean,
    frequency: boolean,
    lastPublishedDate: boolean,
    crawlerClass: boolean,
    emailIds: boolean,
  }

}

const initialState: CrawlerState = {
  name: '',
  url: '',
  xpaths: '',
  xpathDelimiter: '',
  frequency: undefined,
  crawlerClass: undefined,
  emailIds: '',
  crawlers: [],
  getAllCrawler: [],
  getFrequency: [],
  getCrawlerlass: [],
  errors: {
    name: false,
    url: false,
    xpaths: false,
    xpathDelimeter: false,
    frequency: false,
    lastPublishedDate: false,
    crawlerClass: false,
    emailIds: false,
  }
};

export default function CrawlerReducer(
  state = initialState,
  action: { type: string; payload: any }
): CrawlerState {
  switch (action.type) {
    case GET_CRAWLER:
      return { ...state, crawlers: action.payload };
    case GET_ALL_CRAWLER_DETAILS:
      return { ...state, getAllCrawler: action.payload };
    case GET_FREQUENCY:
      return { ...state, getFrequency: action.payload };
    case GET_CRAWLER_CLASS:
      return { ...state, getCrawlerlass: action.payload };
    case SOURCE_NAME:
      return { ...state, name: action.payload, errors: { ...state.errors, name: false } };
    case URL:
      return { ...state, name: action.payload, errors: { ...state.errors, url: false } };
    case XPATHS:
      return { ...state, name: action.payload, errors: { ...state.errors, xpaths: false } };
    case XPATHDELIMETER:
      return { ...state, name: action.payload, errors: { ...state.errors, xpathDelimeter: false } };
    case FREQUENCY:
      return { ...state, name: action.payload, errors: { ...state.errors, frequency: false } };
    case LAST_PUBLISHED_DATE:
      return { ...state, name: action.payload, errors: { ...state.errors, lastPublishedDate: false } };
    case CRAWLER_CLASS:
      return { ...state, name: action.payload, errors: { ...state.errors, crawlerClass: false } };
    case EMAILID:
      return { ...state, name: action.payload, errors: { ...state.errors, emailIds: false } };
    case CRAWLER_VALIDATION:
      return { ...state, errors: action.payload };
    case RESET_CRAWLER_STATE:
      return{
        ...state,errors:initialState.errors
      }
    default:
      return state;
  }
}
