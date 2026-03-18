---
name: CricPro App Development
description: Development conventions, dependency decisions, and UI implementation skills for the CricPro React Native app.
---

# CricPro App Development Skill

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 54 (`~54.0.33`) |
| Runtime | React Native `0.81.5` |
| Language | TypeScript (`~5.9.2`) |
| Navigation | React Navigation **v6** |
| Icons | `lucide-react-native` |
| Safe Area | `react-native-safe-area-context` |

## Critical Dependency Rules

> [!IMPORTANT]
> Always use `npx expo install <pkg>` to add packages — it pins to the SDK-compatible version automatically.

> [!WARNING]
> **React Navigation v7 is INCOMPATIBLE** with this project. The `lib/module/*.js` imports fail in Metro. Always use **v6**:
> - `@react-navigation/native@^6.1.18`
> - `@react-navigation/native-stack@^6.11.0`  
> - `@react-navigation/bottom-tabs@^6.6.1`

> [!WARNING]
> After any navigation package change, always run:
> ```bash
> npm install --legacy-peer-deps
> npx expo start --clear
> ```

## Metro Bundler Configuration

The project uses a custom `metro.config.js` that disables `unstable_enablePackageExports` to fix `.js` extension resolution in navigation packages.

```js
config.resolver.unstable_enablePackageExports = false;
```

## TypeScript Configuration

`tsconfig.json` must include:
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "jsx": "react-native",
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

> [!TIP]
> Use `import * as React from 'react'` instead of `import React from 'react'` to comply with the `esModuleInterop` setting.

## Color System

All colors live in `src/constants/Colors.ts`. Reference them by name — never use hex values inline.

| Token | Hex | Usage |
|---|---|---|
| `maroon` | `#800000` | Primary CTA, active states, selected borders |
| `maroonDark` | `#5D0000` | Dark maroon details |
| `navy` | `#000080` | Organiser role, deep text |
| `peach` | `#FFF5F5` | Card backgrounds, icon cells |
| `white` | `#FFFFFF` | Screen backgrounds |
| `text` | `#000000` | Primary text |
| `textSecondary` | `#666666` | Subtitles, labels |

## Navigation Architecture

```
App.tsx
└── NavigationContainer
    └── OnboardingNavigator (Stack)
        ├── Splash
        ├── Onboarding (Carousel)
        ├── RoleSelection
        └── Main (Bottom Tabs)
            ├── Home
            ├── Matches
            ├── Stats
            ├── Community
            └── Profile
```

## Screen Implementation Pattern

Every screen should follow this structure:

```tsx
import * as React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';

const MyScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container]}>
      {/* Fixed Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        {/* ... */}
      </View>
      {/* Scrollable Body */}
      <ScrollView>
        {/* ... */}
      </ScrollView>
    </View>
  );
};
```

## Design System Rules

- **Gradients**: Use deep navy (`#1A2B4C`) to maroon (`#800000`) for splash/onboarding backgrounds.
- **Cards**: `borderRadius: 16`, `elevation: 2`, `borderColor: #F0F0F0`.
- **Primary Buttons**: `backgroundColor: Colors.maroon`, `borderRadius: 12–14`, `paddingVertical: 15–18`.
- **Section Titles**: `fontSize: 18`, `fontWeight: '800'`, color deep navy `#1A237E`.
- **Conditional styles**: Use ternary `isActive ? style : null` NOT boolean `isActive && style` in style arrays.
- **StatusBar**: Always pass `translucent={true}` explicitly as a boolean prop.

## Stitch Reference Screens

UI designs live in `stitch/<screen_name>/code.html` and `stitch/<screen_name>/screen.png`.

Key screens to implement:
- `splash_screen`, `onboarding_carousel`, `role_selection`
- `home_dashboard`, `home_dashboard_free`, `home_dashboard_pro`
- `live_scoring_screen`, `match_setup_basics`, `full_match_scorecard_charts_1`
- `player_profile_stats`, `player_profile_free`
- `cricpro_pro_subscription`, `pro_plan_selection`
- `community_feed_1`, `chat_interface`
- `tournament_list`, `create_tournament`
