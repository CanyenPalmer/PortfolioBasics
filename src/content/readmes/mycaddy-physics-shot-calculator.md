# My Caddy: Physics-Based Golf Shot Calculator

**Author:** Palmer Projects  
**License:** © Palmer Projects. All rights reserved.

**My Caddy** is a web URL / desktop Python application that accurately simulates effective golf shot distances by modeling real-world conditions. Built for golfers of all skill levels, it combines a user-friendly interface with physics-driven calculations to improve on-course decision-making.

---

## Project Purpose

My Caddy addresses the variability in golf shot distances caused by environmental and lie conditions. Rather than relying solely on flat-yardage numbers, this tool adjusts shot carry predictions by incorporating aerodynamic and atmospheric influences, offering practical assistance on the course or during preparation.

---

## Core Features

- **Dynamic Yardage Calculation**: Adjusts shot distances based on:
  - Lie type (e.g., fairway, rough, buried)
  - Temperature (°F)
  - Wind direction and speed
  - Weather condition (sunny, rainy, snowy)
  - Shot direction
  - Optional flyer lie effect (+5% to +12%)

- **Live Condition Summary**: Displays all inputs in real time for validation and user transparency.

- **Physics Engine**:
  - Implements drag coefficient, temperature-density relationships, and shot-spin modifiers.
  - Adjusts carry distance using aerodynamic logic.

- **Flyer Lie Mode**: Returns a dynamic range of expected outcomes to simulate uncertain lies.

- **Clean GUI Design**:
  - Built using `tkinter` for accessibility.
  - Light theme with simplified layout.

---

## Technology Stack

- **Python 3**
- **tkinter** (for GUI)
- **Custom Mathematical Functions**:
  - Drag-based adjustments
  - Altitude/temperature corrections
  - Wind impact modeling

---

## Target Users

This app supports a wide range of golfers:

- **Beginners**: Learn how environmental conditions influence club distances.
- **Amateurs**: Enhance course management and reduce guesswork.
- **Professionals**: Simulate tournament prep with precise conditional modeling.

---

## How to Use

### Prerequisites

- Install Python 3.x
- Clone or download this repository.

### Run the Application

```bash
python my_caddy_calculator.py
