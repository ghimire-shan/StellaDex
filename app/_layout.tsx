import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, AntDesign  } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { AuthProvider } from '../contexts/AuthContext';

// Import your global theme color
import { HORIZONTAL_PLANE_COLOR } from '../constants/celestial';

export default function Layout() {
	return (
		<AuthProvider>
			<GestureHandlerRootView style={styles.container}>
				<Tabs
					screenOptions={{
						// Hide top header
						headerShown: false,
						tabBarStyle: {
						// Using the same color as the horizontal plane as the bg
						backgroundColor: HORIZONTAL_PLANE_COLOR,
						borderTopColor: '#333',
						height: 60,
						paddingBottom: 10,
						},
						tabBarActiveTintColor: '#4da6ff', // Cyan like color for active
						tabBarInactiveTintColor: '#888',
					}}
				>
					{/* Tab 1: Is the sky view */}
					<Tabs.Screen
						name="index" // Links to app/index.tsx
						options={{
							title: 'Sky',
							tabBarIcon: ({ color, size }) => (
								<Ionicons name="planet-outline" size={size} color={color} />
							),
						}}
					/>

					{/* Tab 2: Stelladex */}
					<Tabs.Screen
						name="stelladex" // Links to app/stelladex.tsx
						options={{
							title: 'Stelladex',
							tabBarIcon: ({ color, size }) => (
								<MaterialCommunityIcons name="storage-tank-outline" size={size} color={color} />
							),
						}}
					/>

					{/* Tab 3: Authentication */}
					<Tabs.Screen
						name="authentication" // Links to app/authentication
						options={{
							title: "User",
							tabBarIcon: ({ color, size }) => (
								<AntDesign name="user" size={size} color={color} />
							),
						}}
					/>
				</Tabs>
			</GestureHandlerRootView>
		</AuthProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black',
	},
});