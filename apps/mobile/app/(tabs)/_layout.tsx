import { Tabs } from 'expo-router';
import React from 'react';
import { CustomBottomBar } from '../../src/components/CustomBottomBar';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="analytics"
      tabBar={(props) => <CustomBottomBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* 1. Root redirect */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />

      {/* 2. Dashboard */}
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Dashboard',
        }}
      />

      {/* 3. Timetable */}
      <Tabs.Screen
        name="timetable"
        options={{
          title: 'Timetable',
        }}
      />

      {/* 4. Mark Entry */}
      <Tabs.Screen
        name="exams"
        options={{
          title: 'Mark Entry',
        }}
      />
      <Tabs.Screen
        name="exams/mark-entry"
        options={{
          href: null,
        }}
      />

      {/* 5. More / Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'More',
        }}
      />

      {/* Additional sub-routes accessible without duplicate bottom bar tabs */}
      <Tabs.Screen
        name="students"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="classes"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="staff-analysis"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="student-marklist"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
