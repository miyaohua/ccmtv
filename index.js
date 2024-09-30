const puppeteer = require("puppeteer");
const {
  getPhoneCodeByPlatform,
  sendPhoneCode,
  getPhoneCode,
  register,
} = require("./send");

// start 入口
const run = async () => {
  // 初始化的一些信息
  var PHPSESSID = "";
  var lvt = "";
  var HMACCOUNT = ""; // 这个值代表邀请
  var acw_tc = "";

  // 接码平台token
  var codeToken = "";
  // 推广链接
  var affUrl = "";
  // 接码平台type
  var project_type = "";
  // 接码平台项目id
  var project_id = "";

  // 获取 HMACCOUNT
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  // 设置视口大小和用户代理
  await page.setViewport({ width: 375, height: 667 });
  await page.setUserAgent(
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
  );
  await page.goto(affUrl);
  // 等待页面加载完成
  await page.waitForSelector("body");
  const cookies = await page.cookies();

  // 设置参数
  if (cookies.length > 0) {
    // HMACCOUNT
    const HMACCOUNTObj = cookies.find((v) => v.name == "HMACCOUNT");
    HMACCOUNT = HMACCOUNTObj.value;

    // lvt
    const lvtObj = cookies.find((v) => v.name.includes("Hm_lvt_"));
    lvt = lvtObj.value;

    // PHPSESSID
    const PHPSESSIDObj = cookies.find((v) => v.name == "PHPSESSID");
    PHPSESSID = PHPSESSIDObj.value;

    // acw_tc
    const acw_tcObj = cookies.find((v) => v.name == "acw_tc");
    acw_tc = acw_tcObj.value;

    console.log("获取到的cookie有效信息:", PHPSESSID, lvt, HMACCOUNT, acw_tc);
    await browser.close();
  } else {
    await browser.close();
    console.log("No cookies found.");
    return;
  }

  console.log("开始获取手机号");
  // 接码平台获取手机号
  const data = await getPhoneCodeByPlatform(
    codeToken,
    project_id,
    project_type
  );
  // 发送成功执行逻辑
  if (data.message == "ok") {
    console.log("获取到的手机号:", data.mobile);
    console.log("准备发送验证码");
    let lpvtCode = Math.ceil(+new Date() / 1000);
    // 发送验证码
    const status = await sendPhoneCode(
      acw_tc,
      PHPSESSID,
      lvt,
      HMACCOUNT,
      lpvtCode,
      affUrl,
      data.mobile
    );
    if (status) {
      const parseStatus = JSON.parse(status);
      // 发送验证码成功
      if (parseStatus.status == 1) {
        console.log("发送验证码成功");
        let i = 0;
        let timer = setInterval(async () => {
          if (i > 30) {
            console.log("设置的时间超时了");
            clearInterval(timer);
          }
          i++;
          console.log("接码平台获取验证码中...");

          const resData = await getPhoneCode(
            codeToken,
            data.mobile,
            project_type,
            project_id
          );
          if (resData.message == "ok") {
            console.log("接码平台获取验证码成功：", resData.code);
            // 执行注册逻辑
            clearInterval(timer);
            const result = await register(
              PHPSESSID,
              lvt,
              HMACCOUNT,
              lpvtCode,
              acw_tc,
              affUrl,
              data.mobile,
              resData.code
            );

            if (result) {
              const resultData = await result.json();
              if (resultData) {
                const jsonResult = JSON.parse(resultData);
                if (jsonResult.status == 1) {
                  console.log("注册成功，5秒后再次执行", jsonResult);
                  setTimeout(() => {
                    run();
                  }, 5000);
                } else {
                  console.log("注册失败，结束进程");
                }
              }
            }
          }
        }, 3000);
      } else {
        console.log("发送验证码失败，结束进程，", status);
      }
    }
  } else {
    // 没获取到
    console.log("获取手机号失败，结束进程，", data);
  }
};

run();
