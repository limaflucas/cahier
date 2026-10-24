const NOUS = 3;
const VOUS = 4;
const ILS = 5;

export const compoundDerivation = (auxiliaryTense) => ({
  label: `auxiliaire ${auxiliaryTense} + participe passé`,
  sources: () => [['participePasse', 0]],
});

export const fromPresentNous = {
  label: '« nous » du présent',
  sources: () => [['present', NOUS]],
};

export const fromPresentParticiple = {
  label: 'en + participe présent',
  sources: () => [['participePresent', 0]],
};

export const fromFutureAndImparfait = {
  label: 'radical du futur + terminaisons de l\'imparfait',
  sources: (person) => [['futur', person], ['imparfait', person]],
};

export const fromPresentIlsAndImparfait = {
  label: '« ils » du présent ; nous, vous : imparfait',
  sources: (person) => (person === NOUS || person === VOUS ? [['imparfait', person]] : [['present', ILS]]),
};

export const fromInfinitive = {
  label: 'infinitif + terminaisons',
  sources: () => [],
};
