export interface MultipleChoiceQuestion {
  question: string;
  options: string[];
  correct_answer: string;
}

export interface TrueFalseQuestion {
  question: string;
  answer: string; // "True" or "False"
}

export interface QuizData {
  multiple_choice: MultipleChoiceQuestion[];
  true_false: TrueFalseQuestion[];
}

export interface UserAnswers {
  [questionKey: string]: string;
}