import { AgeClass } from "@prisma/client";

const ageClassesMock: Array<Omit<AgeClass, "createdAt" | "updatedAt">> = [
  {
    id: "ak1",
    name: "AK 1",
    sortId: 1001,
  },
  {
    id: "ak2",
    name: "AK 2",
    sortId: 2000,
  },
  {
    id: "ak3",
    name: "AK 3",
    sortId: 3000,
  },
  {
    id: "aktive",
    name: "Aktive",
    sortId: 1000,
  },
  {
    id: "ak",
    name: "außer Konkurrenz",
    sortId: 9000,
  },
  {
    id: "junioren",
    name: "Junioren",
    sortId: 970,
  },
];

export default ageClassesMock;
