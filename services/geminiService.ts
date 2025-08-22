import { GoogleGenAI, Type, Part } from "@google/genai";
import { QuizData } from '../types';

// Gracefully handle the absence of process.env.API_KEY in browser environments
// to prevent the app from crashing on load.
const API_KEY = typeof process !== 'undefined' ? process.env.API_KEY : undefined;

if (!API_KEY) {
  console.warn(
    "API_KEY is not set. The application will load, but quiz generation will fail. " +
    "Please set the API_KEY environment variable in your deployment environment (e.g., Netlify)."
  );
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "" });


export interface QuizSource {
  topic?: string;
  file?: File;
}

const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to read file as string."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      mimeType: file.type,
      data: base64EncodedData,
    },
  };
};

const quizSchema = {
  type: Type.OBJECT,
  properties: {
    multiple_choice: {
      type: Type.ARRAY,
      description: "An array of 5 multiple-choice questions.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "The question text." },
          options: {
            type: Type.ARRAY,
            description: "An array of 4 possible answers.",
            items: { type: Type.STRING },
          },
          correct_answer: {
            type: Type.STRING,
            description: "The correct answer from the options.",
          },
        },
        required: ["question", "options", "correct_answer"],
      },
    },
    true_false: {
      type: Type.ARRAY,
      description: "An array of 5 true/false questions.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "The question text." },
          answer: {
            type: Type.STRING,
            description: "The correct answer, either 'True' or 'False'.",
          },
        },
        required: ["question", "answer"],
      },
    },
  },
  required: ["multiple_choice", "true_false"],
};

const promptTemplate = `You are an expert quiz generator. Your task is to create a quiz based on the provided context.

Instructions:
1.  Generate exactly 5 multiple-choice questions and 5 true/false questions.
2.  Return ONLY a valid JSON object that adheres to the provided schema.
3.  Do not include any explanations, comments, or markdown formatting (e.g., \`\`\`json). The output must be a clean, directly parsable JSON string.

The quiz should be based on the following context:
`;

export const generateQuiz = async ({ topic, file }: QuizSource): Promise<QuizData> => {
  if (!API_KEY) {
    throw new Error("API key not configured. Please set the API_KEY environment variable for your deployment.");
  }
  
  let contents: string | { parts: Part[] };
  let prompt: string;

  if (file) {
    prompt = `${promptTemplate}The context is the content of the provided document.`;
    const filePart = await fileToGenerativePart(file);
    contents = { parts: [{ text: prompt }, filePart] };
  } else if (topic) {
    prompt = `${promptTemplate}"${topic}"`;
    contents = prompt;
  } else {
    throw new Error("A topic or a file must be provided to generate a quiz.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      },
    });

    const text = response.text.trim();
    // In case the model still includes markdown, clean it.
    const cleanedText = text.replace(/^```json\s*|```$/g, '');
    const quizData: QuizData = JSON.parse(cleanedText);

    // Basic validation to ensure the structure is correct
    if (!quizData.multiple_choice || !quizData.true_false) {
        throw new Error("Invalid quiz data structure received from API.");
    }

    return quizData;
  } catch (error) {
    console.error("Error generating quiz:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
       throw new Error("The configured API key is invalid. Please check your deployment environment variables.");
    }
    throw new Error("Failed to generate quiz. The model may have returned an invalid format. Please try a different topic or file.");
  }
};