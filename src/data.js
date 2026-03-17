/** Brand */
export const BRAND = {
  blue: "#90c0e8",
  orange: "#f1891a",
  light: "#f7fbff",
  dark: "#1f2937",
  muted: "#6b7280",
  border: "rgba(31,41,55,.12)",
};

export const STEPS = [
  { key: "type", label: "Type huisdier" },
  { key: "data", label: "Gegevens" },
  { key: "activity", label: "Activiteit" },
  { key: "prefs", label: "Voorkeuren" },
  { key: "result", label: "Resultaat" },
];

export const DOG_BREEDS = [
  { name: "Gemengd ras / Onbekend", male: 25, female: 22 },
  { name: "Labrador Retriever", male: 32, female: 28 },
  { name: "Golden Retriever", male: 34, female: 30 },
  { name: "Duitse Herder", male: 34, female: 28 },
  { name: "Mechelse Herder", male: 30, female: 25 },
  { name: "Border Collie", male: 20, female: 18 },
  { name: "Franse Bulldog", male: 12, female: 10 },
  { name: "Engelse Bulldog", male: 24, female: 20 },
  { name: "Beagle", male: 11, female: 10 },
  { name: "Jack Russell Terriër", male: 8, female: 7 },
  { name: "Cavalier King Charles", male: 8, female: 7 },
  { name: "Australian Shepherd", male: 29, female: 25 },
  { name: "Rottweiler", male: 50, female: 42 },
  { name: "Berner Sennenhond", male: 48, female: 40 },
  { name: "Dobermann", male: 40, female: 32 },
  { name: "Boxer", male: 32, female: 28 },
  { name: "Siberische Husky", male: 24, female: 21 },
  { name: "Shih Tzu", male: 7, female: 6 },
  { name: "Maltezer", male: 3.5, female: 3 },
  { name: "Chihuahua", male: 2.5, female: 2.2 },
];

export const CAT_BREEDS = [
  { name: "Gemengd ras / Onbekend", male: 5.0, female: 4.5 },
  { name: "Maine Coon", male: 8.0, female: 6.0 },
  { name: "Britse Korthaar", male: 7.0, female: 5.0 },
  { name: "Ragdoll", male: 7.0, female: 5.0 },
  { name: "Noorse Boskat", male: 7.0, female: 5.0 },
  { name: "Siamese", male: 5.0, female: 4.0 },
  { name: "Bengaal", male: 6.0, female: 4.5 },
  { name: "Sphynx", male: 4.5, female: 4.0 },
];

export const ACTIVITY_LEVELS = [
  {
    key: "rustig",
    title: "Rustig",
    desc: "Vooral binnen, rustige wandelingen",
    factorDog: 1.4,
    factorCat: 1.1,
  },
  {
    key: "normaal",
    title: "Normaal",
    desc: "Dagelijkse wandelingen, matig spel",
    factorDog: 1.6,
    factorCat: 1.2,
  },
  {
    key: "actief",
    title: "Actief",
    desc: "Lange wandelingen, veel beweging",
    factorDog: 1.9,
    factorCat: 1.3,
  },
  {
    key: "zeer_actief",
    title: "Zeer actief",
    desc: "Sport, werk- of herdersdier",
    factorDog: 2.3,
    factorCat: 1.4,
  },
];

export const BODY_CONDITION = [
  { key: "ondergewicht", label: "Ondergewicht", factor: 1.1 },
  { key: "ideaal", label: "Ideaal", factor: 1.0 },
  { key: "overgewicht", label: "Overgewicht", factor: 0.85 },
];

export const TREATS = [
  { key: "yes", label: "Ja, af en toe (oké, best vaak)", factor: 1.05 },
  { key: "no", label: "Nee, ik ben sterk genoeg", factor: 1.0 },
];

export const INGREDIENTS = [
  "Kip",
  "Rund",
  "Lam",
  "Insecten",
  "Vis",
  "Rijst",
  "Granen",
  "Ei",
  "Zuivel",
  "Soja",
];

export const SENSITIVE = new Set(["Soja", "Kip", "Rund", "Zuivel"]);

export const DOG_NAMES = [
  "Max",
  "Luna",
  "Milo",
  "Bella",
  "Charlie",
  "Nala",
  "Rocky",
  "Nova",
  "Odin",
  "Jules",
  "Otis",
  "Bo",
  "Kiki",
  "Ziggy",
];

export const CAT_NAMES = [
  "Mimi",
  "Simba",
  "Loki",
  "Coco",
  "Mia",
  "Leo",
  "Nina",
  "Pablo",
  "Poes",
  "Felix",
  "Moka",
  "Suki",
];

export const SUBSCRIPTION_OPTIONS = [
  { key: 30, label: "Levering elke 30 dagen" },
  { key: 45, label: "Levering elke 45 dagen" },
];