// SwiperButton.jsx
import React from "react";
import { Text, StyleSheet, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const HEIGHT = 64;
const PADDING = 6;
const CIRCLE_SIZE = HEIGHT - PADDING * 2;

export default function SwiperButton({
  onToggle = () => {},
  text = "Swipe to Confirm",
}) {
  const { width } = useWindowDimensions();

  const BUTTON_WIDTH = Math.min(width - 32, 350);
  const SWIPE_RANGE = BUTTON_WIDTH - CIRCLE_SIZE - PADDING * 2;

  const x = useSharedValue(0);
  const startX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      startX.value = x.value;
    })
    .onUpdate((event) => {
      const nextValue = startX.value + event.translationX;
      x.value = Math.max(0, Math.min(nextValue, SWIPE_RANGE));
    })
    .onEnd(() => {
      const completed = x.value > SWIPE_RANGE * 0.75;

      if (completed) {
        x.value = withSpring(SWIPE_RANGE);
        runOnJS(onToggle)(true);

        setTimeout(() => {
          x.value = withSpring(0);
        }, 1000);
      } else {
        x.value = withSpring(0);
        runOnJS(onToggle)(false);
      }
    });

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      x.value,
      [0, SWIPE_RANGE * 0.7],
      [1, 0],
      Extrapolate.CLAMP
    ),
  }));

  return (
    <Animated.View style={[styles.container, { width: BUTTON_WIDTH }]}>
      <Animated.Text style={[styles.text, textStyle]}>
        {text}
      </Animated.Text>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.circle, circleStyle]}>
          <Text style={styles.arrow}>›</Text>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    padding: PADDING,
    overflow: "hidden",
    alignSelf: "center",
  },
  text: {
    color: "#0446DB",
    fontSize: 16,
    fontWeight: "700",
  },
  circle: {
    position: "absolute",
    left: PADDING,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "#0446DB",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  arrow: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "800",
    marginTop: -6,
  },
});




// import React, { useRef } from "react";
// import { Animated, PanResponder, StyleSheet, Text, View } from "react-native";

// const WIDTH = 330;
// const HEIGHT = 64;
// const PADDING = 6;
// const THUMB = HEIGHT - PADDING * 2;
// const MAX = WIDTH - THUMB - PADDING * 2;

// export default function MySwipeButton({ onSuccess = () => { } }) {
//     const x = useRef(new Animated.Value(0)).current;
//     const startX = useRef(0);

//     const panResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => true,
//             onStartShouldSetPanResponderCapture: () => true,
//             onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 2,
//             onMoveShouldSetPanResponderCapture: (_, g) => Math.abs(g.dx) > 2,

//             onPanResponderGrant: () => {
//                 x.stopAnimation((value) => {
//                     startX.current = value;
//                 });
//             },

//             onPanResponderMove: (_, g) => {
//                 const value = Math.max(0, Math.min(startX.current + g.dx, MAX));
//                 x.setValue(value);
//             },

//             onPanResponderRelease: (_, g) => {
//                 const finalValue = startX.current + g.dx;

//                 if (finalValue > MAX * 0.75) {
//                     Animated.spring(x, {
//                         toValue: MAX,
//                         useNativeDriver: true,
//                     }).start(() => {
//                         onSuccess();

//                         setTimeout(() => {
//                             Animated.spring(x, {
//                                 toValue: 0,
//                                 useNativeDriver: true,
//                             }).start();
//                         }, 700);
//                     });
//                 } else {
//                     Animated.spring(x, {
//                         toValue: 0,
//                         useNativeDriver: true,
//                     }).start();
//                 }
//             },

//             onPanResponderTerminate: () => {
//                 Animated.spring(x, {
//                     toValue: 0,
//                     useNativeDriver: true,
//                 }).start();
//             },

//             onShouldBlockNativeResponder: () => true,
//         })
//     ).current;

//     return (
//         <View style={styles.wrapper} pointerEvents="box-none">
//             <View style={styles.container}>
//                 <Text style={styles.text}>Swipe to Confirm</Text>

//                 <Animated.View
//                     {...panResponder.panHandlers}
//                     hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
//                     style={[styles.thumb, { transform: [{ translateX: x }] }]}
//                 >
//                     <Text style={styles.arrow}>›</Text>
//                 </Animated.View>
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     wrapper: {
//         alignItems: "center",
//         zIndex: 999,
//         elevation: 999,
//     },
//     container: {
//         width: WIDTH,
//         height: HEIGHT,
//         borderRadius: HEIGHT / 2,
//         backgroundColor: "#EEF4FF",
//         justifyContent: "center",
//         alignItems: "center",
//         overflow: "hidden",
//     },
//     text: {
//         color: "#0446DB",
//         fontSize: 16,
//         fontWeight: "700",
//     },
//     thumb: {
//         position: "absolute",
//         left: PADDING,
//         width: THUMB,
//         height: THUMB,
//         borderRadius: THUMB / 2,
//         backgroundColor: "#0446DB",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 1000,
//         elevation: 1000,
//     },
//     arrow: {
//         color: "#fff",
//         fontSize: 42,
//         fontWeight: "800",
//         marginTop: -6,
//     },
// });