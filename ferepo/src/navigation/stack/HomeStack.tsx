import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../../screens/home/HomeScreen';
import CreateRoutineScreen from '../../screens/home/CreateRoutineScreen';
import CreateRoutineDetailScreen from '../../screens/home/CreateRoutineDetailScreen';
import PersonalRoutineDetailScreen from '../../screens/home/PersonalRoutineDetailScreen';
import GroupBoardScreen from '../../screens/home/GroupBoardScreen';
import RankBoardScreen from '../../screens/home/RankBoardScreen';
import GroupRoutineSearchScreen from '../../screens/home/GroupRoutineSearchScreen';
import GroupRoutineDetailScreen from '../../screens/home/GroupRoutineDetailScreen';
import CreateGroupRoutineScreen from '../../screens/home/CreateGroupRoutineScreen';
import CreateGroupRoutineDetailScreen from '../../screens/home/CreateGroupRoutineDetailScreen';
import AIRecommendationScreen from '../../screens/home/AIRecommendationScreen';
import AIRecommendationResultScreen from '../../screens/home/AIRecommendationResultScreen';
import LoadingScreen from '../../screens/common/LoadingScreen';
import ActiveRoutineScreen from '../../screens/home/ActiveRoutineScreen';
import ResultScreen from '../../screens/common/ResultScreen';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="CreateRoutine" component={CreateRoutineScreen} />
      <Stack.Screen
        name="CreateRoutineDetail"
        component={CreateRoutineDetailScreen}
      />
      <Stack.Screen
        name="PersonalRoutineDetail"
        component={PersonalRoutineDetailScreen}
      />
      <Stack.Screen name="GroupBoard" component={GroupBoardScreen} />
      <Stack.Screen name="RankBoard" component={RankBoardScreen} />
      <Stack.Screen
        name="GroupRoutineSearch"
        component={GroupRoutineSearchScreen}
      />
      <Stack.Screen
        name="GroupRoutineDetail"
        component={GroupRoutineDetailScreen}
      />
      <Stack.Screen
        name="CreateGroupRoutine"
        component={CreateGroupRoutineScreen}
      />
      <Stack.Screen
        name="CreateGroupRoutineDetail"
        component={CreateGroupRoutineDetailScreen}
      />
      <Stack.Screen
        name="AIRecommendation"
        component={AIRecommendationScreen}
      />
      <Stack.Screen
        name="AIRecommendationResult"
        component={AIRecommendationResultScreen}
      />
      <Stack.Screen name="ActiveRoutine" component={ActiveRoutineScreen} />
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
