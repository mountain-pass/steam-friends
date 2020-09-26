// appid,
// modes: { single, multi } = {},
// priceAudCents,
// platforms: { win, lin, mac } = {},
// rating,
// releaseYear

export const RELEASE_YEAR_FILTERS = [
  { k: 'All', v: () => true },
  { k: '>=2015', v: (x) => x.releaseYear >= 2015 },
  { k: '>=2010', v: (x) => x.releaseYear >= 2010 }
]

export const PRICE_CENTS_FILTERS = [
  { k: 'All', v: () => true },
  { k: 'FREE', v: (x) => x.priceAudCents === 0 },
  { k: '<=$15', v: (x) => x.priceAudCents <= 1500 }
]

export const RATING_FILTERS = [
  { k: 'All', v: () => true },
  { k: '>=80', v: (x) => x.rating >= 80 },
  { k: '>=60', v: (x) => x.rating >= 60 }
]

export const PLATFORM_FILTERS = [
  { k: 'All', v: () => true },
  { k: 'Win', v: (x) => x.platforms && x.platforms.win },
  { k: 'Mac', v: (x) => x.platforms && x.platforms.mac },
  { k: 'Lin', v: (x) => x.platforms && x.platforms.lin }
]

export const MULTIPLAYER_FILTERS = [
  { k: 'All', v: () => true },
  { k: 'Single', v: (x) => x.modes && x.modes.single },
  { k: 'Multiplayer', v: (x) => x.modes && x.modes.multi }
]
