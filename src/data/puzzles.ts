import type { SherlockPuzzle } from "../types";

export const PUZZLES: SherlockPuzzle[] = [
  // Easy Logic Puzzles
  {
    id: "easy-logic-1",
    question: "If you have 3 apples and you take away 2, how many do you have?",
    options: ["1", "2", "3", "5"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "logic",
    explanation: "You have 2 apples because you took away 2 apples.",
  },
  {
    id: "easy-logic-2",
    question: "What comes next in this sequence: 2, 4, 6, 8, ?",
    options: ["9", "10", "12", "14"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "logic",
    explanation: "The sequence increases by 2 each time, so 8 + 2 = 10.",
  },
  {
    id: "easy-riddle-1",
    question:
      "What has keys but no locks, space but no room, and you can enter but not go inside?",
    options: ["A house", "A keyboard", "A car", "A book"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "riddle",
    explanation:
      "A keyboard has keys, space bar, and an enter key, but no physical locks or rooms.",
  },
  {
    id: "easy-riddle-2",
    question: "What gets wet while drying?",
    options: ["A sponge", "A towel", "Hair", "Clothes"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "riddle",
    explanation: "A towel gets wet while it dries other things.",
  },
  {
    id: "easy-math-1",
    question:
      "If a shirt costs $20 and is on sale for 25% off, what is the sale price?",
    options: ["$15", "$16", "$17", "$18"],
    correctAnswer: 0,
    difficulty: "easy",
    category: "logic",
    explanation: "25% of $20 is $5, so $20 - $5 = $15.",
  },

  // Medium Puzzles
  {
    id: "medium-logic-1",
    question:
      "In a race, you overtake the person in 2nd place. What position are you in now?",
    options: ["1st place", "2nd place", "3rd place", "It depends"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "logic",
    explanation:
      "If you overtake the person in 2nd place, you take their position, so you're now in 2nd place.",
  },
  {
    id: "medium-logic-2",
    question: "A farmer has 17 sheep. All but 9 die. How many sheep are left?",
    options: ["8", "9", "17", "0"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "logic",
    explanation: "'All but 9 die' means 9 sheep remain alive.",
  },
  {
    id: "medium-deduction-1",
    question:
      "Three friends - Alex, Blake, and Casey - have different favorite colors: red, blue, and green. Alex doesn't like red. Blake doesn't like blue or green. What is Casey's favorite color?",
    options: ["Red", "Blue", "Green", "Cannot be determined"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "deduction",
    explanation:
      "Blake must like red (only option left). Alex doesn't like red, so Alex likes blue or green. Casey gets the remaining color, which is blue if Alex likes green, or green if Alex likes blue. But since Blake likes red and Alex doesn't like red, and there are only 3 colors, Casey must like blue.",
  },
  {
    id: "medium-riddle-1",
    question:
      "I am not alive, but I grow. I don't have lungs, but I need air. I don't have a mouth, but water kills me. What am I?",
    options: ["A plant", "Fire", "A balloon", "A crystal"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "riddle",
    explanation:
      "Fire grows, needs air (oxygen) to survive, and water extinguishes it.",
  },
  {
    id: "medium-pattern-1",
    question: "What comes next: J, F, M, A, M, J, J, ?",
    options: ["A", "S", "O", "N"],
    correctAnswer: 0,
    difficulty: "medium",
    category: "logic",
    hint: "Think about months of the year.",
    explanation:
      "These are the first letters of months: January, February, March, April, May, June, July, August.",
  },

  // Hard Puzzles
  {
    id: "hard-logic-1",
    question:
      "You have 12 balls that look identical. 11 weigh the same, but one is either heavier or lighter. Using a balance scale only 3 times, how do you find the different ball?",
    options: [
      "Divide into groups of 4",
      "Divide into groups of 6",
      "Divide into groups of 3",
      "It's impossible",
    ],
    correctAnswer: 0,
    difficulty: "hard",
    category: "logic",
    explanation:
      "Divide into 3 groups of 4. Weigh two groups - if balanced, the odd ball is in the third group. If unbalanced, it's in one of the weighed groups. Continue subdividing.",
  },
  {
    id: "hard-riddle-1",
    question:
      "A man lives on the 20th floor of an apartment building. Every morning he takes the elevator down to the ground floor. When he comes home, he takes the elevator to the 10th floor and walks the rest of the way... except on rainy days, when he takes the elevator all the way to the 20th floor. Why?",
    options: [
      "He likes exercise",
      "He's too short to reach the 20th floor button",
      "The elevator is broken",
      "He visits someone on the 10th floor",
    ],
    correctAnswer: 1,
    difficulty: "hard",
    category: "riddle",
    explanation:
      "He's too short to reach the 20th floor button, but can reach the 10th floor button. On rainy days, he has an umbrella to help him reach the higher button.",
  },
  {
    id: "hard-deduction-1",
    question:
      "Five people sit in a row. Each person can see everyone in front of them but not behind. They each wear either a black or white hat. Starting from the back, the first person says 'black', the second says 'white', the third says 'black', the fourth says 'white'. What should the fifth person say to guarantee they're correct about their own hat color?",
    options: ["Black", "White", "Either works", "Not enough information"],
    correctAnswer: 0,
    difficulty: "hard",
    category: "deduction",
    hint: "The people behind are giving information to help those in front.",
    explanation:
      "This is a classic logic puzzle where people use a strategy to communicate information. The pattern suggests a counting system where 'black' indicates an even number of black hats visible, and 'white' indicates odd.",
  },
  {
    id: "hard-math-1",
    question:
      "A snail is at the bottom of a 30-foot well. Each day it climbs up 3 feet, but each night it slides back down 2 feet. How many days will it take to reach the top?",
    options: ["28 days", "30 days", "15 days", "27 days"],
    correctAnswer: 0,
    difficulty: "hard",
    category: "logic",
    explanation:
      "On day 28, the snail climbs from 27 feet to 30 feet and reaches the top. It doesn't slide back because it's already out of the well.",
  },
  {
    id: "hard-lateral-1",
    question:
      "A man pushes his car to a hotel and tells the owner he's bankrupt. What happened?",
    options: [
      "His car broke down",
      "He's playing Monopoly",
      "He lost his job",
      "He ran out of gas",
    ],
    correctAnswer: 1,
    difficulty: "hard",
    category: "riddle",
    explanation:
      "He's playing Monopoly and landed on a hotel property that he can't afford to pay rent for.",
  },
];

// Helper function to get puzzles by difficulty
export const getPuzzlesByDifficulty = (
  difficulty: "easy" | "medium" | "hard"
): SherlockPuzzle[] => {
  return PUZZLES.filter((puzzle) => puzzle.difficulty === difficulty);
};

// Helper function to get random puzzle
export const getRandomPuzzle = (
  difficulty?: "easy" | "medium" | "hard"
): SherlockPuzzle => {
  const availablePuzzles = difficulty
    ? getPuzzlesByDifficulty(difficulty)
    : PUZZLES;
  const randomIndex = Math.floor(Math.random() * availablePuzzles.length);
  return availablePuzzles[randomIndex];
};

// Helper function to get puzzle by category
export const getPuzzlesByCategory = (
  category: "trivia" | "logic" | "riddle" | "deduction"
): SherlockPuzzle[] => {
  return PUZZLES.filter((puzzle) => puzzle.category === category);
};
