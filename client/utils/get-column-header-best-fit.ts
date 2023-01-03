type MatchParams = {
  exact: string[];
  strong: string[];
  weak: string[];
  neg: string[];
};

type Keywords = {
  docNum: MatchParams;
  amount: MatchParams;
  costCentreNum: MatchParams;
  afeNum: MatchParams;
};

type Field = keyof Keywords;

export const getColumnHeaderBestFits = (fields: Field[], headers: string[]) => {
  const Keywords: Keywords = {
    docNum: {
      exact: [" voucher ", " document ", " id "],
      strong: ["vouch", "doc", "vchr"],
      weak: ["no", "num", "#"],
      neg: ["type", "typ"],
    },
    amount: {
      exact: [" amount ", " value "],
      strong: ["amt", "val", "amount", "value", "amout"],
      weak: ["trans"],
      neg: [],
    },
    costCentreNum: {
      exact: ["cost", " center ", " number ", "cc", "business", "unit"],
      strong: ["cost", "centre", "center", "num", "number"],
      weak: ["object", "sub", "#", "unit"],
      neg: ["name", "description", "desc"],
    },
    afeNum: {
      exact: ["afe", "wbs", "business", "unit"],
      strong: ["number", "afe"],
      weak: ["object", "num"],
      neg: ["name", "description", "desc"],
    },
  };

  if (!headers.length) {
    console.log(`headers not provided`);
    return;
  }

  if (!fields.length) {
    console.log(`fields not provided`);
    return;
  }

  fields.forEach((field) => {
    if (!Object.keys(Keywords).includes(field)) {
      console.log(`${field} is not a valid field for mapping`);
      return;
    }
  });

  const bestFits: { [field: string]: string[] } = {};

  for (let field of fields) {
    const keywords = Keywords[field];
    const highScore: { headers: string[]; score: number } = {
      headers: [],
      score: 0,
    };
    for (let h of headers) {
      let score = 0;
      const header = h.toLowerCase();

      // add scores for exact
      keywords.exact.forEach((keyword) => {
        if (header.includes(keyword)) {
          score += 3;
        }
      });

      // add scores for strong
      keywords.strong.forEach((keyword) => {
        if (header.includes(keyword)) {
          score += 2;
        }
      });

      // add scores for weak
      keywords.weak.forEach((keyword) => {
        if (header.includes(keyword)) {
          score += 1;
        }
      });

      // less scores for neg
      keywords.neg.forEach((keyword) => {
        if (header.includes(keyword)) {
          score -= 0.5;
        }
      });

      if (score > highScore.score) {
        highScore.headers = [h];
        highScore.score = score;
      } else if (score === highScore.score) {
        highScore.headers.push(h);
      }
    }

    bestFits[field] = highScore.headers;
  }

  const mappings: { [field: string]: string } = {};
  for (const field in bestFits) {
    mappings[bestFits[field][0]] = field;
  }

  return mappings;
};
