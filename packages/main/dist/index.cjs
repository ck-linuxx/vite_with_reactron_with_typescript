"use strict";
var require$$1 = require("electron");
var require$$1$1 = require("path");
var require$$2 = require("url");
function _interopNamespace(e) {
  if (e && e.__esModule)
    return e;
  var n = { __proto__: null, [Symbol.toStringTag]: "Module" };
  if (e) {
    Object.keys(e).forEach(function(k) {
      if (k !== "default") {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function() {
            return e[k];
          }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}
const ALLOWED_ORIGINS_AND_PERMISSIONS = new Map([[new require$$2.URL("http://localhost:3000/").origin, new Set()]]);
const ALLOWED_EXTERNAL_ORIGINS = new Set([
  "https://github.com"
]);
require$$1.app.on("web-contents-created", (_, contents) => {
  contents.on("will-navigate", (event, url) => {
    const { origin } = new require$$2.URL(url);
    if (ALLOWED_ORIGINS_AND_PERMISSIONS.has(origin)) {
      return;
    }
    event.preventDefault();
    {
      console.warn("Blocked navigating to an unallowed origin:", origin);
    }
  });
  contents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    var _a;
    const { origin } = new require$$2.URL(webContents.getURL());
    const permissionGranted = !!((_a = ALLOWED_ORIGINS_AND_PERMISSIONS.get(origin)) == null ? void 0 : _a.has(permission));
    callback(permissionGranted);
    if (!permissionGranted && true) {
      console.warn(`${origin} requested permission for '${permission}', but was blocked.`);
    }
  });
  contents.setWindowOpenHandler(({ url }) => {
    const { origin } = new require$$2.URL(url);
    if (ALLOWED_EXTERNAL_ORIGINS.has(origin)) {
      require$$1.shell.openExternal(url).catch(console.error);
    } else {
      console.warn("Blocked the opening of an unallowed origin:", origin);
    }
    return { action: "deny" };
  });
  contents.on("will-attach-webview", (event, webPreferences, params) => {
    const { origin } = new require$$2.URL(params.src);
    if (!ALLOWED_ORIGINS_AND_PERMISSIONS.has(origin)) {
      {
        console.warn(`A webview tried to attach ${params.src}, but was blocked.`);
      }
      event.preventDefault();
      return;
    }
    delete webPreferences.preload;
    delete webPreferences.preloadURL;
    webPreferences.nodeIntegration = false;
  });
});
let mainWindow = null;
async function createOrRestoreWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMinimized())
      mainWindow.restore();
    mainWindow.focus();
    return;
  }
  mainWindow = new require$$1.BrowserWindow({
    show: false,
    webPreferences: {
      nativeWindowOpen: true,
      webviewTag: false,
      preload: require$$1$1.join(__dirname, "../../preload/dist/index.cjs")
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow == null ? void 0 : mainWindow.show();
    {
      mainWindow == null ? void 0 : mainWindow.webContents.openDevTools();
    }
  });
  const pageUrl = "http://localhost:3000/";
  await mainWindow.loadURL(pageUrl);
}
const isSingleInstance = require$$1.app.requestSingleInstanceLock();
if (!isSingleInstance) {
  require$$1.app.quit();
  process.exit(0);
}
require$$1.app.on("second-instance", createOrRestoreWindow);
require$$1.app.disableHardwareAcceleration();
require$$1.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    require$$1.app.quit();
  }
});
require$$1.app.whenReady().then(createOrRestoreWindow).catch((e) => console.error("Failed create window:", e));
{
  require$$1.app.whenReady().then(() => Promise.resolve().then(function() {
    return /* @__PURE__ */ _interopNamespace(require("electron-devtools-installer"));
  })).then(({ default: installExtension, VUEJS3_DEVTOOLS }) => installExtension(VUEJS3_DEVTOOLS, {
    loadExtensionOptions: {
      allowFileAccess: true
    }
  })).catch((e) => console.error("Failed install extension:", e));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY2pzIiwic291cmNlcyI6WyIuLi9zcmMvc2VjdXJpdHktcmVzdHJpY3Rpb25zLnRzIiwiLi4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXBwLCBzaGVsbH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IHtVUkx9IGZyb20gJ3VybCc7XG5cbi8qKlxuICogTGlzdCBvZiBvcmlnaW5zIHRoYXQgeW91IGFsbG93IG9wZW4gSU5TSURFIHRoZSBhcHBsaWNhdGlvbiBhbmQgcGVybWlzc2lvbnMgZm9yIGVhY2ggb2YgdGhlbS5cbiAqXG4gKiBJbiBkZXZlbG9wbWVudCBtb2RlIHlvdSBuZWVkIGFsbG93IG9wZW4gYFZJVEVfREVWX1NFUlZFUl9VUkxgXG4gKi9cbmNvbnN0IEFMTE9XRURfT1JJR0lOU19BTkRfUEVSTUlTU0lPTlMgPSBuZXcgTWFwPHN0cmluZywgU2V0PCdjbGlwYm9hcmQtcmVhZCcgfCAnbWVkaWEnIHwgJ2Rpc3BsYXktY2FwdHVyZScgfCAnbWVkaWFLZXlTeXN0ZW0nIHwgJ2dlb2xvY2F0aW9uJyB8ICdub3RpZmljYXRpb25zJyB8ICdtaWRpJyB8ICdtaWRpU3lzZXgnIHwgJ3BvaW50ZXJMb2NrJyB8ICdmdWxsc2NyZWVuJyB8ICdvcGVuRXh0ZXJuYWwnIHwgJ3Vua25vd24nPj4oXG4gIGltcG9ydC5tZXRhLmVudi5ERVYgJiYgaW1wb3J0Lm1ldGEuZW52LlZJVEVfREVWX1NFUlZFUl9VUkxcbiAgICA/IFtbbmV3IFVSTChpbXBvcnQubWV0YS5lbnYuVklURV9ERVZfU0VSVkVSX1VSTCkub3JpZ2luLCBuZXcgU2V0XV1cbiAgICA6IFtdLFxuKTtcblxuLyoqXG4gKiBMaXN0IG9mIG9yaWdpbnMgdGhhdCB5b3UgYWxsb3cgb3BlbiBJTiBCUk9XU0VSLlxuICogTmF2aWdhdGlvbiB0byBvcmlnaW5zIGJlbG93IGlzIHBvc3NpYmxlIG9ubHkgaWYgdGhlIGxpbmsgb3BlbnMgaW4gYSBuZXcgd2luZG93XG4gKlxuICogQGV4YW1wbGVcbiAqIDxhXG4gKiAgIHRhcmdldD1cIl9ibGFua1wiXG4gKiAgIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vXCJcbiAqID5cbiAqL1xuY29uc3QgQUxMT1dFRF9FWFRFUk5BTF9PUklHSU5TID0gbmV3IFNldDxgaHR0cHM6Ly8ke3N0cmluZ31gPihbXG4gICdodHRwczovL2dpdGh1Yi5jb20nLFxuXSk7XG5cblxuYXBwLm9uKCd3ZWItY29udGVudHMtY3JlYXRlZCcsIChfLCBjb250ZW50cykgPT4ge1xuXG4gIC8qKlxuICAgKiBCbG9jayBuYXZpZ2F0aW9uIHRvIG9yaWdpbnMgbm90IG9uIHRoZSBhbGxvd2xpc3QuXG4gICAqXG4gICAqIE5hdmlnYXRpb24gaXMgYSBjb21tb24gYXR0YWNrIHZlY3Rvci4gSWYgYW4gYXR0YWNrZXIgY2FuIGNvbnZpbmNlIHRoZSBhcHAgdG8gbmF2aWdhdGUgYXdheVxuICAgKiBmcm9tIGl0cyBjdXJyZW50IHBhZ2UsIHRoZXkgY2FuIHBvc3NpYmx5IGZvcmNlIHRoZSBhcHAgdG8gb3BlbiB3ZWIgc2l0ZXMgb24gdGhlIEludGVybmV0LlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vd3d3LmVsZWN0cm9uanMub3JnL2RvY3MvbGF0ZXN0L3R1dG9yaWFsL3NlY3VyaXR5IzEzLWRpc2FibGUtb3ItbGltaXQtbmF2aWdhdGlvblxuICAgKi9cbiAgY29udGVudHMub24oJ3dpbGwtbmF2aWdhdGUnLCAoZXZlbnQsIHVybCkgPT4ge1xuICAgIGNvbnN0IHtvcmlnaW59ID0gbmV3IFVSTCh1cmwpO1xuICAgIGlmIChBTExPV0VEX09SSUdJTlNfQU5EX1BFUk1JU1NJT05TLmhhcyhvcmlnaW4pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUHJldmVudCBuYXZpZ2F0aW9uXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmIChpbXBvcnQubWV0YS5lbnYuREVWKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0Jsb2NrZWQgbmF2aWdhdGluZyB0byBhbiB1bmFsbG93ZWQgb3JpZ2luOicsIG9yaWdpbik7XG4gICAgfVxuICB9KTtcblxuXG4gIC8qKlxuICAgKiBCbG9jayByZXF1ZXN0ZWQgdW5hbGxvd2VkIHBlcm1pc3Npb25zLlxuICAgKiBCeSBkZWZhdWx0LCBFbGVjdHJvbiB3aWxsIGF1dG9tYXRpY2FsbHkgYXBwcm92ZSBhbGwgcGVybWlzc2lvbiByZXF1ZXN0cy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL3d3dy5lbGVjdHJvbmpzLm9yZy9kb2NzL2xhdGVzdC90dXRvcmlhbC9zZWN1cml0eSM1LWhhbmRsZS1zZXNzaW9uLXBlcm1pc3Npb24tcmVxdWVzdHMtZnJvbS1yZW1vdGUtY29udGVudFxuICAgKi9cbiAgY29udGVudHMuc2Vzc2lvbi5zZXRQZXJtaXNzaW9uUmVxdWVzdEhhbmRsZXIoKHdlYkNvbnRlbnRzLCBwZXJtaXNzaW9uLCBjYWxsYmFjaykgPT4ge1xuICAgIGNvbnN0IHtvcmlnaW59ID0gbmV3IFVSTCh3ZWJDb250ZW50cy5nZXRVUkwoKSk7XG5cbiAgICBjb25zdCBwZXJtaXNzaW9uR3JhbnRlZCA9ICEhQUxMT1dFRF9PUklHSU5TX0FORF9QRVJNSVNTSU9OUy5nZXQob3JpZ2luKT8uaGFzKHBlcm1pc3Npb24pO1xuICAgIGNhbGxiYWNrKHBlcm1pc3Npb25HcmFudGVkKTtcblxuICAgIGlmICghcGVybWlzc2lvbkdyYW50ZWQgJiYgaW1wb3J0Lm1ldGEuZW52LkRFVikge1xuICAgICAgY29uc29sZS53YXJuKGAke29yaWdpbn0gcmVxdWVzdGVkIHBlcm1pc3Npb24gZm9yICcke3Blcm1pc3Npb259JywgYnV0IHdhcyBibG9ja2VkLmApO1xuICAgIH1cbiAgfSk7XG5cblxuICAvKipcbiAgICogSHlwZXJsaW5rcyB0byBhbGxvd2VkIHNpdGVzIG9wZW4gaW4gdGhlIGRlZmF1bHQgYnJvd3Nlci5cbiAgICpcbiAgICogVGhlIGNyZWF0aW9uIG9mIG5ldyBgd2ViQ29udGVudHNgIGlzIGEgY29tbW9uIGF0dGFjayB2ZWN0b3IuIEF0dGFja2VycyBhdHRlbXB0IHRvIGNvbnZpbmNlIHRoZSBhcHAgdG8gY3JlYXRlIG5ldyB3aW5kb3dzLFxuICAgKiBmcmFtZXMsIG9yIG90aGVyIHJlbmRlcmVyIHByb2Nlc3NlcyB3aXRoIG1vcmUgcHJpdmlsZWdlcyB0aGFuIHRoZXkgaGFkIGJlZm9yZTsgb3Igd2l0aCBwYWdlcyBvcGVuZWQgdGhhdCB0aGV5IGNvdWxkbid0IG9wZW4gYmVmb3JlLlxuICAgKiBZb3Ugc2hvdWxkIGRlbnkgYW55IHVuZXhwZWN0ZWQgd2luZG93IGNyZWF0aW9uLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vd3d3LmVsZWN0cm9uanMub3JnL2RvY3MvbGF0ZXN0L3R1dG9yaWFsL3NlY3VyaXR5IzE0LWRpc2FibGUtb3ItbGltaXQtY3JlYXRpb24tb2YtbmV3LXdpbmRvd3NcbiAgICogQHNlZSBodHRwczovL3d3dy5lbGVjdHJvbmpzLm9yZy9kb2NzL2xhdGVzdC90dXRvcmlhbC9zZWN1cml0eSMxNS1kby1ub3QtdXNlLW9wZW5leHRlcm5hbC13aXRoLXVudHJ1c3RlZC1jb250ZW50XG4gICAqL1xuICBjb250ZW50cy5zZXRXaW5kb3dPcGVuSGFuZGxlcigoe3VybH0pID0+IHtcbiAgICBjb25zdCB7b3JpZ2lufSA9IG5ldyBVUkwodXJsKTtcblxuICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgVHlwZSBjaGVja2luZyBpcyBwZXJmb3JtZWQgaW4gcnVudGltZVxuICAgIGlmIChBTExPV0VEX0VYVEVSTkFMX09SSUdJTlMuaGFzKG9yaWdpbikpIHtcbiAgICAgIC8vIE9wZW4gZGVmYXVsdCBicm93c2VyXG4gICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwodXJsKS5jYXRjaChjb25zb2xlLmVycm9yKTtcblxuICAgIH0gZWxzZSBpZiAoaW1wb3J0Lm1ldGEuZW52LkRFVikge1xuICAgICAgY29uc29sZS53YXJuKCdCbG9ja2VkIHRoZSBvcGVuaW5nIG9mIGFuIHVuYWxsb3dlZCBvcmlnaW46Jywgb3JpZ2luKTtcbiAgICB9XG5cbiAgICAvLyBQcmV2ZW50IGNyZWF0aW5nIG5ldyB3aW5kb3cgaW4gYXBwbGljYXRpb25cbiAgICByZXR1cm4ge2FjdGlvbjogJ2RlbnknfTtcbiAgfSk7XG5cblxuICAvKipcbiAgICogVmVyaWZ5IHdlYnZpZXcgb3B0aW9ucyBiZWZvcmUgY3JlYXRpb25cbiAgICpcbiAgICogU3RyaXAgYXdheSBwcmVsb2FkIHNjcmlwdHMsIGRpc2FibGUgTm9kZS5qcyBpbnRlZ3JhdGlvbiwgYW5kIGVuc3VyZSBvcmlnaW5zIGFyZSBvbiB0aGUgYWxsb3dsaXN0LlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vd3d3LmVsZWN0cm9uanMub3JnL2RvY3MvbGF0ZXN0L3R1dG9yaWFsL3NlY3VyaXR5IzEyLXZlcmlmeS13ZWJ2aWV3LW9wdGlvbnMtYmVmb3JlLWNyZWF0aW9uXG4gICAqL1xuICBjb250ZW50cy5vbignd2lsbC1hdHRhY2gtd2VidmlldycsIChldmVudCwgd2ViUHJlZmVyZW5jZXMsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHtvcmlnaW59ID0gbmV3IFVSTChwYXJhbXMuc3JjKTtcbiAgICBpZiAoIUFMTE9XRURfT1JJR0lOU19BTkRfUEVSTUlTU0lPTlMuaGFzKG9yaWdpbikpIHtcblxuICAgICAgaWYgKGltcG9ydC5tZXRhLmVudi5ERVYpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBBIHdlYnZpZXcgdHJpZWQgdG8gYXR0YWNoICR7cGFyYW1zLnNyY30sIGJ1dCB3YXMgYmxvY2tlZC5gKTtcbiAgICAgIH1cblxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBTdHJpcCBhd2F5IHByZWxvYWQgc2NyaXB0cyBpZiB1bnVzZWQgb3IgdmVyaWZ5IHRoZWlyIGxvY2F0aW9uIGlzIGxlZ2l0aW1hdGVcbiAgICBkZWxldGUgd2ViUHJlZmVyZW5jZXMucHJlbG9hZDtcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIGBwcmVsb2FkVVJMYCBleGlzdHMgLSBzZWUgaHR0cHM6Ly93d3cuZWxlY3Ryb25qcy5vcmcvZG9jcy9sYXRlc3QvYXBpL3dlYi1jb250ZW50cyNldmVudC13aWxsLWF0dGFjaC13ZWJ2aWV3XG4gICAgZGVsZXRlIHdlYlByZWZlcmVuY2VzLnByZWxvYWRVUkw7XG5cbiAgICAvLyBEaXNhYmxlIE5vZGUuanMgaW50ZWdyYXRpb25cbiAgICB3ZWJQcmVmZXJlbmNlcy5ub2RlSW50ZWdyYXRpb24gPSBmYWxzZTtcbiAgfSk7XG59KTtcbiIsImltcG9ydCB7YXBwLCBCcm93c2VyV2luZG93fSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQge2pvaW59IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtVUkx9IGZyb20gJ3VybCc7XG5pbXBvcnQgJy4vc2VjdXJpdHktcmVzdHJpY3Rpb25zJztcblxuXG5sZXQgbWFpbldpbmRvdzogQnJvd3NlcldpbmRvdyB8IG51bGwgPSBudWxsO1xuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVPclJlc3RvcmVXaW5kb3coKSB7XG4gIC8vIElmIHdpbmRvdyBhbHJlYWR5IGV4aXN0IGp1c3Qgc2hvdyBpdFxuICBpZiAobWFpbldpbmRvdyAmJiAhbWFpbldpbmRvdy5pc0Rlc3Ryb3llZCgpKSB7XG4gICAgaWYgKG1haW5XaW5kb3cuaXNNaW5pbWl6ZWQoKSkgbWFpbldpbmRvdy5yZXN0b3JlKCk7XG4gICAgbWFpbldpbmRvdy5mb2N1cygpO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbWFpbldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHtcbiAgICBzaG93OiBmYWxzZSwgLy8gVXNlICdyZWFkeS10by1zaG93JyBldmVudCB0byBzaG93IHdpbmRvd1xuICAgIHdlYlByZWZlcmVuY2VzOiB7XG4gICAgICBuYXRpdmVXaW5kb3dPcGVuOiB0cnVlLFxuICAgICAgd2Vidmlld1RhZzogZmFsc2UsIC8vIFRoZSB3ZWJ2aWV3IHRhZyBpcyBub3QgcmVjb21tZW5kZWQuIENvbnNpZGVyIGFsdGVybmF0aXZlcyBsaWtlIGlmcmFtZSBvciBFbGVjdHJvbidzIEJyb3dzZXJWaWV3LiBodHRwczovL3d3dy5lbGVjdHJvbmpzLm9yZy9kb2NzL2xhdGVzdC9hcGkvd2Vidmlldy10YWcjd2FybmluZ1xuICAgICAgcHJlbG9hZDogam9pbihfX2Rpcm5hbWUsICcuLi8uLi9wcmVsb2FkL2Rpc3QvaW5kZXguY2pzJyksXG4gICAgfSxcbiAgfSk7XG5cbiAgLyoqXG4gICAqIElmIHlvdSBpbnN0YWxsIGBzaG93OiB0cnVlYCB0aGVuIGl0IGNhbiBjYXVzZSBpc3N1ZXMgd2hlbiB0cnlpbmcgdG8gY2xvc2UgdGhlIHdpbmRvdy5cbiAgICogVXNlIGBzaG93OiBmYWxzZWAgYW5kIGxpc3RlbmVyIGV2ZW50cyBgcmVhZHktdG8tc2hvd2AgdG8gZml4IHRoZXNlIGlzc3Vlcy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vZWxlY3Ryb24vZWxlY3Ryb24vaXNzdWVzLzI1MDEyXG4gICAqL1xuICBtYWluV2luZG93Lm9uKCdyZWFkeS10by1zaG93JywgKCkgPT4ge1xuICAgIG1haW5XaW5kb3c/LnNob3coKTtcblxuICAgIGlmIChpbXBvcnQubWV0YS5lbnYuREVWKSB7XG4gICAgICBtYWluV2luZG93Py53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBVUkwgZm9yIG1haW4gd2luZG93LlxuICAgKiBWaXRlIGRldiBzZXJ2ZXIgZm9yIGRldmVsb3BtZW50LlxuICAgKiBgZmlsZTovLy4uL3JlbmRlcmVyL2luZGV4Lmh0bWxgIGZvciBwcm9kdWN0aW9uIGFuZCB0ZXN0XG4gICAqL1xuICBjb25zdCBwYWdlVXJsID0gaW1wb3J0Lm1ldGEuZW52LkRFViAmJiBpbXBvcnQubWV0YS5lbnYuVklURV9ERVZfU0VSVkVSX1VSTCAhPT0gdW5kZWZpbmVkXG4gICAgPyBpbXBvcnQubWV0YS5lbnYuVklURV9ERVZfU0VSVkVSX1VSTFxuICAgIDogbmV3IFVSTCgnLi4vcmVuZGVyZXIvZGlzdC9pbmRleC5odG1sJywgJ2ZpbGU6Ly8nICsgX19kaXJuYW1lKS50b1N0cmluZygpO1xuXG5cbiAgYXdhaXQgbWFpbldpbmRvdy5sb2FkVVJMKHBhZ2VVcmwpO1xufVxuXG5cbi8qKlxuICogUHJldmVudCBtdWx0aXBsZSBpbnN0YW5jZXNcbiAqL1xuY29uc3QgaXNTaW5nbGVJbnN0YW5jZSA9IGFwcC5yZXF1ZXN0U2luZ2xlSW5zdGFuY2VMb2NrKCk7XG5pZiAoIWlzU2luZ2xlSW5zdGFuY2UpIHtcbiAgYXBwLnF1aXQoKTtcbiAgcHJvY2Vzcy5leGl0KDApO1xufVxuYXBwLm9uKCdzZWNvbmQtaW5zdGFuY2UnLCBjcmVhdGVPclJlc3RvcmVXaW5kb3cpO1xuXG5cbi8qKlxuICogRGlzYWJsZSBIYXJkd2FyZSBBY2NlbGVyYXRpb24gZm9yIG1vcmUgcG93ZXItc2F2ZVxuICovXG5hcHAuZGlzYWJsZUhhcmR3YXJlQWNjZWxlcmF0aW9uKCk7XG5cbi8qKlxuICogU2hvdXQgZG93biBiYWNrZ3JvdW5kIHByb2Nlc3MgaWYgYWxsIHdpbmRvd3Mgd2FzIGNsb3NlZFxuICovXG5hcHAub24oJ3dpbmRvdy1hbGwtY2xvc2VkJywgKCkgPT4ge1xuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ2RhcndpbicpIHtcbiAgICBhcHAucXVpdCgpO1xuICB9XG59KTtcblxuXG4vKipcbiAqIENyZWF0ZSBhcHAgd2luZG93IHdoZW4gYmFja2dyb3VuZCBwcm9jZXNzIGJlIHJlYWR5XG4gKi9cbmFwcC53aGVuUmVhZHkoKVxuICAudGhlbihjcmVhdGVPclJlc3RvcmVXaW5kb3cpXG4gIC5jYXRjaCgoZSkgPT4gY29uc29sZS5lcnJvcignRmFpbGVkIGNyZWF0ZSB3aW5kb3c6JywgZSkpO1xuXG5cbi8qKlxuICogSW5zdGFsbCBWdWUuanMgb3Igc29tZSBvdGhlciBkZXZ0b29scyBpbiBkZXZlbG9wbWVudCBtb2RlIG9ubHlcbiAqL1xuaWYgKGltcG9ydC5tZXRhLmVudi5ERVYpIHtcbiAgYXBwLndoZW5SZWFkeSgpXG4gICAgLnRoZW4oKCkgPT4gaW1wb3J0KCdlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXInKSlcbiAgICAudGhlbigoe2RlZmF1bHQ6IGluc3RhbGxFeHRlbnNpb24sIFZVRUpTM19ERVZUT09MU30pID0+IGluc3RhbGxFeHRlbnNpb24oVlVFSlMzX0RFVlRPT0xTLCB7XG4gICAgICBsb2FkRXh0ZW5zaW9uT3B0aW9uczoge1xuICAgICAgICBhbGxvd0ZpbGVBY2Nlc3M6IHRydWUsXG4gICAgICB9LFxuICAgIH0pKVxuICAgIC5jYXRjaChlID0+IGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCBpbnN0YWxsIGV4dGVuc2lvbjonLCBlKSk7XG59XG5cbi8qKlxuICogQ2hlY2sgbmV3IGFwcCB2ZXJzaW9uIGluIHByb2R1Y3Rpb24gbW9kZSBvbmx5XG4gKi9cbmlmIChpbXBvcnQubWV0YS5lbnYuUFJPRCkge1xuICBhcHAud2hlblJlYWR5KClcbiAgICAudGhlbigoKSA9PiBpbXBvcnQoJ2VsZWN0cm9uLXVwZGF0ZXInKSlcbiAgICAudGhlbigoe2F1dG9VcGRhdGVyfSkgPT4gYXV0b1VwZGF0ZXIuY2hlY2tGb3JVcGRhdGVzQW5kTm90aWZ5KCkpXG4gICAgLmNhdGNoKChlKSA9PiBjb25zb2xlLmVycm9yKCdGYWlsZWQgY2hlY2sgdXBkYXRlczonLCBlKSk7XG59XG5cbiJdLCJuYW1lcyI6WyJVUkwiLCJhcHAiLCJCcm93c2VyV2luZG93Iiwiam9pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUUEsTUFBTSxrQ0FBa0MsSUFBSSxJQUV0QyxDQUFDLENBQUMsSUFBSUEsZUFBSSwwQkFBcUMsUUFBUSxJQUFJO0FBY2pFLE1BQU0sMkJBQTJCLElBQUksSUFBeUI7QUFBQSxFQUM1RDtBQUFBO0FBSUZDLGVBQUksR0FBRyx3QkFBd0IsQ0FBQyxHQUFHLGFBQWE7V0FVckMsR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLFFBQVE7VUFDckMsRUFBQyxXQUFVLElBQUlELGVBQUk7UUFDckIsZ0NBQWdDLElBQUksU0FBUzs7O1VBSzNDO0FBRW1CO2NBQ2YsS0FBSyw4Q0FBOEM7QUFBQTtBQUFBO1dBV3RELFFBQVEsNEJBQTRCLENBQUMsYUFBYSxZQUFZLGFBQWE7O1VBQzVFLEVBQUMsV0FBVSxJQUFJQSxlQUFJLFlBQVk7VUFFL0Isb0JBQW9CLENBQUMsQ0FBQyx1Q0FBZ0MsSUFBSSxZQUFwQyxtQkFBNkMsSUFBSTthQUNwRTtRQUVMLENBQUMscUJBQXFCLE1BQXFCO2NBQ3JDLEtBQUssR0FBRyxvQ0FBb0M7QUFBQTtBQUFBO1dBZS9DLHFCQUFxQixDQUFDLEVBQUMsVUFBUztVQUNqQyxFQUFDLFdBQVUsSUFBSUEsZUFBSTtRQUdyQix5QkFBeUIsSUFBSSxTQUFTO3VCQUVsQyxhQUFhLEtBQUssTUFBTSxRQUFRO0FBQUEsV0FFUjtjQUN0QixLQUFLLCtDQUErQztBQUFBO1dBSXZELEVBQUMsUUFBUTtBQUFBO1dBV1QsR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLGdCQUFnQixXQUFXO1VBQzlELEVBQUMsV0FBVSxJQUFJQSxlQUFJLE9BQU87UUFDNUIsQ0FBQyxnQ0FBZ0MsSUFBSSxTQUFTO0FBRXZCO2dCQUNmLEtBQUssNkJBQTZCLE9BQU87QUFBQTtZQUc3Qzs7O1dBS0QsZUFBZTtXQUVmLGVBQWU7bUJBR1Asa0JBQWtCO0FBQUE7QUFBQTtBQ3RIckMsSUFBSSxhQUFtQztBQUV2Qyx1Q0FBdUM7TUFFakMsY0FBYyxDQUFDLFdBQVcsZUFBZTtRQUN2QyxXQUFXO2lCQUEwQjtlQUM5Qjs7O2VBS0EsSUFBSUUseUJBQWM7QUFBQSxJQUM3QixNQUFNO0FBQUEsSUFDTixnQkFBZ0I7QUFBQSxNQUNkLGtCQUFrQjtBQUFBLE1BQ2xCLFlBQVk7QUFBQSxNQUNaLFNBQVNDLGtCQUFLLFdBQVc7QUFBQTtBQUFBO2FBVWxCLEdBQUcsaUJBQWlCLE1BQU07NkNBQ3ZCO0FBRWE7K0NBQ1gsWUFBWTtBQUFBO0FBQUE7UUFTdEIsVUFDRjtRQUlFLFdBQVcsUUFBUTtBQUFBO0FBTzNCLE1BQU0sbUJBQW1CRixlQUFJO0FBQzdCLElBQUksQ0FBQyxrQkFBa0I7aUJBQ2pCO1VBQ0ksS0FBSztBQUFBO0FBRWZBLGVBQUksR0FBRyxtQkFBbUI7QUFNMUJBLGVBQUk7QUFLSkEsZUFBSSxHQUFHLHFCQUFxQixNQUFNO01BQzVCLFFBQVEsYUFBYSxVQUFVO21CQUM3QjtBQUFBO0FBQUE7QUFRUkEsZUFBSSxZQUNELEtBQUssdUJBQ0wsTUFBTSxDQUFDLE1BQU0sUUFBUSxNQUFNLHlCQUF5QjtBQU05QjtpQkFDbkIsWUFDRCxLQUFLLE1BQU07cURBQU87QUFBQSxNQUNsQixLQUFLLENBQUMsRUFBQyxTQUFTLGtCQUFrQixzQkFBcUIsaUJBQWlCLGlCQUFpQjtBQUFBLElBQ3hGLHNCQUFzQjtBQUFBLE1BQ3BCLGlCQUFpQjtBQUFBO0FBQUEsTUFHcEIsTUFBTSxPQUFLLFFBQVEsTUFBTSw2QkFBNkI7QUFBQTsifQ==
