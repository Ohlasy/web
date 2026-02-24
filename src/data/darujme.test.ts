import assert from "node:assert";
import test from "node:test";
import {
  sumRecurrentDonations,
  sumOneTimeDonations,
  type Transaction,
  formatDate,
  getPastFullMonths,
  firstDayOfMonth,
  lastDayOfMonth,
} from "./darujme";

test("Date formatting", () => {
  assert.equal(formatDate(new Date("2020-4-1")), "2020-04-01");
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
  assert.equal(sumRecurrentDonations(txs), 300);
  assert.equal(sumOneTimeDonations(txs), 400);
});

test("Date calculations", () => {
  assert.deepEqual(getPastFullMonths(new Date("2021-2-13"), 3), [
    { month: 1, year: 2021 },
    { month: 12, year: 2020 },
    { month: 11, year: 2020 },
  ]);
  assert.deepEqual(
    firstDayOfMonth({ month: 1, year: 2021 }),
    new Date("2021-1-1"),
  );
  assert.deepEqual(
    lastDayOfMonth({ month: 2, year: 2021 }),
    new Date("2021-2-28"),
  );
});
