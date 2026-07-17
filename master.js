// キャラクター・所属・PRINCE CAT・マスコットのマスターデータ
const PRODUCT_MASTER = {
  units: [
    {
      id: 'starish',
      name: 'ST☆RISH',
      characters: ['一十木音也','聖川真斗','四ノ宮那月','一ノ瀬トキヤ','神宮寺レン','来栖翔','愛島セシル']
    },
    {
      id: 'quartet-night',
      name: 'QUARTET NIGHT',
      characters: ['寿嶺二','黒崎蘭丸','美風藍','カミュ']
    },
    {
      id: 'heavens',
      name: 'HE★VENS',
      characters: ['鳳瑛一','皇綺羅','帝ナギ','鳳瑛二','桐生院ヴァン','日向大和','天草シオン']
    }
  ],

  princeCats: [
    { name:'ロッソ', character:'一十木音也', unit:'ST☆RISH' },
    { name:'シエロ', character:'聖川真斗', unit:'ST☆RISH' },
    { name:'シトロン', character:'四ノ宮那月', unit:'ST☆RISH' },
    { name:'アイリス', character:'一ノ瀬トキヤ', unit:'ST☆RISH' },
    { name:'アランチャ', character:'神宮寺レン', unit:'ST☆RISH' },
    { name:'ロージー', character:'来栖翔', unit:'ST☆RISH' },
    { name:'ライム', character:'愛島セシル', unit:'ST☆RISH' },

    { name:'ヴェルデ', character:'寿嶺二', unit:'QUARTET NIGHT' },
    { name:'グラナータ', character:'黒崎蘭丸', unit:'QUARTET NIGHT' },
    { name:'リラ', character:'美風藍', unit:'QUARTET NIGHT' },
    { name:'アクア', character:'カミュ', unit:'QUARTET NIGHT' },

    { name:'ルビーノ', character:'鳳瑛一', unit:'HE★VENS' },
    { name:'ラピス', character:'皇綺羅', unit:'HE★VENS' },
    { name:'ルチル', character:'帝ナギ', unit:'HE★VENS' },
    { name:'アメジス', character:'鳳瑛二', unit:'HE★VENS' },
    { name:'カネリア', character:'桐生院ヴァン', unit:'HE★VENS' },
    { name:'パラチア', character:'日向大和', unit:'HE★VENS' },
    { name:'ペリド', character:'天草シオン', unit:'HE★VENS' }
  ],

  mascots: ['おんぷくん','トキペン','ピヨちゃん'],

  unitVariants: {
    '夏の星': 'ST☆RISH',
    '夏の夜': 'QUARTET NIGHT'
  }
};

const normalizeMasterName = value => String(value || '').replace(/[\s　]+/g, '');

const CHARACTER_LOOKUP = new Map();
PRODUCT_MASTER.units.forEach(unit => {
  unit.characters.forEach(character => {
    CHARACTER_LOOKUP.set(normalizeMasterName(character), {
      character,
      unit: unit.name
    });
  });
});

const PRINCE_CAT_LOOKUP = new Map(
  PRODUCT_MASTER.princeCats.map(cat => [normalizeMasterName(cat.name), cat])
);

function enrichProduct(product) {
  const variantKey = normalizeMasterName(product.variant);
  const fullText = `${product.name || ''} ${product.variant || ''}`;
  const fullTextKey = normalizeMasterName(fullText);

  let character = null;
  let unit = PRODUCT_MASTER.unitVariants[product.variant] || null;
  let princeCat = null;
  let mascot = null;

  const characterInfo = CHARACTER_LOOKUP.get(variantKey);
  if (characterInfo) {
    character = characterInfo.character;
    unit = characterInfo.unit;
  }

  const catInfo = PRINCE_CAT_LOOKUP.get(variantKey);
  if (catInfo) {
    princeCat = catInfo.name;
    character = catInfo.character;
    unit = catInfo.unit;
  }

  // 商品名にPRINCE CAT名が含まれる商品にも対応
  if (!princeCat) {
    const matchedCat = PRODUCT_MASTER.princeCats.find(cat =>
      fullTextKey.includes(normalizeMasterName(cat.name))
    );
    if (matchedCat) {
      princeCat = matchedCat.name;
      character = matchedCat.character;
      unit = matchedCat.unit;
    }
  }

  mascot = PRODUCT_MASTER.mascots.find(name =>
    fullTextKey.includes(normalizeMasterName(name))
  ) || null;

  return {
    ...product,
    unit,
    character,
    princeCat,
    mascot
  };
}
