// joeshakely
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace allmylinks.Models;

[Table("Prices")]
[Index(nameof(Symbol))]
[Index(nameof(Date))]
public record Price : LongKeyedEntity
{
    public string? UserId { get; set; }
    public DateTime CreatedAt { get { return DateTime.UtcNow; } set { value = DateTime.UtcNow; } }
    public DateTime Date { get; set; }
    public double? Open { get; set; }
    public double? High { get; set; }
    public double? Low { get; set; }
    public double? Close { get; set; }
    public double AdjustedClose { get; set; }
    public double? Volume { get; set; }
    public string? Symbol { get; set; }
    public double Pct_Change { get; set; } = 0.0;

    public override string ToString() => $@"""Date"": ""{Date}"", ""Open"": ""{Open}"", ""High"": ""{High}"", ""Low"": ""{Low}"", ""Close"": ""{Close}"", ""AdjustedClose"": ""{AdjustedClose}"", ""Volume"": ""{Volume}"", ""Pct_Change"": ""{Pct_Change}""" + "\n";
}

public class Prices
{
    public int Id { get; set; }
    public string? UserId { get; set; }
    public DateTime CreatedAt { get { return DateTime.UtcNow; } set { value = DateTime.UtcNow; } }
    public DateTime Date { get; set; }
    public double? Open { get; set; }
    public double? High { get; set; }
    public double? Low { get; set; }
    public double? Close { get; set; }
    public double AdjustedClose { get; set; }
    public double? Volume { get; set; }
    public string? Symbol { get; set; }
    public double Pct_Change { get; set; } = 0.0;

    public override string ToString() => $@"""Date"": ""{Date}"", ""Open"": ""{Open}"", ""High"": ""{High}"", ""Low"": ""{Low}"", ""Close"": ""{Close}"", ""AdjustedClose"": ""{AdjustedClose}"", ""Volume"": ""{Volume}"", ""Pct_Change"": ""{Pct_Change}""" + "\n";
}
public enum SymbolType
{
    Stock,
    Crypto,
}

public record SymbolField
{
    public SymbolField() { }
    public string ID { get; set; }
    public string? Text { get; set; } = null!;
    public SymbolType Type { get; set; } = SymbolType.Crypto;

    public override string ToString() => $"{ID}";

    public SymbolField ConvertTo(object id)
    {
        SymbolField s = new()
        {
            ID = id.ToString(),
            Text = Symbols.Where(x => x.ID == id.ToString()).Select(x => x.Text).First(),
            Type = Symbols.Where(x => x.ID == id.ToString()).Select(x => x.Type).First(),
        };

        return s;
    }


    public static List<SymbolField> Symbols = new()
        {
            new SymbolField { ID = "AAPL", Text = "Apple Inc.", Type = SymbolType.Stock },
            new SymbolField { ID = "JNJ", Text = "Johnson & Johnson", Type = SymbolType.Stock },
            new SymbolField { ID = "TSLA", Text = "Tesla Inc.", Type = SymbolType.Stock },
            new SymbolField { ID = "GOOGL", Text = "Alphabet Inc Class A (Google)", Type = SymbolType.Stock },
            new SymbolField { ID = "BTC-USD", Text = "Bitcoin", Type = SymbolType.Crypto },
            new SymbolField { ID = "ETH-USD", Text = "Ethereum", Type = SymbolType.Crypto },
            new SymbolField { ID = "USDT-USD", Text = "Tether", Type = SymbolType.Crypto },
            new SymbolField { ID = "USDC-USD", Text = "USD Coin", Type = SymbolType.Crypto },
            new SymbolField { ID = "BNB-USD", Text = "BNB", Type = SymbolType.Crypto },
            new SymbolField { ID = "XRP-USD", Text = "XRP", Type = SymbolType.Crypto },
            new SymbolField { ID = "ADA-USD", Text = "Cardano", Type = SymbolType.Crypto },
            new SymbolField { ID = "SOL-USD", Text = "Solana", Type = SymbolType.Crypto },
            new SymbolField { ID = "BUSD-USD", Text = "Binance USD", Type = SymbolType.Crypto },
            new SymbolField { ID = "DOGE-USD", Text = "Dogecoin", Type = SymbolType.Crypto },
            new SymbolField { ID = "DOT-USD", Text = "Polkadot", Type = SymbolType.Crypto },
            new SymbolField { ID = "AVAX-USD", Text = "Avalanche", Type = SymbolType.Crypto },
            new SymbolField { ID = "WBTC-USD", Text = "Wrapped Bitcoin", Type = SymbolType.Crypto },
            new SymbolField { ID = "SHIB-USD", Text = "Shiba Inu", Type = SymbolType.Crypto },
            new SymbolField { ID = "TRX-USD", Text = "TRON", Type = SymbolType.Crypto },
            new SymbolField { ID = "DAI-USD", Text = "Dai", Type = SymbolType.Crypto },
            new SymbolField { ID = "MATIC-USD", Text = "Polygon", Type = SymbolType.Crypto },
            new SymbolField { ID = "LTC-USD", Text = "Litecoin", Type = SymbolType.Crypto },
            new SymbolField { ID = "CRO-USD", Text = "Cronos", Type = SymbolType.Crypto },
            new SymbolField { ID = "LEO-USD", Text = "UNUS SED LEO", Type = SymbolType.Crypto },
            new SymbolField { ID = "NEAR-USD", Text = "NEAR Protocol", Type = SymbolType.Crypto },
            new SymbolField { ID = "FTT-USD", Text = "FTX Token", Type = SymbolType.Crypto },
            new SymbolField { ID = "BCH-USD", Text = "Bitcoin Cash", Type = SymbolType.Crypto },
            new SymbolField { ID = "UNI-USD", Text = "Uniswap", Type = SymbolType.Crypto },
            new SymbolField { ID = "LINK-USD", Text = "Chainlink", Type = SymbolType.Crypto },
            new SymbolField { ID = "XLM-USD", Text = "Stellar", Type = SymbolType.Crypto },
            new SymbolField { ID = "ALGO-USD", Text = "Algorand", Type = SymbolType.Crypto },
            new SymbolField { ID = "ATOM-USD", Text = "Cosmos", Type = SymbolType.Crypto },
            new SymbolField { ID = "FLOW-USD", Text = "Flow", Type = SymbolType.Crypto },
            new SymbolField { ID = "ETC-USD", Text = "Ethereum Classic", Type = SymbolType.Crypto },
            new SymbolField { ID = "XMR-USD", Text = "Monero", Type = SymbolType.Crypto },
            new SymbolField { ID = "APE-USD", Text = "ApeCoin", Type = SymbolType.Crypto },
            new SymbolField { ID = "HBAR-USD", Text = "Hedera", Type = SymbolType.Crypto },
            new SymbolField { ID = "ICP-USD", Text = "Internet Computer", Type = SymbolType.Crypto },
            new SymbolField { ID = "VET-USD", Text = "VeChain", Type = SymbolType.Crypto },
            new SymbolField { ID = "MANA-USD", Text = "Decentraland", Type = SymbolType.Crypto },
            new SymbolField { ID = "EGLD-USD", Text = "Elrond", Type = SymbolType.Crypto },
            new SymbolField { ID = "FIL-USD", Text = "Filecoin", Type = SymbolType.Crypto },
            new SymbolField { ID = "SAND-USD", Text = "The Sandbox", Type = SymbolType.Crypto },
            new SymbolField { ID = "UST-USD", Text = "TerraUSD", Type = SymbolType.Crypto },
            new SymbolField { ID = "XTZ-USD", Text = "Tezos", Type = SymbolType.Crypto },
            new SymbolField { ID = "THETA-USD", Text = "Theta Network", Type = SymbolType.Crypto },
            new SymbolField { ID = "ZEC-USD", Text = "Zcash", Type = SymbolType.Crypto },
            new SymbolField { ID = "EOS-USD", Text = "EOS", Type = SymbolType.Crypto },
            new SymbolField { ID = "MKR-USD", Text = "Maker", Type = SymbolType.Crypto },
            new SymbolField { ID = "AXS-USD", Text = "Axie Infinity", Type = SymbolType.Crypto },
            new SymbolField { ID = "CAKE-USD", Text = "PancakeSwap", Type = SymbolType.Crypto },
            new SymbolField { ID = "KCS-USD", Text = "KuCoin Token", Type = SymbolType.Crypto },
            new SymbolField { ID = "TUSD-USD", Text = "TrueUSD", Type = SymbolType.Crypto },
            new SymbolField { ID = "HNT-USD", Text = "Helium", Type = SymbolType.Crypto },
            new SymbolField { ID = "AAVE-USD", Text = "Aave", Type = SymbolType.Crypto },
            new SymbolField { ID = "KLAY-USD", Text = "Klaytn", Type = SymbolType.Crypto },
            new SymbolField { ID = "RUNE-USD", Text = "THORChain", Type = SymbolType.Crypto },
            new SymbolField { ID = "BTT-USD", Text = "BitTorrent-New", Type = SymbolType.Crypto },
            new SymbolField { ID = "GRT-USD", Text = "The Graph", Type = SymbolType.Crypto },
            new SymbolField { ID = "HT-USD", Text = "Huobi Token", Type = SymbolType.Crypto },
            new SymbolField { ID = "BSV-USD", Text = "Bitcoin SV", Type = SymbolType.Crypto },
            new SymbolField { ID = "GMT-USD", Text = "STEPN", Type = SymbolType.Crypto },
            new SymbolField { ID = "USDP-USD", Text = "Pax Dollar", Type = SymbolType.Crypto },
            new SymbolField { ID = "MIOTA-USD", Text = "IOTA", Type = SymbolType.Crypto },
            new SymbolField { ID = "FTM-USD", Text = "Fantom", Type = SymbolType.Crypto },
            new SymbolField { ID = "USDN-USD", Text = "Neutrino USD", Type = SymbolType.Crypto },
            new SymbolField { ID = "XEC-USD", Text = "eCash", Type = SymbolType.Crypto },
            new SymbolField { ID = "QNT-USD", Text = "Quant", Type = SymbolType.Crypto },
            new SymbolField { ID = "CVX-USD", Text = "Convex Finance", Type = SymbolType.Crypto },
            new SymbolField { ID = "WAVES-USD", Text = "Waves", Type = SymbolType.Crypto },
            new SymbolField { ID = "NEO-USD", Text = "Neo", Type = SymbolType.Crypto },
            new SymbolField { ID = "OKB-USD", Text = "OKB", Type = SymbolType.Crypto },
            new SymbolField { ID = "NEXO-USD", Text = "Nexo", Type = SymbolType.Crypto },
            new SymbolField { ID = "STX-USD", Text = "Stacks", Type = SymbolType.Crypto },
            new SymbolField { ID = "CELO-USD", Text = "Celo", Type = SymbolType.Crypto },
            new SymbolField { ID = "CHZ-USD", Text = "Chiliz", Type = SymbolType.Crypto },
            new SymbolField { ID = "ZIL-USD", Text = "Zilliqa", Type = SymbolType.Crypto },
            new SymbolField { ID = "CRV-USD", Text = "Curve DAO Token", Type = SymbolType.Crypto },
            new SymbolField { ID = "KSM-USD", Text = "Kusama", Type = SymbolType.Crypto },
            new SymbolField { ID = "LRC-USD", Text = "Loopring", Type = SymbolType.Crypto },
            new SymbolField { ID = "GALA-USD", Text = "Gala", Type = SymbolType.Crypto },
            new SymbolField { ID = "DASH-USD", Text = "Dash", Type = SymbolType.Crypto },
            new SymbolField { ID = "ENJ-USD", Text = "Enjin Coin", Type = SymbolType.Crypto },
            new SymbolField { ID = "BAT-USD", Text = "Basic Attention Token", Type = SymbolType.Crypto },
            new SymbolField { ID = "PAXG-USD", Text = "PAX Gold", Type = SymbolType.Crypto },
            new SymbolField { ID = "ONE-USD", Text = "Harmony", Type = SymbolType.Crypto },
            new SymbolField { ID = "GNO-USD", Text = "Gnosis", Type = SymbolType.Crypto },
            new SymbolField { ID = "AMP-USD", Text = "Amp", Type = SymbolType.Crypto },
            new SymbolField { ID = "XDC-USD", Text = "XDC Network", Type = SymbolType.Crypto },
            new SymbolField { ID = "MINA-USD", Text = "Mina", Type = SymbolType.Crypto },
            new SymbolField { ID = "LDO-USD", Text = "Lido DAO", Type = SymbolType.Crypto },
            new SymbolField { ID = "COMP-USD", Text = "Compound", Type = SymbolType.Crypto },
            new SymbolField { ID = "DCR-USD", Text = "Decred", Type = SymbolType.Crypto },
            new SymbolField { ID = "HOT-USD", Text = "Holo", Type = SymbolType.Crypto },
            new SymbolField { ID = "AR-USD", Text = "Arweave", Type = SymbolType.Crypto },
            new SymbolField { ID = "XEM-USD", Text = "NEM", Type = SymbolType.Crypto },
            new SymbolField { ID = "GT-USD", Text = "GateToken", Type = SymbolType.Crypto },
            new SymbolField { ID = "FEI-USD", Text = "Fei USD", Type = SymbolType.Crypto },
            new SymbolField { ID = "QTUM-USD", Text = "Qtum", Type = SymbolType.Crypto },
            new SymbolField { ID = "KAVA-USD", Text = "Kava", Type = SymbolType.Crypto },
            new SymbolField { ID = "BNT-USD", Text = "Bancor", Type = SymbolType.Crypto },
            new SymbolField { ID = "XYM-USD", Text = "Symbol", Type = SymbolType.Crypto },
            new SymbolField { ID = "TFUEL-USD", Text = "Theta Fuel", Type = SymbolType.Crypto },
            new SymbolField { ID = "YFI-USD", Text = "yearn.finance", Type = SymbolType.Crypto },
            new SymbolField { ID = "1INCH-USD", Text = "1inch Network", Type = SymbolType.Crypto },
            new SymbolField { ID = "LPT-USD", Text = "Livepeer", Type = SymbolType.Crypto },
            new SymbolField { ID = "OMG-USD", Text = "OMG Network", Type = SymbolType.Crypto },
            new SymbolField { ID = "KDA-USD", Text = "Kadena", Type = SymbolType.Crypto },
            new SymbolField { ID = "ICX-USD", Text = "ICON", Type = SymbolType.Crypto },
            new SymbolField { ID = "GLMR-USD", Text = "Moonbeam", Type = SymbolType.Crypto },
            new SymbolField { ID = "IOST-USD", Text = "IOST", Type = SymbolType.Crypto },
            new SymbolField { ID = "BTG-USD", Text = "Bitcoin Gold", Type = SymbolType.Crypto },
            new SymbolField { ID = "ZRX-USD", Text = "0x", Type = SymbolType.Crypto },
            new SymbolField { ID = "SCRT-USD", Text = "Secret", Type = SymbolType.Crypto },
            new SymbolField { ID = "KNC-USD", Text = "Kyber Network Crystal v2", Type = SymbolType.Crypto },
            new SymbolField { ID = "SNX-USD", Text = "Synthetix", Type = SymbolType.Crypto },
            new SymbolField { ID = "ELON-USD", Text = "Dogelon Mars", Type = SymbolType.Crypto },
            new SymbolField { ID = "BORA-USD", Text = "BORA", Type = SymbolType.Crypto },
            new SymbolField { ID = "SRM-USD", Text = "Serum", Type = SymbolType.Crypto },
            new SymbolField { ID = "SKL-USD", Text = "SKALE Network", Type = SymbolType.Crypto },
            new SymbolField { ID = "JST-USD", Text = "JUST", Type = SymbolType.Crypto },
            new SymbolField { ID = "AUDIO-USD", Text = "Audius", Type = SymbolType.Crypto },
            new SymbolField { ID = "IOTX-USD", Text = "IoTeX", Type = SymbolType.Crypto },
            new SymbolField { ID = "ANKR-USD", Text = "Ankr", Type = SymbolType.Crypto },
            new SymbolField { ID = "CHSB-USD", Text = "SwissBorg", Type = SymbolType.Crypto },
            new SymbolField { ID = "RVN-USD", Text = "Ravencoin", Type = SymbolType.Crypto },
            new SymbolField { ID = "USDD-USD", Text = "USDD", Type = SymbolType.Crypto },
            new SymbolField { ID = "ZEN-USD", Text = "Horizen", Type = SymbolType.Crypto },
            new SymbolField { ID = "ROSE-USD", Text = "Oasis Network", Type = SymbolType.Crypto },
            new SymbolField { ID = "SC-USD", Text = "Siacoin", Type = SymbolType.Crypto },
            new SymbolField { ID = "GLM-USD", Text = "Golem", Type = SymbolType.Crypto },
            new SymbolField { ID = "WAXP-USD", Text = "WAX", Type = SymbolType.Crypto },
            new SymbolField { ID = "BTRST-USD", Text = "Braintrust", Type = SymbolType.Crypto },
            new SymbolField { ID = "ONT-USD", Text = "Ontology", Type = SymbolType.Crypto },
            new SymbolField { ID = "RNDR-USD", Text = "Render Token", Type = SymbolType.Crypto },
            new SymbolField { ID = "NFT-USD", Text = "APENFT", Type = SymbolType.Crypto },
            new SymbolField { ID = "VGX-USD", Text = "Voyager Token", Type = SymbolType.Crypto },
            new SymbolField { ID = "SXP-USD", Text = "SXP", Type = SymbolType.Crypto },
            new SymbolField { ID = "GUSD-USD", Text = "Gemini Dollar", Type = SymbolType.Crypto },
            new SymbolField { ID = "RLY-USD", Text = "Rally", Type = SymbolType.Crypto },
            new SymbolField { ID = "WOO-USD", Text = "WOO Network", Type = SymbolType.Crypto },
            new SymbolField { ID = "ENS-USD", Text = "Ethereum Name Service", Type = SymbolType.Crypto },
            new SymbolField { ID = "RENBTC-USD", Text = "renBTC", Type = SymbolType.Crypto },
            new SymbolField { ID = "IMX-USD", Text = "Immutable X", Type = SymbolType.Crypto },
            new SymbolField { ID = "ILV-USD", Text = "Illuvium", Type = SymbolType.Crypto },
            new SymbolField { ID = "HIVE-USD", Text = "Hive", Type = SymbolType.Crypto },
            new SymbolField { ID = "CEL-USD", Text = "Celsius", Type = SymbolType.Crypto },
            new SymbolField { ID = "DGB-USD", Text = "DigiByte", Type = SymbolType.Crypto },
            new SymbolField { ID = "MXC-USD", Text = "MXC", Type = SymbolType.Crypto },
            new SymbolField { ID = "UMA-USD", Text = "UMA", Type = SymbolType.Crypto },
            new SymbolField { ID = "STORJ-USD", Text = "Storj", Type = SymbolType.Crypto },
            new SymbolField { ID = "TWT-USD", Text = "Trust Wallet Token", Type = SymbolType.Crypto },
            new SymbolField { ID = "CSPR-USD", Text = "Casper", Type = SymbolType.Crypto },
            new SymbolField { ID = "FXS-USD", Text = "Frax Share", Type = SymbolType.Crypto },
            new SymbolField { ID = "ACA-USD", Text = "Acala Token", Type = SymbolType.Crypto },
            new SymbolField { ID = "VLX-USD", Text = "Velas", Type = SymbolType.Crypto },
            new SymbolField { ID = "FLUX-USD", Text = "Flux", Type = SymbolType.Crypto },
            new SymbolField { ID = "PLA-USD", Text = "PlayDapp", Type = SymbolType.Crypto },
            new SymbolField { ID = "POLY-USD", Text = "Polymath", Type = SymbolType.Crypto },
            new SymbolField { ID = "SUSHI-USD", Text = "SushiSwap", Type = SymbolType.Crypto },
            new SymbolField { ID = "REN-USD", Text = "Ren", Type = SymbolType.Crypto },
            new SymbolField { ID = "CKB-USD", Text = "Nervos Network", Type = SymbolType.Crypto },
            new SymbolField { ID = "KEEP-USD", Text = "Keep Network", Type = SymbolType.Crypto },
            new SymbolField { ID = "TEL-USD", Text = "Telcoin", Type = SymbolType.Crypto },
            new SymbolField { ID = "MX-USD", Text = "MX TOKEN", Type = SymbolType.Crypto },
            new SymbolField { ID = "XCH-USD", Text = "Chia", Type = SymbolType.Crypto },
            new SymbolField { ID = "XNO-USD", Text = "Nano", Type = SymbolType.Crypto },
            new SymbolField { ID = "WIN-USD", Text = "WINkLink", Type = SymbolType.Crypto },
            new SymbolField { ID = "CFX-USD", Text = "Conflux", Type = SymbolType.Crypto },
            new SymbolField { ID = "CEEK-USD", Text = "CEEK VR", Type = SymbolType.Crypto },
            new SymbolField { ID = "LSK-USD", Text = "Lisk", Type = SymbolType.Crypto },
            new SymbolField { ID = "OCEAN-USD", Text = "Ocean Protocol", Type = SymbolType.Crypto },
            new SymbolField { ID = "DAO-USD", Text = "DAO Maker", Type = SymbolType.Crypto },
            new SymbolField { ID = "RAY-USD", Text = "Raydium", Type = SymbolType.Crypto },
            new SymbolField { ID = "DAG-USD", Text = "Constellation", Type = SymbolType.Crypto },
            new SymbolField { ID = "XYO-USD", Text = "XYO", Type = SymbolType.Crypto },
            new SymbolField { ID = "XPRT-USD", Text = "Persistence", Type = SymbolType.Crypto },
            new SymbolField { ID = "MED-USD", Text = "MediBloc", Type = SymbolType.Crypto },
            new SymbolField { ID = "XDB-USD", Text = "DigitalBits", Type = SymbolType.Crypto },
            new SymbolField { ID = "DYDX-USD", Text = "dYdX", Type = SymbolType.Crypto },
            new SymbolField { ID = "ORBS-USD", Text = "Orbs", Type = SymbolType.Crypto },
            new SymbolField { ID = "CHR-USD", Text = "Chromia", Type = SymbolType.Crypto },
            new SymbolField { ID = "FET-USD", Text = "Fetch.ai", Type = SymbolType.Crypto },
            new SymbolField { ID = "TRIBE-USD", Text = "Tribe", Type = SymbolType.Crypto },
            new SymbolField { ID = "SPELL-USD", Text = "Spell Token", Type = SymbolType.Crypto },
            new SymbolField { ID = "REV-USD", Text = "Revain", Type = SymbolType.Crypto },
            new SymbolField { ID = "COTI-USD", Text = "COTI", Type = SymbolType.Crypto },
            new SymbolField { ID = "SYS-USD", Text = "Syscoin", Type = SymbolType.Crypto },
            new SymbolField { ID = "INJ-USD", Text = "Injective", Type = SymbolType.Crypto },
            new SymbolField { ID = "REQ-USD", Text = "Request", Type = SymbolType.Crypto },
            new SymbolField { ID = "CELR-USD", Text = "Celer Network", Type = SymbolType.Crypto },
            new SymbolField { ID = "DIVI-USD", Text = "Divi", Type = SymbolType.Crypto },
            new SymbolField { ID = "NU-USD", Text = "NuCypher", Type = SymbolType.Crypto },
            new SymbolField { ID = "SNT-USD", Text = "Status", Type = SymbolType.Crypto },
            new SymbolField { ID = "CTSI-USD", Text = "Cartesi", Type = SymbolType.Crypto },
            new SymbolField { ID = "PUNDIX-USD", Text = "Pundi X (New)", Type = SymbolType.Crypto },
            new SymbolField { ID = "JOE-USD", Text = "JOE", Type = SymbolType.Crypto },
            new SymbolField { ID = "POWR-USD", Text = "Powerledger", Type = SymbolType.Crypto },
            new SymbolField { ID = "ONG-USD", Text = "Ontology Gas", Type = SymbolType.Crypto },
            new SymbolField { ID = "PYR-USD", Text = "Vulcan Forged PYR", Type = SymbolType.Crypto },
            new SymbolField { ID = "DENT-USD", Text = "Dent", Type = SymbolType.Crypto },
            new SymbolField { ID = "UOS-USD", Text = "Ultra", Type = SymbolType.Crypto },
            new SymbolField { ID = "CVC-USD", Text = "Civic", Type = SymbolType.Crypto },
            new SymbolField { ID = "RGT-USD", Text = "Rari Governance Token", Type = SymbolType.Crypto },

        };

}