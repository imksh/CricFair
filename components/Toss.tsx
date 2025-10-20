import { View, TouchableOpacity, Image } from "react-native";
import { useRef, useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import useThemeStore from "../store/themeStore";
import LottieView from "lottie-react-native";
import { Mid,Heading } from "./Typography";

export default function Toss() {
  const { colors } = useThemeStore();
  const animation = useRef(null);
  const [show, setShow] = useState(false);
  const [result,setResult] = useState("");

  useEffect(() => {
    if (show && animation.current) {
      animation.current.play();
    }
  }, [show]);

  const toss = () => {
    setShow(true);
    calculate();
  };

  const calculate = () => {
  const res = Math.random() < 0.5 ? "Tails" : "Head";
  setResult(res);
};

  // play animation after state update (when Lottie is rendered)
  
  return (
    <LinearGradient
      colors={colors.gradients.surface}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="my-4 p-4 w-[100%] mx-auto "
      style={{
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 1,
      }}
    >
      <View className="w-[100%] flex justify-end items-center h-72">
        {!show ? (
          <>
            <Image
              source={require("@/assets/images/coin.png")}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
            {
                result.trim() && <Heading style={result==="Head"?{color:colors.primary}:{color:colors.text}}>{result}</Heading>
            }
            <TouchableOpacity
              className="py-3 mt-8 rounded-2xl w-[40%] items-center"
              style={{ backgroundColor: colors.primary }}
              onPress={toss}
            >
              <Mid style={{color:"#fff"}}>Toss</Mid>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <LottieView
              source={require("../assets/animations/coinFlip.json")}
              autoPlay={false}
              loop={false}
              ref={animation}
              onAnimationFinish={()=>setShow(false)}
              style={{ width: 200, height: 200 }}
            />
            <TouchableOpacity
              className="py-3 mt-8 rounded-2xl w-[40%] items-center"
              style={{ backgroundColor: colors.primary }}
              onPress={toss}
            >
              <Mid style={{color:"#fff"}}>Toss</Mid>
            </TouchableOpacity>
          </>
        )}
      </View>
    </LinearGradient>
  );
}
