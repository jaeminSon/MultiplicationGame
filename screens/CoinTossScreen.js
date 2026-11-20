import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Modal,
} from "react-native";

import CoinIcon from "../components/CoinIcon";

// A coin-toss betting game that shows kids why gambling loses in the long run.
// A correct guess wins the bet minus the house's cut ("tax"); a wrong guess
// loses the whole bet. With any cut above 0% the game is rigged against the
// player, and the balance chart and auto-play make that visible.

const START_BALANCE = 100;
const BET_OPTIONS = [10, 20, 50, "all"];
const TAX_OPTIONS = [0, 0.05, 0.1, 0.2];
const AUTO_ROUNDS = 100;
const MIN_BET = 1;
const CHART_POINTS = 60;

const round2 = (n) => Math.round(n * 100) / 100;
const fmt = (n) => String(Math.round(n * 10) / 10);
const pct = (rate) => `${Math.round(rate * 100)}%`;
const sideName = (side) => (side === "H" ? "Heads" : "Tails");

function freshGame() {
  return {
    balance: START_BALANCE,
    history: [START_BALANCE],
    rounds: 0,
    wins: 0,
    taxPaid: 0,
  };
}

// One flip. Returns the next game state and what happened.
function playRound(game, guess, bet, taxRate) {
  const side = Math.random() < 0.5 ? "H" : "T";
  const won = side === guess;
  const tax = won ? round2(bet * taxRate) : 0;
  const change = won ? round2(bet - tax) : -bet;
  const balance = round2(game.balance + change);
  return {
    game: {
      balance,
      history: [...game.history, balance],
      rounds: game.rounds + 1,
      wins: game.wins + (won ? 1 : 0),
      taxPaid: round2(game.taxPaid + tax),
    },
    outcome: { side, guess, won, bet, tax, change },
  };
}

export default function CoinTossScreen() {
  const [game, setGame] = useState(freshGame);
  const [betChoice, setBetChoice] = useState(10);
  const [taxRate, setTaxRate] = useState(0.1);
  const [flipping, setFlipping] = useState(false);
  const [outcome, setOutcome] = useState(null);
  const [autoSummary, setAutoSummary] = useState(null);
  const flip = useRef(new Animated.Value(0)).current;

  const broke = game.balance < MIN_BET;
  const betFor = (balance) =>
    betChoice === "all" ? balance : Math.min(betChoice, balance);
  const bet = betFor(game.balance);

  const handleGuess = (guess) => {
    if (flipping || broke) return;
    const next = playRound(game, guess, bet, taxRate);
    setFlipping(true);
    setOutcome(null);
    setAutoSummary(null);
    flip.setValue(0);
    Animated.timing(flip, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setGame(next.game);
      setOutcome(next.outcome);
      setFlipping(false);
    });
  };

  const handleAutoPlay = () => {
    if (flipping || broke) return;
    let current = game;
    let played = 0;
    while (played < AUTO_ROUNDS && current.balance >= MIN_BET) {
      const guess = Math.random() < 0.5 ? "H" : "T";
      current = playRound(current, guess, betFor(current.balance), taxRate).game;
      played += 1;
    }
    setAutoSummary({
      played,
      wins: current.wins - game.wins,
      change: round2(current.balance - game.balance),
      tax: round2(current.taxPaid - game.taxPaid),
    });
    setOutcome(null);
    setGame(current);
  };

  const handleRestart = () => {
    setGame(freshGame());
    setOutcome(null);
    setAutoSummary(null);
  };

  // Flip animation: the coin squashes to an edge and back four times while it
  // rises and falls, which reads as a spinning coin.
  const scaleY = flip.interpolate({
    inputRange: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
    outputRange: [1, 0, 1, 0, 1, 0, 1, 0, 1],
  });
  const translateY = flip.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -70, 0],
  });
  const coinFace = flipping ? "?" : outcome ? outcome.side : undefined;

  const houseProfit = round2(START_BALANCE - game.balance);
  const chart = game.history.slice(-CHART_POINTS);
  // Headroom so the start line and the tallest bar never touch the top edge.
  const chartMax = Math.max(START_BALANCE, ...chart) * 1.15;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsRow}>
          <Stat label="Your coins" value={fmt(game.balance)} highlight />
          <Stat
            label="House profit"
            value={fmt(houseProfit)}
            color={houseProfit > 0 ? "#c0392b" : "#333"}
          />
          <Stat label="Rounds" value={String(game.rounds)} />
        </View>

        <View style={styles.coinArea}>
          <Animated.View style={{ transform: [{ translateY }, { scaleY }] }}>
            <CoinIcon size={120} face={coinFace} />
          </Animated.View>
        </View>

        <View style={styles.messageBox}>
          {flipping ? (
            <Text style={styles.message}>Flipping…</Text>
          ) : outcome ? (
            <>
              <Text style={styles.message}>
                It's {sideName(outcome.side)}!
              </Text>
              <Text
                style={[styles.subMessage, { color: outcome.won ? "#2e8b57" : "#c0392b" }]}
              >
                {outcome.won
                  ? `You won ${fmt(outcome.change)} coins` +
                    (outcome.tax > 0 ? ` (the house kept ${fmt(outcome.tax)})` : "")
                  : `You lost ${fmt(outcome.bet)} coins`}
              </Text>
            </>
          ) : autoSummary ? (
            <>
              <Text style={styles.message}>
                {autoSummary.played} rounds: won {autoSummary.wins}, lost{" "}
                {autoSummary.played - autoSummary.wins}
              </Text>
              <Text
                style={[
                  styles.subMessage,
                  { color: autoSummary.change >= 0 ? "#2e8b57" : "#c0392b" },
                ]}
              >
                {autoSummary.change >= 0 ? "You gained" : "You lost"}{" "}
                {fmt(Math.abs(autoSummary.change))} coins · the house took{" "}
                {fmt(autoSummary.tax)} in tax
              </Text>
            </>
          ) : (
            <Text style={styles.message}>Heads or tails? Make your guess!</Text>
          )}
        </View>

        <Text style={styles.sectionLabel}>Bet: {fmt(bet)} coins</Text>
        <View style={styles.chipRow}>
          {BET_OPTIONS.map((option) => (
            <Chip
              key={option}
              label={option === "all" ? "All in" : String(option)}
              selected={betChoice === option}
              onPress={() => setBetChoice(option)}
            />
          ))}
        </View>

        <View style={styles.guessRow}>
          {["H", "T"].map((side) => (
            <TouchableOpacity
              key={side}
              style={[styles.guessButton, (flipping || broke) && styles.disabled]}
              onPress={() => handleGuess(side)}
              disabled={flipping || broke}
            >
              <Text style={styles.guessText}>{sideName(side)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.autoButton, (flipping || broke) && styles.disabled]}
          onPress={handleAutoPlay}
          disabled={flipping || broke}
        >
          <Text style={styles.autoText}>⏩ Play {AUTO_ROUNDS} rounds for me</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Your coins over time</Text>
        <View style={styles.chart}>
          <View
            style={[
              styles.startLine,
              { bottom: (START_BALANCE / chartMax) * CHART_HEIGHT },
            ]}
          />
          {chart.map((value, index) => (
            <View
              key={index}
              style={[
                styles.bar,
                {
                  height: Math.max(1, (value / chartMax) * CHART_HEIGHT),
                  backgroundColor: value >= START_BALANCE ? "#2e8b57" : "#c0392b",
                },
              ]}
            />
          ))}
        </View>
        <Text style={styles.chartCaption}>Dashed line: the 100 coins you started with</Text>

        <Text style={styles.sectionLabel}>House cut on every win</Text>
        <View style={styles.chipRow}>
          {TAX_OPTIONS.map((rate) => (
            <Chip
              key={rate}
              label={pct(rate)}
              selected={taxRate === rate}
              onPress={() => setTaxRate(rate)}
            />
          ))}
        </View>

        <View style={styles.lessonCard}>
          <Text style={styles.lessonTitle}>Why the house always wins</Text>
          <Text style={styles.lessonText}>{lessonText(taxRate)}</Text>
        </View>

        <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
          <Text style={styles.restartText}>Start over with 100 coins</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={broke && !flipping} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Out of coins! 💸</Text>
            <Text style={styles.modalText}>
              You played {game.rounds} rounds and won {game.wins} of them, yet
              all 100 coins are gone. The house took {fmt(game.taxPaid)} coins in
              tax along the way.
            </Text>
            <Text style={styles.modalText}>
              Real gambling works the same way, only with real money. The rules
              are always set so the house wins in the end.
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleRestart}>
              <Text style={styles.modalButtonText}>Start over</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function lessonText(taxRate) {
  if (taxRate === 0) {
    return (
      "With no house cut this is a fair game: on average you neither win nor " +
      "lose. Real casinos and betting apps are never fair like this. They " +
      "always take a cut, because that is how they make money."
    );
  }
  const keep = Math.round((1 - taxRate) * 100);
  const lossPer10 = fmt((10 * taxRate) / 2);
  return (
    `You guess right half the time, but a win pays only ${keep}% of your bet ` +
    `while a loss costs all of it. On average every 10-coin bet loses ` +
    `${lossPer10} coins to the house. A lucky streak can't change that: the ` +
    `longer you play, the more surely the house wins. Try "Play ${AUTO_ROUNDS} ` +
    `rounds for me" and watch the chart.`
  );
}

function Stat({ label, value, highlight, color }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text
        style={[styles.statValue, highlight && styles.statHighlight, color && { color }]}
      >
        {value}
      </Text>
    </View>
  );
}

function Chip({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const CHART_HEIGHT = 90;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f4f3f1",
    borderRadius: 12,
    paddingVertical: 12,
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 13,
    color: "#777",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  statHighlight: {
    color: "#a8740a",
  },
  coinArea: {
    height: 200,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10,
  },
  messageBox: {
    minHeight: 64,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  message: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subMessage: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chip: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#928e85",
    alignItems: "center",
  },
  chipSelected: {
    backgroundColor: "#928e85",
  },
  chipText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#928e85",
  },
  chipTextSelected: {
    color: "#ffffff",
  },
  guessRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  guessButton: {
    width: "48%",
    backgroundColor: "#928e85",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  guessText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
  },
  disabled: {
    opacity: 0.4,
  },
  autoButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#eee",
    alignItems: "center",
  },
  autoText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
  },
  chart: {
    height: CHART_HEIGHT,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f4f3f1",
    borderRadius: 8,
    paddingHorizontal: 4,
    overflow: "hidden",
  },
  startLine: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: "#555",
  },
  bar: {
    flex: 1,
    maxWidth: 12,
    marginHorizontal: 0.5,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  chartCaption: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  lessonCard: {
    marginTop: 20,
    backgroundColor: "#fff6e0",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#d9a514",
  },
  lessonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  lessonText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
  },
  restartButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  restartText: {
    fontSize: 15,
    color: "#928e85",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 28,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 14,
    color: "#333",
  },
  modalText: {
    fontSize: 16,
    lineHeight: 23,
    color: "#444",
    textAlign: "center",
    marginBottom: 12,
  },
  modalButton: {
    marginTop: 6,
    backgroundColor: "#928e85",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
