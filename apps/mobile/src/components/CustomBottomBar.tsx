import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { BarChart2, Calendar, Menu, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DestinationItem, DestinationMenuDrawer } from './DestinationMenuDrawer';

export interface CustomBottomBarProps {
  state: any;
  navigation: any;
  descriptors?: any;
  insets?: any;
}

export function CustomBottomBar({ state, navigation }: CustomBottomBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isMenuDrawerVisible, setIsMenuDrawerVisible] = useState(false);

  const currentRouteName = state.routes[state.index]?.name;

  const isTabActive = (name: string) => {
    if (!currentRouteName) return false;
    return (
      currentRouteName === name ||
      currentRouteName === `${name}/index` ||
      currentRouteName.startsWith(`${name}/`)
    );
  };

  const handleTabPress = async (routeName: string) => {
    try {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}

      // Find matching route in navigation state (matching 'name', 'name/index', or starting with 'name/')
      const targetRoute = state.routes.find(
        (r: { name: string; key: string }) =>
          r.name === routeName ||
          r.name === `${routeName}/index` ||
          r.name.startsWith(`${routeName}/`)
      );

      const isFocused = isTabActive(routeName);

      if (targetRoute) {
        const event = navigation.emit({
          type: 'tabPress',
          target: targetRoute.key,
          canPreventDefault: true,
        });

        // Do not re-navigate if already focused on this tab
        if (!isFocused && !event.defaultPrevented) {
          try {
            navigation.navigate({ name: targetRoute.name, merge: true });
          } catch {
            router.navigate(`/(tabs)/${routeName}` as any);
          }
        }
      } else {
        // Fallback navigation
        try {
          navigation.navigate(routeName);
        } catch {
          router.navigate(`/(tabs)/${routeName}` as any);
        }
      }
    } catch (err) {
      console.warn('Tab navigation error:', err);
      try {
        router.navigate(`/(tabs)/${routeName}` as any);
      } catch {}
    }
  };

  const handleMorePress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setIsMenuDrawerVisible(true);
  };

  const handleSelectDestination = (dest: DestinationItem) => {
    try {
      if (dest.path) {
        router.navigate(dest.path as any);
      } else {
        navigation.navigate(dest.routeName);
      }
    } catch (err) {
      console.warn('Destination navigation error:', err);
      if (dest.path) {
        try {
          router.push(dest.path as any);
        } catch {}
      }
    }
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {/* Destination Menu Drawer Modal */}
      <DestinationMenuDrawer
        visible={isMenuDrawerVisible}
        onClose={() => setIsMenuDrawerVisible(false)}
        onSelectDestination={handleSelectDestination}
      />

      {/* Raised Center Dome with Custom Icon */}
      <View style={styles.centerDomeWrapper} pointerEvents="box-none">
        <View style={styles.centerDomeBackdrop} />
        <TouchableOpacity
          style={styles.centerButton}
          onPress={() => handleTabPress('analytics')}
          activeOpacity={0.85}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={require('../../icons/icon.png')}
            style={styles.centerIconImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      {/* Bottom Bar Items */}
      <View style={styles.bar}>
        {/* Dashboard */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleTabPress('analytics')}
          activeOpacity={0.7}
        >
          <BarChart2
            size={22}
            color={isTabActive('analytics') ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)'}
            strokeWidth={isTabActive('analytics') ? 2.5 : 2}
          />
          <Text
            style={[
              styles.tabLabel,
              isTabActive('analytics') && styles.tabLabelActive,
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>

        {/* Timetable */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleTabPress('timetable')}
          activeOpacity={0.7}
        >
          <Calendar
            size={22}
            color={isTabActive('timetable') ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)'}
            strokeWidth={isTabActive('timetable') ? 2.5 : 2}
          />
          <Text
            style={[
              styles.tabLabel,
              isTabActive('timetable') && styles.tabLabelActive,
            ]}
          >
            Timetable
          </Text>
        </TouchableOpacity>

        {/* Center Spacer for the Raised Button */}
        <View style={styles.centerSpacer} />

        {/* Mark Entry */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleTabPress('exams')}
          activeOpacity={0.7}
        >
          <Plus
            size={24}
            color={isTabActive('exams') ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)'}
            strokeWidth={isTabActive('exams') ? 3 : 2.2}
          />
          <Text
            style={[
              styles.tabLabel,
              isTabActive('exams') && styles.tabLabelActive,
            ]}
          >
            Mark Entry
          </Text>
        </TouchableOpacity>

        {/* More Menu */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={handleMorePress}
          activeOpacity={0.7}
        >
          <Menu
            size={22}
            color={
              isTabActive('profile') || isMenuDrawerVisible
                ? '#FFFFFF'
                : 'rgba(255, 255, 255, 0.75)'
            }
            strokeWidth={isTabActive('profile') || isMenuDrawerVisible ? 2.5 : 2}
          />
          <Text
            style={[
              styles.tabLabel,
              (isTabActive('profile') || isMenuDrawerVisible) &&
                styles.tabLabelActive,
            ]}
          >
            More
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#6559FC',
    position: 'relative',
  },
  bar: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  centerSpacer: {
    width: 72,
  },
  centerDomeWrapper: {
    position: 'absolute',
    top: -24,
    left: '50%',
    marginLeft: -40,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 25,
  },
  centerDomeBackdrop: {
    position: 'absolute',
    top: 0,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6559FC',
    borderWidth: 3,
    borderColor: '#7C4DFF',
  },
  centerButton: {
    marginTop: 8,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  centerIconImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
