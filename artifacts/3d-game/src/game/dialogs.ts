import { DialogContent } from "./types";

export const DIALOGS: Record<string, (state: { income: number; deductions: number; withheld: number; visitedBuildings: string[] }) => DialogContent> = {
  workcorp: ({ visitedBuildings }) => ({
    buildingId: "workcorp",
    title: "💼 WorkCorp — Payroll Department",
    body: visitedBuildings.includes("workcorp")
      ? "You already received your paycheck this year! You earned $48,000 gross salary with $6,200 withheld for federal taxes."
      : `Welcome! Your annual salary is $48,000.\n\nYour employer withholds $6,200 for federal income taxes throughout the year (this is called "withholding"). You'll get a W-2 form showing this.\n\nFact: Employers withhold taxes each paycheck so you don't owe a huge lump sum in April!`,
    action: visitedBuildings.includes("workcorp") ? undefined : "earn",
    amount: 48000,
  }),

  taxmart: () => ({
    buildingId: "taxmart",
    title: "🛒 TaxMart — Deduction Shopping",
    body: "Some purchases can be deducted from your taxable income! Choose wisely — only legitimate work-related or qualifying expenses reduce your taxes.",
    options: [
      {
        id: "laptop",
        name: "Laptop for Work",
        cost: 1200,
        deductible: true,
        deductibleAmount: 1200,
        reason: "Work-related equipment is deductible as a business expense!",
        category: "Business",
      },
      {
        id: "charity",
        name: "Charitable Donation ($500)",
        cost: 500,
        deductible: true,
        deductibleAmount: 500,
        reason: "Donations to qualified charities are tax-deductible!",
        category: "Charitable",
      },
      {
        id: "student_loan",
        name: "Student Loan Interest ($800)",
        cost: 800,
        deductible: true,
        deductibleAmount: 800,
        reason: "You can deduct up to $2,500 of student loan interest!",
        category: "Education",
      },
      {
        id: "vacation",
        name: "Personal Vacation ($2,000)",
        cost: 2000,
        deductible: false,
        deductibleAmount: 0,
        reason: "Personal expenses like vacations are NOT deductible. Only business/qualifying expenses count!",
        category: "Personal",
      },
      {
        id: "groceries",
        name: "Groceries ($600)",
        cost: 600,
        deductible: false,
        deductibleAmount: 0,
        reason: "Ordinary groceries are NOT deductible — they're a personal expense.",
        category: "Personal",
      },
    ],
  }),

  firstbank: ({ income, deductions }) => ({
    buildingId: "firstbank",
    title: "🏦 First Bank — Financial Education",
    body: `Learn about how taxes work!\n\n📖 TAX BRACKETS (2024 Single Filer):\n• 10% on income up to $11,600\n• 12% on $11,600–$47,150\n• 22% on $47,150–$100,525\n\n📖 STANDARD DEDUCTION:\nEvery filer gets $14,600 deducted automatically. Your additional deductions reduce this further!\n\n📖 EFFECTIVE VS MARGINAL RATE:\nYour highest bracket is your "marginal rate" but you only pay that rate on income IN that bracket. Your average tax rate is called the "effective rate".\n\n💡 At your income of $${income.toLocaleString()}, only the income above $11,600 is taxed at 12% — not your whole income!`,
    action: "bank",
  }),

  university: () => ({
    buildingId: "university",
    title: "🎓 MoneyBot University — Student Loans 101",
    body: `Welcome to MoneyBot U! Today's lecture: STUDENT LOANS — what every grad needs to know.\n\n📖 FEDERAL vs PRIVATE:\nFederal loans (Direct Subsidized/Unsubsidized, PLUS) come with fixed rates, flexible repayment plans, and forgiveness options. Private loans usually have variable rates, fewer protections, and no income-based repayment.\n\n📖 SUBSIDIZED vs UNSUBSIDIZED:\nOn SUBSIDIZED loans, the government pays your interest while you're in school. On UNSUBSIDIZED loans, interest accrues from day one — it can capitalize (get added to principal) after the grace period, growing what you owe.\n\n📖 REPAYMENT PLANS:\n• Standard — 10 years, fixed payments\n• Income-Driven (SAVE, IBR, PAYE) — caps payments at a % of discretionary income\n• Public Service Loan Forgiveness (PSLF) — 120 qualifying payments while working for a qualifying employer wipes the rest\n\n📖 THE TAX ANGLE:\nYou can deduct up to $2,500 of student loan interest each year — even if you take the standard deduction. That's an "above-the-line" deduction. Sound familiar? You saw it on the shelf at TaxMart! 🛒\n\n💡 Lesson: Borrow federal first, only what you need, and never ignore the interest clock on unsubsidized loans.`,
    action: "study",
  }),

  bottrain: () => ({
    buildingId: "bottrain",
    title: "🚆 BotTrain Station — Commute vs Business Travel",
    body: `All aboard! Today's lesson: not all train rides are tax-equal.\n\n📖 YOUR DAILY COMMUTE — NOT DEDUCTIBLE:\nThe ride between home and your regular workplace is "commuting" — even if it's expensive, even if it's far. The IRS considers it a personal expense.\n\n📖 BUSINESS TRAVEL — DEDUCTIBLE:\nTraveling to a client site, a conference, or a temporary work location (away from your tax home) IS deductible. Train tickets, taxis, mileage — keep the receipts.\n\n📖 PRE-TAX COMMUTER BENEFITS:\nMany employers offer a commuter benefits plan: you can use pre-tax dollars (up to $315/month in 2024) for transit passes and parking. It's not a deduction — it just lowers your taxable wages before they even hit your paycheck.\n\n💡 Lesson: Keep a log of business trips. Save the receipts. Your daily commute doesn't count — but that conference trip definitely does.`,
    action: "train",
  }),

  botstadium: () => ({
    buildingId: "botstadium",
    title: "🏟️ BotStadium — Entertainment & Gambling Taxes",
    body: `Welcome to BotStadium — home of the BotCity Robots! Today's lesson covers two stadium-flavored tax topics.\n\n📖 ENTERTAINMENT EXPENSES (the big TCJA change):\nBefore 2018, businesses could deduct 50% of entertainment costs — concert tickets, sports box seats, golf outings with clients. The Tax Cuts and Jobs Act killed that. Today, client entertainment is generally NOT deductible at all. Meals are still 50% deductible if there's a clear business purpose.\n\n📖 GAMBLING WINNINGS — TAXABLE INCOME:\nThat lucky parlay you hit? It's taxable. Casinos and sportsbooks issue Form W-2G when you win $600+ (and the threshold varies by game). You report ALL winnings, even small ones — not just the W-2G amount.\n\n📖 GAMBLING LOSSES — LIMITED DEDUCTION:\nYou can deduct losses ONLY if you itemize, and only up to the amount of your winnings for the year. So if you won $1,000 and lost $1,500, you can only deduct $1,000. The other $500 is gone.\n\n💡 Lesson: Sports tickets aren't deductible. Gambling winnings are taxable. Keep a log if you gamble seriously.`,
    action: "stadium",
  }),

  botmarket: () => ({
    buildingId: "botmarket",
    title: "🛍️ BotMarket — Self-Employment & Sales Tax",
    body: `Welcome to BotMarket! Selling stuff sounds simple — until tax season. Here's what every market vendor needs to know.\n\n📖 SELF-EMPLOYMENT TAX:\nIf you sell goods or services for profit, you owe SELF-EMPLOYMENT tax — 15.3% on net earnings (12.4% Social Security + 2.9% Medicare). That's ON TOP of regular income tax. Why? Because there's no employer to split FICA with you; you cover both halves.\n\n📖 SALES TAX vs INCOME TAX:\nSales tax is collected FROM your customers and remitted to your state — it's never your money. Income tax is on YOUR net profit (revenue minus expenses).\n\n📖 1099-K REPORTING:\nIf you sell through a payment processor (Square, PayPal, Etsy, etc.), they'll issue a 1099-K when your sales cross the federal threshold. As of recent rules, that threshold has been dropping — assume you'll get one if you process more than a few thousand dollars.\n\n📖 BUSINESS EXPENSES:\nInventory, booth fees, mileage to the market, packaging, supplies — all deductible on Schedule C, reducing your taxable profit.\n\n💡 Lesson: Selling for profit means SE tax + income tax. Track expenses religiously — they shrink your tax bill.`,
    action: "market",
  }),

  botbeach: () => ({
    buildingId: "botbeach",
    title: "🏖️ BotBeach — Vacation vs Business Travel",
    body: `Welcome to BotBeach! Sand, sun, and... tax rules. Here's how the IRS treats your getaway.\n\n📖 VACATIONS ARE NOT DEDUCTIBLE:\nA pure pleasure trip — even if you brought your laptop and answered a few emails — is a PERSONAL expense. Flights, hotels, meals, all of it: not deductible.\n\n📖 "WORKATION" / MIXED TRIPS:\nMixed business + leisure trips are deductible ONLY for the business portion. If you spent 4 days at a conference and 3 days lounging, you deduct flights only if business days >50%, and lodging/meals only for business days.\n\n📖 REMOTE WORK FROM THE BEACH:\nWorking remotely from a vacation rental doesn't turn it into a business trip. Your "tax home" is where you regularly work. A change of scenery is personal preference, not a business need.\n\n📖 HOME OFFICE RULES (the real deduction):\nIf you're self-employed and have a SPECIFIC space used REGULARLY and EXCLUSIVELY for business, you can deduct a portion of rent, utilities, and internet. The space at your beach Airbnb doesn't qualify.\n\n💡 Lesson: Vacations are personal. Real business travel needs a real business purpose. Sand is wonderful, but it isn't a deduction.`,
    action: "beach",
  }),

  botshops: () => ({
    buildingId: "botshops",
    title: "🏪 BotShops Plaza — Hobby vs Business",
    body: `Welcome to BotShops Plaza! Whether you sell coffee, books, games, or pastries, the same question matters: hobby or business?\n\n📖 THE HOBBY vs BUSINESS TEST:\nThe IRS looks at PROFIT MOTIVE. Rule of thumb: if you've earned a profit in 3 of the last 5 years, you're presumed to be a business. Other factors: do you keep books, market actively, have a separate bank account, and depend on the income?\n\n📖 WHY IT MATTERS:\n• BUSINESS: Report on Schedule C. Deduct all ordinary & necessary expenses. Losses can offset other income.\n• HOBBY: Report income as "other income" (no Schedule C). After 2017, hobby expenses are NOT deductible at all.\n\nThat asymmetry is brutal: a hobby pays full tax on revenue but can't subtract costs.\n\n📖 ORDINARY & NECESSARY EXPENSES:\nFor a business, you can deduct what's "ordinary" (common in your trade) and "necessary" (helpful for the business). Espresso beans for a coffee shop? Yes. A jet ski "for client meetings"? Probably not.\n\n📖 QUARTERLY ESTIMATED TAXES:\nIf you expect to owe $1,000+ at year end (federal), you should pay quarterly estimates (April, June, Sept, Jan). Otherwise: underpayment penalties.\n\n💡 Lesson: Treat your side gig like a business — books, separate account, profit motive — or accept the hobby tax hit.`,
    action: "shops",
  }),

  moneybottowers: () => ({
    buildingId: "moneybottowers",
    title: "🏢 MoneyBot Towers — Corporate Tax & Entity Choice",
    body: `Welcome to MoneyBot Towers — global HQ of MoneyBot Inc. The view is great, but the real story is what entity you pick when you start a business. Choose wrong and you'll pay tax twice on the same dollar.\n\n📖 ENTITY CHOICES AT A GLANCE:\n• SOLE PROP / SCHEDULE C — No legal separation. Profits hit your 1040. Simple, but unlimited personal liability.\n• LLC — Legal liability shield. By default taxed like a sole prop (single member) or partnership (multi-member). Can elect S-Corp or C-Corp treatment.\n• S-CORP — Pass-through taxation (no entity-level tax). Profits flow to owners' returns. Owner-employees must pay themselves "reasonable compensation" as W-2 wages.\n• C-CORP — Separate taxpayer. Pays a flat 21% federal corporate tax. Then shareholders pay tax AGAIN on dividends.\n\n📖 THE DOUBLE-TAXATION TRAP:\nC-Corp earns $100 → pays $21 corporate tax → $79 left. Distributes as dividend → shareholder pays up to 20% qualified dividend tax → another ~$16. Final: ~$63 of the original $100. That's the C-Corp tax cost.\n\n📖 WHY S-CORP IS POPULAR:\nAn S-Corp owner can split income into (a) reasonable W-2 wages (subject to payroll tax ~15.3%) and (b) distributions (NOT subject to payroll tax). The distribution slice avoids self-employment tax — a real savings vs Schedule C. But "reasonable compensation" is enforced; underpaying yourself invites an IRS reclassification.\n\n📖 QBI DEDUCTION (§199A):\nPass-through owners (sole prop, partnership, S-Corp) can deduct up to 20% of qualified business income — a powerful break that effectively lowers your top rate. Phaseouts apply to "specified service trades" (law, health, consulting, finance) above income thresholds (~$232k single / ~$464k joint in 2024).\n\n📖 STOCK OPTIONS (ISO vs NSO):\n• ISO (Incentive Stock Option) — Employees only. No regular tax at exercise, but the spread is an AMT preference item. Long-term capital gain treatment if you hold 2 years from grant + 1 year from exercise.\n• NSO (Non-qualified Stock Option) — Spread between strike and FMV at exercise is ORDINARY income (W-2 wages). Subsequent gain after exercise is capital gain.\n\n📖 EXECUTIVE COMP & §83(b):\nGet restricted stock instead of options? An §83(b) election lets you pay tax NOW on the (usually tiny) value at grant, instead of later when the stock has appreciated. Risky if the stock craters, but huge upside if it moons.\n\n💡 Lesson: LLC for liability shield, S-Corp election to split wages+distributions, QBI deduction for pass-throughs, watch ISO/AMT, and remember §83(b) timing on restricted stock.`,
    action: "tower",
  }),

  botfarm: () => ({
    buildingId: "botfarm",
    title: "🚜 BotFarm — Farming & Schedule F",
    body: `Welcome to BotFarm! Farming has its own corner of the tax code. Here's what every grower needs to know.\n\n📖 SCHEDULE F (NOT SCHEDULE C):\nFarmers report profits and losses on Schedule F, not Schedule C. It covers crops, livestock, dairy, poultry — anything raised for sale. Hobby gardens don't qualify; you need a profit motive.\n\n📖 CASH vs ACCRUAL ACCOUNTING:\nMost farms use the cash method — income when you receive it, expenses when you pay. Accrual method matches income to the year it was earned. Cash is simpler and most family farms stick with it.\n\n📖 SECTION 179 + BONUS DEPRECIATION:\nNew tractor? Combine? Grain bin? You can often deduct a huge chunk (or all) of the cost in year one via Section 179 or bonus depreciation, instead of spreading it over 5-7 years. Powerful, but the deduction can't exceed your farm income (the excess carries forward).\n\n📖 INCOME AVERAGING (SCHEDULE J):\nFarming income swings wildly with weather and prices. Schedule J lets a farmer "average" a great year's income over the prior 3 years' brackets — softening the bracket-jump hit when one harvest is huge.\n\n📖 CROP INSURANCE & DISASTER PAYMENTS:\nCrop insurance proceeds are TAXABLE income, but a farmer can often defer them one year if the crop would've sold next year. Disaster relief payments work similarly. Document everything.\n\n📖 CONSERVATION RESERVE PROGRAM (CRP):\nPayments for taking acreage out of production are taxable. They may or may not be subject to self-employment tax depending on whether you're materially involved.\n\n📖 ESTATE PLANNING (THE FAMILY-FARM ANGLE):\nWhen a farm passes to heirs, the assets get a "stepped-up basis" to fair market value at death — wiping out decades of unrealized gain. Special-use valuation (§2032A) can further reduce estate tax for working farms passed within the family.\n\n💡 Lesson: Schedule F. Section 179 for equipment. Schedule J for swings. Crop insurance is taxable. Estate stepped-up basis is huge for family farms.`,
    action: "farm",
  }),

  botdealer: () => ({
    buildingId: "botdealer",
    title: "🚗 BotDealer — Buy a BotMobile",
    body: `Welcome to BotDealer! Buying a vehicle is a tax-loaded decision. Each BotMobile below carries different tax consequences. Read carefully before you pick one off the lot.\n\n📖 PERSONAL USE:\nA daily driver is a personal expense. You pay sales tax at purchase, but the car itself is NOT deductible. Commuting between home and your regular workplace is also NEVER deductible — no matter how fancy the car.\n\n📖 BUSINESS USE:\nIf the vehicle is used for business (NOT commuting), you have two options:\n• Standard mileage rate: 67¢/mile in 2024\n• Actual expenses: gas, insurance, maintenance, depreciation, Section 179\nSection 179 lets you deduct a large chunk of the cost in year one — for heavier vehicles (>6,000 lbs GVWR) the limit is more generous.\n\n📖 EV TAX CREDIT (the big one):\nQualified new clean vehicles can earn a federal credit up to $7,500. Credits beat deductions: a $7,500 credit reduces your TAX by $7,500. A $7,500 deduction at the 12% bracket only saves you $900. Big difference. Income limits and battery sourcing rules apply.`,
    options: [
      {
        id: "botmobile_commuter",
        name: "BotMobile Commuter — Daily Driver ($25,000)",
        cost: 25000,
        deductible: false,
        deductibleAmount: 0,
        reason:
          "Personal vehicle for commuting. NOT deductible — commuting is always a personal expense. (You still pay sales tax.)",
        category: "Personal",
      },
      {
        id: "botmobile_pro",
        name: "BotMobile Pro — 100% Business Use ($35,000)",
        cost: 35000,
        deductible: true,
        deductibleAmount: 12000,
        reason:
          "Used exclusively for business. Eligible for Section 179 — deducting ~$12,000 in year one (depreciation continues in later years).",
        category: "Business",
      },
      {
        id: "botmobile_ev",
        name: "BotMobile EV — Qualified Clean Vehicle ($40,000)",
        cost: 40000,
        deductible: true,
        deductibleAmount: 7500,
        reason:
          "Qualifies for the federal Clean Vehicle Credit up to $7,500. Note: a real CREDIT reduces tax dollar-for-dollar — way more powerful than the deduction this game models.",
        category: "EV Credit",
      },
    ],
  }),

  botplane: () => ({
    buildingId: "botplane",
    title: "✈️ BotPlane Airport — Business Travel Deductions",
    body: `Welcome to BotPlane International! Time to learn what you can write off when you fly.\n\n📖 DEDUCTIBLE BUSINESS TRAVEL:\nFlights, hotels, baggage fees, rental cars, and ground transport for work trips are deductible (for self-employed and certain business travelers). The trip must have a clear business purpose and be "away from your tax home."\n\n📖 MEALS — THE 50% RULE:\nMeals while traveling for business are only 50% deductible. So a $40 dinner on a work trip → $20 write-off.\n\n📖 PER DIEM:\nInstead of tracking every receipt, the IRS publishes daily allowance rates by city. If your employer reimburses at or below per diem, the reimbursement is tax-free to you.\n\n📖 MIXING BUSINESS + PLEASURE:\nTacked a vacation onto a work trip? Only the business portion is deductible. You can't write off the extra days you spent at the beach.\n\n💡 Lesson: A business trip is a tax-deductible expense. A vacation is not. The IRS cares about the primary PURPOSE of the trip.`,
    action: "plane",
  }),

  bothospital: () => ({
    buildingId: "bothospital",
    title: "🏥 BotHospital — HSAs, FSAs & Medical Deductions",
    body: `Welcome to BotHospital! Health care has its own tax playbook. Three big ideas:\n\n📖 HSA (Health Savings Account) — the triple-tax-advantaged unicorn:\n• Contributions: pre-tax (or above-the-line if you contribute yourself)\n• Growth: tax-free\n• Withdrawals: tax-free if used for qualified medical expenses\nYou must be enrolled in a High-Deductible Health Plan (HDHP) to contribute. 2024 limits: $4,150 self-only / $8,300 family. After age 65 you can use HSA funds for anything (just pay regular income tax, no penalty).\n\n📖 FSA (Flexible Spending Account):\nAlso pre-tax dollars for medical (or dependent-care) expenses, but USE IT OR LOSE IT each year. Limited rollover (typically up to $640). Funded via payroll deduction; lowers your W-2 wages directly.\n\n📖 MEDICAL EXPENSE DEDUCTION (Schedule A):\nIf you itemize, you can deduct unreimbursed medical expenses ABOVE 7.5% of AGI. So at $50k AGI, only costs above $3,750 count. High threshold — most filers can't use it.\n\n💡 Lesson: Max your HSA if you have an HDHP — it's the most tax-efficient account in the code. FSAs are decent but volatile. The Schedule A medical deduction is real but rarely triggers.`,
    action: "hospital",
  }),

  botcharity: () => ({
    buildingId: "botcharity",
    title: "❤️ BotCharity Center — Giving & Tax Deductions",
    body: `Welcome to the BotCharity Center! Generosity has tax consequences — usually good ones.\n\n📖 ONLY ITEMIZERS GET THE DEDUCTION:\nCharitable contributions are an ITEMIZED deduction (Schedule A). If you take the standard deduction ($14,600 single), donations don't reduce your tax bill. The COVID-era $300 above-the-line allowance has expired.\n\n📖 QUALIFIED ORGANIZATIONS ONLY:\n501(c)(3) public charities count. GoFundMe campaigns for individuals do NOT. Political donations do NOT. Check the IRS Tax Exempt Organization Search.\n\n📖 CASH vs PROPERTY:\n• Cash: deduct up to 60% of AGI\n• Long-term appreciated stock: deduct FAIR MARKET VALUE up to 30% of AGI — and skip capital gains entirely. This is a power move for high earners.\n• Used goods: deduct fair market value, not original price. Need a receipt for anything $250+.\n\n📖 BUNCHING + DAFs:\nSince the standard deduction is high, many filers "bunch" 2-3 years of donations into one year to clear the standard-deduction hurdle. A Donor-Advised Fund (DAF) lets you take the deduction now and dole grants out over time.\n\n📖 QCDs (QUALIFIED CHARITABLE DISTRIBUTIONS):\nAge 70½+? Donate directly from your IRA (up to $105k/yr). It counts toward your RMD and is excluded from income — even if you don't itemize. Best deal in the tax code for retirees who give.\n\n💡 Lesson: Bunch donations to clear the standard deduction. Give appreciated stock, not cash. Use a DAF or QCD if it fits.`,
    action: "charity",
  }),

  botcrypto: () => ({
    buildingId: "botcrypto",
    title: "₿ BotCrypto Exchange — Capital Gains & 1099-B",
    body: `Welcome to BotCrypto! Trading digital assets means you're a taxpayer with extra paperwork.\n\n📖 EVERY SALE IS A TAXABLE EVENT:\nSelling crypto, swapping one coin for another, spending crypto on goods — all trigger CAPITAL GAINS or LOSSES. The IRS treats crypto as PROPERTY, not currency.\n\n📖 SHORT-TERM vs LONG-TERM:\n• Held ≤ 1 year → taxed as ORDINARY INCOME (your regular bracket: 10-37%)\n• Held > 1 year → LONG-TERM capital gains: 0%, 15%, or 20% (most filers: 15%)\nHolding period matters enormously. A 1-day-shy-of-a-year sale can cost you double.\n\n📖 COST BASIS — TRACK EVERY LOT:\nYour gain = sale price − cost basis. If you bought 1 BTC at $30k and sold at $60k, that's a $30k gain. Exchanges issue Form 1099-B (or 1099-DA going forward) but historically the basis info has been spotty. Keep your own records.\n\n📖 WASH SALE RULES (currently STOCKS only):\nThe 30-day wash sale rule applies to securities. Crypto is NOT a security, so as of now you CAN sell at a loss and immediately re-buy. (Congress has flirted with closing this loophole — watch this space.)\n\n📖 TAX-LOSS HARVESTING:\nSell losers to offset winners. Up to $3,000 of net capital losses can offset ORDINARY income each year; the rest carries forward indefinitely.\n\n📖 STAKING, MINING, AIRDROPS:\nAll treated as ORDINARY INCOME at fair market value when received. Then a separate capital gain/loss when you eventually sell.\n\n💡 Lesson: Hold > 1 year for the cap-gains rate. Track basis obsessively. Harvest losses. Staking income is ordinary, not capital.`,
    action: "crypto",
  }),

  botretirement: () => ({
    buildingId: "botretirement",
    title: "🏛️ BotRetirement Plaza — 401(k), IRA & Roth",
    body: `Welcome to BotRetirement Plaza! Retirement accounts are the biggest tax break most people will ever use. Pick the wrong one and you leave thousands on the table.\n\n📖 401(k) — EMPLOYER PLAN:\nContribute pre-tax dollars from your paycheck. 2024 limit: $23,000 (under 50) / $30,500 (50+). Lowers your CURRENT taxable income. Many employers match a percentage — that match is FREE MONEY, always grab at least the full match.\n\n📖 TRADITIONAL IRA:\nContribute up to $7,000 ($8,000 if 50+) on your own. May be deductible (income-dependent if you also have a workplace plan). Same idea as 401(k): tax now, pay later.\n\n📖 ROTH 401(k) / ROTH IRA — THE FLIP:\nContribute POST-tax dollars. Growth is tax-free. Qualified withdrawals are tax-free. Best for younger filers who expect higher tax rates in retirement. Roth IRA has income limits ($161k single / $240k joint, 2024) — but the BACKDOOR ROTH (contribute to Traditional, immediately convert) sidesteps the limit.\n\n📖 RMDs (REQUIRED MINIMUM DISTRIBUTIONS):\nTraditional accounts force you to withdraw starting at age 73 (rising to 75) — and pay tax on every dollar. Roth IRAs have NO RMD during the owner's life. Roth wins on flexibility.\n\n📖 THE FRAMEWORK (in order):\n1. 401(k) up to the employer match\n2. Max HSA if you have one ($4,150 / $8,300)\n3. Max Roth IRA ($7,000) if eligible\n4. Back to 401(k) up to $23,000\n5. After-tax 401(k) → mega-backdoor Roth (advanced)\n\n📖 EARLY WITHDRAWAL PENALTY:\nPulling from a Traditional 401(k)/IRA before age 59½ usually costs you a 10% penalty + ordinary income tax. Roth contributions (not earnings) can come out anytime, tax- and penalty-free.\n\n💡 Lesson: Grab the employer match first. Tax-now (Roth) vs tax-later (Traditional) depends on your future bracket — when in doubt, split. HSAs beat both for medical costs.`,
    action: "retirement",
  }),

  bothaus: () => ({
    buildingId: "bothaus",
    title: "🏠 BotHaus — Homeownership & Taxes",
    body: `Welcome to BotHaus! Owning a home is one of the biggest tax events most people ever experience. The code is full of breaks — and traps.\n\n📖 MORTGAGE INTEREST DEDUCTION:\nDeductible on Schedule A (itemizers only) for interest on up to $750k of home-acquisition debt (loans after Dec 2017). Older "grandfathered" loans get $1M. Refinances inherit the original cap. HELOCs are only deductible if used to "buy, build, or substantially improve" the home.\n\n📖 PROPERTY TAXES + THE SALT CAP:\nState & local taxes (property + state income OR state sales) are deductible — but TOTAL SALT is capped at $10,000 per return ($5k MFS). High-tax states feel this badly. The cap is scheduled to sunset after 2025 unless Congress extends it.\n\n📖 POINTS:\nMortgage points paid at purchase are typically deductible in the year paid. Refi points must be amortized over the life of the loan.\n\n📖 HOME SALE EXCLUSION (§121):\nThe crown jewel. Live in your primary residence 2 of the last 5 years → you can EXCLUDE up to $250k of capital gain (single) / $500k (married joint) when you sell. No 1099 needed below the threshold. This is one of the most valuable provisions in the code.\n\n📖 FIRST-TIME HOMEBUYER & STATE CREDITS:\nMany states offer credits for first-time buyers, mortgage credit certificates (MCCs), or property-tax freezes for seniors. Always check state-level perks; they're easy to miss.\n\n📖 HOME OFFICE:\nIf you're SELF-EMPLOYED and use part of your home REGULARLY and EXCLUSIVELY for business, you can deduct a percentage (Form 8829). W-2 employees can NOT deduct a home office post-TCJA — even if their employer requires remote work.\n\n📖 RENTAL CONVERSION TRAP:\nConverting your home to a rental, then selling, partially disqualifies the §121 exclusion. Plan timing carefully if you ever move out.\n\n💡 Lesson: Mortgage interest + property tax help only if you itemize. The §121 home sale exclusion is the real prize. Watch the SALT cap. Home office is self-employed only.`,
    action: "haus",
  }),

  botbroker: () => ({
    buildingId: "botbroker",
    title: "📈 BotBroker — Stocks, Dividends & RSUs",
    body: `Welcome to BotBroker! Traditional securities follow different rules than crypto. Here's the playbook for stocks, dividends, and equity comp.\n\n📖 CAPITAL GAINS (FAMILIAR BUT DIFFERENT):\nSame holding-period rules as crypto: short-term (≤1 year) = ordinary income; long-term (>1 year) = 0%/15%/20%. The key difference: stocks ARE securities, so the WASH SALE rule applies.\n\n📖 WASH SALE RULE:\nSell a stock at a loss, then buy the same (or "substantially identical") stock within 30 days BEFORE or AFTER — the loss is DISALLOWED. The disallowed loss adds to your basis in the replacement shares. Common trap: harvesting losses in December and rebuying in January (still within the 60-day window).\n\n📖 QUALIFIED vs ORDINARY DIVIDENDS:\n• Qualified dividends (most US stocks held >60 days): taxed at LONG-TERM cap gains rates (0/15/20%)\n• Ordinary dividends (REITs, MLPs, short holding): taxed at your regular bracket\nThe broker reports both on 1099-DIV. Big difference in tax bill — favor qualified payers in taxable accounts.\n\n📖 RSUs (RESTRICTED STOCK UNITS):\nVest → counted as W-2 wages at the fair market value on vest date. Your employer typically sells some shares to cover withholding (often 22% — usually NOT enough for high earners). Holding the rest creates a NEW capital-gain clock from the vest date. Most RSU horror stories come from people thinking they were taxed only on sale.\n\n📖 ISOs vs NSOs:\n• NSOs (non-qualified options): ordinary income on the spread at exercise. Simple.\n• ISOs (incentive stock options): no regular tax at exercise — BUT the spread is AMT preference income. Exercising big ISO grants can trigger massive AMT bills. Plan with a tax pro.\n\n📖 ESPP (EMPLOYEE STOCK PURCHASE PLAN):\nUsually 15% discount on company stock. Qualified ESPP: hold ≥2 years from grant + ≥1 year from purchase → most of the gain is long-term. Otherwise the discount is taxed as ordinary wages.\n\n📖 NIIT (NET INVESTMENT INCOME TAX):\nAn extra 3.8% on investment income if your MAGI exceeds $200k single / $250k MFJ. Stealth tax most people don't realize they owe.\n\n💡 Lesson: Hold > 1 year for the cap-gains rate. Watch wash sales. RSU vesting is W-2 income. Qualified dividends beat ordinary. Plan around AMT for ISOs.`,
    action: "broker",
  }),

  botkids: () => ({
    buildingId: "botkids",
    title: "🧒 BotKids — Dependents, CTC & 529s",
    body: `Welcome to BotKids! Children are expensive — but the tax code gives meaningful breaks if you know how to claim them.\n\n📖 CHILD TAX CREDIT (CTC):\n$2,000 per qualifying child under 17 (2024). Up to $1,700 is REFUNDABLE (you get it even if your tax is $0). Phases out above $200k single / $400k MFJ. Credits beat deductions — every $1 of CTC saves $1 of tax.\n\n📖 CREDIT FOR OTHER DEPENDENTS:\n$500 nonrefundable credit for dependents who don't qualify for CTC — older children, parents you support, etc.\n\n📖 EARNED INCOME TAX CREDIT (EITC):\nUp to ~$7,830 (2024, 3+ kids). Refundable. Aimed at low-to-moderate income working families. Hugely underclaimed — ~20% of eligible filers miss it. Phaseouts depend on filing status and # of kids.\n\n📖 CHILD & DEPENDENT CARE CREDIT:\n20-35% of qualifying daycare costs, up to $3,000 of expenses for 1 child or $6,000 for 2+. Both parents must have earned income. Nonrefundable.\n\n📖 DEPENDENT CARE FSA:\nVia your employer: up to $5,000/year of daycare costs PRE-TAX. Better than the credit for most middle-income families. Use-it-or-lose-it.\n\n📖 529 PLANS (COLLEGE SAVINGS):\n• Contributions: NOT federally deductible, but many states give state-tax breaks\n• Growth: tax-FREE\n• Withdrawals for qualified education expenses: tax-FREE\nNon-qualified withdrawals: earnings taxed + 10% penalty. Also: up to $10k/year for K-12 tuition, up to $10k LIFETIME toward student loans.\n\n📖 KIDDIE TAX:\nA child's UNEARNED income (dividends, interest, capital gains) above ~$2,600 is taxed at the PARENTS' rate. Don't try to dump appreciated stock on your kid to avoid your bracket — the IRS caught that one decades ago.\n\n📖 ADOPTION CREDIT:\nUp to $16,810/child (2024) of qualifying expenses, nonrefundable. Phases out at high income.\n\n💡 Lesson: Credits >> deductions. Claim CTC, use the dependent care FSA if you have one, contribute to a 529 for the tax-free growth. Watch the kiddie tax on UTMA accounts.`,
    action: "kids",
  }),

  botgigs: () => ({
    buildingId: "botgigs",
    title: "🛵 BotGigs — 1099 Work & Self-Employment Tax",
    body: `Welcome to BotGigs! Driving for an app, freelancing, consulting, selling crafts — anything where you're paid as a 1099 contractor instead of a W-2 employee has its own tax universe.\n\n📖 SELF-EMPLOYMENT TAX (THE BIG ONE):\nW-2 employees: their employer pays HALF of Social Security + Medicare (FICA, 7.65%). Self-employed people pay BOTH halves = 15.3% on net earnings, on TOP of regular income tax. This is what catches gig workers off guard.\nGood news: you can deduct half of SE tax as an above-the-line adjustment.\n\n📖 SCHEDULE C — PROFIT OR LOSS:\nReport gross income, then deduct business expenses to get NET profit. SE tax + income tax both apply to net, not gross. Common deductions:\n• Mileage (67¢/mile in 2024) — usually beats actual-cost method for app drivers\n• Phone, home office (if applicable)\n• Supplies, equipment, software\n• Health insurance premiums (above-the-line if no other coverage)\n• Half of SE tax\n\n📖 QUARTERLY ESTIMATED TAXES:\nNo employer withholding = you must send the IRS estimated payments 4x/year (Apr 15, Jun 15, Sep 15, Jan 15). Miss them and you owe penalties + interest. Safe harbor: pay 100% of last year's tax (110% if AGI > $150k) and you're penalty-free.\n\n📖 1099-K THRESHOLD CHAOS:\nPlatforms (Venmo, PayPal, Etsy, eBay) now issue 1099-K for business payments above the federal threshold ($5,000 in 2024, dropping to $600 over time). Personal payments to friends shouldn't trigger — but many platforms over-report. Save your records.\n\n📖 QBI DEDUCTION (§199A):\nUp to 20% of qualified business income is DEDUCTIBLE if you're under the income threshold (~$191k single / $383k MFJ in 2024). Above that, "specified service trades" (law, medicine, consulting) get phased out. One of the most valuable post-TCJA provisions.\n\n📖 SOLO 401(k) / SEP-IRA:\nSelf-employed retirement accounts let you stash WAY more than a regular 401(k):\n• Solo 401(k): up to $69k (2024) — employee + employer contributions\n• SEP-IRA: 25% of net SE earnings, up to $69k\nMassive tax shelter for high-earning freelancers.\n\n📖 LLC vs S-CORP:\nAt some profit level (~$60-80k+), electing S-Corp status can save thousands in SE tax by splitting income between "reasonable salary" (FICA owed) and "distributions" (no SE tax). Adds complexity — payroll, separate return — so do the math before electing.\n\n💡 Lesson: Set aside ~30% of every gig dollar for taxes. Track mileage and expenses obsessively. Pay quarterly. Open a Solo 401(k) or SEP-IRA. Consider S-Corp once profit is reliably $60k+.`,
    action: "gigs",
  }),

  littlebots: () => ({
    buildingId: "littlebots",
    title: "🧸 LittleBots DayCare — Form 2441 Deep Dive",
    body: `Welcome to LittleBots DayCare! BotKids covered the headline family credits — here we go deep on the ONE tax form daycare-paying parents must file: Form 2441, and the strategic choice between the Credit and the FSA.\n\n📖 THE TWO PARALLEL BENEFITS:\n• Child & Dependent Care CREDIT: 20-35% of qualifying expenses (rate slides with AGI). Cap: $3,000 of expenses for 1 child, $6,000 for 2+.\n• Dependent Care FSA: up to $5,000/year of PRE-TAX dollars via your employer ($2,500 if married filing separately). Use it or lose it.\nYou can't double-dip on the same dollars — but you can stack them (FSA $5k + Credit on $1k extra for 2 kids).\n\n📖 FSA vs CREDIT — WHICH WINS?\nAt most middle-income brackets, the FSA beats the Credit because the FSA dodges BOTH income tax AND the 7.65% FICA. The Credit only dodges income tax. Rough rule:\n• AGI under ~$45k: Credit is competitive (35% rate)\n• AGI $45k–$125k: FSA usually wins\n• AGI > $125k: FSA almost always wins (Credit drops to 20%)\nRun the numbers in October when open enrollment opens.\n\n📖 QUALIFYING CHILDREN:\nUnder age 13 when care was provided. Disabled spouse or dependent of any age also qualifies. Care must enable you (and spouse if married) to WORK or LOOK FOR WORK — both adults must have earned income (or be a full-time student / disabled).\n\n📖 QUALIFYING EXPENSES (✅) vs NOT (❌):\n✅ Daycare center, in-home daycare, after-school care\n✅ Preschool / nursery school (educational portion of pre-K)\n✅ Summer DAY camp (sports camp, art camp, even bot-coding camp)\n✅ Nanny / au pair wages (must withhold "nanny tax" if >$2,700/yr)\n✅ Before-school care, sick-child backup care\n❌ OVERNIGHT camp (this trips up parents every summer)\n❌ Kindergarten or higher grades (it's "education", not care)\n❌ Tutoring, music lessons (educational, not custodial)\n❌ Care provided by your spouse, the child's parent, or YOUR child under 19\n\n📖 THE EIN REQUIREMENT:\nForm 2441 Part I requires the provider's NAME, ADDRESS, and EIN (or SSN for individuals). NO EIN = NO CREDIT. Always ask for a W-10 in January. If a provider refuses, you can still claim by showing "due diligence" but it triggers IRS scrutiny.\n\n📖 NANNY TAX (SCHEDULE H):\nIf you paid a household employee $2,700+ in 2024, YOU are an employer:\n• Withhold and pay 7.65% FICA (employer + employee shares)\n• Pay FUTA (0.6% on first $7k)\n• File Schedule H with your 1040\n• Issue W-2 to the nanny by Jan 31\nMost families use a payroll service ($50/mo) — penalties for skipping are brutal.\n\n📖 EMPLOYER BACKUP CARE:\nMany large employers offer subsidized backup/sick-child care (Bright Horizons, Care.com). The benefit is generally taxable unless run through the Dep Care FSA — check your W-2 box 10.\n\n📖 STATE-LEVEL DEPENDENT CARE CREDITS:\nMany states (NY, CA, MN, NE, OR, etc.) offer their own credit on TOP of federal. Some are refundable. Don't leave them on the table.\n\n💡 Lesson: Take the FSA if you have it (especially over $45k AGI). Get the W-10 / EIN every January. Form 2441 — both parents' earned income, provider's tax ID, ages under 13. Day camp ✅, overnight camp ❌.`,
    action: "daycare",
  }),

  botcityhall: () => ({
    buildingId: "botcityhall",
    title: "🏛️ BotCityHall — State & Local Tax Maze",
    body: `Welcome to BotCityHall! The federal tax code is only half the story. Every state, county, and city writes its own rules — and they vary WILDLY. Where you live can change your tax bill by tens of thousands of dollars a year.\n\n📖 STATE INCOME TAX — A WILD WEST:\n• 9 states have NO income tax: Alaska, Florida, Nevada, New Hampshire (interest/dividends only — phasing out), South Dakota, Tennessee, Texas, Washington, Wyoming\n• 9 states have a FLAT rate (everyone pays the same %): AZ, CO, ID, IL, IN, KY, MI, NC, PA, UT\n• The rest are progressive, like the federal system. California tops out at 13.3% — the highest in the nation.\n\n📖 RECIPROCITY (CROSS-BORDER WORKERS):\nLive in NJ, work in NY? Live in IL, work in WI? Many neighboring states have reciprocity agreements — you pay tax only to your HOME state, not where you work. File the right form (e.g., NJ-165, IL W-5-NR) with your employer or you'll over-withhold all year.\n\n📖 THE CONVENIENCE-OF-EMPLOYER RULE (REMOTE WORK TRAP):\nNY, CT, PA, NE, DE, and AR say: if your job is BASED in our state and you work remote from elsewhere, you still owe US tax. Caught millions of pandemic-era remote workers off guard.\n\n📖 LOCAL INCOME TAX:\nMost states don't have it. The big exceptions:\n• Philadelphia: 3.75% wage tax for residents, 3.44% for non-residents\n• NYC: up to 3.876% on top of NY state\n• Detroit, Cleveland, Pittsburgh, Kansas City, and 17 OH cities\n• Ohio is the worst — most cities tax non-resident workers (RITA / CCA collectors)\n\n📖 STATE SALES TAX:\n• 5 states with NO sales tax: Alaska, Delaware, Montana, New Hampshire, Oregon\n• Highest combined: Tennessee (9.55%), Louisiana (9.55%), Arkansas (9.44%)\n• Most states exempt groceries; some don't (Hawaii, Idaho, Kansas, Mississippi, SD)\n\n📖 OCCUPATIONAL / PRIVILEGE TAXES:\n• Denver "Occupational Privilege Tax": $5.75/month if you earn $500+\n• PA Local Services Tax: $52/year in many municipalities\n• Newark Payroll Tax, San Francisco Gross Receipts Tax, etc.\n\n📖 STATE-LEVEL CREDITS YOU MIGHT MISS:\n• Renter's credits (CA, MD, NJ, NY, etc.) — even if you don't own\n• State EITC (~30 states piggyback on federal EITC)\n• State 529 deductions (NY: up to $10k MFJ; PA: $17k single)\n• Senior property-tax freeze programs\n• Solar/EV state credits stacked on top of federal\n\n📖 MOVING STATES MID-YEAR (PART-YEAR RESIDENT):\nYou file two state returns and allocate income by domicile period. Tricky for capital gains, RSU vests, and bonuses paid after the move.\n\n📖 ESTABLISHING DOMICILE:\nMoving to a no-tax state isn't about a mailing address. States like NY and CA aggressively audit "snowbird" moves: they look at days present (the 183-day rule), where your driver's license / voter registration / doctors are, where your "near and dear" possessions live, and where your business interests sit.\n\n💡 Lesson: Where you live is a tax decision. Check reciprocity if you cross state lines. Local wage taxes ambush new residents of Philly / NYC / Ohio. Hunt your state's credits — most go unclaimed.`,
    action: "cityhall",
  }),

  irs: ({ income, withheld, visitedBuildings }) => ({
    buildingId: "irs",
    title: "📋 IRS Tax Office — File Your Return",
    body:
      !visitedBuildings.includes("workcorp")
        ? "You need to visit WorkCorp to earn income before you can file taxes!"
        : `You're ready to file your Form 1040!\n\nYou earned $${income.toLocaleString()} this year. You've identified your deductions and your employer withheld $${withheld.toLocaleString()} in taxes.\n\nThe IRS will calculate how much you actually owe based on your taxable income (after deductions) and compare it to what was withheld. If you overpaid — you get a REFUND! If you underpaid — you OWE the difference.\n\nReady to file your taxes and see your result?`,
    action: visitedBuildings.includes("workcorp") ? "file" : undefined,
  }),
};
