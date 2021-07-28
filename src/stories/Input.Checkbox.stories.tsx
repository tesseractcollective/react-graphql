// require('dotenv').config();
import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

//Pull in our Input component instead
import Input from "../components/shared/Input";
import { Pressable, View } from "react-native";
import { useReactGraphql } from "../hooks/useReactGraphql";
import HasuraConfig from "../../tests/TestHasuraConfig";
import decorators from "./decorators";
// import { createClient, Provider as UrqlProvider } from 'urql';

export default {
  title: "Inputs/Checkbox",
  component: Input.Checkbox,
  decorators,
} as ComponentMeta<typeof Input.Checkbox>;

export const Form: ComponentStory<typeof Input.Checkbox> = () => {
  const dataApi = useReactGraphql(HasuraConfig.userGroups);
  const mutationState = dataApi.useInsert({});
  return (
    <View>
      <Input.Checkbox
        disabled={false}
        text={"Admin"}
        state={mutationState}
        name="isAdmin"
      />
      <Input.Checkbox
        disabled={false}
        text={"Founder"}
        state={mutationState}
        name="isFounder"
      />
    </View>
  );
};