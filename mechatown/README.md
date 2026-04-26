# Sewer Scavenger 🛡️🔧

**Sewer Scavenger** is a fast-paced, retro-style 2D arcade game built with **Phaser 3**. You play as a mechanical soldier navigating a hazardous sewer system to collect scrap metal and maintain your energy levels.

## 🕹️ Gameplay

The goal is simple: survive as long as possible while maximizing your scrap collection.

* **Collect Scrap:** Each piece of scrap adds to your score. Reach milestones (10, 100, 1000) to Level Up!
* **Manage Energy:** Your energy constantly depletes. Collect **Energy Cores** to stay powered up.
* **Avoid Hazards:** Falling water drops are toxic to your systems. Losing all lives or running out of energy results in a **System Critical** failure (Game Over).

### Controls
* **Left/Right Arrow Keys:** Move the soldier.
* **Up Arrow Key:** Jump (Double jump is disabled, so time your leaps!).
* **Mouse Click:** Necessary to initialize the audio engine upon start.

## 🚀 Features

* **Dynamic Spawning:** Randomly generated scrap, energy, and hazards.
* **Juice & Feedback:** Includes screen shakes, particle bursts on level-up, and sound effects with pitch randomization.
* **Invincibility Frames:** Short protection window after taking damage.
* **Responsive Scaling:** Automatically adjusts to fit your browser window.

## 🛠️ Technical Details

* **Engine:** Phaser 3 (Arcade Physics)
* **Build Tool:** Vite
* **Assets:** Custom Pixel Art (32x32) and high-fidelity SFX (.wav / .mp3).

## 📦 How to Build and Run

This project uses **Vite** for a modern development workflow.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/sewer-scavenger.git
    cd sewer-scavenger
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run in development mode:**
    ```bash
    npm run dev
    ```

4.  **Build for production (itch.io / Playables):**
    ```bash
    npm run build
    ```
    The production-ready files will be in the `/dist` folder.

## 📜 License

This project is open-source and available under the **MIT License**. Feel free to fork, modify, and build your own versions!

---
*Created as part of a gamedev challenge. Stay Critical!*