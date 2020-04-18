const athletes = [
  {
    firstName: "Toni",
    lastName: "Möckel",
    gender: "MALE",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "7d51f4d1-3f40-4686-a868-9437dabcb9f0",
    athleteGroupId: "bcb97061-39b7-49ac-94ac-8c60964a7211"
  },
  {
    firstName: "Nora",
    lastName: "Liebender",
    gender: "FEMALE",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "0aa373fb-456d-4eaf-87bf-3c7c11d5317c",
    athleteGroupId: "bcb97061-39b7-49ac-94ac-8c60964a7211"
  },
  {
    firstName: "Foo",
    lastName: "Bar",
    gender: "MALE",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "be5135d3-3470-452c-9f46-2abd2f96081b",
    athleteGroupId: "bcb97061-39b7-49ac-94ac-8c60964a7211"
  },
  {
    importId: "5175",
    gender: "FEMALE",
    club: "Kraft & Fitness Eilenburg",
    birthday: "09.09.1992",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "fd44e2ca-b98b-4fba-bc6b-ad3dd4285a3d",
    lastName: "Amelal",
    firstName: "Mirjam",
    athleteGroupId: "bcb97061-39b7-49ac-94ac-8c60964a7211"
  },
  {
    importId: "5020",
    gender: "FEMALE",
    club: "USV TU Dresden",
    birthday: "23.11.1990",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "5a61a695-133e-4aef-b597-39a9260245f2",
    lastName: "Ihle",
    firstName: "Nancy",
    athleteGroupId: "bcb97061-39b7-49ac-94ac-8c60964a7211"
  },
  {
    importId: "2793",
    gender: "FEMALE",
    club: "SV 1919 Grimma Abt. Kraftsport",
    birthday: "12.08.1994",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "6b5f9564-286b-4234-842f-471b3f85195d",
    lastName: "Pham Viet",
    firstName: "Ha",
    athleteGroupId: "bcb97061-39b7-49ac-94ac-8c60964a7211"
  },
  {
    importId: "4825",
    gender: "FEMALE",
    club: "SV 1919 Grimma Abt. Kraftsport",
    birthday: "03.11.1993",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "05ce728c-33d8-4d36-8fc6-ea39c31e537f",
    lastName: "Bosse",
    firstName: "Juliane",
    athleteGroupId: "bcb97061-39b7-49ac-94ac-8c60964a7211"
  },
  {
    importId: "2448",
    gender: "FEMALE",
    club: "BSC Rapid Chemnitz",
    birthday: "26.12.1981",
    total: 487,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "250bd241-0fe0-4007-ba9e-0916b4785e64",
    lastName: "Fydrich",
    firstName: "Nicole"
  },
  {
    importId: "2449",
    gender: "FEMALE",
    club: "BSC Rapid Chemnitz",
    birthday: "15.06.1989",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "2fcb31a7-2824-4c6a-9440-49e4a1567d4e",
    lastName: "Tonn",
    firstName: "Patricia"
  },
  {
    importId: "5070",
    gender: "FEMALE",
    club: "USV TU Dresden",
    birthday: "14.02.1988",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "64ddce28-5791-4fb2-ac67-aca9f5acc4d5",
    lastName: "Fiedler",
    firstName: "Helene"
  },
  {
    importId: "5112",
    gender: "FEMALE",
    club: "SV 1919 Grimma Abt. Kraftsport",
    birthday: "16.11.1989",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "e2e0b0c7-162e-4345-b664-f8fc56c464c8",
    lastName: "Jörger-Hickfang",
    firstName: "Theresa"
  },
  {
    importId: "3730",
    gender: "FEMALE",
    club: "SV Rotation Langenbach e.V.",
    birthday: "18.03.1971",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "894cea2a-aa52-43d3-bae1-9e0acf3c793c",
    lastName: "Brandt",
    firstName: "Simone"
  },
  {
    importId: "5071",
    gender: "FEMALE",
    club: "USV TU Dresden",
    birthday: "13.02.1998",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "9a8ada37-6b01-42a8-9602-4a1e73659dfa",
    lastName: "Fricke",
    firstName: "Tatjana"
  },
  {
    importId: "4145",
    gender: "FEMALE",
    club: "Kraftsportverein Bad Lausick e.V.",
    birthday: "04.04.1995",
    total: 250,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "abd6fa0b-9aa6-4775-b970-777cf2c1e38b",
    lastName: "Hänsel",
    firstName: "Patricia"
  },
  {
    importId: "2809",
    gender: "FEMALE",
    club: "Kraft & Fitness Eilenburg",
    birthday: "07.02.1996",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "e9923703-5812-4f7a-9458-7bdca7dbae50",
    lastName: "Gebhardt",
    firstName: "Sabrina"
  },
  {
    importId: "5180",
    gender: "FEMALE",
    club: "Geringswalder Handballverein e.V.",
    birthday: "22.01.2001",
    total: 210,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "0cad89f1-a44c-4d04-b53d-a70e3ba81537",
    lastName: "Voigt",
    firstName: "Luisa"
  },
  {
    weightClass: "-74",
    importId: "5216",
    gender: "MALE",
    club: "USV TU Dresden",
    birthday: "11.12.1977",
    total: 0,
    norm: false,
    price: "22,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "f4a77ae7-1ed6-412b-8dd3-b6246e7d036e",
    lastName: "Azadidoust",
    firstName: "Akbar"
  },
  {
    weightClass: "-93",
    importId: "4415",
    gender: "MALE",
    club: "KBV Bautzen e.V.",
    birthday: "02.06.1976",
    total: 695,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "91d80e5b-01bc-4a86-97b3-76c85db518e4",
    lastName: "Gersdorf",
    firstName: "Jens"
  },
  {
    weightClass: "-93",
    importId: "2890",
    gender: "MALE",
    club: "Kraftsportverein Bad Lausick e.V.",
    birthday: "03.06.1975",
    total: 670,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "1a0a875d-4157-4715-a050-a7d8372e73c8",
    lastName: "Kühne",
    firstName: "Sven"
  },
  {
    weightClass: "+120",
    importId: "5077",
    gender: "MALE",
    club: "SV Rotation Langenbach e.V.",
    birthday: "15.01.1974",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "2c00b809-8133-4595-9773-d12f1c5ca9ce",
    lastName: "Grandl",
    firstName: "Johann"
  },
  {
    weightClass: "-83",
    importId: "3984",
    gender: "MALE",
    club: "USV TU Dresden",
    birthday: "06.11.1978",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "aa79d3fd-d8b9-4c6f-864a-c9729215209e",
    lastName: "Jakob",
    firstName: "Viktor"
  },
  {
    weightClass: "-105",
    importId: "2814",
    gender: "MALE",
    club: "Kraft & Fitness Eilenburg",
    birthday: "04.05.1969",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "b94b473c-7d60-49e4-b5e0-65df356ba48c",
    lastName: "Kammer",
    firstName: "Torsten"
  },
  {
    weightClass: "-105",
    importId: "3494",
    gender: "MALE",
    club: "SSV Bad Brambach e. V.",
    birthday: "06.11.1973",
    total: 0,
    norm: false,
    price: "22,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "ac829aeb-c3bb-4c88-9c5e-fb2134331b39",
    lastName: "Markewitz",
    firstName: "Thomas"
  },
  {
    weightClass: "-105",
    importId: "2715",
    gender: "MALE",
    club: "KBV Bautzen e.V.",
    birthday: "14.01.1977",
    total: 685,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "f39108e7-d994-4d69-beb7-0f16a9c36774",
    lastName: "Ruhland ",
    firstName: "Nico"
  },
  {
    weightClass: "-105",
    importId: "3982",
    gender: "MALE",
    club: "USV TU Dresden",
    birthday: "12.05.1974",
    total: 787,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "32168352-35b1-490b-ae70-938346731162",
    lastName: "Stecklina",
    firstName: "Sven"
  },
  {
    weightClass: "-120",
    importId: "3432",
    gender: "MALE",
    club: "SG Fortschritt Eibau e.V.",
    birthday: "13.10.1977",
    total: 580,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "3ed84cf8-b0ea-4b86-ad4d-e8be5b9a5813",
    lastName: "Ludwig ",
    firstName: "Patrick"
  },
  {
    weightClass: "-105",
    importId: "4740",
    gender: "MALE",
    club: "Kraftsport Colonia",
    birthday: "25.05.1996",
    total: 0,
    norm: false,
    price: "22,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "9f904a64-5391-4f09-8de6-c37d48fc9f07",
    lastName: "Baum",
    firstName: "Fabian"
  },
  {
    weightClass: "+120",
    importId: "4594",
    gender: "MALE",
    club: "Kraftdreikampf Flensburg e. V.",
    birthday: "14.10.1996",
    total: 0,
    norm: false,
    price: "22,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "d9085538-82d6-4302-be82-ac312a5c88ad",
    lastName: "Russok",
    firstName: "Yannik"
  },
  {
    weightClass: "-120",
    importId: "5074",
    gender: "MALE",
    club: "SV Rotation Langenbach e.V.",
    birthday: "26.12.1999",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "766333c7-29ed-4cad-95b8-e6287667b082",
    lastName: "Borm",
    firstName: "Jan Nils"
  },
  {
    weightClass: "-120",
    importId: "5176",
    gender: "MALE",
    club: "Kraft & Fitness Eilenburg",
    birthday: "07.07.1995",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "fc57db2f-7d7b-4eb8-b509-c60e9c904168",
    lastName: "Högel",
    firstName: "Lucas"
  },
  {
    weightClass: "-120",
    importId: "4906",
    gender: "MALE",
    club: "SV Rotation Langenbach e.V.",
    birthday: "28.02.1998",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "27311bd5-da62-486d-98f4-7dfc49b45774",
    lastName: "Niclas",
    firstName: "Zemke"
  },
  {
    weightClass: "-83",
    importId: "3430",
    gender: "MALE",
    club: "SG Fortschritt Eibau e.V.",
    birthday: "29.05.1997",
    total: 390,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "89d1ab5f-3609-4185-933a-a60315b23d4f",
    lastName: "Ebisch",
    firstName: "Nick-Julien"
  },
  {
    weightClass: "-74",
    importId: "4044",
    gender: "MALE",
    club: "Erzg. KV Jöhstadt e.V.",
    birthday: "06.09.1999",
    total: 0,
    norm: false,
    price: "22,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "25f52c38-5e83-4dc8-bde0-0d0e9bdb6265",
    lastName: "Friedel",
    firstName: "Paul"
  },
  {
    weightClass: "-93",
    importId: "5177",
    gender: "MALE",
    club: "Kraft & Fitness Eilenburg",
    birthday: "19.07.1999",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "8eabca41-e772-4553-acad-4c8101d4f0ac",
    lastName: "Ohneseit",
    firstName: "Anton"
  },
  {
    weightClass: "-93",
    importId: "4965",
    gender: "MALE",
    club: "Kraft & Fitness Eilenburg",
    birthday: "20.08.1995",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "525adc0c-c650-4aca-b9df-69250e890cdd",
    lastName: "Tony",
    firstName: "Apitzsch"
  },
  {
    weightClass: "-93",
    importId: "2888",
    gender: "MALE",
    club: "Kraftsportverein Bad Lausick e.V.",
    birthday: "03.11.1996",
    total: 520,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "d55c3467-fb52-4b8e-922f-747d7148bf5d",
    lastName: "Troelenberg",
    firstName: "Robin"
  },
  {
    weightClass: "-66",
    importId: "2046",
    gender: "MALE",
    club: "Erzg. KV Jöhstadt e.V.",
    birthday: "22.06.1999",
    total: 0,
    norm: false,
    price: "22,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "be79fbc5-0641-42f6-9e52-361bc09e7501",
    lastName: "Polsfuß",
    firstName: "Jan"
  },
  {
    weightClass: "-105",
    importId: "5211",
    gender: "MALE",
    club: "SV 1919 Grimma Abt. Kraftsport",
    birthday: "22.10.1995",
    total: 0,
    norm: false,
    price: "22,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "6a55f97b-cb45-4bd0-9fb9-a704f1030f80",
    lastName: "Riehl",
    firstName: "Maximilian"
  },
  {
    weightClass: "-105",
    importId: "2851",
    gender: "MALE",
    club: "Kraftsportfreunde Erzgebirge e.V.",
    birthday: "09.01.1996",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "0e3d0597-53ce-451e-a8ad-63da766b7166",
    lastName: "Tröger",
    firstName: "Esra"
  },
  {
    weightClass: "-105",
    importId: "5191",
    gender: "MALE",
    club: "USV TU Dresden",
    birthday: "31.08.1995",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "823dee3a-1c5f-460c-bd27-c2e3105c325a",
    lastName: "Wätzig",
    firstName: "Martin"
  },
  {
    weightClass: "+120",
    importId: "3561",
    gender: "MALE",
    club: "SV 1919 Grimma Abt. Kraftsport",
    birthday: "03.03.1999",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "b07b6c78-944e-4d62-ba9d-9bcc3f62673e",
    lastName: "Schönfeld",
    firstName: "Dominic"
  },
  {
    weightClass: "-93",
    importId: "3962",
    gender: "MALE",
    club: "USV TU Dresden",
    birthday: "03.08.1989",
    total: 575,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "fba4976e-7b08-4387-a900-d642ec122936",
    lastName: "Dennelöhr",
    firstName: "Cedric"
  },
  {
    weightClass: "-93",
    importId: "2892",
    gender: "MALE",
    club: "Kraftsportverein Bad Lausick e.V.",
    birthday: "18.12.1963",
    total: 560,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "559fd7da-5ca5-4621-864d-492b4d0b166d",
    lastName: "Hering",
    firstName: "Uwe"
  },
  {
    weightClass: "-93",
    importId: "4931",
    gender: "MALE",
    club: "KBV Bautzen e.V.",
    birthday: "13.01.1982",
    total: 710,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "5f0659a8-9bda-4efe-8b2f-42e30b457578",
    lastName: "Hurtig",
    firstName: "Michael"
  },
  {
    weightClass: "-93",
    importId: "4548",
    gender: "MALE",
    club: "SV Rotation Langenbach e.V.",
    birthday: "04.10.1990",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "b6af2e8d-4b51-47a2-a740-13c82b2f29ae",
    lastName: "Kaiser",
    firstName: "Marcus"
  },
  {
    weightClass: "-93",
    importId: "4930",
    gender: "MALE",
    club: "SV Rotation Langenbach e.V.",
    birthday: "27.01.1990",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "72176846-ca38-47c0-a015-76321bbbc56e",
    lastName: "Lüdemann",
    firstName: "Sebastian"
  },
  {
    weightClass: "-93",
    importId: "4394",
    gender: "MALE",
    club: "Annaberger Kraftsportclub e.V.",
    birthday: "06.05.1984",
    total: 500,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "508f0e8b-85d5-4c7c-9e7d-2bc7bc6131a4",
    lastName: "Martin",
    firstName: "Neubert"
  },
  {
    weightClass: "-93",
    importId: "5178",
    gender: "MALE",
    club: "Kraft & Fitness Eilenburg",
    birthday: "08.09.1986",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "d22eb80b-0f41-451e-914c-9e4f610d31d4",
    lastName: "Nütz",
    firstName: "Robert"
  },
  {
    weightClass: "-93",
    importId: "2706",
    gender: "MALE",
    club: "KBV Bautzen e.V.",
    birthday: "18.12.1986",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "7bd60b0d-ea20-4f66-8875-566de7b758f4",
    lastName: "Oliver",
    firstName: "Bahr"
  },
  {
    weightClass: "-93",
    importId: "3735",
    gender: "MALE",
    club: "SV Rotation Langenbach e.V.",
    birthday: "29.04.1987",
    total: 580,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "9bcafc1c-b8eb-44d8-8845-5981cda939ce",
    lastName: "Reinsdorf",
    firstName: "Tobias"
  },
  {
    weightClass: "-93",
    importId: "4539",
    gender: "MALE",
    club: "BSC Rapid Chemnitz",
    birthday: "21.12.1993",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "fd038be8-f86d-45ce-87f5-944f7282c657",
    lastName: "Schöngarth",
    firstName: "Arno"
  },
  {
    weightClass: "-93",
    importId: "3731",
    gender: "MALE",
    club: "SV Rotation Langenbach e.V.",
    birthday: "19.12.1992",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "4e6169c9-4293-46c4-8a57-f7cba180b5e0",
    lastName: "Voigt",
    firstName: "Stefan"
  },
  {
    weightClass: "-83",
    importId: "5189",
    gender: "MALE",
    club: "BSC Rapid Chemnitz",
    birthday: "06.03.1994",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "63b50684-287b-439a-b32e-8a9415b4e423",
    lastName: "Drechsel",
    firstName: "Dominic"
  },
  {
    weightClass: "-83",
    importId: "3295",
    gender: "MALE",
    club: "Riesear AC",
    birthday: "15.05.1990",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "65aef154-da04-4832-92f9-02c39fb28611",
    lastName: "Fuhrig",
    firstName: "Max"
  },
  {
    weightClass: "-83",
    importId: "5127",
    gender: "MALE",
    club: "USV TU Dresden",
    birthday: "30.05.1992",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "b67811f9-732e-4754-9bca-fed4b016c8ce",
    lastName: "Jörke",
    firstName: "Sören"
  },
  {
    weightClass: "-83",
    importId: "3722",
    gender: "MALE",
    club: "SV Rotation Langenbach e.V.",
    birthday: "13.06.1994",
    total: 572,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "9819da97-46b3-48a8-a640-a9f0b6bfdbcc",
    lastName: "Müller",
    firstName: "Michel"
  },
  {
    weightClass: "-83",
    importId: "4538",
    gender: "MALE",
    club: "BSC Rapid Chemnitz",
    birthday: "13.08.1988",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "0d135d3b-4f96-490d-9827-4f26c3e29b90",
    lastName: "Slansky",
    firstName: "Dirk"
  },
  {
    weightClass: "-120",
    importId: "2864",
    gender: "MALE",
    club: "Kraftsportfreunde Stoeckigt e.V.",
    birthday: "17.01.1992",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "d86b6751-4045-43c1-b1b7-9fd703e9b8c5",
    lastName: "Gerecke",
    firstName: "Marc"
  },
  {
    weightClass: "-120",
    importId: "4525",
    gender: "MALE",
    club: "Kraft & Fitness Eilenburg",
    birthday: "28.11.1994",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "61fdf97b-8705-4ac0-87e9-ba1d8109927c",
    lastName: "Groß",
    firstName: "Alexander"
  },
  {
    weightClass: "+120",
    importId: "3978",
    gender: "MALE",
    club: "USV TU Dresden",
    birthday: "10.06.1994",
    total: 715,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "381798a4-5a3f-403c-9f1f-7edf03af177d",
    lastName: "Kielmann",
    firstName: "Richard"
  },
  {
    weightClass: "+120",
    importId: "3103",
    gender: "MALE",
    club: "Kraftsportverein Bad Lausick e.V.",
    birthday: "24.08.1989",
    total: 925,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "f7f67783-9d69-472e-b9ac-883eadca2d73",
    lastName: "Ludwig",
    firstName: "Thomas"
  },
  {
    weightClass: "+120",
    importId: "3974",
    gender: "MALE",
    club: "USV TU Dresden",
    birthday: "25.01.1984",
    total: 820,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "001be13d-f036-4243-918d-d2064c77ce14",
    lastName: "Ziegler",
    firstName: "Nico"
  },
  {
    weightClass: "-74",
    importId: "2344",
    gender: "MALE",
    club: "Annaberger Kraftsportclub e.V.",
    birthday: "02.05.1991",
    total: 375,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "44bf2caf-a3ee-48d9-a4d6-c13d5405c3a5",
    lastName: "Scholz",
    firstName: "Oliver"
  },
  {
    weightClass: "-66",
    importId: "2338",
    gender: "MALE",
    club: "Annaberger Kraftsportclub e.V.",
    birthday: "08.08.1990",
    total: 320,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "466bf82d-22a3-4c72-832c-da1e781c532c",
    lastName: "Thiele",
    firstName: "Johannes"
  },
  {
    weightClass: "-105",
    importId: "2889",
    gender: "MALE",
    club: "Kraftsportverein Bad Lausick e.V.",
    birthday: "02.10.1985",
    total: 800,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "f7f7f18e-62fd-4d50-b1ea-f837bf9642e4",
    lastName: "Vierig",
    firstName: "Steven"
  },
  {
    weightClass: "-105",
    importId: "5075",
    gender: "MALE",
    club: "SV Rotation Langenbach e.V.",
    birthday: "08.03.2001",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "b7da9848-2a90-4c1a-b491-f2ddf8a082ac",
    lastName: "Dietel",
    firstName: "Alexander"
  },
  {
    weightClass: "-83",
    importId: "4915",
    gender: "MALE",
    club: "Kraftsportverein Bad Lausick e.V.",
    birthday: "27.12.2001",
    total: 500,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "c3661e75-0dcc-40e0-b6e2-6a90f19a7144",
    lastName: "Dust",
    firstName: "Benedikt"
  },
  {
    weightClass: "-66",
    importId: "4855",
    gender: "MALE",
    club: "Geringswalder Handballverein e.V.",
    birthday: "20.06.2002",
    total: 270,
    norm: false,
    price: "22,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "c9b6f2d0-7b0d-4441-b558-895def07c7f3",
    lastName: "Gabriel",
    firstName: "Hugo"
  },
  {
    weightClass: "-66",
    importId: "5076",
    gender: "MALE",
    club: "SV Rotation Langenbach e.V.",
    birthday: "28.04.2003",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "cfa4fa26-b887-499d-8d4d-08d060304e23",
    lastName: "Meyer",
    firstName: "Chris Patrick"
  },
  {
    weightClass: "-74",
    importId: "4853",
    gender: "MALE",
    club: "Geringswalder Handballverein e.V.",
    birthday: "08.08.2001",
    total: 280,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "299e80d3-a0d9-423d-9cf7-921ca7263d2d",
    lastName: "Rothe",
    firstName: "Tom Jason"
  },
  {
    weightClass: "-83",
    importId: "4877",
    gender: "MALE",
    club: "KBV Bautzen e.V.",
    birthday: "14.08.1954",
    total: 0,
    norm: false,
    price: "12,00 Euro",
    eventId: "a286a77d-14ae-444f-a1da-594accb00c02",
    id: "cbf991a0-a71c-4af7-8d39-fb1526de62c7",
    lastName: "Kießlich",
    firstName: "Bernd"
  }
];

export default athletes;