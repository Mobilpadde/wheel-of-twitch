import JSConfetti from "js-confetti";

const jsConfetti = new JSConfetti();

export default function celebrate(_winner: string): void {
  jsConfetti.addConfetti({
    emojis: ["🌈", "⚡️", "💥", "✨", "💫", "🌸", "🏆", "🎁", "🪅", "🪩"],
    emojiSize: 18,
    confettiNumber: 30,
  });

  jsConfetti.addConfetti({
    emojis: ["🎉", "🎊", "🥳"],
    emojiSize: 20,
    confettiNumber: 40,
  });

  jsConfetti.addConfetti({
    confettiColors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
    confettiRadius: 5,
    confettiNumber: 60,
  });
}
