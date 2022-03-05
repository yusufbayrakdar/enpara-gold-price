const axios = require("axios");
const cron = require("node-cron");
const shell = require("shelljs");
const moment = require("moment");

const wantedPrice = Number(process.argv[2]);
const minutes = Number(process.argv[3]) || 1;
if (!wantedPrice) {
  console.log("🤯 wantedPrice is not defined");
  process.exit(1);
}
const intervalMessage = `in every ${minutes > 1 ? `${minutes} ` : ""}minutes`;
console.log(`🔍 Checking price for ${wantedPrice}₺ ${intervalMessage}`);

const checkPrice = async () => {
  try {
    const { data: page } = await axios.get(
      "https://www.qnbfinansbank.enpara.com/hesaplar/doviz-ve-altin-kurlari"
    );
    const price = Number(
      String(
        page.match(/(?<=<span>Altın \(gram\)<\/span><span>)\d+,\d{1,2}/)[0]
      ).replace(",", ".")
    );

    const roundedPrice = Math.floor(price);
    const fraction = Number(String(price).match(/(?<=.)\d+/)[0]);
    const clock = moment().format("HH:mm");
    console.log(`🕓 ${clock} - 💰 Altın fiyatı: ${roundedPrice},${fraction}`);
    if (price >= wantedPrice) {
      shell.exec(
        `say -v Yelda Altının fiyatı ${roundedPrice} lira ${fraction} kuruş`
      );
    }
  } catch (error) {
    console.log(
      "Something went wrong, error: " +
        error +
        "\n You can contact with the developer via yusufsabribayrakdar@icloud.com"
    );
  }
};

// Schedule task to be run
cron.schedule(`*/${minutes} * * * *`, checkPrice);
