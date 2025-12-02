import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AIRecommendationScreen from '../screens/home/AIRecommendationScreen';
import LoadingScreen from '../screens/common/LoadingScreen';
import AIRecommendationResultScreen from '../screens/home/AIRecommendationResultScreen';
import RoutineSuggestionScreen from '../screens/analysis/RoutineSuggestionScreen';
import CreateRoutineScreen from '../screens/home/CreateRoutineScreen';
import CreateRoutineDetailScreen from '../screens/home/CreateRoutineDetailScreen';

const Stack = createNativeStackNavigator();

interface OnboardingNavigatorProps {
  onComplete?: () => void;
  initialRouteName?: string;
  initialParams?: any;
}

const OnboardingNavigator = ({
  onComplete,
  initialParams,
}: OnboardingNavigatorProps) => {
  return (
    <Stack.Navigator
      initialRouteName="AIRecommendation"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="AIRecommendation"
        component={AIRecommendationScreen}
        initialParams={initialParams}
      />
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen
        name="AIRecommendationResult"
        component={AIRecommendationResultScreen}
      />
      <Stack.Screen
        name="RoutineSuggestion"
        component={RoutineSuggestionScreen}
      />
      <Stack.Screen name="CreateRoutine" component={CreateRoutineScreen} />
      <Stack.Screen
        name="CreateRoutineDetail"
        component={CreateRoutineDetailScreen}
      />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
