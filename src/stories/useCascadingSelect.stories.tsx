import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import ENV from '../../.env.js';
import HasuraConfig from '../../tests/TestHasuraConfig';
import Input from '../components/shared/Input';
import useCascadingSelect from '../hooks/useCascadingSelect';
import decorators from './decorators';
//@ts-ignore
import Autocomplete from 'react-native-web-ui-components/Autocomplete';

export default {
  title: 'Hooks/useCascadingSelect',
  component: View,
  decorators,
} as ComponentMeta<typeof Input.SelectViaRelationship>;

export const Select: ComponentStory<typeof View> = () => {
  console.log('🚀 ~ file: useCascadingSelect.stories.tsx ~ line 23 ~ HasuraConfig', HasuraConfig);
  const { options, selected, select } = useCascadingSelect({
    config: HasuraConfig.motorcycleReference,
    columns: ['year', 'makeName', 'modelName'],
  });
  const [year, setYear] = useState<string>();
  const [make, setMake] = useState<string>();
  const [model, setModel] = useState<string>();

  console.log('🚀 ~ file: useCascadingSelect.stories.tsx ~ line 30 ~ options', 
  'options:len: ', options.length,
  options[0].options, options[1].options, options[2].options);
  return (
    <View style={{ height: '200px', flexDirection: 'column-reverse' }}>
      <Autocomplete
        items={options[2].options}
        onChangeText={(e: any) => {
          console.log('e', e);          
          setModel(e);
        }}
        value={model}
        onSelect={(e)=> (select(2, e), setModel(e))}
      />
      <Text>Model</Text>
      <Autocomplete
        items={options[1].options}
        onChangeText={(e: any) => {
          console.log('e', e);
          setMake(e);
        }}
        value={make}
        onSelect={(e)=> (select(1, e), setMake(e))}
      />
      <Text>Make</Text>
      <Autocomplete
        items={options[0].options}
        onChangeText={(e: any) => {
          console.log('e', e);
          setYear(e);
        }}
        value={year}
        onSelect={(e)=> (select(0, e), setYear(e))}
      />
      <Text>Year</Text>
    </View>
  );
};
