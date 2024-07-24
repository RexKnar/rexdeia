export function sortByRank(a, b) {
  if (a.rank === b.rank) {
    return 0;
  } else if (a.rank === 1) {
    return -1;
  } else if (b.rank === 1) {
    return 1;
  } else if (a.rank === 0) {
    return 1;
  } else if (b.rank === 0) {
    return -1;
  } else {
    return a.rank - b.rank;
  }
}
