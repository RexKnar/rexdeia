import React, { useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClassDetailCards } from '../../src/components/ClassDetailCards';
import { Header } from '../../src/components/Header';

export default function ClassesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title="Class Directory"
        subtitle="Sections, Strength & Academic Incharges"
        searchPlaceholder="Search classes or sections..."
        onSearch={setSearchQuery}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#6559FC"
            colors={['#6559FC']}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <ClassDetailCards
          searchQuery={searchQuery}
          refreshTrigger={refreshTrigger}
          onRefreshEnd={() => setRefreshing(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 110,
  },
});
