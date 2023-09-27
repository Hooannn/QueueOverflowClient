import { v4 as uuidv4 } from "uuid";
import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  animals,
  colors,
  countries,
  languages,
  names,
  starWars,
} from "unique-names-generator";

const Dictionaries = [
  adjectives,
  animals,
  colors,
  countries,
  languages,
  names,
  starWars,
];

export default () => {
  const generateShortName = (name: string, tags: string | string[]) => {
    const RANDOW_MAX = 6;
    const RANDOW_MIN = 0;

    const getRandomInt = (min: number, max: number) =>
      Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) +
      Math.ceil(min);

    const seed = uuidv4() + `${name}_${tags}`?.toString();
    const customConfig: Config = {
      dictionaries: [
        Dictionaries[getRandomInt(RANDOW_MIN, RANDOW_MAX)],
        Dictionaries[getRandomInt(RANDOW_MIN, RANDOW_MAX)],
        Dictionaries[getRandomInt(RANDOW_MIN, RANDOW_MAX)],
      ],
      separator: "_",
      length: getRandomInt(2, 3),
      seed,
      style: "lowerCase",
    };

    return uniqueNamesGenerator(customConfig).replaceAll(/\s/g, "");
  };

  return { generateShortName };
};
