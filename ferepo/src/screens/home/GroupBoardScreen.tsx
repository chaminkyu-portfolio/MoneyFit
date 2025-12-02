import React, { useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import { AddRoutineButton } from '../../components/domain/routine';
import RoutineCard from '../../components/domain/routine/RoutineCard';
import { useGroupRoutines } from '../../hooks/routine/group/useGroupRoutines';

const GroupBoardScreen = ({ navigation }: any) => {
  const {
    data: groupRoutinesData,
    isLoading: isGroupRoutinesLoading,
    error: groupRoutinesError,
  } = useGroupRoutines({
    page: 0,
    size: 50,
  });


  const formatTimeForDisplay = (time: any): string => {
    if (!time) return '00:00';

    if (Array.isArray(time)) {
      const [hour, minute] = time;
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    if (typeof time === 'string') {
      if (time.includes(',')) {
        const [hour, minute] = time.split(',');
        return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
      }

      if (time.includes(':')) {
        return time.split(':').slice(0, 2).join(':');
      }
    }

    return '00:00';
  };

  const groupRoutines =
    groupRoutinesData?.result?.items?.map((item) => {
      // 진행률이 100%인 경우 오늘 날짜의 요일만 완료된 것으로 표시
      const today = new Date();
      const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
      const dayIndex = today.getDay();
      // getDay()는 0(일요일)부터 6(토요일)까지 반환하므로 매핑 필요
      const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // 일요일(0) -> 6, 월요일(1) -> 0
      const todayDay = dayNames[mappedIndex];

      const completedDays =
        (item.percent || 0) >= 100 && (item.dayOfWeek || []).includes(todayDay)
          ? [todayDay]
          : [];

      const formattedItem = {
        id: item.id.toString(),
        title: item.title,
        description: item.description || '루틴 설명이 없습니다.',
        startTime: item.startTime,
        endTime: item.endTime,
        timeRange: `${formatTimeForDisplay(item.startTime)} - ${formatTimeForDisplay(item.endTime)}`,
        itemCount: item.routineNums || 0,
        participantCount: item.peopleNums || 0,
        selectedDays: item.dayOfWeek || [],
        completedDays,
        routineType: item.routineType,
        joined: item.joined,
        progress: item.percent || 0,
      };

      return formattedItem;
    }) || [];


  const renderRoutine = ({ item }: any) => (
    <RoutineCardWrapper>
      <RoutineCard
        progress={item.progress}
        title={item.title}
        description={item.description}
        category={item.routineType === 'DAILY' ? '생활' : '소비'}
        timeRange={item.timeRange}
        selectedDays={item.selectedDays}
        completedDays={item.completedDays}
        routineNums={item.itemCount}
        onPress={() =>
          navigation.navigate('GroupRoutineDetail', {
            routineId: item.id,
            routineData: {
              id: item.id,
              title: item.title,
              description: item.description,
              startTime: item.startTime,
              endTime: item.endTime,
              dayOfWeek: item.selectedDays,
              peopleNums: item.participantCount,
              routineNums: item.itemCount,
              routineType: item.routineType,
              joined: item.joined,
            },
          })
        }
      />
      <ParticipantInfo>
        <ParticipantIcon source={require('../../assets/images/person.png')} />
        <ParticipantCount>{item.participantCount}</ParticipantCount>
      </ParticipantInfo>
    </RoutineCardWrapper>
  );

  return (
    <Container edges={['top', 'left', 'right']}>
      <Header title="단체루틴 목록" onBackPress={() => navigation.goBack()} />

      <ListWrapper>
        <FlatList
          data={groupRoutines}
          renderItem={renderRoutine}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => (
            <>
              <Banner>
                <BannerIcon>
                  <SpeakerIcon
                    source={require('../../assets/images/speaker.png')}
                  />
                </BannerIcon>
                <BannerText>
                  부적절한 게시글을 작성할 경우, 앱 이용이 제한될 수 있습니다.
                </BannerText>
              </Banner>
              <SearchButton
                onPress={() => navigation.navigate('GroupRoutineSearch')}
              >
                <SearchButtonText>루틴명을 검색해주세요</SearchButtonText>
                <SearchIcon>
                  <Ionicons
                    name="search"
                    size={16}
                    color={theme.colors.gray400}
                  />
                </SearchIcon>
              </SearchButton>
              <Divider />
            </>
          )}
          ListEmptyComponent={() => (
            <EmptyContainer>
              <EmptyImage
                source={require('../../assets/images/coin_pig.png')}
                resizeMode="contain"
              />
              <EmptyText>등록된 루틴이 없습니다.</EmptyText>
            </EmptyContainer>
          )}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
        />
      </ListWrapper>

      <AddRoutineButton
        onPress={() => navigation.navigate('CreateGroupRoutine')}
      />
    </Container>
  );
};

export default GroupBoardScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Banner = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 12px 0 16px 0;
  padding: 12px 8px 12px 0;
  border-radius: 8px;
  background-color: #f7f8fa;
`;

const Divider = styled.View`
  height: 1px;
  background-color: #e5e5e5;
  margin: 16px 0;
`;

const BannerIcon = styled.View`
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  margin-right: 10px;
`;

const SpeakerIcon = styled.Image`
  width: 32px;
  height: 32px;
`;

const BannerText = styled.Text`
  flex: 1;
  font-family: ${theme.fonts.Regular};
  font-size: 11px;
  font-weight: 400;
  color: #6f7075;
`;

const ListWrapper = styled.View`
  flex: 1;
`;

const RoutineCardWrapper = styled.View`
  position: relative;
  margin-bottom: 10px;
`;

const ParticipantInfo = styled.View`
  position: absolute;
  top: 16px;
  right: 16px;
  align-items: center;
  background-color: #f7f8fa;
  padding: 8px 12px;
  border-radius: 12px;
`;

const ParticipantIcon = styled.Image`
  width: 24px;
  height: 24px;
  margin-bottom: 2px;
  resize-mode: contain;
`;

const ParticipantCount = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 11px;
  font-weight: 500;
  color: #FF6F61;
  text-align: center;
`;

const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const EmptyImage = styled.Image`
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
  opacity: 0.3;
`;

const EmptyText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray400};
  text-align: center;
`;

const SearchButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #f7f8fa;
  border-radius: 12px;
  padding: 12px 16px;
  margin: 8px 0;
`;

const SearchButtonText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray400};
`;

const SearchIcon = styled.View`
  align-items: center;
  justify-content: center;
`;
