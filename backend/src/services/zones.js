const yahooFinance = require('yahoo-finance2').default;
const Zone = require('../models/Zone');
const winston = require('winston');
const logger = require('../utils/logger');
const { fetchStockData } = require('../utils/yahooFinanceUtil');

// Predefined list of NSE tickers (NIFTY 50 subset for example)
const NSE_TICKERS = [
  "PAYTM.NS",
  "JSL.NS",
  "SUNDARMFIN.NS",
  "TRIVENI.NS",
  "AUBANK.NS",
  "RADICO.NS",
  "CAPLIPOINT.NS",
  "KEC.NS",
  "GODFRYPHLP.NS",
  "TORNTPOWER.NS",
  "GSPL.NS",
  "SAPPHIRE.NS",
  "RENUKA.NS",
  "PRAJIND.NS",
  "TIMKEN.NS",
  "UNOMINDA.NS",
  "SCHNEIDER.NS",
  "HOMEFIRST.NS",
  "GLS.NS",
  "RVNL.NS",
  "DOMS.NS",
  "ZFCVINDIA.NS",
  "CELLO.NS",
  "VARROC.NS",
  "PRESTIGE.NS",
  "BANDHANBNK.NS",
  "BALRAMCHIN.NS",
  "PPLPHARMA.NS",
  "UPL.NS",
  "MFSL.NS",
  "JWL.NS",
  "MCX.NS",
  "PNBHOUSING.NS",
  "PHOENIXLTD.NS",
  "CHALET.NS",
  "UTIAMC.NS",
  "NATCOPHARM.NS",
  "VIJAYA.NS",
  "METROPOLIS.NS",
  "STARHEALTH.NS",
  "SAFARI.NS",
  "OBEROIRLTY.NS",
  "SHREECEM.NS",
  "GRSE.NS",
  "GESHIP.NS",
  "ERIS.NS",
  "FORTIS.NS",
  "LAURUSLABS.NS",
  "SUNDRMFAST.NS",
  "FIVESTAR.NS",
  "AVANTIFEED.NS",
  "SOLARINDS.NS",
  "APTUS.NS",
  "SUVENPHAR.NS",
  "ALKEM.NS",
  "CROMPTON.NS",
  "DCMSHRIRAM.NS",
  "SIGNATURE.NS",
  "AJANTPHARM.NS",
  "RAINBOW.NS",
  "LUPIN.NS",
  "GLENMARK.NS",
  "FDC.NS",
  "TVSMOTOR.NS",
  "KRBL.NS",
  "GPIL.NS",
  "CHAMBLFERT.NS",
  "CREDITACC.NS",
  "ACE.NS",
  "INDUSTOWER.NS",
  "ECLERX.NS",
  "NHPC.NS",
  "CIPLA.NS",
  "SHYAMMETL.NS",
  "JUBLINGREA.NS",
  "APARINDS.NS",
  "CHEMPLASTS.NS",
  "DALBHARAT.NS",
  "UNITDSPR.NS",
  "BAJFINANCE.NS",
  "KIMS.NS",
  "ANANDRATHI.NS",
  "MTARTECH.NS",
  "GAIL.NS",
  "MANKIND.NS",
  "COROMANDEL.NS",
  "M&M.NS",
  "POWERINDIA.NS",
  "GRANULES.NS",
  "PCBL.NS",
  "TORNTPHARM.NS",
  "HAL.NS",
  "SCHAEFFLER.NS",
  "DIVISLAB.NS",
  "NTPC.NS",
  "VIPIND.NS",
  "LALPATHLAB.NS",
  "HEROMOTOCO.NS",
  "DLF.NS",
  "GODREJPROP.NS",
  "CUB.NS",
  "IGL.NS",
  "3MINDIA.NS",
  "BIRLACORPN.NS",
  "EPL.NS",
  "KEI.NS",
  "CRAFTSMAN.NS",
  "SUNTV.NS",
  "SYNGENE.NS",
  "PIDILITIND.NS",
  "IIFL.NS",
  "FACT.NS",
  "BAJAJFINSV.NS",
  "TATAINVEST.NS",
  "HFCL.NS",
  "KPRMILL.NS",
  "PAGEIND.NS",
  "POWERGRID.NS",
  "TVSSCS.NS",
  "SONATSOFTW.NS",
  "PERSISTENT.NS",
  "TATACOMM.NS",
  "POLICYBZR.NS",
  "BOSCHLTD.NS",
  "SUNPHARMA.NS",
  "ITI.NS",
  "HAPPSTMNDS.NS",
  "UJJIVANSFB.NS",
  "APLLTD.NS",
  "SRF.NS",
  "GNFC.NS",
  "RAMCOCEM.NS",
  "INDIGO.NS",
  "RATNAMANI.NS",
  "ASTERDM.NS",
  "IPCALAB.NS",
  "EIDPARRY.NS",
  "ELECON.NS",
  "BHARTIARTL.NS",
  "POLYCAB.NS",
  "CLEAN.NS",
  "DELHIVERY.NS",
  "IRCTC.NS",
  "TCS.NS",
  "TTML.NS",
  "NIACL.NS",
  "CANBK.NS",
  "BEL.NS",
  "SWSOLAR.NS",
  "CHENNPETRO.NS",
  "APOLLOHOSP.NS",
  "ICICIPRULI.NS",
  "JUSTDIAL.NS",
  "ATUL.NS",
  "BRIGADE.NS",
  "ASHOKLEY.NS",
  "TMB.NS",
  "MEDPLUS.NS",
  "GICRE.NS",
  "IDFC.NS",
  "TITAN.NS",
  "AETHER.NS",
  "INOXWIND.NS",
  "RCF.NS",
  "HINDZINC.NS",
  "BSE.NS",
  "JINDALSAW.NS",
  "BIOCON.NS",
  "EQUITASBNK.NS",
  "DEEPAKNTR.NS",
  "KPIL.NS",
  "TATAPOWER.NS",
  "JKLAKSHMI.NS",
  "IDFCFIRSTB.NS",
  "HINDPETRO.NS",
  "EIHOTEL.NS",
  "VEDL.NS",
  "RRKABEL.NS",
  "INDIGOPNTS.NS",
  "GAEL.NS",
  "ACC.NS",
  "LEMONTREE.NS",
  "AMBUJACEM.NS",
  "PIIND.NS",
  "POLYMED.NS",
  "COLPAL.NS",
  "ESCORTS.NS",
  "ULTRACEMCO.NS",
  "CARBORUNIV.NS",
  "INFY.NS",
  "BAJAJ-AUTO.NS",
  "DRREDDY.NS",
  "EASEMYTRIP.NS",
  "MGL.NS",
  "ICICIBANK.NS",
  "KAJARIACER.NS",
  "EICHERMOT.NS",
  "TATACHEM.NS",
  "BALAMINES.NS",
  "RHIM.NS",
  "VAIBHAVGBL.NS",
  "RBLBANK.NS",
  "GRASIM.NS",
  "JINDALSTEL.NS",
  "UBL.NS",
  "TIINDIA.NS",
  "PATANJALI.NS",
  "INDUSINDBK.NS",
  "EXIDEIND.NS",
  "KSB.NS",
  "MANYAVAR.NS",
  "ABB.NS",
  "HDFCLIFE.NS",
  "NH.NS",
  "PNB.NS",
  "SBFC.NS",
  "LT.NS",
  "CENTURYPLY.NS",
  "COFORGE.NS",
  "ISEC.NS",
  "SIEMENS.NS",
  "LLOYDSME.NS",
  "SBILIFE.NS",
  "BRITANNIA.NS",
  "BANKINDIA.NS",
  "ANGELONE.NS",
  "ABBOTINDIA.NS",
  "NAVINFLUOR.NS",
  "DATAPATTNS.NS",
  "ASIANPAINT.NS",
  "AAVAS.NS",
  "TATAELXSI.NS",
  "HINDCOPPER.NS",
  "CAMPUS.NS",
  "BDL.NS",
  "CSBBANK.NS",
  "LINDEINDIA.NS",
  "FINCABLES.NS",
  "JSWSTEEL.NS",
  "SBICARD.NS",
  "TITAGARH.NS",
  "RTNINDIA.NS",
  "NCC.NS",
  "INDIANB.NS",
  "MRF.NS",
  "MSUMI.NS",
  "ADANIENT.NS",
  "ANURAS.NS",
  "CONCOR.NS",
  "MASTEK.NS",
  "ADANIPORTS.NS",
  "KALYANKJIL.NS",
  "PETRONET.NS",
  "BHARATFORG.NS",
  "THERMAX.NS",
  "GUJGASLTD.NS",
  "TATACONSUM.NS",
  "UCOBANK.NS",
  "LTIM.NS",
  "AUROPHARMA.NS",
  "AXISBANK.NS",
  "TATATECH.NS",
  "BAJAJHLDNG.NS",
  "DEVYANI.NS",
  "GMDCLTD.NS",
  "SHRIRAMFIN.NS",
  "ADANIENSOL.NS",
  "HAVELLS.NS",
  "SANOFI.NS",
  "KAYNES.NS",
  "KFINTECH.NS",
  "CONCORDBIO.NS",
  "PVRINOX.NS",
  "CDSL.NS",
  "APOLLOTYRE.NS",
  "RBA.NS",
  "SKFINDIA.NS",
  "GODREJIND.NS",
  "TATASTEEL.NS",
  "SBIN.NS",
  "ONGC.NS",
  "ADANIGREEN.NS",
  "NATIONALUM.NS",
  "GMRINFRA.NS",
  "PGHH.NS",
  "BATAINDIA.NS",
  "INDHOTEL.NS",
  "PFC.NS",
  "TRITURBINE.NS",
  "JKCEMENT.NS",
  "INTELLECT.NS",
  "RKFORGE.NS",
  "KOTAKBANK.NS",
  "IDBI.NS",
  "CUMMINSIND.NS",
  "MEDANTA.NS",
  "HAPPYFORGE.NS",
  "BLUESTARCO.NS",
  "ARE&M.NS",
  "BPCL.NS",
  "JUBLFOOD.NS",
  "M&MFIN.NS",
  "LXCHEM.NS",
  "HSCL.NS",
  "WIPRO.NS",
  "MARUTI.NS",
  "TRENT.NS",
  "NESTLEIND.NS",
  "JYOTHYLAB.NS",
  "RAYMOND.NS",
  "CIEINDIA.NS",
  "PRINCEPIPE.NS",
  "BANKBARODA.NS",
  "MOTHERSON.NS",
  "GODREJCP.NS",
  "EMAMILTD.NS",
  "QUESS.NS",
  "MAHABANK.NS",
  "AEGISLOG.NS",
  "IOC.NS",
  "WELCORP.NS",
  "HINDALCO.NS",
  "CHOLAFIN.NS",
  "MAPMYINDIA.NS",
  "MOTILALOFS.NS",
  "SYRMA.NS",
  "NUVAMA.NS",
  "OFSS.NS",
  "REDINGTON.NS",
  "GRINDWELL.NS",
  "INDIACEM.NS",
  "JBMA.NS",
  "HINDUNILVR.NS",
  "JBCHEPHARM.NS",
  "AARTIIND.NS",
  "HONAUT.NS",
  "ICICIGI.NS",
  "NLCINDIA.NS",
  "JMFINANCIL.NS",
  "ENDURANCE.NS",
  "HCLTECH.NS",
  "DEEPAKFERT.NS",
  "ROUTE.NS",
  "TEJASNET.NS",
  "CRISIL.NS",
  "CCL.NS",
  "MAHSEAMLES.NS",
  "HEG.NS",
  "SWANENERGY.NS",
  "TRIDENT.NS",
  "ITC.NS",
  "SAIL.NS",
  "NMDC.NS",
  "BHEL.NS",
  "MHRIL.NS",
  "OLECTRA.NS",
  "STLTECH.NS",
  "FEDERALBNK.NS",
  "LICHSGFIN.NS",
  "BERGEPAINT.NS",
  "NAUKRI.NS",
  "METROBRAND.NS",
  "YESBANK.NS",
  "MAZDOCK.NS",
  "MPHASIS.NS",
  "VBL.NS",
  "AWL.NS",
  "LTF.NS",
  "ASTRAL.NS",
  "CENTRALBK.NS",
  "BALKRISIND.NS",
  "RAILTEL.NS",
  "IOB.NS",
  "FINPIPE.NS",
  "SAMMAANCAP.NS",
  "ZOMATO.NS",
  "GPPL.NS",
  "KANSAINER.NS",
  "NYKAA.NS",
  "GLAND.NS",
  "MUTHOOTFIN.NS",
  "SJVN.NS",
  "MANAPPURAM.NS",
  "LODHA.NS",
  "MAXHEALTH.NS",
  "PRSMJOHNSN.NS",
  "RECLTD.NS",
  "RELIANCE.NS",
  "NAM-INDIA.NS",
  "JSWINFRA.NS",
  "AFFLE.NS",
  "SONACOMS.NS",
  "SUNTECK.NS",
  "BAYERCROP.NS",
  "RAJESHEXPO.NS",
  "ABCAPITAL.NS",
  "TANLA.NS",
  "HDFCAMC.NS",
  "ABFRL.NS",
  "ZENSARTECH.NS",
  "COALINDIA.NS",
  "KARURVYSYA.NS",
  "CGPOWER.NS",
  "JUBLPHARMA.NS",
  "TECHM.NS",
  "AIAENG.NS",
  "KNRCON.NS",
  "LICI.NS",
  "HDFCBANK.NS",
  "ASTRAZEN.NS",
  "OIL.NS",
  "DABUR.NS",
  "JAIBALAJI.NS",
  "GILLETTE.NS",
  "GRAPHITE.NS",
  "GLAXO.NS",
  "VGUARD.NS",
  "CASTROLIND.NS",
  "INDIAMART.NS",
  "ATGL.NS",
  "TV18BRDCST.NS",
  "RITES.NS",
  "BEML.NS",
  "IEX.NS",
  "IRFC.NS",
  "JIOFIN.NS",
  "BORORENEW.NS",
  "360ONE.NS",
  "IRCON.NS",
  "NSLNISP.NS",
  "WHIRLPOOL.NS",
  "LATENTVIEW.NS",
  "SOBHA.NS",
  "ALKYLAMINE.NS",
  "GSFC.NS",
  "JSWENERGY.NS",
  "J&KBANK.NS",
  "PNCINFRA.NS",
  "MMTC.NS",
  "IRB.NS",
  "TATAMOTORS.NS",
  "BLUEDART.NS",
  "FLUOROCHEM.NS",
  "BIKAJI.NS",
  "CEATLTD.NS",
  "NUVOCO.NS",
  "ASAHIINDIA.NS",
  "VTL.NS",
  "GMMPFAUDLR.NS",
  "ZEEL.NS",
  "FINEORG.NS",
  "PEL.NS",
  "POONAWALLA.NS",
  "SAREGAMA.NS",
  "CAMS.NS",
  "BSOFT.NS",
  "ZYDUSLIFE.NS",
  "ACI.NS",
  "MRPL.NS",
  "UNIONBANK.NS",
  "USHAMART.NS",
  "BLS.NS",
  "MARICO.NS",
  "ALLCARGO.NS",
  "BBTC.NS",
  "DMART.NS",
  "WELSPUNLIV.NS",
  "HONASA.NS",
  "LTTS.NS",
  "SUZLON.NS",
  "CENTURYTEX.NS",
  "CYIENT.NS",
  "VOLTAS.NS",
  "AMBER.NS",
  "ADANIPOWER.NS",
  "KPITTECH.NS",
  "MAHLIFE.NS",
  "ELGIEQUIP.NS",
  "HBLPOWER.NS",
  "DIXON.NS",
  "CGCL.NS",
  "JKPAPER.NS",
  "SPARC.NS",
  "SUPREMEIND.NS",
  "FSL.NS",
  "CANFINHOME.NS",
  "MINDACORP.NS",
  "CESC.NS",
  "ALOKINDS.NS",
  "CERA.NS",
  "SUMICHEM.NS",
  "CHOLAHLDNG.NS",
  "APLAPOLLO.NS",
  "ENGINERSIN.NS",
  "WESTLIFE.NS",
  "NBCC.NS",
  "COCHINSHIP.NS",
  "IDEA.NS",
  "HUDCO.NS",
  "NETWORK18.NS"
];


// Retry utility for API calls
const retry = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Check zone freshness
const getFreshness = async (ticker, timeFrame, proximalLine, distalLine, legOutDate) => {
  try {
    // Fetch candles from legOutDate to present
    const period1 = new Date(legOutDate);
    const period2 = new Date();
    const candles = await retry(() =>
      yahooFinance.historical(ticker, {
        period1,
        period2,
        interval: timeFrame,
      })
    );

    if (!candles || candles.length < 1) {
      winston.warn(`No candles found for freshness check: ${ticker} (${timeFrame})`);
      return 3; // No data, assume fresh
    }

    let approachCount = 0;
    let isBreached = false;

    // Check each candle for approach or breach
    for (const candle of candles) {
      // Skip the leg-out candle itself
      if (new Date(candle.date).toISOString() === new Date(legOutDate).toISOString()) {
        continue;
      }

      // Approach: Price enters the zone (low <= proximalLine && high >= distalLine)
      if (candle.low <= proximalLine && candle.high >= distalLine) {
        approachCount++;
        winston.info(`Price approached zone: ${ticker} (${timeFrame}), Date: ${candle.date}, Low: ${candle.low}, High: ${candle.high}`);
      }

      // Breach: Price closes below distalLine (demand zone)
      if (candle.close < distalLine) {
        isBreached = true;
        winston.info(`Zone breached: ${ticker} (${timeFrame}), Date: ${candle.date}, Close: ${candle.close}, Distal: ${distalLine}`);
        break; // No need to check further
      }
    }

    // Assign freshness score
    if (isBreached) {
      return 0; // Breached, not fresh
    }
    if (approachCount === 0) {
      return 3; // No approaches, fresh
    }
    if (approachCount <= 2) {
      return 1.5; // Approached 1-2 times
    }
    return 0; // Approached 3+ times, not fresh
  } catch (err) {
    winston.error(`Error checking freshness for ${ticker} (${timeFrame}): ${err.message}`);
    return 3; // Default to fresh on error to avoid blocking
  }
};

// Main function to identify demand zones
const identifyDemandZones = async (ticker, timeFrame = '1d') => {
  try {
    // Validate timeFrame
    if (!['1d', '1wk', '1mo'].includes(timeFrame)) {
      throw new Error('Invalid timeFrame. Use 1d, 1wk, or 1mo.');
    }

    // Calculate date range (1 year ago to now)
    const period2 = new Date(); // Current date
    const period1 = new Date(period2);
    period1.setFullYear(period2.getFullYear() - 1); // 1 year ago

    // Fetch historical data
    const candles = await retry(() =>
      yahooFinance.historical(ticker, {
        period1,
        period2,
        interval: timeFrame,
      })
    );

    if (!candles || candles.length < 10) {
      throw new Error(`Insufficient data for ${ticker}`);
    }

    const zones = [];
    let i = 0;

    while (i < candles.length) {
      // Step 1: Find leg-in candle (body > 50% of range)
      const currentCandle = candles[i];
      const body = Math.abs(currentCandle.close - currentCandle.open);
      const range = currentCandle.high - currentCandle.low;
      const isLegIn = body / range > 0.5;

      if (isLegIn) {
        const legIn = currentCandle;
        let baseCandles = [];
        let baseCount = 0;
        let j = i + 1;

        // Step 2: Find up to 5 base candles (body < 50% of range)
        while (j < candles.length && baseCount < 5) {
          const nextCandle = candles[j];
          const nextBody = Math.abs(nextCandle.close - nextCandle.open);
          const nextRange = nextCandle.high - nextCandle.low;
          const isBaseCandle = nextBody / nextRange < 0.5;

          if (isBaseCandle) {
            baseCandles.push(nextCandle);
            baseCount++;
            j++;
          } else {
            break; // Non-base candle found, stop collecting base candles
          }
        }

        // Step 3: Check for leg-out candle (green, closes above leg-in high)
        if (baseCount >= 1 && j < candles.length) {
          const legOut = candles[j];
          const isLegOutGreen = legOut.close > legOut.open;
          const isLegOutValid = legOut.close > legIn.high;

          // Step 4: Check for DBR or RBR pattern
          const isDBR = legIn.close < legIn.open && isLegOutGreen && isLegOutValid; // Red leg-in
          const isRBR = legIn.close > legIn.open && isLegOutGreen && isLegOutValid; // Green leg-in

          if (isDBR || isRBR) {
            // Step 5: Mark zone boundaries (body-to-wick method)
            const proximalLine = Math.max(...baseCandles.map(c => Math.max(c.close, c.open)));
            const distalLine = Math.min(...baseCandles.map(c => c.low));

            // Step 6: Calculate trade score
            const freshness = await getFreshness(ticker, timeFrame, proximalLine, distalLine, legOut.date);
            const strength = (legOut.high - legOut.low) > (baseCandles[baseCandles.length - 1].high - baseCandles[baseCandles.length - 1].low) * 2 ? 2 : 1;
            const timeAtBase = baseCount <= 3 ? 2 : baseCount <= 5 ? 1 : 0;
            const tradeScore = freshness + strength + timeAtBase;

            // Step 7: Store zone if trade score is sufficient
            if (tradeScore >= 4) {
              const zone = {
                ticker,
                timeFrame,
                type: 'demand',
                pattern: isDBR ? 'DBR' : 'RBR',
                proximalLine,
                distalLine,
                tradeScore,
                freshness,
                strength,
                timeAtBase,
                legOutDate: new Date(legOut.date),
              };
              zones.push(zone);
            }
          }
        }

        // Move to the candle after the last base candle or leg-out
        i = j;
      } else {
        i++; // Move to next candle if no leg-in found
      }
    }

    // Save zones to MongoDB
    if (zones.length > 0) {
      await Zone.insertMany(zones);
      winston.info(`Saved ${zones.length} demand zones for ${ticker} (${timeFrame})`);
    }

    return zones;
  } catch (err) {
    winston.error(`Error identifying demand zones for ${ticker}: ${err.message}`);
    throw err;
  }
};

// Identify demand zones for a specific date (default: today) for multiple stocks
const identifyDailyDemandZones = async (timeFrame = '1d', tickers = NSE_TICKERS, targetDate = null) => {
  try {
    // Validate timeFrame
    if (!['1d', '1wk', '1mo'].includes(timeFrame)) {
      throw new Error('Invalid timeFrame. Use 1d, 1wk, or 1mo.');
    }

    // Set target date (default to today)
    const target = targetDate ? new Date(targetDate) : new Date();
    target.setHours(0, 0, 0, 0); // Start of target date
    const targetEnd = new Date(target.getTime() + 24 * 60 * 60 * 1000); // End of target date

    // Check for cached zones for the target date
    const cachedZones = await Zone.find({
      timeFrame,
      type: 'demand',
      legOutDate: {
        $gte: target,
        $lt: targetEnd,
      },
      ticker: { $in: tickers },
    });

    if (cachedZones.length > 0) {
      logger.info(`Returning ${cachedZones.length} cached daily zones for ${timeFrame} on ${target.toISOString().split('T')[0]}`);
      // return cachedZones;
    }

    // Fetch candles (10 days before target date to now)
    const period2 = new Date(target.getTime() + 24 * 60 * 60 * 1000); // Include target date
    const period1 = new Date(target);
    period1.setDate(target.getDate() - 10); // 10 days before target

    const allZones = [];

    // Process tickers in batches to avoid overwhelming API
    const batchSize = 5;
    for (let i = 0; i < tickers.length; i += batchSize) {
      const batch = tickers.slice(i, i + batchSize);
      const promises = batch.map(async ticker => {
        try {
          const candles = await fetchStockData(ticker, { period1, period2, interval: timeFrame });
          if (!candles || candles.length < 3) {
            logger.warn(`Insufficient data for ${ticker} (${timeFrame})`);
            return [];
          }
      
          const zones = [];
      
          for (let j = candles.length - 1; j >= 2; j--) {
            const currentCandle = candles[j];
            const candleDate = new Date(currentCandle.date);
            candleDate.setHours(0, 0, 0, 0);
      
            if (candleDate.getTime() !== target.getTime()) continue;
      
            // Check leg-out condition
            const isLegOutGreen = currentCandle.close > currentCandle.open;
            const priorHigh = Math.max(...candles.slice(Math.max(j - 3, 0), j).map(c => c.high));
            const isLegOutValid = isLegOutGreen && currentCandle.close > priorHigh;
      
            logger.info(`🟢 Checking Leg-Out for ${ticker} on ${currentCandle.date}: Close=${currentCandle.close}, Open=${currentCandle.open}, PriorHigh=${priorHigh}, isGreen=${isLegOutGreen}, isValid=${isLegOutValid}`);
      
            if (isLegOutValid) {
              const legOut = currentCandle;
              let baseCandles = [];
              let baseCount = 0;
              let k = j - 1;
      
              while (k >= 0 && baseCount < 5) {
                const prevCandle = candles[k];
                const body = Math.abs(prevCandle.close - prevCandle.open);
                const range = prevCandle.high - prevCandle.low;
                const isBaseCandle = range > 0 && body / range < 0.5;
      
                logger.info(`🔹${ticker} Base check at ${prevCandle.date}: Range=${range}, Body=${body}, Ratio=${(body / range).toFixed(2)}, isBase=${isBaseCandle}`);
      
                if (isBaseCandle) {
                  baseCandles.push(prevCandle);
                  baseCount++;
                  k--;
                } else {
                  logger.info(`⛔️ ${ticker} Base sequence broke at ${prevCandle.date}`);
                  break;
                }
              }
      
              // Check leg-in
              if (baseCount >= 1 && k >= 0) {
                const legIn = candles[k];
                const body = Math.abs(legIn.close - legIn.open);
                const range = legIn.high - legIn.low;
                const isLegIn = range > 0 && body / range > 0.5;
      
                const isDBR = legIn.close < legIn.open;
                const isRBR = legIn.close > legIn.open;
      
                logger.info(`🔻 Leg-In check at ${legIn.date}: Range=${range}, Body=${body}, Ratio=${(body / range).toFixed(2)}, isLegIn=${isLegIn}, DBR=${isDBR}, RBR=${isRBR}`);
      
                if (isLegIn && (isDBR || isRBR)) {
                  const proximalLine = Math.max(...baseCandles.map(c => Math.max(c.close, c.open)));
                  const distalLine = Math.min(...baseCandles.map(c => c.low));
      
                  const freshness = await getFreshness(ticker, timeFrame, proximalLine, distalLine, legOut.date);
                  const strength = (legOut.high - legOut.low) > (baseCandles[baseCandles.length - 1].high - baseCandles[baseCandles.length - 1].low) * 2 ? 2 : 1;
                  const timeAtBase = baseCount <= 3 ? 2 : baseCount <= 5 ? 1 : 0;
                  const tradeScore = freshness + strength + timeAtBase;
      
                  logger.info(`📊 Zone Candidate for ${ticker} on ${legOut.date} | Proximal=${proximalLine}, Distal=${distalLine}, Freshness=${freshness}, Strength=${strength}, TimeAtBase=${timeAtBase}, TradeScore=${tradeScore}`);
      
                  if (tradeScore >= 4) {
                    const zone = {
                      ticker,
                      timeFrame,
                      type: 'demand',
                      pattern: isDBR ? 'DBR' : 'RBR',
                      proximalLine,
                      distalLine,
                      tradeScore,
                      freshness: freshness,
                      strength: strength,
                      timeAtBase: timeAtBase,
                      legOutDate: new Date(legOut.date),
                    };
                    zones.push(zone);
                    logger.info(`✅ Zone ACCEPTED for ${ticker} on ${legOut.date}`);
                  } else {
                    logger.info(`❌ Zone REJECTED for ${ticker} on ${legOut.date} | Insufficient tradeScore: ${tradeScore}`);
                  }
                }
              }
            }
          }
          return zones;
        } catch (err) {
          logger.error(`Error processing ${ticker} (${timeFrame}): ${err.message}`);
          return [];
        }
      });
      

      const results = await Promise.allSettled(promises);
  const batchZones = results
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value)
    .flat();
  allZones.push(...batchZones);

  // Delay between batches to avoid rate limits
  if (i + batchSize < tickers.length) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

    // Save zones to MongoDB
    if (allZones.length > 0) {
      await Zone.insertMany(allZones);
      logger.info(`Saved ${allZones.length} daily demand zones for ${timeFrame} on ${target.toISOString().split('T')[0]}`);
    }

    return allZones;
  } catch (err) {
    logger.error(`Error identifying daily demand zones: ${err.message}`);
    throw err;
  }
};



module.exports = { identifyDemandZones,identifyDailyDemandZones };