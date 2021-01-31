import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  ActivityIndicator,
  Button,
} from "react-native";
import Slider from "@react-native-community/slider";
import API from "./API/request";

const api = API.getInstance();

export default function App() {
  const [remainGuess, setRemainGuess] = useState(() => 0);
  const [dark, setDark] = useState<boolean>(() => false);
  const [dific, setDific] = useState<number>(() => 3);
  const [puzzle, setPuzzle] = useState<string>(() => "");
  const [answer, setAnswer] = useState<string[]>(() => []);
  const [pushedKeys, setPushedKeys] = useState<string[]>(() => []);
  const [loading, setLoading] = useState<boolean>(() => true);
  const [guess, setGuess] = useState<string>(() => "");
  const [status, setStatus] = useState<boolean>(() => true);
  const [win, setWin] = useState<boolean>(() => false);

  const getPuzzle = (wordCount: number) => {
    (async () => {
      try {
        setRemainGuess(0);
        setLoading(true);
        let data = await api.GetPuzzle({ wordCount: wordCount });
        let newdata: string = data.data.puzzle;
        let arrayedData: string[] = newdata.split("");
        setAnswer(arrayedData);
        setPushedKeys([]);
        setRemainGuess(7);
        setWin(false);
        setStatus(true);
        let arr = Array(arrayedData.length);
        let tex = "";
        for (let i = 0; i < arrayedData.length; i++) {
          if (arrayedData[i] === " ") {
            tex += " ";
          } else {
            tex += "*";
          }
        }
        setPuzzle(tex);
        setLoading(false);
      } catch (e) {
        throw Error(e);
      }
    })();
  };

  useEffect(() => {
    getPuzzle(dific);
  }, []);

  useEffect(() => {
    if (status) {
      let flag = 0;
      if (puzzle.length && answer.length) {
        if (pushedKeys.find((element) => element === guess)) {
        } else {
          let temp = pushedKeys;
          temp.push(guess);
          setPushedKeys(temp);
          let arr: string[] = puzzle.split("");
          for (let i = 0; i < answer.length; i++) {
            if (answer[i].toUpperCase() === guess.toUpperCase()) {
              arr[i] = guess.toUpperCase();
              flag = 1;
            }
          }
          arr.find((element) => element === "*")
            ? ""
            : (setStatus(false), setWin(true));
          if (remainGuess === 1 && flag === 0) {
            setStatus(false);
          }
          flag ? "" : setRemainGuess(remainGuess - 1);
          let tex = arr.join("");
          setPuzzle(tex);
        }
      }
    }
  }, [guess]);

  const mainContainerStyleHandler = (theme: boolean) => {
    if (theme) {
      return {
        backgroundColor: "#424874",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      };
    } else {
      return {
        backgroundColor: "#f5dd4b",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      };
    }
  };

  const textStyleHandler = (
    theme: boolean,
    size: number = 20,
    padd: number = 0,
    align: boolean = true
  ) => {
    let alignment = align ? "left" : "center";
    if (theme) {
      return {
        color: "#fafafa",
        fontFamily: "Helvetica",
        fontSize: size,
        width: "100%",
        paddingLeft: padd,
        textAlign: alignment,
      };
    } else {
      return {
        color: "#040404",
        fontFamily: "Helvetica",
        fontSize: size,
        width: "100%",
        paddingLeft: padd,
        textAlign: alignment,
      };
    }
  };
  window.addEventListener("keypress", (e) => {
    let press: string = String.fromCharCode(e.charCode);
    setGuess(press);
  });

  return (
    <View style={mainContainerStyleHandler(dark)}>
      <View style={{ maxWidth: "425px" }}>
        <View style={styles.header}>
          <Text style={textStyleHandler(dark, 28, 0)}>GUESS THE WORLD</Text>
          <Switch
            style={{ marginLeft: 20 }}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={dark ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setDark(!dark)}
            value={dark}
          />
        </View>
        <Text style={textStyleHandler(dark, 15, 17)}>
          start by typing any random letter
        </Text>
        <br />
        <View style={styles.puzzle}>
          {loading && <ActivityIndicator size="large" />}
          {loading === false &&
            puzzle.split(" ").map((item, index) => (
              <Text key={index} style={textStyleHandler(dark, 28, 0, false)}>
                {item}{" "}
              </Text>
            ))}
        </View>
        <br />
        <Text style={textStyleHandler(dark, 15, 17)}>
          {status
            ? "remaining guess : " + remainGuess
            : win
            ? "You won, lets try again!"
            : "You loose, better luck next time!\nThe word was : " +
              answer.join("")}
        </Text>
        <br />
        <Button
          title="reset"
          onPress={() => {
            getPuzzle(dific);
          }}
        />
        <br />
        <Text style={textStyleHandler(dark, 15, 17)}>
          Number of words : {dific}
        </Text>
        <Slider
          style={{ width: 410, height: 40 }}
          minimumValue={3}
          maximumValue={9}
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="#000"
          onValueChange={(e) => setDific(e)}
          onSlidingComplete={(e) => getPuzzle(e)}
          step={1}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  puzzle: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
