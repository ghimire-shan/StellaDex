import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { StyleSheet, View, Alert, Button, TextInput, Text } from 'react-native';
import { Session } from '@supabase/supabase-js';
import {
	BACKGROUND_COLOR,
	CONTAINER_PADDING,
	LOCK_OUTLINE_COLOR,
	SEARCH_BACKGROUND_COLOR,
	SEARCH_OUTLINE_COLOR
} from '../constants/stelladexview';

export default function Account({ session }: { session: Session }) {
	const [loading, setLoading] = useState(true)
	const [username, setUsername] = useState('')

	useEffect(() => {
		if (session) getProfile()
	}, [session])

	async function getProfile() {
		try {
			setLoading(true)
			if (!session?.user) throw new Error('No user on the session!')

			const { data, error, status } = await supabase
				.from('profiles')
				.select(`username, website, avatar_url`)
				.eq('id', session?.user.id)
				.single()
			if (error && status !== 406) {
				throw error
			}

			if (data) {
				setUsername(data.username)
			}
		} catch (error) {
			if (error instanceof Error) {
				Alert.alert(error.message)
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}> {session?.user?.email} </Text>
			</View>

			<View>
				<Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: BACKGROUND_COLOR,
	},
	header: {
		marginBottom: 10,
		padding: CONTAINER_PADDING,
	},
	title: {
		color: 'white',
		fontSize: 28,
		fontWeight: 'semibold',
	},
})