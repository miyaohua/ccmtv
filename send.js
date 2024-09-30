// 接码平台获取手机号
const getPhoneCodeByPlatform = async (codeToken, project_id, project_type) => {
  const res = await fetch("http://az.yezi56.com:90/api/get_mobile", {
    headers: {
      accept: "application/json, text/plain, */*",
      "content-type": "application/x-www-form-urlencoded",
      Referer: "http://h5.yezi86.com:90/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: `token=${codeToken};project_id=${project_id};project_type=${project_type};operator=0;loop=1`,
    method: "POST",
  });
  return await res.json();
};

// 发送验证码
const sendPhoneCode = async (
  acw_tc,
  PHPSESSID,
  lvt,
  HMACCOUNT,
  lpvtCode,
  affUrl,
  mobile
) => {
  const sendStatus = await fetch(
    "https://www.ccmtv.cn/upload_files/new_upload_files/ccmtvtp/Loginreg/Loginnew/getPhoneNum.html",
    {
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        priority: "u=1, i",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        cookie: `acw_tc=${acw_tc}; PHPSESSID=${PHPSESSID}; _pk_id.1.26ae=be713874f0922f21.1726129727.; _pk_ses.1.26ae=1; Hm_lvt_c0365db04d091d9c1aa69704fd50813d=${lvt}; HMACCOUNT=${HMACCOUNT}; Hm_lpvt_c0365db04d091d9c1aa69704fd50813d=${lpvtCode}`,
        Referer: affUrl,
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: `act_type=reg&atc_mob=${mobile}&is_doctor=1`,
      method: "POST",
    }
  );
  return await sendStatus.json();
};

// 获取验证码
const getPhoneCode = async (codeToken, mobile, project_type, project_id) => {
  const getStatus = await fetch("http://az.yezi56.com:90/api/get_message", {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9",
      "content-type": "application/x-www-form-urlencoded",
      "proxy-connection": "keep-alive",
      Referer: "http://h5.yezi86.com:90/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: `token=${codeToken};phone_num=${mobile};project_type=${project_type};project_id=${project_id}`,
    method: "POST",
  });
  return await getStatus.json();
};

// 注册逻辑
const register = async (
  PHPSESSID,
  lvt,
  HMACCOUNT,
  lpvtCode,
  acw_tc,
  affUrl,
  mobile,
  code
) => {
  const result = await fetch(
    "https://www.ccmtv.cn/upload_files/new_upload_files/ccmtvtp/Loginreg/Loginnew/saveRegInfo.html",
    {
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        priority: "u=1, i",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        cookie: `PHPSESSID=${PHPSESSID}; _pk_id.1.26ae=be713874f0922f21.1726129727.; Hm_lvt_c0365db04d091d9c1aa69704fd50813d=${lvt}; HMACCOUNT=${HMACCOUNT}; Hm_lpvt_c0365db04d091d9c1aa69704fd50813d=${lpvtCode}; acw_tc=${acw_tc}`,
        Referer: affUrl,
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: `is_doctor=1&atc_mob=${mobile}&atc_num=${code}&atc_password=mi010409&atc_newpassword=mi010409&is_mob=1`,
      method: "POST",
    }
  );
  return result;
};

module.exports = {
  getPhoneCodeByPlatform,
  sendPhoneCode,
  getPhoneCode,
  register,
};
