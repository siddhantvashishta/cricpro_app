---
name: Expo Go SDK 54 Compatibility Enforcement
description: Strictly enforces native package version resolution and UI regression checks for this specific project running on Expo Go SDK 54.
---

# 🛑 Expo Go SDK Dependency & UI Safety Protocol

This skill contains strict instructions for adding new features, packages, or navigation flows to the `CricPro` application while maintaining perfect harmony with the user's specific **Expo Go version SDK 54**.

## 1. Golden Rule of Installation
The user is running **Expo Go SDK 54.0.0**. This means the physical device has **locked, pre-compiled Native C++ and Objective-C/Java bindings**. 
*   **NEVER** use `npm install [package-name]` to arbitrarily install complex native packages (like Reanimated, Gesture Handler, Vision Camera, Maps, etc.).
*   **ALWAYS** use `npx expo install [package-name]`. This command consults the Expo registry and maps the exact version compatible with the locked native bindings on SDK 54, preventing `WorkletsError` or `NullPointerException` crashes.

## 2. Dealing with React Navigation
If React Navigation or the Drawer component is requested in the future, follow this strict sequence to avoid peer-dependency chaos and Worklet mismatches:

1.  **Stop all existing Metro instances.**
2.  Install core Navigation without Reanimated initially: 
    ```bash
    npm install @react-navigation/native @react-navigation/native-stack @react-navigation/drawer
    ```
3.  Install Expo-managed dependencies via `expo install`:
    ```bash
    npx expo install react-native-screens react-native-safe-area-context react-native-reanimated react-native-gesture-handler
    ```
4.  If installing Reanimated, **ALWAYS** check `babel.config.js`. You must add `react-native-reanimated/plugin` as the **last** plugin.
5.  Clear the bundler cache on the next run: `npx expo start -c`

## 3. UI Regression Prevention
When implementing new complex logic (like routing, Redux, or APIs), the visual fidelity must remain untouched. 
*   Do **NOT** alter styling, spacing, or color hexes inside components unless explicitly told to do so by the user.
*   Keep the UI layer (Components) heavily separated from the logic layer (Data Fetching / Routing). 
*   When moving components (e.g., placing `HomeScreen` inside a `Drawer.Screen`), ensure no extra wrappers (like `View` without `flex: 1`) break the CSS layout.

## 4. Troubleshooting Reanimated / Worklet Crashes
If the user's phone displays a Red Screen Error related to Worklets (`Mismatch between JavaScript part...`) or a `NullPointerException` in `ReanimatedModule`:
1.  Do **NOT** attempt manual version downgrades to fix peer conflicts.
2.  Immediately purge `node_modules`.
3.  Delete `react-native-worklets-core` if it exists in `package.json` (Expo Go natively handles it).
4.  Run a fresh `npm install` followed by `npx expo install --fix`.
