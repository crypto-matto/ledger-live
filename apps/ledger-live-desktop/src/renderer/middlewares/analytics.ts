import { start } from "~/renderer/analytics/segment";
let isAnalyticsStarted = false;
export default (store: any) => (next: any) => (action: any) => {
  next(action);
  if (!isAnalyticsStarted) {
    isAnalyticsStarted = true;
    start(store);
  }
};
