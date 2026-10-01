/**
 * Verified book metadata & structured pilgrimage data for Thirtha Yatra Guide
 * Author: Ramesh Gangashetty
 * Reference: https://www.amazon.in/-/hi/Thirtha-Yatra-Guide-Temples-Kshetras/dp/1684661331?s=bazaar
 */

export interface TempleSpot {
  id: string;
  name: string;
  sanskritName: string;
  region: string;
  coordinates: [number, number, number]; // 3D coordinates for spatial map
  description: string;
  significance: string;
  deity: string;
  verseSnippet?: string;
  pageNumber?: number;
  tags: string[];
  imageUrl: string;
  thumbUrl?: string;
}

export interface BookSpread {
  id: string;
  pageNumber: number;
  chapterTitle: string;
  leftPage: {
    title: string;
    subtitle: string;
    mantraOrVerse?: string;
    type: 'temple-illustration' | 'sacred-map' | 'manuscript-excerpt';
    imageLabel: string;
    accentQuote: string;
    imageUrl: string;
  };
  rightPage: {
    heading: string;
    content: string[];
    sacredNotes: string;
    kshetraHighlights: string[];
  };
}

export const BOOK_METADATA = {
  title: "Thirtha Yatra Guide",
  subtitle: "Temples & Kshetras",
  author: "Ramesh Gangashetty",
  amazonUrl: "https://www.amazon.in/-/hi/Thirtha-Yatra-Guide-Temples-Kshetras/dp/1684661331?s=bazaar",
  tagline: "Open the book. Begin the Yatra.",
  description: "An evocative, comprehensive pilgrimage guide illuminating the sacred temples, timeless kshetras, and spiritual paths across India by Ramesh Gangashetty. Crafted for devotees, seekers, and cultural explorers.",
  dimensions: {
    width: 2.45,
    height: 3.35,
    depth: 0.35,
    pagesCount: 384
  }
};

export const SPREADS_DATA: BookSpread[] = [
  {
    id: "spread-1",
    pageNumber: 12,
    chapterTitle: "Prathama Kanda • The Northern Kshetras",
    leftPage: {
      title: "Kashi Vishwanath & Ganga Ghats",
      subtitle: "The Eternal Sanctum of Light & Moksha",
      mantraOrVerse: "वाराणसी पुरपतेर् भज विश्वनाथम्",
      type: "temple-illustration",
      imageLabel: "Manikarnika & Golden Temple Sanctum",
      accentQuote: "“Where light touches the soul before it touches the earth.”",
      imageUrl: "/images/temples/kashi.webp"
    },
    rightPage: {
      heading: "The City Older than Time Itself",
      content: [
        "Varanasi stands not merely as a geographical city on the crescent bank of the sacred Ganga, but as an ancient cosmos of spiritual liberation.",
        "The pilgrimage unfolds through five cardinal kshetras: the inner sanctum of Sri Vishwanath, the timeless ghats of morning prayers, and the ancient alleyways echoing with Rudram chants."
      ],
      sacredNotes: "Best visited during Brahma Muhurta when the morning aarti resonates across the river waters.",
      kshetraHighlights: ["Sri Vishwanath Jyotirlinga", "Dashashwamedh Ghat", "Annapurna Sanctum"]
    }
  },
  {
    id: "spread-2",
    pageNumber: 68,
    chapterTitle: "Dvitiya Kanda • The High Himalayan Dhams",
    leftPage: {
      title: "Kedarnath & Badrinath",
      subtitle: "Sanctuaries in the Abode of Snow & Silence",
      mantraOrVerse: "महायोगपीठं हिमगिरितटे पावनतरम्",
      type: "sacred-map",
      imageLabel: "Mandakini Valley & Garhwal Alaknanda Route",
      accentQuote: "“Ascending the path where mountains breathe devotion.”",
      imageUrl: "/images/temples/kedarnath.webp"
    },
    rightPage: {
      heading: "The Himalayan Pilgrimage Trail",
      content: [
        "Nestled at high altitude amid the Garhwal Himalayas, Kedarnath represents the primordial pinnacle of ascetic devotion.",
        "Complementing it across the ridges, Badrinath rests within the Nar-Narayana ranges, enshrining Lord Badri Vishal amidst steaming natural hot springs and alpine clarity."
      ],
      sacredNotes: "Pilgrim guide includes crucial seasonal windows, high-altitude preparation, and traditional parikrama rules.",
      kshetraHighlights: ["Kedarnath Jyotirlinga (3,583m)", "Badrinath Temple & Tapt Kund", "Mana Village - The Last Boundary"]
    }
  },
  {
    id: "spread-3",
    pageNumber: 144,
    chapterTitle: "Tritiya Kanda • The Southern Dravidian Gopurams",
    leftPage: {
      title: "Rameswaram & Madurai Meenakshi",
      subtitle: "Architectural Wonders of Cosmic Geometry",
      mantraOrVerse: "रामेश्वरं महालिङ्गं सेतुमध्ये सुशोभितम्",
      type: "manuscript-excerpt",
      imageLabel: "The 1000-Pillared Corridors & Sacred Theerthams",
      accentQuote: "“Carved in granite, consecrated for eternity.”",
      imageUrl: "/images/temples/meenakshi.webp"
    },
    rightPage: {
      heading: "The Sanctified 22 Theerthams & Divine Mother",
      content: [
        "Ramanathaswamy Temple is renowned worldwide for its longest sculptured pillared corridors and the ritual bath across 22 holy wells (Theerthams).",
        "Coupled with the magnificent 14 soaring Gopurams of Madurai Meenakshi Sundareswarar, this southern pilgrimage preserves millennia of Agamic worship and classical temple architecture."
      ],
      sacredNotes: "Step-by-step guidance on traditional 22-bath sequence and temple corridor alignments.",
      kshetraHighlights: ["22 Sacred Theerthams Bath Sequence", "Ramanathaswamy Longest Corridor", "Madurai Golden Lotus Pond (Potramarai Kulam)"]
    }
  },
  {
    id: "spread-4",
    pageNumber: 188,
    chapterTitle: "Tritiya Kanda • The South Indian Maha Kshetras",
    leftPage: {
      title: "Tirupati Balaji & Brihadeeswara",
      subtitle: "The Kaliyuga Vaikuntha & Chola Granite Sovereign",
      mantraOrVerse: "वेङ्कटाद्रि समं स्थानं ब्रह्माण्डे नास्ति किञ्चन",
      type: "temple-illustration",
      imageLabel: "Golden Ananda Nilayam & The Great Chola Vimana",
      accentQuote: "“Where devotion turns every breath into pure gold.”",
      imageUrl: "/images/temples/tirupati.webp"
    },
    rightPage: {
      heading: "Sanctuaries of Immense Grace & Granite",
      content: [
        "Perched atop the sacred Seven Hills of Seshachalam, Sri Venkateswara Swamy in Tirumala reigns as Kaliyuga Prathyaksha Daivam, welcoming millions into supreme solace.",
        "Down in the Kaveri delta, Raja Raja Chola's Brihadeeswara Temple at Thanjavur stands as a UNESCO World Heritage marvel, with its single 80-tonne granite kumbam summiting the skies."
      ],
      sacredNotes: "Pilgrimage roadmap through the Saptagiri footpaths and the sacred geometry of the Brihadeeswara sanctum.",
      kshetraHighlights: ["Ananda Nilayam Golden Dome", "Alipiri & Srivari Mettu Trek Routes", "Thanjavur 216ft Granite Vimanam"]
    }
  },
  {
    id: "spread-5",
    pageNumber: 218,
    chapterTitle: "Chaturtha Kanda • The Coastal & Western Shrines",
    leftPage: {
      title: "Dwarkadhish & Somnath",
      subtitle: "Guardians of the Western Ocean Horizons",
      mantraOrVerse: "सौराष्ट्रे सोमनाथं च श्रीशैले मल्लिकार्जुनम्",
      type: "temple-illustration",
      imageLabel: "The Arabian Sea Confluence & Somnath Jyotirlinga",
      accentQuote: "“Where prayer meets the roar of infinite waves.”",
      imageUrl: "/images/temples/somnath.webp"
    },
    rightPage: {
      heading: "The Resilient Pillar of Faith",
      content: [
        "Somnath, the first of the twelve sacred Jyotirlingas, stands resilient against the Arabian Sea, signifying the eternal cycle of creation and renewal.",
        "Up the coastline, Dwarka reigns as the ancient capital city of Sri Krishna, holding the magnificent 5-storey Jagat Mandir atop the Gomti confluence."
      ],
      sacredNotes: "Details on evening Dhwajarohan ceremony and coastal circumambulation routes.",
      kshetraHighlights: ["Somnath First Jyotirlinga", "Dwarkadhish Jagat Mandir", "Bet Dwarka Marine Pilgrimage"]
    }
  }
];

export const TEMPLE_MAP_SPOTS: TempleSpot[] = [
  {
    id: "meenakshi",
    name: "Madurai Meenakshi Amman",
    sanskritName: "मीनाक्षी सुन्दरेश्वर मन्दिर",
    region: "Tamil Nadu",
    coordinates: [0.15, -1.2, 0.4],
    description: "The crown jewel of Dravidian temple architecture on the banks of Vaigai river.",
    significance: "Sacred abode of Goddess Meenakshi & Sundareswarar with 14 colossal sculptured Gopurams.",
    deity: "Goddess Meenakshi & Lord Shiva",
    verseSnippet: "सर्वमङ्गल माङ्गल्ये शिवे सर्वार्थ साधिके",
    pageNumber: 144,
    tags: ["South Indian", "Shakti Peetha", "Dravidian Gopurams"],
    imageUrl: "/images/temples/meenakshi.webp",
    thumbUrl: "/images/temples/meenakshi-thumb.webp"
  },
  {
    id: "tirupati",
    name: "Tirupati Balaji (Tirumala)",
    sanskritName: "श्री वेंकटेश्वर स्वामी क्षेत्र",
    region: "Andhra Pradesh",
    coordinates: [0.35, -0.9, 0.3],
    description: "The sacred Seven Hills (Saptagiri) abode of Lord Venkateswara Swamy.",
    significance: "Kaliyuga Vaikuntha with the eternal glowing golden Ananda Nilayam.",
    deity: "Lord Sri Venkateswara (Govinda)",
    verseSnippet: "वेङ्कटाद्रि समं स्थानं ब्रह्माण्डे नास्ति किञ्चन",
    pageNumber: 188,
    tags: ["South Indian", "Divya Desam", "Vaikuntha Kshetras"],
    imageUrl: "/images/temples/tirupati.webp",
    thumbUrl: "/images/temples/tirupati-thumb.webp"
  },
  {
    id: "brihadeeswara",
    name: "Brihadeeswara Temple",
    sanskritName: "तञ्जावूरु बृहदीश्वर मन्दिर",
    region: "Tamil Nadu (Thanjavur)",
    coordinates: [0.28, -1.15, 0.35],
    description: "The Great Living Chola Temple built entirely of interlocking granite.",
    significance: "UNESCO World Heritage site with a towering 216-foot monolithic Vimana.",
    deity: "Lord Shiva (Brihadeeswara)",
    verseSnippet: "नमो हिरण्यबाहवे हिरण्यवर्णाय",
    pageNumber: 196,
    tags: ["South Indian", "UNESCO Heritage", "Dravidian Gopurams"],
    imageUrl: "/images/temples/brihadeeswara.webp",
    thumbUrl: "/images/temples/brihadeeswara-thumb.webp"
  },
  {
    id: "padmanabhaswamy",
    name: "Sree Padmanabhaswamy",
    sanskritName: "अनन्तपद्मनाभ स्वामी क्षेत्र",
    region: "Kerala (Trivandrum)",
    coordinates: [-0.1, -1.45, 0.45],
    description: "Grand Chera-Dravidian sanctum facing the holy Padmatheertham tank.",
    significance: "Lord Vishnu in eternal Ananta Shayana posture upon Adi Shesha snake.",
    deity: "Lord Sri Padmanabha",
    verseSnippet: "शान्ताकारं भुजगशयनं पद्मनाभं सुरेशम्",
    pageNumber: 204,
    tags: ["South Indian", "Divya Desam", "Kerala Kshetras"],
    imageUrl: "/images/temples/padmanabhaswamy.webp",
    thumbUrl: "/images/temples/padmanabhaswamy-thumb.webp"
  },
  {
    id: "srirangam",
    name: "Sri Ranganathaswamy Srirangam",
    sanskritName: "श्रीरङ्ग क्षेत्र",
    region: "Tamil Nadu (Trichy)",
    coordinates: [0.22, -1.18, 0.38],
    description: "The largest functioning temple complex in India spanning 156 acres on Kaveri island.",
    significance: "First and foremost of all 108 Divya Desams with 21 soaring Raja Gopurams.",
    deity: "Lord Ranganatha",
    verseSnippet: "कावेरी विरजा सेयं वैकुण्ठं रङ्गमन्दिरम्",
    pageNumber: 210,
    tags: ["South Indian", "Divya Desam", "Dravidian Gopurams"],
    imageUrl: "/images/temples/srirangam.webp",
    thumbUrl: "/images/temples/srirangam-thumb.webp"
  },
  {
    id: "murudeshwar",
    name: "Murudeshwar Shiva Temple",
    sanskritName: "मुरुडेश्वर क्षेत्र",
    region: "Karnataka Coast",
    coordinates: [-0.45, -0.95, 0.25],
    description: "Spectacular seaside cliff temple overlooking the Arabian Sea in Uttara Kannada.",
    significance: "Colossal 123-foot Lord Shiva statue and 20-storey Raja Gopuram.",
    deity: "Lord Shiva (Murudeshwar)",
    verseSnippet: "त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्",
    pageNumber: 214,
    tags: ["South Indian", "Coastal Kshetras", "Karnataka Kshetras"],
    imageUrl: "/images/temples/murudeshwar.webp",
    thumbUrl: "/images/temples/murudeshwar-thumb.webp"
  },
  {
    id: "rameswaram",
    name: "Rameshwaram Jyotirlinga",
    sanskritName: "रामेश्वर सेतु तीर्थ",
    region: "Tamil Nadu",
    coordinates: [0.1, -1.3, 0.4],
    description: "Island kshetra where the Gulf of Mannar meets Palk Strait.",
    significance: "Consecrated by Sri Rama prior to the Lanka crossing with 22 sacred theerthams.",
    deity: "Lord Ramanathaswamy",
    verseSnippet: "सेतुबन्धे महातीर्थे",
    pageNumber: 144,
    tags: ["South Indian", "Jyotirlinga", "Chardham"],
    imageUrl: "/images/temples/rameswaram.webp",
    thumbUrl: "/images/temples/rameswaram-thumb.webp"
  },
  {
    id: "kashi",
    name: "Kashi Vishwanath",
    sanskritName: "वाराणसी क्षेत्र",
    region: "Uttar Pradesh",
    coordinates: [0.8, 0.4, 0.1],
    description: "The timeless city of light on the holy Ganga riverbank.",
    significance: "Primary Jyotirlinga of Moksha and eternal wisdom.",
    deity: "Lord Shiva (Vishwanath)",
    verseSnippet: "सत्यं शिवं सुन्दरम्",
    pageNumber: 12,
    tags: ["Jyotirlinga", "Ganga Ghats", "Moksha Puri"],
    imageUrl: "/images/temples/kashi.webp",
    thumbUrl: "/images/temples/kashi-thumb.webp"
  },
  {
    id: "kedarnath",
    name: "Kedarnath Temple",
    sanskritName: "केदारनाथ धाम",
    region: "Uttarakhand Himalayas",
    coordinates: [0.3, 1.2, -0.4],
    description: "High-altitude sanctuary surrounded by glaciated Himalayan peaks.",
    significance: "One of the Chardhams and supreme abode of tapasya.",
    deity: "Lord Shiva (Sadashiva)",
    verseSnippet: "हिमवत्सुत समायुक्तं",
    pageNumber: 68,
    tags: ["Chardham", "Panch Kedar", "High Altitude"],
    imageUrl: "/images/temples/kedarnath.webp",
    thumbUrl: "/images/temples/kedarnath-thumb.webp"
  },
  {
    id: "badrinath",
    name: "Badrinath Dham",
    sanskritName: "बद्रीनाथ क्षेत्र",
    region: "Garhwal Himalayas",
    coordinates: [0.5, 1.3, -0.6],
    description: "The golden-canopied jewel of the Alaknanda river valley.",
    significance: "Maha-Vishnu's eternal meditative sanctuary in Badrivan.",
    deity: "Lord Badri Vishal",
    verseSnippet: "नमो नारायणाय",
    pageNumber: 74,
    tags: ["Chardham", "Divya Desam", "Garhwal"],
    imageUrl: "/images/temples/kedarnath.webp",
    thumbUrl: "/images/temples/kedarnath-thumb.webp"
  },
  {
    id: "somnath",
    name: "Somnath Temple",
    sanskritName: "सोमनाथ प्रभास पाटन",
    region: "Gujarat Coast",
    coordinates: [-1.1, -0.2, 0.3],
    description: "The timeless shrine of Prabhas Patan looking toward the South Pole.",
    significance: "The First (Adya) of the 12 sacred Jyotirlingas.",
    deity: "Lord Somnath",
    verseSnippet: "प्रभासतीर्थे सोमेशम्",
    pageNumber: 218,
    tags: ["Adya Jyotirlinga", "Prabhas Patan", "Ocean Shrine"],
    imageUrl: "/images/temples/somnath.webp",
    thumbUrl: "/images/temples/somnath-thumb.webp"
  },
  {
    id: "dwarka",
    name: "Dwarkadhish Jagat Mandir",
    sanskritName: "द्वारिका धाम",
    region: "Gujarat Coast",
    coordinates: [-1.3, 0.2, 0.2],
    description: "The eternal golden kingdom of Lord Krishna on the Gomti mouth.",
    significance: "Western Chardham and Mokshapuri of supreme grandeur.",
    deity: "Lord Sri Krishna (Dwarkadhish)",
    verseSnippet: "द्वारका वासिने नमः",
    pageNumber: 232,
    tags: ["Chardham", "Mokshapuri", "Gomti Sangam"],
    imageUrl: "/images/temples/somnath.webp",
    thumbUrl: "/images/temples/somnath-thumb.webp"
  }
];
