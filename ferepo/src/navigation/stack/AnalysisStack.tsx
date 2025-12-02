import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AnalysisScreen from '../../screens/analysis/AnalysisScreen';
import ConsumptionAnalysisScreen from '../../screens/analysis/ConsumptionAnalysisScreen';
import FinancialProductScreen from '../../screens/analysis/FinancialProductScreen';
import RoutineSuggestionScreen from '../../screens/analysis/RoutineSuggestionScreen';
import StreakSuccessScreen from '../../screens/analysis/StreakSuccessScreen';
import LoadingScreen from '../../screens/common/LoadingScreen';

const Stack = createNativeStackNavigator();

const AnalysisStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AnalysisMain" component={AnalysisScreen} />
      <Stack.Screen
        name="ConsumptionAnalysis"
        component={ConsumptionAnalysisScreen}
      />
      <Stack.Screen
        name="FinancialProduct"
        component={FinancialProductScreen}
      />
      <Stack.Screen
        name="RoutineSuggestion"
        component={RoutineSuggestionScreen}
      />
      <Stack.Screen name="StreakSuccess" component={StreakSuccessScreen} />
      <Stack.Screen name="Loading" component={LoadingScreen} />
    </Stack.Navigator>
  );
};

export default AnalysisStack;
