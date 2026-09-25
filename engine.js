/* TierMath engine - price the loyalty-status chase. Pure math, no DOM. */
(function (root) {
  'use strict';

  function num(v, name) {
    const n = typeof v === 'string' ? parseFloat(v) : v;
    if (typeof n !== 'number' || !isFinite(n) || isNaN(n)) throw new Error(name + ' must be a number');
    return n;
  }
  function round2(x) { return Math.round(x * 100) / 100; }

  function chase(o) {
    if (!o || typeof o !== 'object') throw new Error('options required');
    const currentNights = num(o.currentNights, 'currentNights');
    const threshold = num(o.threshold, 'threshold');
    const taxPerNight = o.taxPerNight === undefined ? 0 : num(o.taxPerNight, 'taxPerNight');
    const mattressNights = o.mattressNights === undefined ? 0 : num(o.mattressNights, 'mattressNights');
    const avgRate = o.avgRate === undefined ? 150 : num(o.avgRate, 'avgRate');
    const benefitNights = num(o.benefitNights, 'benefitNights');
    const b = o.benefits || {};
    const lounge = b.lounge === undefined ? 0 : num(b.lounge, 'lounge');
    const upgrade = b.upgrade === undefined ? 0 : num(b.upgrade, 'upgrade');
    const breakfast = b.breakfast === undefined ? 0 : num(b.breakfast, 'breakfast');
    const points = b.points === undefined ? 0 : num(b.points, 'points');
    const statusYears = o.statusYears === undefined ? 1 : num(o.statusYears, 'statusYears');

    if (currentNights < 0 || currentNights > 500) throw new Error('currentNights must be in [0, 500]');
    if (threshold <= 0 || threshold > 500) throw new Error('threshold must be in (0, 500]');
    if (taxPerNight < 0 || taxPerNight > 2000) throw new Error('taxPerNight must be in [0, 2000]');
    if (mattressNights < 0 || mattressNights > 100) throw new Error('mattressNights must be in [0, 100]');
    if (avgRate <= 0 || avgRate > 5000) throw new Error('avgRate must be in (0, 5000]');
    if (benefitNights < 0 || benefitNights > 500) throw new Error('benefitNights must be in [0, 500]');
    for (const [v, n] of [[lounge, 'lounge'], [upgrade, 'upgrade'], [breakfast, 'breakfast'], [points, 'points']]) {
      if (v < 0 || v > 2000) throw new Error(n + ' must be in [0, 2000]');
    }
    if (statusYears <= 0 || statusYears > 5) throw new Error('statusYears must be in (0, 5]');

    const nightsNeeded = Math.max(0, threshold - currentNights);
    // cost of earning: loyalty premium on nights you'd sleep anyway + full price of mattress-run nights
    const earnCost = nightsNeeded * taxPerNight + mattressNights * avgRate;
    const perNightBenefit = lounge + upgrade + breakfast + points;
    const benefitValue = benefitNights * perNightBenefit * statusYears;
    const net = benefitValue - earnCost;

    return {
      nightsNeeded: nightsNeeded,
      earnCost: round2(earnCost),
      perNightBenefit: round2(perNightBenefit),
      benefitValue: round2(benefitValue),
      net: round2(net),
      worthIt: net > 0,
      // what your per-night benefit must be for the chase to break even
      breakEvenBenefitPerNight: benefitNights * statusYears > 0 ? round2(earnCost / (benefitNights * statusYears)) : null,
      // effective cost per status-year if benefits are ignored
      costPerStatusYear: round2(earnCost / statusYears)
    };
  }

  const api = { chase: chase };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.TierMathEngine = api;
})(typeof self !== 'undefined' ? self : this);
