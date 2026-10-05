import React from 'react';
import ExamsScreen from './index';

/**
 * MarkEntryRouteWrapper:
 * Ensures any direct link or navigation to '/(tabs)/exams/mark-entry' loads
 * the unified, live-data Mark Entry screen without static mock data fallbacks.
 */
export default function MarkEntryRouteWrapper() {
  return <ExamsScreen />;
}
