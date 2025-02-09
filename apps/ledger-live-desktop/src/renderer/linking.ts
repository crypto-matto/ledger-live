import { track } from "~/renderer/analytics/segment";
import electron from "electron";
let shell;
if (!process.env.STORYBOOK_ENV) {
  shell = electron.shell;
}
export const openURL = (url: string, customEventName = "OpenURL", extraParams: object = {}) => {
  if (customEventName) {
    track(customEventName, {
      ...extraParams,
      url,
    });
  }
  shell && shell.openExternal(url);
};
