import { Redirect } from 'expo-router';
import React from 'react';

/**
 * Root Tabs Route:
 * Automatically redirects to the unified Dashboard screen (analytics).
 */
export default function TabsIndexRedirect() {
  return <Redirect href="/(tabs)/analytics" />;
}
