// src/utils/getResponse.js

import { faqs } from '../data/faqs';
import stringSimilarity from 'string-similarity';

export function getResponse(userInput) {
  const input = userInput.toLowerCase();

  // Extrae todas las preguntas de todas las categorías
  const allQuestions = faqs.flatMap(category => category.questions.map(q => q.question.toLowerCase()));

  // Encuentra la mejor coincidencia
  const { bestMatch, bestMatchIndex } = stringSimilarity.findBestMatch(input, allQuestions);

  if (bestMatch.rating > 0.2) {
    // Encuentra la categoría y la pregunta correspondiente
    for (const category of faqs) {
      const questionIndex = category.questions.findIndex(q => q.question.toLowerCase() === allQuestions[bestMatchIndex]);
      if (questionIndex !== -1) {
        return category.questions[questionIndex].answer;
      }
    }
  }

  return "I'm sorry, I don't have an answer to that question. Please check our FAQs or contact support.";
}