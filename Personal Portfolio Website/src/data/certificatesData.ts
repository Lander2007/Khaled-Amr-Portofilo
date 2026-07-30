export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
  skills: string[];
}

export const certificatesData: Certificate[] = [
  {
    id: "python-essentials-1",
    title: "Python Essentials 1",
    issuer: "Cisco Networking Academy & Python Institute",
    date: "09 Aug 2025",
    image: "/certificates/python-essentials.png",
    skills: ["Python", "Object-Oriented Programming", "Algorithm Design", "Data Structures"],
  },
  {
    id: "javascript-essentials-1",
    title: "JavaScript Essentials 1",
    issuer: "Cisco Networking Academy & JS Institute",
    date: "22 Jan 2026",
    image: "/certificates/javascript-essentials.png",
    skills: ["JavaScript (ES6+)", "Control Flow", "Functions & Scope", "Web Logic"],
  },
];
