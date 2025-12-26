import React, { useState } from 'react';
import { Alert, StyleSheet, View, AppState, Button, TextInput } from 'react-native';
import { supabase } from '../utils/supabase';
import {
	BACKGROUND_COLOR,
	CONTAINER_PADDING,
	LOCK_OUTLINE_COLOR,
	SEARCH_BACKGROUND_COLOR,
	SEARCH_OUTLINE_COLOR
} from '../constants/stelladexview';


// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
	if (state === 'active') {
		supabase.auth.startAutoRefresh()
	} else {
		supabase.auth.stopAutoRefresh()
	}
})

export default function Auth() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)

	async function signInWithEmail() {
		setLoading(true)
		const { error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		})

		if (error) Alert.alert(error.message)
		setLoading(false)
	}

	async function signUpWithEmail() {
		setLoading(true)
		const {
			data: { session },
			error,
		} = await supabase.auth.signUp({
			email: email,
			password: password,
		})

		if (error) Alert.alert(error.message)
		if (!session) Alert.alert('Please check your inbox for email verification!')
		setLoading(false)
	}

	return (
		<View style={styles.container}>
			<View style={styles.inputContainer}>
				<TextInput
					style= {styles.inputText}
					onChangeText={(text) => setEmail(text)}
					value={email}
					placeholder="email@address.com"
					autoCapitalize={'none'}
					placeholderTextColor={SEARCH_OUTLINE_COLOR}
				/>
			</View>
			<View style={styles.inputContainer}>
				<TextInput
					style= {styles.inputText}
					onChangeText={(text) => setPassword(text)}
					value={password}
					secureTextEntry={true}
					placeholder="Password"
					autoCapitalize={'none'}
					placeholderTextColor={SEARCH_OUTLINE_COLOR}
				/>
			</View>
			<View style={styles.buttonContainer}>
				<Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
			</View>
			<View>
				<Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: BACKGROUND_COLOR,
		padding: CONTAINER_PADDING
	},
	inputContainer: {
		flexDirection: 'row',
        backgroundColor: SEARCH_BACKGROUND_COLOR,
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: LOCK_OUTLINE_COLOR,
		margin: 10
	},
	inputText: {
		flex: 1,
        color: 'white',
        marginLeft: 8,
        fontSize: 14, 
	},
	buttonContainer: {
		marginBottom: 10
	}

})