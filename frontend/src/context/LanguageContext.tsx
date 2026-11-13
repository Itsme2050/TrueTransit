import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'hi' | 'fr' | 'zh';

export interface LanguageOption {
  code: Language;
  label: string;
  native: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'fr', label: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'zh', label: 'Chinese', native: '中文', flag: '🇨🇳' },
];

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    fr: string;
    zh: string;
  };
}

export const TRANSLATIONS: Translations = {
  // Navigation & Header
  tagline: {
    en: 'More than maps. Your true local guardian.',
    hi: 'नक्शों से कहीं अधिक। आपका सच्चा स्थानीय संरक्षक।',
    fr: 'Bien plus que des cartes. Votre véritable gardien local.',
    zh: '超越地图。您忠实的本地守护者。',
  },
  dashboard: {
    en: 'Guardian Dashboard',
    hi: 'गार्जियन डैशबोर्ड',
    fr: 'Tableau de bord Gardien',
    zh: '守护者仪表盘',
  },
  priceCheck: {
    en: 'Anti-Scam Price Index',
    hi: 'उचित मूल्य सूचकांक',
    fr: 'Indice Anti-Arnaque',
    zh: '防欺诈价格指数',
  },
  safetyMap: {
    en: 'Chrono-Safety Map',
    hi: 'सुरक्षा हीटमैप',
    fr: 'Carte Chrono-Sécurité',
    zh: '时段安全地图',
  },
  smartItinerary: {
    en: 'Smart AI Itinerary',
    hi: 'स्मार्ट यात्रा योजना',
    fr: 'Itinéraire IA Intelligent',
    zh: '智能AI行程',
  },
  emergencySOS: {
    en: 'Offline SOS & Panic Sync',
    hi: 'आपातकालीन एसओएस',
    fr: 'SOS Hors-ligne & Sync',
    zh: '离线紧急求救与同步',
  },
  savedTrips: {
    en: 'Saved Trips & Places',
    hi: 'सहेजी गई यात्राएं',
    fr: 'Voyages & Lieux enregistrés',
    zh: '已保存行程与地点',
  },
  adminModeration: {
    en: 'Moderation Portal',
    hi: 'मॉडरेशन पोर्टल',
    fr: 'Portail de modération',
    zh: '内容审核门户',
  },
  settings: {
    en: 'Settings & Privacy',
    hi: 'सेटिंग्स और गोपनीयता',
    fr: 'Paramètres & Confidentialité',
    zh: '设置与隐私',
  },
  online: {
    en: 'Online',
    hi: 'ऑनलाइन',
    fr: 'En ligne',
    zh: '在线',
  },
  offlineSim: {
    en: 'Offline Sim',
    hi: 'ऑफ़लाइन सिम',
    fr: 'Sim Hors-ligne',
    zh: '离线模拟',
  },
  cityDelhi: {
    en: 'Delhi',
    hi: 'दिल्ली',
    fr: 'Delhi',
    zh: '德里',
  },
  sos: {
    en: 'SOS',
    hi: 'एसओएस',
    fr: 'SOS',
    zh: '紧急求救',
  },
  viewMode: {
    en: 'View Mode',
    hi: 'दृश्य मोड',
    fr: 'Mode d\'affichage',
    zh: '视图模式',
  },
  phoneView: {
    en: 'Phone View',
    hi: 'फ़ोन दृश्य',
    fr: 'Vue Mobile',
    zh: '手机视图',
  },
  wideView: {
    en: 'Wide View',
    hi: 'विस्तृत दृश्य',
    fr: 'Vue Large',
    zh: '宽屏视图',
  },
  phoneModeActive: {
    en: 'Mobile Preview Active',
    hi: 'मोबाइल पूर्वावलोकन सक्रिय',
    fr: 'Aperçu Mobile Actif',
    zh: '手机预览已激活',
  },

  // Bottom Navigation
  home: {
    en: 'Home',
    hi: 'होम',
    fr: 'Accueil',
    zh: '首页',
  },
  prices: {
    en: 'Prices',
    hi: 'मूल्य',
    fr: 'Tarifs',
    zh: '价格',
  },
  safety: {
    en: 'Safety',
    hi: 'सुरक्षा',
    fr: 'Sécurité',
    zh: '安全',
  },
  planner: {
    en: 'Planner',
    hi: 'योजना',
    fr: 'Planning',
    zh: '规划',
  },

  // Welcome Banner & Quick Status (HomeDashboard)
  activeCityBanner: {
    en: 'Active City: Delhi, India',
    hi: 'सक्रिय शहर: दिल्ली, भारत',
    fr: 'Ville active: Delhi, Inde',
    zh: '当前城市：印度德里',
  },
  welcomeUser: {
    en: 'Welcome, Visiting Traveler!',
    hi: 'स्वागत है, सम्मानीय यात्री!',
    fr: 'Bienvenue, Cher Voyageur!',
    zh: '欢迎您，尊贵的旅客！',
  },
  welcomeGreeting: {
    en: 'Welcome, ',
    hi: 'स्वागत है, ',
    fr: 'Bienvenue, ',
    zh: '欢迎，',
  },
  traveler: {
    en: 'Visiting Traveler',
    hi: 'सम्मानीय यात्री',
    fr: 'Voyageur invité',
    zh: '到访旅客',
  },
  welcomeSubtitle: {
    en: 'Navigate unfamiliar streets with fair price transparency, 24-hour safety insights, and intelligent itinerary planning.',
    hi: 'उचित मूल्य पारदर्शिता, 24 घंटे सुरक्षा विश्लेषण, और समझदार यात्रा योजना के साथ अपरिचित सड़कों पर बेफिक्र घूमें।',
    fr: 'Naviguez dans les rues inconnues avec une transparence tarifaire, des conseils de sécurité 24h/24 et une planification d\'itinéraire intelligente.',
    zh: '凭借公正透明的价格、24小时安全洞察以及智能行程规划，安心探索陌生街道。',
  },
  checkFairPriceBtn: {
    en: 'Check Fair Price',
    hi: 'उचित मूल्य जांचें',
    fr: 'Vérifier Prix Équitable',
    zh: '查询公道价格',
  },
  exploreSafeRoutesBtn: {
    en: 'Explore Safe Routes',
    hi: 'सुरक्षित मार्ग देखें',
    fr: 'Explorer Itinéraires Sûrs',
    zh: '探索安全路线',
  },
  emergencySOSBtn: {
    en: 'Emergency SOS',
    hi: 'आपातकालीन एसओएस',
    fr: 'SOS d\'urgence',
    zh: '紧急求助 SOS',
  },
  currentLocality: {
    en: 'Current Locality',
    hi: 'वर्तमान क्षेत्र',
    fr: 'Localité actuelle',
    zh: '当前区域',
  },
  connaughtPlaceCentral: {
    en: 'Connaught Place (Central)',
    hi: 'कनॉट प्लेस (सेंट्रल)',
    fr: 'Connaught Place (Centre)',
    zh: '康诺特广场（市中心）',
  },
  chronoSafetyStatus: {
    en: 'Chrono-Safety Status',
    hi: 'समय-आधारित सुरक्षा स्थिति',
    fr: 'Statut Chrono-Sécurité',
    zh: '时段安全状态',
  },
  loadingLocalStatus: {
    en: 'Loading local status…',
    hi: 'स्थानीय स्थिति लोड हो रही है…',
    fr: 'Chargement du statut local…',
    zh: '正在加载当地状态…',
  },
  connectivityCache: {
    en: 'Connectivity & Cache',
    hi: 'कनेक्टिविटी और कैश',
    fr: 'Connectivité & Cache',
    zh: '网络连接与缓存',
  },
  liveSynchronized: {
    en: 'Live Synchronized',
    hi: 'लाइव सिंक्रनाइज़्ड',
    fr: 'Synchronisé en direct',
    zh: '实时已同步',
  },
  offlineModeCache: {
    en: 'Offline Mode (Local Cache)',
    hi: 'ऑफ़लाइन मोड (स्थानीय कैश)',
    fr: 'Mode Hors-ligne (Cache local)',
    zh: '离线模式（本地缓存）',
  },
  lowerConcern: {
    en: 'Lower concern',
    hi: 'सामान्य (कम जोखिम)',
    fr: 'Faible préoccupation',
    zh: '低风险（较安全）',
  },
  cautionAdvised: {
    en: 'Caution advised',
    hi: 'सावधानी बरतें',
    fr: 'Prudence conseillée',
    zh: '建议保持警惕',
  },
  elevatedConcern: {
    en: 'Elevated concern',
    hi: 'उच्च सतर्कता आवश्यक',
    fr: 'Vigilance accrue',
    zh: '需高度警惕',
  },
  unavailableOffline: {
    en: 'Unavailable offline',
    hi: 'ऑफ़लाइन अनुपलब्ध',
    fr: 'Indisponible hors-ligne',
    zh: '离线时不可用',
  },

  // Home Feature Modules
  officialTariffsBadge: {
    en: 'Official Tariffs + Community',
    hi: 'सरकारी दरें + समुदाय',
    fr: 'Tarifs officiels + Communauté',
    zh: '官方费率 + 社区基准',
  },
  antiScamTitle: {
    en: 'Anti-Scam Fair Price Index',
    hi: 'उचित मूल्य सूचकांक (एंटी-स्कैम)',
    fr: 'Indice de Prix Anti-Arnaque',
    zh: '防欺诈公道价格指数',
  },
  antiScamDesc: {
    en: 'Verify expected auto-rickshaw fares, taxi tariffs, and street food prices before paying. Includes official Delhi meter rules and statistical outlier filtering.',
    hi: 'भुगतान करने से पहले ऑटो-रिक्शा किराया, टैक्सी दरें और स्ट्रीट फूड की कीमतें जांचें। इसमें दिल्ली के आधिकारिक मीटर नियम और सांख्यिकीय फ़िल्टरिंग शामिल हैं।',
    fr: 'Vérifiez les tarifs des rickshaws, taxis et cuisine de rue avant de payer. Intègre les règles officielles de compteur de Delhi et le filtrage statistique.',
    zh: '付款前核验突突车、出租车及街头美食的合理费用。内置德里官方计价器标准及统计异常值过滤。',
  },
  delhiAutoBase: {
    en: 'Delhi Auto (Base 1.5 km):',
    hi: 'दिल्ली ऑटो (शुरुआती 1.5 किमी):',
    fr: 'Auto Delhi (Base 1,5 km):',
    zh: '德里突突车起步（1.5公里）：',
  },
  autoRateThereafter: {
    en: 'Auto Rate thereafter:',
    hi: 'प्रति किमी अतिरिक्त दर:',
    fr: 'Tarif au km suivant:',
    zh: '此后每公里费率：',
  },
  nightSurchargeRow: {
    en: 'Night Surcharge (23:00 - 05:00):',
    hi: 'रात्रि शुल्क (23:00 - 05:00):',
    fr: 'Supplément nuit (23:00 - 05:00):',
    zh: '夜间附加费（23:00 - 05:00）：',
  },
  launchPriceCalculatorBtn: {
    en: 'Launch Fair Price Calculator',
    hi: 'उचित मूल्य कैलकुलेटर खोलें',
    fr: 'Ouvrir Calculateur de Prix',
    zh: '打开公道价格计算器',
  },

  timeSliderBadge: {
    en: '24-Hour Time Slider',
    hi: '24-घंटे का समय स्लाइडर',
    fr: 'Curseur horaire 24h',
    zh: '24小时时段滑块',
  },
  chronoSafetyTitle: {
    en: 'Chrono-Safety Map & Routes',
    hi: 'समय-सुरक्षा मानचित्र व मार्ग',
    fr: 'Carte Chrono-Sécurité & Itinéraires',
    zh: '时段安全地图与路线',
  },
  chronoSafetyDesc: {
    en: 'Assess street conditions by time of day. Compare Fastest vs. Safest vs. Balanced routes factoring street lighting, foot traffic, and verified incident records.',
    hi: 'समय के अनुसार सड़क की स्थिति का आकलन करें। स्ट्रीट लाइट, भीड़ और सुरक्षा रिकॉर्ड के आधार पर सबसे तेज़, सुरक्षित और संतुलित मार्गों की तुलना करें।',
    fr: 'Évaluez l\'état des rues selon l\'heure. Comparez les trajets les plus rapides, les plus sûrs et équilibrés selon l\'éclairage et la fréquentation.',
    zh: '按一天不同时段评估街区状况。综合考量路灯照明、人流密度及巡逻警力，比对最快、最安全与均衡路线。',
  },
  safestRouteSnippet: {
    en: 'Safest Route: High-patrol boulevards with full CCTV',
    hi: 'सबसे सुरक्षित मार्ग: पुलिस गश्त और पूर्ण सीसीटीवी युक्त मुख्य मार्ग',
    fr: 'Itinéraire le plus sûr: Boulevards surveillés avec vidéosurveillance',
    zh: '最安全路线：高频巡逻大道与全覆盖监控',
  },
  fastestRouteSnippet: {
    en: 'Fastest Route: Direct bypass via secondary links',
    hi: 'सबसे तेज़ मार्ग: द्वितीयक गलियों से सीधा शॉर्टकट',
    fr: 'Itinéraire le plus rapide: Raccourci direct via voies secondaires',
    zh: '最快路线：通过次要支路直达避堵',
  },
  openInteractiveMapBtn: {
    en: 'Open Interactive Safety Map',
    hi: 'इंटरैक्टिव सुरक्षा मानचित्र खोलें',
    fr: 'Ouvrir Carte Interactive',
    zh: '打开交互式安全地图',
  },

  aiBudgetBadge: {
    en: 'AI + Deterministic Budget Check',
    hi: 'एआई + सटीक बजट सत्यापन',
    fr: 'IA + Validation Budgétaire Déterministe',
    zh: 'AI + 确定性预算严格校验',
  },
  smartPlannerTitle: {
    en: 'Smart AI Itinerary Planner',
    hi: 'स्मार्ट एआई यात्रा योजनाकार',
    fr: 'Planificateur d\'Itinéraire IA Intelligent',
    zh: '智能AI行程规划师',
  },
  smartPlannerDesc: {
    en: 'Enter your budget and free hours (e.g. ₹1,500 budget, 4 hours free) to generate realistic itineraries with itemized transport, safe stops, and mathematical budget guarantees.',
    hi: 'अपना बजट और उपलब्ध समय दर्ज करें (उदा. ₹1,500 बजट, 4 घंटे) और सटीक बजट गारंटी के साथ सुरक्षित यात्रा योजना बनाएं।',
    fr: 'Entrez votre budget et temps libre (ex: 1500 ₹, 4h) pour générer des itinéraires avec transports détaillés et garantie budgétaire stricte.',
    zh: '输入您的预算与空闲时间（例如 ₹1,500 预算，4小时空闲），生成涵盖逐项交通、安全停靠点且严格受控在预算内的精细行程。',
  },
  planItineraryBtn: {
    en: 'Plan Itinerary with Gemini',
    hi: 'जेमिनी के साथ यात्रा बनाएं',
    fr: 'Planifier avec Gemini',
    zh: '使用 Gemini 规划行程',
  },

  offlineResilienceBadge: {
    en: 'Offline-First Resilience',
    hi: 'ऑफ़लाइन-प्रथम सुरक्षा',
    fr: 'Résilience Hors-ligne Totale',
    zh: '离线优先应急防护',
  },
  offlineSOSCardTitle: {
    en: 'Offline SOS & Panic Sync',
    hi: 'ऑफ़लाइन एसओएस और पैनिक सिंक',
    fr: 'SOS Hors-ligne & Sync Panique',
    zh: '离线紧急求救与同步',
  },
  offlineSOSCardDesc: {
    en: 'One-tap direct dialing for 112 / 1091, pre-cached Delhi hospital coordinates (AIIMS, Safdarjung), and queue-based report replay when connectivity is restored.',
    hi: '112 / 1091 पर एक टैप से सीधे कॉल करें, दिल्ली के प्रमुख अस्पतालों (एम्स, सफदरजंग) की जानकारी और इंटरनेट आने पर स्वचालित सिंक।',
    fr: 'Composition directe 112 / 1091, coordonnées des hôpitaux de Delhi en cache (AIIMS, Safdarjung) et synchronisation automatique au retour du réseau.',
    zh: '一键直拨 112/1091，预存德里重点医院坐标（AIIMS、萨夫达容），网络恢复后自动重放同步上报。',
  },
  openEmergencyHubBtn: {
    en: 'Open Offline Emergency Hub',
    hi: 'ऑफ़लाइन आपातकालीन केंद्र खोलें',
    fr: 'Ouvrir Centre d\'Urgence Hors-ligne',
    zh: '打开离线应急中心',
  },

  productPrincipleBadge: {
    en: 'Product Principle:',
    hi: 'उत्पाद सिद्धांत:',
    fr: 'Principe du Produit:',
    zh: '产品原则：',
  },
  productPrincipleDesc: {
    en: 'TrueTransit uses objective economic baselines and infrastructure signals to assist traveler decision-making. Safety indicators are decision-support heuristics and not guarantees of crime-free areas. Price assessments follow official statutory meter tariffs and verified surveys.',
    hi: 'TrueTransit यात्रियों के निर्णय में सहायता के लिए आधिकारिक आर्थिक आंकड़ों और बुनियादी ढांचा संकेतों का उपयोग करता है। सुरक्षा संकेतक निर्णय-सहायता के लिए हैं, अपराध-मुक्त क्षेत्र की गारंटी नहीं। मूल्य मूल्यांकन आधिकारिक मीटर नियमों और सत्यापित सर्वेक्षणों पर आधारित हैं।',
    fr: 'TrueTransit utilise des données économiques objectives et des signaux d\'infrastructure pour aider à la prise de décision. Les indices de sécurité sont des heuristiques d\'aide et non des garanties de zones sans criminalité.',
    zh: 'TrueTransit 运用客观的经济基准与市政基建信号辅助旅客决策。安全评分属于启发式参考而非零犯罪保证。价格测算遵循德里官方法定计费及核实调研。',
  },

  // Price Check Page (Photo 2)
  antiScamPriceIndexHeading: {
    en: 'Anti-Scam Price Index',
    hi: 'उचित मूल्य सूचकांक (एंटी-स्कैम)',
    fr: 'Indice de Prix Anti-Arnaque',
    zh: '防欺诈公道价格指数',
  },
  priceCheckHeaderDesc: {
    en: 'Empowering travelers with official regulated tariffs, market baselines, and quotation verification.',
    hi: 'आधिकारिक विनियमित दरों, बाज़ार आधार रेखाओं और उद्धरण सत्यापन के साथ यात्रियों को सशक्त बनाना।',
    fr: 'Permettre aux voyageurs de vérifier les devis avec les tarifs officiels réglementés et les repères du marché.',
    zh: '凭借官方规管费率、市场基准与即时报价比对，守护旅客消费权益。',
  },
  reportPriceBtn: {
    en: 'Report a Price',
    hi: 'मूल्य रिपोर्ट करें',
    fr: 'Signaler un Prix',
    zh: '上报价格',
  },
  serviceInputsTitle: {
    en: 'Service & Item Inputs',
    hi: 'सेवा एवं वस्तु विवरण',
    fr: 'Détails du Service & Article',
    zh: '服务与物品输入',
  },
  categoryLabel: {
    en: 'Category',
    hi: 'श्रेणी',
    fr: 'Catégorie',
    zh: '类别',
  },
  transportCategory: {
    en: 'Transport',
    hi: 'परिवहन',
    fr: 'Transport',
    zh: '交通出行',
  },
  foodCategory: {
    en: 'Street Food',
    hi: 'स्ट्रीट फूड',
    fr: 'Street Food',
    zh: '街头美食',
  },
  commodityCategory: {
    en: 'Packaged Goods',
    hi: 'पैकेटबंद सामान',
    fr: 'Produits emballés',
    zh: '包装食品/日用',
  },
  serviceCategory: {
    en: 'Services',
    hi: 'सेवाएँ',
    fr: 'Services',
    zh: '便民服务',
  },
  itemNameLabel: {
    en: 'Item / Service Name',
    hi: 'वस्तु / सेवा का नाम',
    fr: 'Nom de l\'article / Service',
    zh: '物品 / 服务名称',
  },
  // Item Options
  optDelhiAuto: {
    en: 'Delhi Auto-Rickshaw (Official Meter)',
    hi: 'दिल्ली ऑटो-रिक्शा (आधिकारिक मीटर)',
    fr: 'Auto-Rickshaw Delhi (Compteur Officiel)',
    zh: '德里突突车（官方打表）',
  },
  optDelhiTaxi: {
    en: 'Delhi Standard AC Taxi / Cab',
    hi: 'दिल्ली मानक एसी टैक्सी / कैब',
    fr: 'Taxi AC Standard Delhi / VTC',
    zh: '德里标准空调出租车 / 网约车',
  },
  optDmrcMetroFeeder: {
    en: '🚇 DMRC Metro + Local Feeder (Combined Multimodal)',
    hi: '🚇 डीएमआरसी मेट्रो + स्थानीय फीडर परिवहन (मल्टीमॉडल)',
    fr: '🚇 Métro DMRC + Transport local (multimodal)',
    zh: '🚇 德里地铁 DMRC + 最后一公里接驳（多模式出行）',
  },
  optCholeBhature: {
    en: 'Chole Bhature (Standard Serving)',
    hi: 'छोले भटूरे (मानक थाली)',
    fr: 'Chole Bhature (Portion standard)',
    zh: '鹰嘴豆炸面饼（标准份）',
  },
  optTeaChai: {
    en: 'Tea / Chai (Kulhad Street Stall)',
    hi: 'चाय / कुल्हड़ चाय (सड़क की दुकान)',
    fr: 'Thé / Chai (Étal de rue Kulhad)',
    zh: '瓦罐热茶 / 奶茶（街头小摊）',
  },
  optTenderCoconut: {
    en: 'Tender Coconut Water',
    hi: 'ताज़ा नारियल पानी',
    fr: 'Eau de coco fraîche',
    zh: '新鲜椰青椰汁',
  },
  optPackagedWater: {
    en: 'Packaged Drinking Water 1L (Statutory MRP)',
    hi: 'पैकेटबंद पीने का पानी 1L (सरकारी एमआरपी)',
    fr: 'Eau embouteillée 1L (Prix légal MRP)',
    zh: '瓶装饮用水 1升（法定建议零售价）',
  },
  optSimCard: {
    en: 'SIM Card Tourist Pack (30 Days)',
    hi: 'सिम कार्ड टूरिस्ट पैक (30 दिन)',
    fr: 'Pack SIM Touriste (30 jours)',
    zh: '旅游SIM电话卡套餐（30天）',
  },
  optLuggageCloakroom: {
    en: 'Luggage Cloakroom (24h DMRC/IRCTC)',
    hi: 'सामान क्लॉकरूम (24 घंटे मेट्रो/रेलवे)',
    fr: 'Consigne à bagages (24h Métro/Gare)',
    zh: '火车站/地铁行李寄存处（24小时）',
  },
  optShoeKeeping: {
    en: 'Shoe Keeping at Monument',
    hi: 'स्मारक पर जूता स्टैंड शुल्क',
    fr: 'Garde de chaussures aux monuments',
    zh: '古迹鞋履寄存服务',
  },

  tripDistanceLabel: {
    en: 'Trip Distance',
    hi: 'यात्रा दूरी',
    fr: 'Distance du trajet',
    zh: '行程距离',
  },
  shortHop: {
    en: 'Short Hop (1 km)',
    hi: 'छोटा चक्कर (1 किमी)',
    fr: 'Court trajet (1 km)',
    zh: '短途代步（1公里）',
  },
  cityAverage: {
    en: 'City Average (5 km)',
    hi: 'शहर का औसत (5 किमी)',
    fr: 'Moyenne urbaine (5 km)',
    zh: '城市平均（5公里）',
  },
  airportCrossCity: {
    en: 'Airport / Cross City (25 km)',
    hi: 'हवाई अड्डा / शहर पार (25 किमी)',
    fr: 'Aéroport / Traversée (25 km)',
    zh: '机场 / 跨城（25公里）',
  },
  localityLabel: {
    en: 'Locality',
    hi: 'इलाका / क्षेत्र',
    fr: 'Quartier / Localité',
    zh: '所在区域 / 地标',
  },
  localityPlaceholder: {
    en: 'e.g. Connaught Place, Paharganj',
    hi: 'उदा. कनॉट प्लेस, पहाड़गंज',
    fr: 'ex: Connaught Place, Paharganj',
    zh: '例如：康诺特广场、帕哈甘吉',
  },
  quantityLabel: {
    en: 'Quantity',
    hi: 'मात्रा',
    fr: 'Quantité',
    zh: '数量',
  },
  unitSingular: {
    en: 'unit',
    hi: 'इकाई',
    fr: 'unité',
    zh: '件/份',
  },
  unitPlural: {
    en: 'units',
    hi: 'इकाइयाँ',
    fr: 'unités',
    zh: '件/份',
  },
  timeOfDayLabel: {
    en: 'Time of Day',
    hi: 'दिन का समय / दर',
    fr: 'Moment de la journée',
    zh: '时段与计费标准',
  },
  regularDayTime: {
    en: 'Regular Day (05:00 - 23:00)',
    hi: 'सामान्य दिन (05:00 - 23:00)',
    fr: 'Jour normal (05:00 - 23:00)',
    zh: '日间正常（05:00 - 23:00）',
  },
  nightFareTariff: {
    en: 'Night Fare (+25% Tariff)',
    hi: 'रात्रि शुल्क (+25% दर)',
    fr: 'Tarif de nuit (+25%)',
    zh: '夜间费率（+25% 附加费）',
  },
  quotedPriceQuestion: {
    en: 'Were you quoted a specific price? (Optional)',
    hi: 'क्या आपसे कोई विशेष मूल्य मांगा गया? (वैकल्पिक)',
    fr: 'Un prix vous a-t-il été proposé? (Facultatif)',
    zh: '对方是否报出了具体价格？（选填）',
  },
  quotedPricePlaceholder: {
    en: 'Enter quoted price (e.g. 180)',
    hi: 'मांगी गई कीमत दर्ज करें (उदा. 180)',
    fr: 'Entrez le prix proposé (ex: 180)',
    zh: '输入对方要价（例如 180）',
  },
  quotedPriceHint: {
    en: 'Compare seller quotation against fair algorithmic baseline in real time.',
    hi: 'वास्तविक समय में एल्गोरिथम आधार मूल्य से विक्रेता के मूल्य की तुलना करें।',
    fr: 'Comparez l\'offre du vendeur à l\'indice équitable en temps réel.',
    zh: '实时对比卖家报价与系统公道算法基准。',
  },
  recalculatePriceBtn: {
    en: 'Recalculate Fair Price',
    hi: 'उचित मूल्य की पुनः गणना करें',
    fr: 'Recalculer le Prix Équitable',
    zh: '重新测算公道价格',
  },
  evaluatingIndex: {
    en: 'Evaluating Index...',
    hi: 'मूल्यांकन किया जा रहा है...',
    fr: 'Évaluation en cours...',
    zh: '正在评估指标...',
  },
  fairPriceRange: {
    en: 'Estimated Fair Price Range',
    hi: 'अनुमानित उचित मूल्य दायरा',
    fr: 'Fourchette de Prix Équitable Estimée',
    zh: '预估公道价格区间',
  },
  typicalReportedRate: {
    en: 'Typical Locally Reported Rate:',
    hi: 'सामान्य स्थानीय रिपोर्ट की गई दर:',
    fr: 'Tarif typique rapporté localement:',
    zh: '当地典型报备价格：',
  },
  confidenceScore: {
    en: 'Confidence Score',
    hi: 'विश्वसनीयता स्कोर',
    fr: 'Score de Confiance',
    zh: '置信度得分',
  },
  verifiedTariffNotice: {
    en: 'Verified Official Tariff 2024-2026',
    hi: 'सत्यापित आधिकारिक दर 2024-2026',
    fr: 'Tarif officiel vérifié 2024-2026',
    zh: '2024-2026 官方核定费率',
  },
  verifiedLabel: {
    en: 'Verified',
    hi: 'सत्यापित',
    fr: 'Vérifié',
    zh: '已验证',
  },

  // Verdict Alerts
  verdictFair: {
    en: 'Fair Price',
    hi: 'उचित मूल्य',
    fr: 'Prix Équitable',
    zh: '公道合理',
  },
  verdictSlightlyAbove: {
    en: 'Slightly Above Estimated Range',
    hi: 'अनुमानित दायरे से थोड़ा अधिक',
    fr: 'Légèrement au-dessus de la fourchette',
    zh: '略高于预估区间',
  },
  verdictSignificantlyAbove: {
    en: 'Significantly Above Estimated Range',
    hi: 'अनुमानित दायरे से काफी अधिक',
    fr: 'Fortement supérieur à la fourchette',
    zh: '严重超出合理范围（谨防欺诈）',
  },
  verdictBelowTypical: {
    en: 'Below Typical Estimate',
    hi: 'सामान्य अनुमान से कम',
    fr: 'Inférieur à l\'estimation typique',
    zh: '低于一般预估价',
  },
  verdictAdviceQuotedHigher: {
    en: 'Quoted price is higher than typical benchmarks. Request official meter charging, check app alternatives, or politely check another vendor.',
    hi: 'मांगी गई कीमत मानक दरों से काफी अधिक है। आधिकारिक मीटर से चलने का आग्रह करें, कैब ऐप जांचें, या दूसरे ऑटो/दुकान से संपर्क करें।',
    fr: 'Le prix proposé dépasse les repères. Exigez le compteur officiel, consultez une application VTC ou adressez-vous à un autre vendeur.',
    zh: '此报价明显高于当地基准。请坚决要求打表、查看网约车叫车软件比价，或礼貌另寻其他司机/商户。',
  },

  fareFormulaTitle: {
    en: 'Fare Formula & Tariff Breakdown',
    hi: 'किराया सूत्र और दर विवरण',
    fr: 'Formule Tarifaire & Ventilation',
    zh: '计价公式与明细拆解',
  },
  dataSourceLabel: {
    en: 'Data Source:',
    hi: 'डेटा स्रोत:',
    fr: 'Source des données:',
    zh: '数据来源：',
  },
  dataSourceText: {
    en: 'Delhi Government Transport Department Meter Notification',
    hi: 'दिल्ली सरकार परिवहन विभाग मीटर अधिसूचना',
    fr: 'Notification du ministère des transports du gouvernement de Delhi',
    zh: '德里政府交通局官方计价器核定通告',
  },
  fairTradingNoticeLabel: {
    en: 'Fair Trading Notice:',
    hi: 'निष्पक्ष व्यापार सूचना:',
    fr: 'Avis de Commerce Équitable:',
    zh: '公平交易须知：',
  },
  fairTradingNoticeText: {
    en: 'Prices vary by vendor, local demand, time of day, and operating conditions. Transportation rates reflect Delhi Transport Dept published tariffs.',
    hi: 'कीमतें विक्रेता, मांग, समय और परिचालन स्थितियों के अनुसार भिन्न हो सकती हैं। परिवहन दरें दिल्ली परिवहन विभाग की आधिकारिक दरों पर आधारित हैं।',
    fr: 'Les prix varient selon le vendeur, la demande et l\'heure. Les tarifs de transport reflètent la grille publiée par les autorités.',
    zh: '实际价格可能因商户、即时供需、时段及路况略有浮动。市内交通资费严格依据德里交通局公布的法定出租标准测算。',
  },

  // Breakdown Keys
  breakdownDistanceKm: {
    en: 'Distance Km',
    hi: 'दूरी (किमी)',
    fr: 'Distance Km',
    zh: '里程公里数',
  },
  breakdownBaseFare: {
    en: 'Base Fare',
    hi: 'शुरुआती किराया',
    fr: 'Prise en charge',
    zh: '起步价',
  },
  breakdownBaseKm: {
    en: 'Base Km',
    hi: 'शुरुआती दूरी (किमी)',
    fr: 'Km inclus',
    zh: '起步里程',
  },
  breakdownDistanceCharge: {
    en: 'Distance Charge',
    hi: 'दूरी शुल्क',
    fr: 'Coût kilométrique',
    zh: '里程追加费',
  },
  breakdownNightSurcharge: {
    en: 'Night Surcharge',
    hi: 'रात्रि शुल्क',
    fr: 'Supplément nuit',
    zh: '夜间附加费',
  },
  breakdownIsNightTariff: {
    en: 'Is Night Tariff Applied',
    hi: 'क्या रात्रि शुल्क लागू है',
    fr: 'Tarif de nuit appliqué',
    zh: '是否适用夜间资费',
  },
  yesLabel: {
    en: 'Yes',
    hi: 'हाँ',
    fr: 'Oui',
    zh: '是',
  },
  noLabel: {
    en: 'No',
    hi: 'नहीं',
    fr: 'Non',
    zh: '否',
  },

  // Chrono-Safety Map Page (Photo 3)
  chronoSafetyPageTitle: {
    en: 'Chrono-Safety Map & Routing',
    hi: 'समय-सुरक्षा मानचित्र व मार्ग',
    fr: 'Carte Chrono-Sécurité & Itinéraires',
    zh: '时段安全地图与智能寻路',
  },
  chronoSafetyPageDesc: {
    en: 'Compare Fastest vs. Safest corridors based on street lighting, pedestrian vitality, and 24-hour infrastructure.',
    hi: 'स्ट्रीट लाइट, भीड़ और 24-घंटे बुनियादी ढांचे के आधार पर सबसे तेज़ व सबसे सुरक्षित मार्गों की तुलना करें।',
    fr: 'Comparez les corridors les plus rapides et sûrs selon l\'éclairage, la fréquentation piétonne et les infrastructures 24h/24.',
    zh: '根据路灯照明、人流活力及全天候市政设施，比对最快与最安全通行走廊。',
  },
  reportSafetyConcernBtn: {
    en: 'Report Safety Concern',
    hi: 'सुरक्षा संबंधी चिंता दर्ज करें',
    fr: 'Signaler un problème de sécurité',
    zh: '上报安全隐患',
  },
  chronoTimeSliderLabel: {
    en: 'Chrono-Time Slider:',
    hi: 'समय स्लाइडर:',
    fr: 'Curseur temporel:',
    zh: '时段调节滑块：',
  },
  timeNightNote: {
    en: 'Late Night: High-risk back alleys; main arterials recommended',
    hi: 'देर रात: गलियों में जोखिम; केवल मुख्य सड़कों का उपयोग करें',
    fr: 'Tard dans la nuit: Ruelles sombres déconseillées; artères principales recommandées',
    zh: '深夜时段：小巷光照不足风险高；强烈建议走主干道',
  },
  timeEveningNote: {
    en: 'Evening: Variable illumination; shops closing',
    hi: 'शाम: असमान रोशनी; दुकानें बंद होना शुरू',
    fr: 'Soirée: Éclairage variable; fermeture progressive des commerces',
    zh: '傍晚时段：部分路段光照不一；沿街店铺陆续打烊',
  },
  timeDaylightNote: {
    en: 'Daylight: Active natural pedestrian surveillance',
    hi: 'दिन का समय: स्वाभाविक जन-चहलपहल और उच्च सुरक्षा',
    fr: 'Plein jour: Forte présence piétonne et surveillance naturelle',
    zh: '日间时段：公共人流密集，天然可视性与安全度高',
  },
  midnightLabel: {
    en: '00:00 (Midnight)',
    hi: '00:00 (मध्यरात्रि)',
    fr: '00:00 (Minuit)',
    zh: '00:00（午夜）',
  },
  dawnLabel: {
    en: '06:00 (Dawn)',
    hi: '06:00 (भोर)',
    fr: '06:00 (Aube)',
    zh: '06:00（清晨）',
  },
  noonLabel: {
    en: '12:00 (Noon)',
    hi: '12:00 (दोपहर)',
    fr: '12:00 (Midi)',
    zh: '12:00（正午）',
  },
  duskLabel: {
    en: '18:00 (Dusk)',
    hi: '18:00 (शाम)',
    fr: '18:00 (Crépuscule)',
    zh: '18:00（傍晚）',
  },
  nightLabel: {
    en: '23:00 (Night)',
    hi: '23:00 (रात)',
    fr: '23:00 (Nuit)',
    zh: '23:00（夜晚）',
  },

  departurePointLabel: {
    en: 'Departure Point (Origin)',
    hi: 'प्रारंभिक स्थल (शुरुआत)',
    fr: 'Point de départ (Origine)',
    zh: '出发地点（起点）',
  },
  destinationPointLabel: {
    en: 'Destination Point',
    hi: 'गंतव्य स्थल',
    fr: 'Point de destination',
    zh: '目的地（终点）',
  },
  typeOrSelectOrigin: {
    en: 'Type any departure point or pick from popular landmarks...',
    hi: 'कोई भी प्रारंभिक स्थान टाइप करें या लैंडमार्क चुनें...',
    fr: 'Tapez un point de départ ou choisissez un lieu emblématique...',
    zh: '输入任意出发地或从地标中选择...',
  },
  unlimitedOriginNotice: {
    en: 'Unlimited Departure Search: Type any Delhi/NCR location, hotel, station, or street.',
    hi: 'असीमित प्रारंभिक स्थल खोज: कोई भी होटल, स्टेशन, या सड़क टाइप करें।',
    fr: 'Recherche libre de départ: Tapez n\'importe quel hôtel, gare ou rue.',
    zh: '无限制出发地搜索：输入任意酒店、车站、街区或地址。',
  },
  typeOrSelectDestination: {
    en: 'Type any destination or pick from popular landmarks...',
    hi: 'कोई भी गंतव्य टाइप करें या लोकप्रिय स्थानों में से चुनें...',
    fr: 'Tapez une destination ou choisissez un lieu emblématique...',
    zh: '输入任意目的地或从热门地标中选择...',
  },
  unlimitedDestinationsNotice: {
    en: 'Unlimited Destination Search: Type any Delhi/NCR location, landmark, or street name.',
    hi: 'असीमित गंतव्य खोज: किसी भी दिल्ली/एनसीआर स्थान, लैंडमार्क या सड़क का नाम टाइप करें।',
    fr: 'Recherche illimitée: Tapez n\'importe quel lieu, monument ou rue de Delhi.',
    zh: '无限制目的地探索：输入任意德里/首都圈地点、地标或街道名称。',
  },
  popularDestinations: {
    en: 'Popular Destinations',
    hi: 'लोकप्रिय गंतव्य',
    fr: 'Destinations populaires',
    zh: '热门推荐目的地',
  },
  customDestinationAdded: {
    en: 'Custom Location',
    hi: 'कस्टम स्थान',
    fr: 'Emplacement personnalisé',
    zh: '自定义地点',
  },
  routeAlternativesHeading: {
    en: 'Alternative Route Recommendations',
    hi: 'वैकल्पिक मार्ग अनुशंसाएँ',
    fr: 'Recommandations d\'itinéraires alternatifs',
    zh: '备选路线智能推荐',
  },
  tradeOffLabel: {
    en: 'Trade-off:',
    hi: 'व्यापार-बंद (Trade-off):',
    fr: 'Compromis:',
    zh: '得失权衡：',
  },
  safetyEvidenceTitle: {
    en: 'Safety Evidence & Corridor Analysis',
    hi: 'सुरक्षा साक्ष्य एवं मार्ग विश्लेषण',
    fr: 'Preuves de sécurité & Analyse du corridor',
    zh: '安全佐证与走廊深度分析',
  },
  lightingLabel: {
    en: 'Lighting:',
    hi: 'स्ट्रीट लाइटिंग:',
    fr: 'Éclairage:',
    zh: '照明状况：',
  },
  transitAccessLabel: {
    en: 'Transit Access:',
    hi: 'परिवहन पहुंच:',
    fr: 'Accès transports:',
    zh: '交通接驳：',
  },
  recommendedHoursLabel: {
    en: 'Hours:',
    hi: 'उपयुक्त समय:',
    fr: 'Heures:',
    zh: '建议时段：',
  },
  safetyAdvisoryText: {
    en: 'Safety Advisory: TrueTransit route scores are heuristic guidance calculated from street lighting, transit hubs, and recent reports. Never substitute navigational scores for common-sense vigilance.',
    hi: 'सुरक्षा सलाह: TrueTransit मार्ग स्कोर स्ट्रीट लाइट, मेट्रो स्टेशनों और हालिया रिपोर्टों से तैयार अनुमानित मार्गदर्शन हैं। व्यक्तिगत सतर्कता हमेशा सबसे महत्वपूर्ण है।',
    fr: 'Avis de sécurité: Les scores TrueTransit sont des indications calculées à partir de l\'éclairage et des données récentes. Restez toujours vigilant.',
    zh: '安全警示：TrueTransit 路线评分是基于路灯照度、枢纽便利度与上报信息的辅助参考。出行请随时保持警觉。',
  },

  // Smart AI Itinerary Planner Page (Photo 4)
  itineraryPlannerHeading: {
    en: 'Smart AI Itinerary Planner',
    hi: 'स्मार्ट एआई यात्रा योजनाकार',
    fr: 'Planificateur d\'Itinéraire IA Intelligent',
    zh: '智能AI行程规划师',
  },
  itinerarySubtitle: {
    en: 'Gemini generative reasoning backed by strict programmatic budget validation.',
    hi: 'जेमिनी जेनरेटिव रीज़निंग के साथ सख्त प्रोग्रामेटिक बजट सत्यापन।',
    fr: 'Raisonnement génératif Gemini soutenu par une validation budgétaire stricte.',
    zh: 'Gemini 大模型生成式推理，并由底层确定性算法严格捍卫预算底线。',
  },
  loadMedicalPresetBtn: {
    en: 'Load Medical Demo Preset (₹1,500 / 4h)',
    hi: 'मेडिकल डेमो प्रीसेट लोड करें (₹1,500 / 4 घंटे)',
    fr: 'Charger démo Médicale (1 500 ₹ / 4h)',
    zh: '加载就医/速览演示预设（₹1,500 / 4小时）',
  },
  startingPointInputLabel: {
    en: 'Starting Point',
    hi: 'प्रारंभिक स्थान',
    fr: 'Point de départ',
    zh: '出发地点',
  },
  destinationInputLabel: {
    en: 'Destination',
    hi: 'गंतव्य स्थल',
    fr: 'Destination',
    zh: '目的地点',
  },
  availableFreeTimeLabel: {
    en: 'Available Free Time',
    hi: 'उपलब्ध खाली समय',
    fr: 'Temps libre disponible',
    zh: '可用空闲时间',
  },
  hoursUnit: {
    en: 'hours',
    hi: 'घंटे',
    fr: 'heures',
    zh: '小时',
  },
  totalMaxBudgetLabel: {
    en: 'Total Maximum Budget',
    hi: 'कुल अधिकतम बजट',
    fr: 'Budget maximal total',
    zh: '出行预算上限',
  },
  travelPurposeLabel: {
    en: 'Travel Purpose',
    hi: 'यात्रा का उद्देश्य',
    fr: 'Motif du voyage',
    zh: '出行目的 / 主题',
  },
  preferredTransportLabel: {
    en: 'Preferred Transportation',
    hi: 'पसंदीदा परिवहन',
    fr: 'Transport préféré',
    zh: '出行交通偏好',
  },
  // Transport Options in Planner
  transOptBalanced: {
    en: 'Balanced (Air-Conditioned Metro + Pre-paid Auto)',
    hi: 'संतुलित (वातानुकूलित मेट्रो + प्रीपेड ऑटो)',
    fr: 'Équilibré (Métro climatisé + Auto prépayé)',
    zh: '均衡搭配（空调地铁 + 官方预付费突突车）',
  },
  transOptMetro: {
    en: 'Metro Rail Only (Most Economical & Safe)',
    hi: 'केवल मेट्रो रेल (सबसे किफायती और सुरक्षित)',
    fr: 'Métro uniquement (Plus économique & sûr)',
    zh: '仅乘坐地铁（经济实惠且高安全度）',
  },
  transOptAuto: {
    en: 'Auto-Rickshaw',
    hi: 'ऑटो-रिक्शा',
    fr: 'Auto-Rickshaw',
    zh: '突突车直达',
  },
  transOptCab: {
    en: 'Standard Cab',
    hi: 'मानक कैब / टैक्सी',
    fr: 'Taxi standard',
    zh: '标准出租车 / 专车',
  },
  generateValidatedItineraryBtn: {
    en: 'Generate Validated Itinerary',
    hi: 'सत्यापित यात्रा कार्यक्रम बनाएं',
    fr: 'Générer l\'Itinéraire Validé',
    zh: '生成已验真合规行程',
  },
  synthesizingContext: {
    en: 'Synthesizing Context & Checking Invariants...',
    hi: 'संदर्भ विश्लेषण एवं बजट सुरक्षा की जांच हो रही है...',
    fr: 'Synthèse du contexte & vérification des contraintes...',
    zh: '正在结合真实场景推理并检验预算不变量...',
  },
  deterministicBudgetGuardPassed: {
    en: 'Deterministic Budget Guard Passed',
    hi: 'सटीक बजट गार्ड सत्यापित (सफल)',
    fr: 'Garde Budgétaire Déterministe Validé',
    zh: '底层确定性预算守卫：校验通过',
  },
  deterministicBudgetGuardFailed: {
    en: 'Deterministic Budget Guard: constraints not met',
    hi: 'सटीक बजट गार्ड: सीमाएं पूरी नहीं हुईं',
    fr: 'Garde Budgétaire: limites non respectées',
    zh: '预算守卫告警：超出设定限额',
  },
  interactiveScheduleTimeline: {
    en: 'Interactive Schedule Timeline',
    hi: 'इंटरैक्टिव यात्रा समयरेखा',
    fr: 'Chronologie Interactive du Séjour',
    zh: '交互式行程时间轴',
  },
  tripStartTimeLabel: {
    en: 'Trip Departure Time',
    hi: 'यात्रा प्रारंभ समय',
    fr: 'Heure de départ du trajet',
    zh: '行程出发时间',
  },
  shiftScheduleLabel: {
    en: 'Shift Schedule',
    hi: 'समय आगे-पीछे करें',
    fr: 'Décaler l\'horaire',
    zh: '平移时间表',
  },
  editTimingBtn: {
    en: 'Custom Timing',
    hi: 'समय बदलें',
    fr: 'Modifier l\'heure',
    zh: '自定义时间',
  },
  saveTimingBtn: {
    en: 'Save Timing',
    hi: 'समय सहेजें',
    fr: 'Enregistrer',
    zh: '保存时间',
  },
  totalBudgetCard: {
    en: 'Total Budget',
    hi: 'कुल बजट',
    fr: 'Budget Total',
    zh: '总设定预算',
  },
  calculatedCostCard: {
    en: 'Calculated Cost',
    hi: 'गणना की गई लागत',
    fr: 'Coût Calculé',
    zh: '精算总花费',
  },
  remainingBufferCard: {
    en: 'Remaining Buffer',
    hi: 'शेष बचत राशि',
    fr: 'Marge Restante',
    zh: '结余安全资金',
  },
  allocatedTimeCard: {
    en: 'Allocated Time',
    hi: 'आवंटित समय',
    fr: 'Temps Alloué',
    zh: '预计总耗时',
  },
  transitViaLabel: {
    en: 'Transit via:',
    hi: 'यात्रा साधन:',
    fr: 'Transport via:',
    zh: '乘车方式：',
  },
  stopExpensesTitle: {
    en: 'Stop Expenses',
    hi: 'पड़ाव खर्च',
    fr: 'Dépenses de l\'étape',
    zh: '此站开销',
  },
  transitCostLabel: {
    en: 'Transit:',
    hi: 'यात्रा:',
    fr: 'Transport:',
    zh: '交通费：',
  },
  activityCostLabel: {
    en: 'Activity:',
    hi: 'गतिविधि:',
    fr: 'Activité:',
    zh: '活动/门票：',
  },
  budgetInvariantGuaranteeLabel: {
    en: 'Budget Invariant Guarantee:',
    hi: 'बजट अपरिवर्तनीय गारंटी:',
    fr: 'Garantie Budgétaire Invariable:',
    zh: '预算守恒数学担保：',
  },
  budgetInvariantGuaranteeText: {
    en: 'Sum of itemized transportation and activity fees is mathematically verified to never exceed your budget limit.',
    hi: 'परिवहन और गतिविधि शुल्क का योग गणितीय रूप से आपके बजट की सीमा के भीतर सत्यापित किया गया है।',
    fr: 'La somme des frais de transport et d\'activité est mathématiquement vérifiée pour ne jamais dépasser votre budget.',
    zh: '分项交通与活动费用之和经过确定性数学核验，确保严格控制在您的预算安全线内。',
  },

  // Offline SOS & Settings
  offlineSOSPageTitle: {
    en: 'Offline Emergency SOS & Panic Sync',
    hi: 'ऑफ़लाइन आपातकालीन एसओएस और पैनिक सिंक',
    fr: 'SOS d\'urgence Hors-ligne & Sync Panique',
    zh: '离线紧急救援 SOS 与数据同步',
  },
  profilePermissionsTitle: {
    en: 'Profile, Permissions & Data Ethics',
    hi: 'प्रोफ़ाइल, अनुमतियाँ और डेटा नीति',
    fr: 'Profil, Permissions & Éthique des Données',
    zh: '个人资料、权限管理与数据伦理',
  },
  manageAccountProfile: {
    en: 'Manage your account profile, privacy controls, and data transparency notices.',
    hi: 'अपने खाते की प्रोफ़ाइल, गोपनीयता सेटिंग्स और डेटा पारदर्शिता प्रबंधित करें।',
    fr: 'Gérez votre profil, vos paramètres de confidentialité et vos avis de transparence.',
    zh: '管理您的账户设置、隐私权限及数据透明度条款。',
  },
  languageAndLocalization: {
    en: 'Language & Localization',
    hi: 'भाषा और स्थानीयकरण',
    fr: 'Langue & Localisation',
    zh: '语言与本地化',
  },
  privacyByDesign: {
    en: 'Privacy by Design Principles',
    hi: 'डिज़ाइन द्वारा गोपनीयता सिद्धांत',
    fr: 'Principes de Confidentialité dès la Conception',
    zh: '隐私优先设计准则',
  },
  zeroSecretBundling: {
    en: 'Zero Secret Bundling: No Gemini or routing keys are packaged in the web/mobile client bundle. All credentials remain secured on backend servers.',
    hi: 'जीरो सीक्रेट बंडलिंग: क्लाइंट ऐप में कोई गुप्त एपीआई कीज़ नहीं हैं। सभी क्रेडेंशियल सुरक्षित बैकएंड सर्वर पर हैं।',
    fr: 'Aucune clé secrète dans le client: Toutes les clés Gemini sont sécurisées sur les serveurs backend.',
    zh: '前端零凭据捆绑：客户端代码内绝不泄露 Gemini 或地图密钥，所有鉴权均于后端服务器受控调用。',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(
    (localStorage.getItem('truetransit_lang') as Language) || 'en'
  );

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('truetransit_lang', lang);
  };

  const t = (key: string, fallback?: string): string => {
    const entry = TRANSLATIONS[key];
    if (entry) {
      return entry[language] || entry.en || fallback || key;
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
