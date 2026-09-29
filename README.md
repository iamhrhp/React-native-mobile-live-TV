# Moon Sky TV 🌙📺

Moon Sky TV is a premium, cross-platform IPTV application built with React Native. It allows users to seamlessly browse, filter, and stream live television channels directly from their mobile devices with a beautiful and modern user interface.




https://github.com/user-attachments/assets/91e291bb-93e8-455d-a44f-ddea70134aa3




<img width="400" height="500" alt="Screenshot 2026-09-29 at 1 42 01 PM" src="https://github.com/user-attachments/assets/d30ed296-74bf-47a2-8d6b-490997333a01" />
<img width="400" height="500" alt="Screenshot 2026-09-29 at 1 42 24 PM" src="https://github.com/user-attachments/assets/33c99394-193e-4b9d-90db-74db0c8d44e6" />

<img width="400" height="500" alt="Screenshot 2026-09-29 at 1 42 36 PM" src="https://github.com/user-attachments/assets/850dfe66-e1a5-4c15-989d-5cec7d330690" />
<img width="400" height="500" alt="Screenshot 2026-09-29 at 1 42 51 PM" src="https://github.com/user-attachments/assets/2de119f0-05bb-42c5-b511-d1c53e0cd49a" />



## Features ✨
- **Live IPTV Streaming:** Watch live TV channels using HLS (`.m3u8`) streaming protocols.
- **Native Video Player:** Integrated with high-performance native video players for both iOS (`AVPlayer`) and Android (`ExoPlayer`) for buttery smooth playback.
- **Orientation Management:** Smart rotation handling. The app stays in portrait mode for browsing, but gracefully allows landscape viewing when watching full-screen video.
- **Dynamic Categories:** Automatically groups channels by categories (e.g., Sports, Movies, News).
- **Favorites System:** Easily favorite your most-watched channels for quick access.
- **Search Functionality:** Instantly search through hundreds of channels with a smooth, animated search bar.
- **Cross-Platform:** Beautifully designed to work flawlessly on both iOS and Android.

## Tech Stack 🛠
- **Framework:** [React Native](https://reactnative.dev/) (TypeScript)
- **Navigation:** [React Navigation](https://reactnavigation.org/)
- **Video Playback:** [react-native-video](https://github.com/react-native-video/react-native-video)
- **Orientation:** [react-native-orientation-locker](https://github.com/wonday/react-native-orientation-locker)
- **Icons:** [iconsax-react-native](https://github.com/vuesax/iconsax-react-native)

## Getting Started 🚀

### Prerequisites
Make sure your development environment is set up for React Native (Node.js, Watchman, Xcode for iOS, and Android Studio for Android). 

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Install iOS Pods:**
   ```bash
   cd ios
   pod install
   cd ..
   ```

### Running the App

**For iOS:**
```bash
npm run ios
```

**For Android:**
```bash
npm run android
```

## Troubleshooting 🔧
- **iOS Build Errors:** If you experience issues building on iOS, ensure your Pods are up to date by running `cd ios && pod install --repo-update`.
- **Android Icon Issues:** If you modify the app icons, ensure you clean the build cache (`cd android && ./gradlew clean`) before running the app again.
- **Stream Issues on iOS:** HTTP (non-HTTPS) streams are blocked by default on iOS. Ensure you are using HTTPS streams or that `NSAppTransportSecurity` is properly configured in your `Info.plist`.

## License 📄
This project is proprietary and confidential.
