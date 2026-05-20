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
