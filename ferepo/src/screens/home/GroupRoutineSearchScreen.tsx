import React, { useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native';

import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import { SearchInput } from '../../components/domain/routine';
import RoutineCard from '../../components/domain/routine/RoutineCard';
import { useSearchGroupRoutines } from '../../hooks/routine/group/useGroupRoutines';

const GroupRoutineSearchScreen = ({ navigation }: any) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const {
    data: searchResultsData,
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchGroupRoutines(
    { keyword: searchKeyword },
    isSearching && !!searchKeyword.trim(),
  );

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    setIsSearching(false);
  };

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
    searchResultsData?.result?.items?.map((item) => {
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
      <Header title="단체루틴 검색" onBackPress={() => navigation.goBack()} />

      <SearchContainer>
        <SearchInput
          placeholder="루틴명을 입력해주세요."
          onSearch={handleSearch}
          onClear={handleClearSearch}
          hasSearchResults={
            isSearching &&
            searchResultsData?.result?.items &&
            searchResultsData.result.items.length > 0
          }
        />
      </SearchContainer>

      <ListWrapper>
        <FlatList
          data={groupRoutines}
          renderItem={renderRoutine}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => {
            if (isSearchLoading) {
              return (
                <EmptyContainer>
                  <EmptyText>검색 중...</EmptyText>
                </EmptyContainer>
              );
            }
            return (
              <EmptyContainer>
                <EmptyStateImage
                  source={require('../../assets/images/coin_pig.png')}
                />
                <EmptyText>검색 결과가 없습니다.</EmptyText>
              </EmptyContainer>
            );
          }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
        />
      </ListWrapper>
    </Container>
  );
};

export default GroupRoutineSearchScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const SearchContainer = styled.View`
  padding: 12px 16px;
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
  justify-content: center;
  align-items: center;
  padding: 80px 0;
`;

const EmptyText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray500};
  text-align: center;
`;

const EmptyStateImage = styled.Image`
  width: 160px;
  height: 160px;
  margin-bottom: 20px;
  resize-mode: contain;
  opacity: 0.3;
`;
