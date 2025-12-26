import SwipeableCard from '@/components/SwipeableCard';
import React from 'react';
import { SafeAreaView } from 'react-native';

const Home = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <SwipeableCard />
    </SafeAreaView>
  );
};

export default Home;