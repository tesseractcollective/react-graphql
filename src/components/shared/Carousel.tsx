import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import {
  View,
  TextInputBase,
  Constructor,
  NativeMethods,
  TimerMixin,
  TextInputProps,
  Text,
  ViewProps,
} from "react-native";
import { MutateState } from "../../hooks/useMutate";
import { HasuraDataConfig } from "../../types/hasuraConfig";
//@ts-ignore
import RNWUICarousel from "react-native-web-ui-components/Carousel";

export interface IInputProps {
  state: MutateState;
  name: string;
  disabled?: boolean;
}

export interface TInput {
  Carousel: FunctionComponent<IInputProps>;
}

const Carousel: FunctionComponent<IInputProps> = function Inputs(props) {
  return <View></View>;
} as CarouselType;

(Carousel as FunctionComponent<IInputProps> & TInput).Carousel = function Inputs(
  props
) {
  return (
    <View>
      <RNWUICarousel
      autoplay={false}
      delay={3000}
      loop={true}
      width={100}
      >
        <div style={{width:"300px", height: "300px", background: 'green'}}/>
        <div style={{width:"300px", height: "300px", background: 'red'}}/>
        <div style={{width:"300px", height: "300px", background: 'blue'}}/>
        <div style={{width:"300px", height: "300px", background: 'orange'}}/>
    </RNWUICarousel>
    </View>
  );
};


export type CarouselType = FunctionComponent<IInputProps> & TInput;

export default Carousel as CarouselType;