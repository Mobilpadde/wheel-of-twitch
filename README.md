# 🎡 WoT - Wheel of Twitch

> *The real wheel makes the teal seal squeal* 🦭

A fun interactive wheel spinner for Twitch streamers! 🎮 Connect to your Twitch chat and let viewers join the wheel for giveaways, mini-games, or just random fun!

## ✨ Features

- 🎯 **Live Twitch Integration** - Connects to any Twitch channel's chat
- 🌈 **Colorful Sectors** - Each user gets their own colored section
- 🎊 **Celebration Effects** - Confetti explosion when the wheel stops!
- 📱 **Browser Notifications** - Get notified when someone wins
- ⚙️ **Customizable Settings** - Configure entries per user, filter keywords, and more
- 🔒 **Smart Locking** - Prevents new entries once spinning starts

## 🚀 Quick Start

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Start the development server:**

   ```bash
   pnpm dev
   ```

3. **Configure your settings:**

    > [!CAUTION]
    > Saving will reset the wheel. This is intended.

   - Set your Twitch channel name
   - Choose number of entries per user
   - Add keyword filters (optional)
   - Default color (optional)

4. **Spin that wheel!** 🎡

## 🛠️ Libraries

I'm of course using these amazing libraries. Go support them 🤗

- **tmi.js** - Twitch chat integration 👀
- **js-confetti** - Because celebrations need confetti! 🎉

## 🎮 How It Works

1. Viewers type in chat (optionally with a keyword filter)
   - Each viewer can have X entries, based on your settings
2. Their names get added to the wheel with unique colors
3. Click **SPIN** to start the wheel spinning
4. Watch the magic happen with celebrations! ✨
   - While spinning, the button is locked.
   - Unlock by clicking it
   - Spin again 🍀
5. Once a winner is found, it's broadcasted to a [nfty](https://nfty.sh)-channel, this is the same name as the twitch channel 📣

---

Made with ❤️ for the Twitch community

Or, well, mostly [got_there](https://www.twitch.tv/got_there) because I felt sorry for him 😬
