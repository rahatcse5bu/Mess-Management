"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dayDiff = exports.addDays = exports.dateKey = exports.normalizeDate = void 0;
const normalizeDate = (input) => {
    const date = new Date(input);
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};
exports.normalizeDate = normalizeDate;
const dateKey = (input) => (0, exports.normalizeDate)(input).toISOString().slice(0, 10);
exports.dateKey = dateKey;
const addDays = (input, days) => {
    const date = new Date(input);
    date.setUTCDate(date.getUTCDate() + days);
    return date;
};
exports.addDays = addDays;
const dayDiff = (from, to) => {
    const ms = (0, exports.normalizeDate)(to).getTime() - (0, exports.normalizeDate)(from).getTime();
    return Math.floor(ms / (1000 * 60 * 60 * 24));
};
exports.dayDiff = dayDiff;
//# sourceMappingURL=date.util.js.map