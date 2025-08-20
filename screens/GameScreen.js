import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function GameScreen({ route, navigation }) {
  const { table, duration, totalProblems } = route.params;
  const durationMS = duration * 1000;
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationMS);
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);

  // Generate random number within the table range
  const getRandomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // Get smooth color interpolation for timer
  const getTimerColor = (timeLeft) => {
    const ratio = timeLeft / durationMS; // 0 to 1
    if (ratio > 0.5) {
      // Yellow to orange (1.0 to 0.5)
      const r = 255;
      const g = Math.floor(215 - (215 - 165) * (1 - ratio) * 2);
      const b = 0;
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Orange to red (0.5 to 0.0)
      const r = 255;
      const g = Math.floor(165 * ratio * 2);
      const b = Math.floor(68 * ratio * 2);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  // Generate wrong answers with same digit count and same last digit as correct answer
  const generateWrongAnswers = (correctAnswer) => {
    const digitCount = correctAnswer.toString().length;
    const lastDigit = correctAnswer % 10;
    const wrongAnswers = [];

    while (wrongAnswers.length < 3) {
      let wrongAnswer;
      if (digitCount === 1) {
        wrongAnswer = Math.floor(Math.random() * 9) + 1;
      } else {
        const min = Math.pow(10, digitCount - 1);
        const max = Math.pow(10, digitCount) - 1;
        wrongAnswer = Math.floor(Math.random() * (max - min + 1)) + min;
        // Replace last digit with correct answer's last digit
        wrongAnswer = Math.floor(wrongAnswer / 10) * 10 + lastDigit;
      }

      if (
        wrongAnswer !== correctAnswer &&
        !wrongAnswers.includes(wrongAnswer) &&
        wrongAnswer > 0
      ) {
        wrongAnswers.push(wrongAnswer);
      }
    }

    return wrongAnswers;
  };

  // Generate new question
  const generateQuestion = () => {
    let num1, num2;
    if (Math.random() < 0.5) {
      num1 = getRandomNumber(1, table);
      num2 = getRandomNumber(table - 8, table);
    } else {
      num1 = getRandomNumber(table - 8, table);
      num2 = getRandomNumber(1, table);
    }
    const correctAnswer = num1 * num2;
    const wrongAnswers = generateWrongAnswers(correctAnswer);

    // Shuffle answers
    const allAnswers = [correctAnswer, ...wrongAnswers];
    const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);

    setQuestion({ num1, num2, correctAnswer });
    setAnswers(shuffledAnswers);
    setTimeLeft(durationMS);
    setIsAnswered(false);
  };

  // Handle answer selection
  const handleAnswerPress = (selectedAnswer) => {
    if (isAnswered) return;

    setIsAnswered(true);
    const correct = selectedAnswer === question.correctAnswer;

    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < totalProblems) {
        setCurrentQuestion(currentQuestion + 1);
        generateQuestion();
      } else {
        navigation.navigate("Results", {
          score: correct ? score + 1 : score,
          table,
          totalProblems,
          duration, 
        });
      }
    }, 500);
  };

  // Timer effect - updates every 100ms for smooth animation
  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 100), 100);
      return () => clearTimeout(timer);
    } else if (timeLeft <= 0 && !isAnswered) {
      handleAnswerPress(-1); // Wrong answer when time runs out
    }
  }, [timeLeft, isAnswered]);

  // Initialize first question
  useEffect(() => {
    generateQuestion();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.questionCounter}>
          Question {currentQuestion}/{totalProblems}
        </Text>
        <View style={styles.timerContainer}>
          <View style={styles.timerBar}>
            <View
              style={[
                styles.timerProgress,
                {
                  width: `${(timeLeft / durationMS) * 100}%`,
                  backgroundColor: getTimerColor(timeLeft),
                },
              ]}
            />
          </View>
        </View>
        <Text style={styles.score}>Score: {score}</Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {question.num1} × {question.num2} = ?
        </Text>
      </View>

      <View style={styles.answersContainer}>
        {answers.map((answer, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.answerButton,
              isAnswered &&
                answer === question.correctAnswer &&
                styles.correctButton,
              isAnswered &&
                answer !== question.correctAnswer &&
                styles.disabledButton,
            ]}
            onPress={() => handleAnswerPress(answer)}
            disabled={isAnswered}
          >
            <Text style={styles.answerText}>{answer}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  questionCounter: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  timerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  timerBar: {
    width: 100,
    height: 8,
    backgroundColor: "#ddd",
    borderRadius: 4,
    overflow: "hidden",
  },
  timerProgress: {
    height: "100%",
    borderRadius: 4,
    transition: "all 0.3s ease-in-out",
  },
  score: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  questionContainer: {
    alignItems: "center",
    marginBottom: 80,
  },
  questionText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#333",
  },
  feedbackContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  correct: {
    color: "#4CAF50",
  },
  incorrect: {
    color: "#f44336",
  },
  correctAnswerText: {
    fontSize: 18,
    color: "#666",
    marginTop: 5,
  },
  answersContainer: {
    flex: 1,
  },
  answerButton: {
    backgroundColor: "#928e85",
    paddingVertical: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  correctButton: {
    backgroundColor: "#4CAF50",
  },
  disabledButton: {
    opacity: 0.6,
  },
  answerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});
