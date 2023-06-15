import { configureScrivito } from "./scrivito";
import { configureHistory } from "./history";
import { configureObjClassForContentType } from "./objClassForContentType";
import { configureScrivitoContentBrowser } from "./scrivitoContentBrowser";
import { configureWindowScrivito } from "./windowScrivito";
import { i18n } from "dateformat";


export function configure(options) {
  configureScrivito(options);
  configureObjClassForContentType();

  configureScrivitoContentBrowser();
  configureHistory();
  configureWindowScrivito();
}

i18n.dayNames = [
  "So",
  "Mo",
  "Di",
  "Mi",
  "Do",
  "Fr",
  "Sa",
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];

i18n.monthNames = [
  "Jan",
  "Feb",
  "Mär",
  "Apr",
  "Mai",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dez",
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];
