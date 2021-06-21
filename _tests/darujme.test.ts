import { getRecurrentDonations, getOneTimeDonations } from "../api/dary";
import { Transaction, formatDate } from "../api/_darujme";

test("Date formatting", () => {
  expect(formatDate(new Date("2020-4-1"))).toBe("2020-04-01");
});

test("Stats calculation", () => {
  const txs: Transaction[] = [
    {
      transactionId: 1,
      sentAmount: {
        cents: 100_00,
        currency: "CZK",
      },
      pledge: {
        pledgeId: 1,
        isRecurrent: true,
      },
    },
    {
      transactionId: 2,
      sentAmount: {
        cents: 200_00,
        currency: "CZK",
      },
      pledge: {
        pledgeId: 2,
        isRecurrent: true,
      },
    },
    {
      transactionId: 2391206,
      sentAmount: null,
      pledge: {
        pledgeId: 1863762,
        isRecurrent: true,
      },
    },
    {
      transactionId: 3,
      sentAmount: {
        cents: 400_00,
        currency: "CZK",
      },
      pledge: {
        pledgeId: 3,
        isRecurrent: false,
      },
    },
  ];
  expect(getRecurrentDonations(txs)).toEqual(300);
  expect(getOneTimeDonations(txs)).toEqual(400);
});
