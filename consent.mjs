export const CONSENT_STORAGE_KEY = "survivus-cookie-consent";
export const CONSENT_ACCEPTED = "accepted";

export function hasAcceptedConsent(storage) {
  try {
    return storage?.getItem(CONSENT_STORAGE_KEY) === CONSENT_ACCEPTED;
  } catch {
    return false;
  }
}

export function rememberConsent(storage) {
  try {
    storage?.setItem(CONSENT_STORAGE_KEY, CONSENT_ACCEPTED);
  } catch {}
}

function appendOptionalScript(documentRef, id, source, attributes = {}) {
  if (!source || documentRef.getElementById(id) || !documentRef.head?.append) {
    return false;
  }

  const script = documentRef.createElement("script");
  script.id = id;
  script.src = source;
  Object.assign(script, attributes);
  documentRef.head.append(script);

  return true;
}

export function loadOptionalServices(documentRef, globalObject, sources = {}) {
  const adsenseLoaded = appendOptionalScript(
    documentRef,
    "survivus-adsense",
    sources.adsenseSrc,
    { async: true, crossOrigin: "anonymous" },
  );

  const analyticsLoaded = appendOptionalScript(
    documentRef,
    "survivus-analytics",
    sources.analyticsSrc,
    { async: true },
  );

  if (analyticsLoaded && sources.analyticsId) {
    globalObject.dataLayer = globalObject.dataLayer || [];
    globalObject.gtag =
      globalObject.gtag ||
      function gtag() {
        globalObject.dataLayer.push(arguments);
      };
    globalObject.gtag("js", new Date());
    globalObject.gtag("config", sources.analyticsId);
  }

  const speedInsightsLoaded = appendOptionalScript(
    documentRef,
    "survivus-speed-insights",
    sources.speedInsightsSrc,
    { defer: true },
  );

  if (speedInsightsLoaded) {
    globalObject.si =
      globalObject.si ||
      function speedInsights() {
        (globalObject.siq = globalObject.siq || []).push(arguments);
      };
  }

  return { adsenseLoaded, analyticsLoaded, speedInsightsLoaded };
}

export function initializeConsent(documentRef, globalObject, storage) {
  const notice = documentRef.getElementById("cookie-consent");
  const acceptButton = documentRef.querySelector(
    "[data-cookie-consent-accept]",
  );

  if (!notice || !acceptButton) return;

  const sources = {
    adsenseSrc: notice.dataset.adsenseSrc,
    analyticsSrc: notice.dataset.analyticsSrc,
    analyticsId: notice.dataset.analyticsId,
    speedInsightsSrc: notice.dataset.speedInsightsSrc,
  };

  const accept = () => {
    rememberConsent(storage);
    loadOptionalServices(documentRef, globalObject, sources);
    notice.hidden = true;
  };

  if (hasAcceptedConsent(storage)) {
    accept();
    return;
  }

  let acceptedThisPage = false;
  notice.hidden = false;
  acceptButton.addEventListener("click", () => {
    if (acceptedThisPage) return;
    acceptedThisPage = true;
    accept();
  });
}

if (typeof document !== "undefined" && typeof window !== "undefined") {
  let storage;
  try {
    storage = window.localStorage;
  } catch {
    storage = undefined;
  }
  initializeConsent(document, window, storage);
}
