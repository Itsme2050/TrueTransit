import { Language } from '../context/LanguageContext';

export interface LocalizedString {
  en: string;
  hi: string;
  fr: string;
  zh: string;
}

export interface StreetFoodItem {
  id: string;
  name: LocalizedString;
  tag: LocalizedString;
  flavorProfile: LocalizedString;
  description: LocalizedString;
  priceRange: { min: number; max: number; typical: number };
  unit: LocalizedString;
  famousSpots: { name: string; locality: string; nearestMetro: string }[];
  touristTip: LocalizedString;
  isVegetarian: boolean;
}

export const DELHI_FAMOUS_STREET_FOODS: StreetFoodItem[] = [
  {
    id: 'chole-bhature',
    name: {
      en: 'Chole Bhature',
      hi: 'छोले भटूरे',
      fr: 'Chole Bhature',
      zh: '鹰嘴豆炸面饼 (Chole Bhature)',
    },
    tag: {
      en: 'Delhi #1 Iconic Dish',
      hi: 'दिल्ली का नंबर 1 प्रसिद्ध व्यंजन',
      fr: 'Plat emblématique n°1 de Delhi',
      zh: '德里第一经典美食',
    },
    flavorProfile: {
      en: 'Spicy, Tangy & Rich',
      hi: 'तीखा, चटपटा और स्वादिष्ट',
      fr: 'Épicé, acidulé et savoureux',
      zh: '香辣浓郁，酸甜爽口',
    },
    description: {
      en: 'Golden fluffy deep-fried leavened bread (bhatura) served with slow-cooked spicy chickpea curry (chole), pickled carrots, raw onions, and tangy mint chutney.',
      hi: 'कुरकुरे फूले हुए भटूरे, गाढ़े मसालेदार काबुली चने, गाजर का अचार और पुदीने की चटनी के साथ परोसे जाते हैं।',
      fr: 'Pain levé frit et croustillant (bhatura) servi avec un curry de pois chiches mijoté aux épices, carottes marinées et chutney de menthe.',
      zh: '金黄酥脆膨松的油炸发面饼配浓郁慢炖鹰嘴豆咖喱、腌胡萝卜与薄荷酸辣酱。',
    },
    priceRange: { min: 70, max: 140, typical: 90 },
    unit: {
      en: 'plate (2 bhature + chole)',
      hi: 'थाली (2 भटूरे + छोले)',
      fr: 'portion (2 bhaturas + chole)',
      zh: '份（2张炸面饼+鹰嘴豆）',
    },
    famousSpots: [
      { name: 'Sita Ram Diwan Chand', locality: 'Paharganj', nearestMetro: 'New Delhi / RK Ashram Marg' },
      { name: 'Chache Di Hatti', locality: 'Kamla Nagar (DU North Campus)', nearestMetro: 'Vishwa Vidyalaya' },
      { name: 'Nagpal Chole Bhature', locality: 'Lajpat Nagar', nearestMetro: 'Lajpat Nagar (Violet/Pink Line)' },
    ],
    touristTip: {
      en: 'Very filling. Best enjoyed as breakfast or early lunch. Served piping hot straight out of the kadhai.',
      hi: 'सुबह के नाश्ते या दोपहर के भोजन के लिए उत्तम। गर्मागर्म कढ़ाई से उतरते ही खाएं।',
      fr: 'Très copieux. À déguster de préférence au petit-déjeuner ou au déjeuner.',
      zh: '分量十足。最适合当作丰盛的早餐或早午餐，刚出锅趁热享用风味最佳。',
    },
    isVegetarian: true,
  },
  {
    id: 'golgappe-pani-puri',
    name: {
      en: 'Golgappe / Pani Puri',
      hi: 'गोलगप्पे / पानी पूरी',
      fr: 'Golgappe / Pani Puri',
      zh: '脆皮空心泡水球 (Pani Puri)',
    },
    tag: {
      en: 'Most Popular Street Snack',
      hi: 'सबसे लोकप्रिय स्ट्रीट स्नैक',
      fr: 'En-cas de rue populaire',
      zh: '最受欢迎街头小吃',
    },
    flavorProfile: {
      en: 'Crisp, Tangy & Refreshing',
      hi: 'कुरकुरा, खट्टा-मीठा और तीखा',
      fr: 'Croustillant, acidulé et rafraîchissant',
      zh: '香脆爽口，酸辣清凉',
    },
    description: {
      en: 'Bite-sized crisp hollow semolina or flour spheres stuffed with boiled spiced potato and chickpeas, filled with chilled tangy mint-coriander water or sweet tamarind sauce.',
      hi: 'कुरकुरी सूजी या आटे की पूरियां जिनमें उबले आलू-चने और ठंडा खट्टा-तीखा पुदीने का पानी या सौंठ भरा जाता है।',
      fr: 'Petites sphères croustillantes garnies de pommes de terre épicées et remplies d\'eau aromatisée à la menthe ou au tamarin.',
      zh: '酥脆空心炸丸子填入香料土豆与鹰嘴豆，注入冰镇薄荷香菜酸辣汁或罗望子甜汁。',
    },
    priceRange: { min: 30, max: 60, typical: 40 },
    unit: {
      en: 'plate (6 pieces)',
      hi: 'प्लेट (6 पीस)',
      fr: 'portion (6 pièces)',
      zh: '份（6个）',
    },
    famousSpots: [
      { name: 'Bengali Sweet House', locality: 'Bengali Market, Connaught Place', nearestMetro: 'Mandi House' },
      { name: 'Vaishno Chaat Bhandar', locality: 'Kamla Nagar', nearestMetro: 'Vishwa Vidyalaya' },
      { name: 'Prabhu Chaat Bhandar (UPSC)', locality: 'Shahjahan Road', nearestMetro: 'Khan Market' },
    ],
    touristTip: {
      en: 'Ask for packaged or purified water. Eat the whole sphere in one single bite to prevent spilling.',
      hi: 'बिसलेरी या आरओ के पानी के लिए कहें। पूरी को एक ही बार में मुंह में रखें।',
      fr: 'Demandez de l\'eau purifiée en bouteille. Mangez la sphère entière en une seule bouchée.',
      zh: '建议询问是否使用纯净水调制。整颗一口放入口中防止汁水溢出。',
    },
    isVegetarian: true,
  },
  {
    id: 'dahi-bhalla-chaat',
    name: {
      en: 'Dahi Bhalla Chaat',
      hi: 'दही भल्ला चाट',
      fr: 'Dahi Bhalla Chaat',
      zh: '甜酸酸奶扁豆丸 (Dahi Bhalla)',
    },
    tag: {
      en: 'Cooling Classic Chaat',
      hi: 'ठंडी और स्वादिष्ट चाट',
      fr: 'Chaat rafraîchissant classique',
      zh: '清凉消暑经典沙特',
    },
    flavorProfile: {
      en: 'Creamy, Sweet, Tangy & Mildly Spiced',
      hi: 'मलाईदार, मीठी और हल्की चटपटी',
      fr: 'Crémeux, doux et acidulé',
      zh: '浓稠酸甜，清凉绵软',
    },
    description: {
      en: 'Soft lentil dumplings soaked in chilled sweetened whisked yogurt, drizzled with roasted cumin, red chili, and sweet tamarind-date chutney.',
      hi: 'नरम उड़द दाल के भल्ले जिन्हें ठंडे मीठे गाढ़े दही में भिगोकर भुना जीरा, सोंठ और पुदीने की चटनी के साथ परोसा जाता है।',
      fr: 'Boulettes moelleuses de lentilles trempées dans du yaourt doux et frais, nappées d\'épices douces et chutney de tamarin.',
      zh: '绵软扁豆炸丸浸润在香甜浓郁的冰镇酸奶中，淋上烤孜然粉、红椒粉与酸甜罗望子红枣酱。',
    },
    priceRange: { min: 50, max: 90, typical: 70 },
    unit: {
      en: 'plate',
      hi: 'प्लेट',
      fr: 'assiette',
      zh: '份',
    },
    famousSpots: [
      { name: 'Natraj Dahi Bhalla Corner', locality: 'Chandni Chowk', nearestMetro: 'Chandni Chowk Gate 5' },
      { name: 'Haldiram’s Heritage Outlet', locality: 'Chandni Chowk', nearestMetro: 'Chandni Chowk' },
      { name: 'Padam Chaat Corner', locality: 'Kinari Bazar, Old Delhi', nearestMetro: 'Chawri Bazar' },
    ],
    touristTip: {
      en: 'Ideal for soothing your palate after spicy food. Natraj in Chandni Chowk has served this since 1940.',
      hi: 'मसालेदार खाने के बाद पेट को ठंडक पहुंचाने के लिए बेहतरीन विकल्प। नटराज 1940 से यह बना रहा है।',
      fr: 'Parfait pour adoucir le palais après des plats épicés. Natraj à Chandni Chowk le sert depuis 1940.',
      zh: '吃过辣味小吃后解辣清口的绝佳选择，老德里老店自1940年传承至今。',
    },
    isVegetarian: true,
  },
  {
    id: 'aloo-tikki-chaat',
    name: {
      en: 'Crispy Aloo Tikki Chaat',
      hi: 'आलू टिक्की चाट',
      fr: 'Aloo Tikki Chaat',
      zh: '香脆香料土豆饼 (Aloo Tikki)',
    },
    tag: {
      en: 'Crisp Golden Favorite',
      hi: 'कुरकुरी सुनहरी टिक्की',
      fr: 'Galette de pomme de terre dorée',
      zh: '金黄香脆经典小吃',
    },
    flavorProfile: {
      en: 'Crunchy Outside, Savory & Sweet-Spicy',
      hi: 'बाहर से कुरकुरी, अंदर से नरम और चटपटी',
      fr: 'Croustillant et savoureux',
      zh: '外脆里糯，甜辣开胃',
    },
    description: {
      en: 'Golden spiced potato patties slow-griddled on a large pan until crackling crisp, split open and smothered with curd, mint chutney, and tamarind sauce.',
      hi: 'तवे पर धीमी आंच पर सेकी गई कुरकुरी आलू की टिक्की, दही, मीठी सोंठ और हरी चटनी के साथ।',
      fr: 'Galettes de pommes de terre épicées et dorées à la poêle, garnies de yaourt et chutneys parfumés.',
      zh: '慢火铁板煎至金黄酥脆的香料土豆饼，浇淋鲜酸奶、香辣薄荷酱与酸甜罗望子果酱。',
    },
    priceRange: { min: 40, max: 80, typical: 60 },
    unit: {
      en: 'plate (2 tikkis)',
      hi: 'प्लेट (2 टिक्की)',
      fr: 'assiette (2 galettes)',
      zh: '份（2个）',
    },
    famousSpots: [
      { name: 'Bittoo Tikki Wala (BTW)', locality: 'Rani Bagh / Across Delhi', nearestMetro: 'Netaji Subhash Place' },
      { name: 'Shree Balaji Chaat Bhandar', locality: 'Old Delhi', nearestMetro: 'Chandni Chowk' },
      { name: 'Prince Paan & Chaat Corner', locality: 'Greater Kailash 1 (M Block)', nearestMetro: 'Kailash Colony' },
    ],
    touristTip: {
      en: 'Ask the vendor for "extra crisp" (karaari) for the best texture.',
      hi: 'अधिक कुरकुरी टिक्की के लिए दुकानदार से "करारी" करने को कहें।',
      fr: 'Demandez une version "extra croustillante" (karaari) pour la meilleure texture.',
      zh: '可向摊主提出要求煎得更焦脆（karaari）以获得最佳口感。',
    },
    isVegetarian: true,
  },
  {
    id: 'paranthe-wali-gali',
    name: {
      en: 'Stuffed Paranthe (Parathe Wali Gali)',
      hi: 'भरवां पराठे (पराठे वाली गली)',
      fr: 'Paranthe Farcis (Parathe Wali Gali)',
      zh: '传统馅料飞饼 (Paranthe)',
    },
    tag: {
      en: 'Historic Heritage Wonder',
      hi: 'ऐतिहासिक चांदनी चौक की धरोहर',
      fr: 'Spécialité historique de Chandni Chowk',
      zh: '古老德里街头非遗美食',
    },
    flavorProfile: {
      en: 'Flaky, Rich & Savory',
      hi: 'खस्ता, भरपूर और स्वादिष्ट',
      fr: 'Feuilleté, riche et épicé',
      zh: '层层香酥，风味浓郁',
    },
    description: {
      en: 'Traditional crisp flatbreads stuffed with paneer, spiced potatoes, or vegetables, served with pumpkin curry, spicy aloo sabzi, and tamarind chutney.',
      hi: 'पनीर, आलू या सब्जियों से भरे खस्ता तले हुए पराठे, कद्दू की सब्जी, आलू की तीखी तरी और चटनी के साथ।',
      fr: 'Pains plats traditionnels farcis au fromage ou légumes, servis avec currys variés et chutneys.',
      zh: '包入奶酪、香料土豆或蔬菜后香炸起酥的飞饼，配南瓜咖喱、土豆辛香汤汁与酱料。',
    },
    priceRange: { min: 70, max: 120, typical: 90 },
    unit: {
      en: 'piece with 3 curries',
      hi: 'पीस (3 प्रकार की सब्जी के साथ)',
      fr: 'pièce avec 3 currys',
      zh: '张（含3种免费咖喱与小菜）',
    },
    famousSpots: [
      { name: 'Pt. Gaya Prasad Shiv Charan', locality: 'Parathe Wali Gali, Chandni Chowk', nearestMetro: 'Chandni Chowk' },
      { name: 'Pt. Kanhaiyalal Durgaprasad', locality: 'Parathe Wali Gali', nearestMetro: 'Chandni Chowk' },
      { name: 'Babu Ram Paranthe Wale', locality: 'Parathe Wali Gali', nearestMetro: 'Chandni Chowk' },
    ],
    touristTip: {
      en: 'Curries are made satvik style without onion or garlic. Two paranthas are usually enough for lunch.',
      hi: 'सब्जियां बिना प्याज-लहसुन (सात्विक) बनाई जाती हैं। दोपहर के भोजन के लिए 2 पराठे पर्याप्त हैं।',
      fr: 'Les currys sont préparés sans oignon ni ail selon la tradition satvik.',
      zh: '老街作坊遵循传统纯素无洋葱大蒜烹调，两张饼足以吃得非常饱。',
    },
    isVegetarian: true,
  },
  {
    id: 'kathi-roll',
    name: {
      en: 'Kathi Roll / Frankie',
      hi: 'काठी रोल / फ्रेंकी',
      fr: 'Kathi Roll / Frankie',
      zh: '卡提烤肉卷饼 (Kathi Roll)',
    },
    tag: {
      en: 'Street Wrap on the Go',
      hi: 'स्वादिष्ट स्ट्रीट रोल',
      fr: 'Wrap indien sur le pouce',
      zh: '便捷街头卷饼',
    },
    flavorProfile: {
      en: 'Smoky, Peppery & Tangy',
      hi: 'धुएँदार, चटपटा और मसालेदार',
      fr: 'Fumé, poivré et acidulé',
      zh: '焦香扑鼻，辛香开胃',
    },
    description: {
      en: 'Crisp layered paratha rolled with seasoned paneer, soya chaap, or spiced chicken tikka, pickled onions, and mint chutney.',
      hi: 'कुरकुरे पराठे में पनीर, सोया चाप या चिकन टिक्का, सिरके वाले प्याज और हरी चटनी लपेटकर बनाया गया रोल।',
      fr: 'Pain paratha roulé garni de paneer ou poulet mariné, oignons marinés et sauce menthe fraîche.',
      zh: '分层酥脆烤饼包裹腌制烤印度奶酪、豆制品或香料烤鸡块，配以腌洋葱丝与薄荷青酱。',
    },
    priceRange: { min: 60, max: 140, typical: 90 },
    unit: {
      en: 'roll',
      hi: 'रोल',
      fr: 'rouleau',
      zh: '卷',
    },
    famousSpots: [
      { name: 'Nizam’s Kathi Kabab', locality: 'Connaught Place (Block H)', nearestMetro: 'Rajiv Chowk Gate 6' },
      { name: 'Khan Chacha', locality: 'Khan Market', nearestMetro: 'Khan Market (Violet Line)' },
      { name: 'Art of Spices', locality: 'Karol Bagh', nearestMetro: 'Karol Bagh' },
    ],
    touristTip: {
      en: 'A convenient meal while exploring markets. Paneer or chicken rolls are customer favorites.',
      hi: 'घूमते-फिरते खाने के लिए सबसे सुविधाजनक और तृप्त करने वाला भोजन।',
      fr: 'Idéal pour manger rapidement tout en visitant les marchés de la ville.',
      zh: '逛街购物时最方便实惠的随身快餐，双蛋鸡肉或奶酪卷人气最高。',
    },
    isVegetarian: false,
  },
  {
    id: 'delhi-momos',
    name: {
      en: 'Steamed / Tandoori Momos',
      hi: 'दिल्ली मोमोज़ (तंदूरी / स्टीम्ड)',
      fr: 'Momos à la vapeur / Tandoori',
      zh: '德里蒸饺 / 烤馍馍 (Momos)',
    },
    tag: {
      en: 'Modern Delhi Street Staple',
      hi: 'दिल्ली का आधुनिक पसंदीदा स्नैक',
      fr: 'Incontournable moderne de Delhi',
      zh: '德里年轻一代最爱小吃',
    },
    flavorProfile: {
      en: 'Savory with Fiery Garlic Chutney',
      hi: 'तीखी लहसुन चटनी और स्वादिष्ट भरावन',
      fr: 'Savoureux avec sauce piquante à l\'ail',
      zh: '鲜香多汁，配火辣蒜蓉辣酱',
    },
    description: {
      en: 'Delicate dough dumplings filled with seasoned vegetables, paneer, or chicken, served steamed or tandoori char-grilled with spicy red dip.',
      hi: 'सब्जियों, पनीर या चिकन से भरे स्टीम्ड या तंदूर में भूने हुए मोमोज़, तीखी लाल चटनी के साथ।',
      fr: 'Raviolis délicats cuits à la vapeur ou grillés au tandoor avec farce aux légumes ou poulet.',
      zh: '皮薄馅足的蒸饺或经坦都里泥炉香烤的香料饺，裹入精细蔬菜、奶酪或鸡肉馅，配特制红油蒜蓉辣酱。',
    },
    priceRange: { min: 50, max: 100, typical: 70 },
    unit: {
      en: 'plate (8 pieces)',
      hi: 'प्लेट (8 पीस)',
      fr: 'assiette (8 pièces)',
      zh: '份（8个）',
    },
    famousSpots: [
      { name: 'Dolma Aunty Momos', locality: 'Lajpat Nagar Central Market', nearestMetro: 'Lajpat Nagar' },
      { name: 'Wongdhen Cafe / Rigo', locality: 'Majnu Ka Tilla Tibetan Colony', nearestMetro: 'Vishwa Vidyalaya' },
      { name: 'Hunger Strike (Tandoori Momos)', locality: 'Amar Colony, Lajpat Nagar 4', nearestMetro: 'Moolchand' },
    ],
    touristTip: {
      en: 'The red garlic chili sauce is very spicy. Sample a small drop first before adding generously.',
      hi: 'लाल मिर्च-लहसुन की चटनी काफी तीखी होती है, पहले थोड़ा चखकर देखें।',
      fr: 'La sauce piquante rouge est très épicée. Goûtez une petite goutte d\'abord.',
      zh: '随盘红辣椒大蒜酱非常辛辣。建议初次品尝时先蘸少许尝试辣度。',
    },
    isVegetarian: false,
  },
  {
    id: 'jalebi-with-rabri',
    name: {
      en: 'Old Delhi Jalebi with Rabri',
      hi: 'जलेबी और रबड़ी (पुरानी दिल्ली)',
      fr: 'Jalebi avec Rabri',
      zh: '糖浆脆炸糖环配浓缩奶酪 (Jalebi & Rabri)',
    },
    tag: {
      en: 'Iconic Old Delhi Dessert',
      hi: 'पुरानी दिल्ली की शाही मिठाई',
      fr: 'Dessert légendaire du Vieux Delhi',
      zh: '老德里皇室传世甜品',
    },
    flavorProfile: {
      en: 'Warm, Saffron-infused & Sweet Creamy',
      hi: 'कुरकुरी, केसरिया चाशनी और गाढ़ी रबड़ी',
      fr: 'Chaud, croustillant, safrané et crémeux',
      zh: '热脆甜香，奶香醇厚',
    },
    description: {
      en: 'Crisp spiral coils fried in pure desi ghee, soaked in saffron syrup, served piping hot topped with chilled rabri cream.',
      hi: 'देसी घी में तली कुरकुरी रसीली जलेबियां, ऊपर से ठंडी गाढ़ी मलाईदार रबड़ी के साथ परोसी जाती हैं।',
      fr: 'Spirales frites au ghee pur, trempées dans un sirop au safran et garnies de crème de lait rabri fraîche.',
      zh: '纯印度酥油炸成金黄酥脆的金黄糖环，浸透藏红花糖浆，热气腾腾出锅并淋上冰镇浓缩奶酪霜（Rabri）。',
    },
    priceRange: { min: 60, max: 130, typical: 90 },
    unit: {
      en: 'plate (100g + rabri)',
      hi: 'प्लेट (100 ग्राम + रबड़ी)',
      fr: 'assiette (100g + rabri)',
      zh: '份（100克糖环+浓厚奶酪）',
    },
    famousSpots: [
      { name: 'Old Famous Jalebi Wala', locality: 'Dariba Kalan Corner, Chandni Chowk', nearestMetro: 'Chandni Chowk' },
      { name: 'Kallan Sweets', locality: 'Jama Masjid Gate 1', nearestMetro: 'Jama Masjid' },
      { name: 'Shiv Mishthan Bhandar', locality: 'Chandni Chowk', nearestMetro: 'Chandni Chowk' },
    ],
    touristTip: {
      en: 'The contrast between piping hot crisp jalebi and ice-cold silky rabri is legendary.',
      hi: 'गर्मागर्म कुरकुरी जलेबी और ठंडी रबड़ी का संगम लाजवाब स्वाद देता है।',
      fr: 'Le contraste entre la jalebi chaude croustillante et la crème rabri froide est sublime.',
      zh: '滚烫酥脆甜糖环与冰凉丝滑奶香糊形成的冷热交融口感是德里一绝。',
    },
    isVegetarian: true,
  },
  {
    id: 'kulfi-falooda',
    name: {
      en: 'Traditional Kulfi Falooda',
      hi: 'पारंपरिक कुल्फी फालूदा',
      fr: 'Kulfi Falooda Traditionnel',
      zh: '传统藏红花开心果棒冰 (Kulfi Falooda)',
    },
    tag: {
      en: 'Heritage Summer Treat',
      hi: 'गर्मियों की पारंपरिक कुल्फी',
      fr: 'Dessert glacé estival traditionnel',
      zh: '百年经典夏季冰饮',
    },
    flavorProfile: {
      en: 'Rich Saffron, Pistachio & Rose',
      hi: 'पिस्ता, केसर और गुलाब की महक',
      fr: 'Pistache, safran et parfum de rose',
      zh: '奶香浓郁，坚果与玫瑰花香',
    },
    description: {
      en: 'Dense slow-simmered caramelized milk ice cream infused with pistachios and saffron, sliced over falooda noodles and rose syrup.',
      hi: 'गाढ़े पके दूध और मेवों से बनी मलाईदार कुल्फी, फालूदा सेवई और रूह-अफ़ज़ा गुलाब शरबत के साथ।',
      fr: 'Glace au lait dense caramélisé avec pistaches et safran, servie avec vermicelles et sirop de rose.',
      zh: '慢火熬煮焦香浓缩奶制成的传统印度冰淇淋，富含开心果与藏红花，切块搭配细粉丝与玫瑰花露甜浆。',
    },
    priceRange: { min: 50, max: 100, typical: 70 },
    unit: {
      en: 'plate / stick',
      hi: 'प्लेट / स्टिक',
      fr: 'assiette / bâtonnet',
      zh: '份 / 支',
    },
    famousSpots: [
      { name: 'Roshan Di Kulfi', locality: 'Karol Bagh Market', nearestMetro: 'Karol Bagh' },
      { name: 'Kuremal Mohan Lal Kulfi Wale', locality: 'Sita Ram Bazar, Chawri', nearestMetro: 'Chawri Bazar' },
      { name: 'Giani’s Di Hatti', locality: 'Fatehpuri, Chandni Chowk', nearestMetro: 'Chandni Chowk' },
    ],
    touristTip: {
      en: 'Look for historic shops in Karol Bagh and Chawri Bazar that have made this for over 80 years.',
      hi: 'करोल बाग और पुरानी दिल्ली में असली पारंपरिक मटका कुल्फी का आनंद लें।',
      fr: 'Un régal rafraîchissant préparé artisanalement depuis des générations.',
      zh: '夏日清凉解暑神器，卡罗尔巴格的老字号传承数十年原汁原味。',
    },
    isVegetarian: true,
  },
  {
    id: 'bedmi-puri-aloo',
    name: {
      en: 'Bedmi Puri with Aloo Sabzi',
      hi: 'बेड़मी पूरी और आलू की सब्ज़ी',
      fr: 'Bedmi Puri avec Curry Aloo',
      zh: '扁豆馅香炸脆饼配辣土豆 (Bedmi Puri)',
    },
    tag: {
      en: 'Traditional Morning Breakfast',
      hi: 'पुरानी दिल्ली का प्रसिद्ध नाश्ता',
      fr: 'Petit-déjeuner traditionnel réputé',
      zh: '老德里清晨地道早餐',
    },
    flavorProfile: {
      en: 'Crisp, Spiced Dal & Tangy Potato Curry',
      hi: 'खस्ता, दाल भरावन और तीखी तरी',
      fr: 'Croustillant et curry relevé',
      zh: '外酥里脆，辛香浓郁',
    },
    description: {
      en: 'Crispy puffy flatbreads stuffed with spiced urad dal, served with aromatic hot potato curry and tangy pumpkin pickle.',
      hi: 'उड़द दाल की खस्ता पूरियां, मेथी वाले तीखे तरीदार आलू और खट्टे-मीठे कद्दू के लौंज के साथ।',
      fr: 'Pains frits farcis aux lentilles épicées, accompagnés d\'un curry de pommes de terre parfumé.',
      zh: '内嵌调味黑扁豆泥的松脆油炸圆饼，配搭香浓滚烫的胡芦巴辣土豆咖喱汤与酸甜南瓜小菜。',
    },
    priceRange: { min: 40, max: 80, typical: 50 },
    unit: {
      en: 'plate (2 puris + sabzi)',
      hi: 'थाली (2 पूरी + सब्जी)',
      fr: 'assiette (2 puris + curry)',
      zh: '份（2个脆饼+土豆汤）',
    },
    famousSpots: [
      { name: 'Ram Swaroop Halwai', locality: 'Chawri Bazar', nearestMetro: 'Chawri Bazar' },
      { name: 'Shyam Sweets', locality: 'Chawri Bazar', nearestMetro: 'Chawri Bazar' },
      { name: 'Shiv Mishthan Bhandar', locality: 'Chandni Chowk', nearestMetro: 'Chandni Chowk' },
    ],
    touristTip: {
      en: 'Traditional Old Delhi shops often sell out by 11:30 AM, so visit early in the morning.',
      hi: 'अधिकांश पारंपरिक दुकानें सुबह 11:30 बजे तक समाप्त हो जाती हैं, अतः सुबह जल्दी जाएं।',
      fr: 'Plat matinal très prisé, les échoppes traditionnelles sont souvent épuisées avant midi.',
      zh: '最正宗的老字号通常在上午11点半前就售罄，建议清早前往打卡。',
    },
    isVegetarian: true,
  },
  {
    id: 'tea-kulhad-chai',
    name: {
      en: 'Kulhad Masala Chai',
      hi: 'कुल्हड़ मसाला चाय',
      fr: 'Thé Chai en Tasse Kulhad',
      zh: '瓦罐香料奶茶 (Kulhad Chai)',
    },
    tag: {
      en: 'Everyday Street Fuel',
      hi: 'दैनिक ऊर्जा और ताजगी',
      fr: 'Boisson de rue incontournable',
      zh: '每日街头活力饮品',
    },
    flavorProfile: {
      en: 'Spiced Ginger, Cardamom & Warm Milk',
      hi: 'अदरक, इलायची और गाढ़े दूध का स्वाद',
      fr: 'Gingembre, cardamome et lait chaud',
      zh: '浓醇生姜豆蔻辛香，奶香四溢',
    },
    description: {
      en: 'Freshly boiled strong tea simmered with crushed ginger, cardamom, and milk, served steaming hot in an unglazed clay cup.',
      hi: 'कूटे हुए ताजे अदरक और इलायची के साथ उबाली गई कड़क चाय, मिट्टी के कुल्हड़ में परोसी जाती है।',
      fr: 'Thé noir corsé mijoté avec du gingembre frais pilé, cardamome et lait, servi dans une tasse en terre cuite.',
      zh: '阿萨姆红茶与鲜姜碎、绿豆蔻粒及鲜牛奶慢火沸煮，盛于未上釉的传统陶土瓦罐杯中，散发独特的天然泥土焙香。',
    },
    priceRange: { min: 15, max: 35, typical: 20 },
    unit: {
      en: 'clay cup (kulhad)',
      hi: 'कुल्हड़ कप',
      fr: 'tasse en terre cuite',
      zh: '陶土瓦罐杯',
    },
    famousSpots: [
      { name: 'Sudama Tea Stall', locality: 'DU North Campus', nearestMetro: 'Vishwa Vidyalaya' },
      { name: 'Chai Point / Local Nukkad Stalls', locality: 'Connaught Place & Metro Gates', nearestMetro: 'All Metro Stations' },
      { name: 'Wengers Delicatessen & Tea', locality: 'Connaught Place Inner Circle', nearestMetro: 'Rajiv Chowk' },
    ],
    touristTip: {
      en: 'The unglazed earthenware cup gives the tea an earthy scent and is fully biodegradable.',
      hi: 'मिट्टी का कुल्हड़ चाय को एक सौंधी महक देता है और पूरी तरह पर्यावरण अनुकूल है।',
      fr: 'La tasse en argile non émaillée apporte un arôme boisé unique.',
      zh: '未上釉陶杯天然可降解，饮用完毕后丢入指定回收箱即可。',
    },
    isVegetarian: true,
  },
];

/**
 * Returns localized food text based on user selected language.
 * Strictly presents strings only in the chosen language.
 */
export function getLocalizedFood(food: StreetFoodItem, lang: Language) {
  const l: Language = (lang in food.name) ? lang : 'en';
  return {
    name: food.name[l] || food.name.en,
    tag: food.tag[l] || food.tag.en,
    flavorProfile: food.flavorProfile[l] || food.flavorProfile.en,
    description: food.description[l] || food.description.en,
    unit: food.unit[l] || food.unit.en,
    touristTip: food.touristTip[l] || food.touristTip.en,
  };
}
