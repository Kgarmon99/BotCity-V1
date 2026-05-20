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
