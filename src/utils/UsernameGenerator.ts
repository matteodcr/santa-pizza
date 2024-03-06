export function generateRandomName(): string {
  const adjectives = [
    'Red',
    'Blue',
    'Green',
    'Happy',
    'Sad',
    'Clever',
    'Funny',
    'Smart',
    'Wise',
    'Brave',
    'Shiny',
    'Silly',
    'Fierce',
    'Lucky',
    'Magical',
    'Gentle',
    'Crazy',
    'Curious',
    'Mysterious',
  ];
  const nouns = [
    'Duck',
    'Cat',
    'Dog',
    'Fish',
    'Tiger',
    'Lion',
    'Eagle',
    'Bear',
    'Wolf',
    'Monkey',
    'Rabbit',
    'Panda',
    'Elephant',
    'Dragon',
    'Unicorn',
    'Octopus',
    'Koala',
    'Penguin',
    'Squirrel',
    'Giraffe',
  ];
  const numbers = Math.floor(Math.random() * 1000);

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${randomAdjective}${randomNoun}${numbers}`;
}
