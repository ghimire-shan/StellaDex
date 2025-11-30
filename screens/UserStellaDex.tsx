import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const UserStellaDex = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Ensure StatusBar is light so we can see time/battery on black bg */}
      <StatusBar barStyle="light-content" />
      
      <View style={styles.content}>
        <Text style={styles.title}>Stelladex</Text>
        <Text style={styles.subtitle}>Look at your Stelladex</Text>
        
        {/* Placeholder for the list we will build next */}
        <View style={styles.placeholderBox}>
            <Text style={styles.placeholderText}>Search 110,000+ Stars...</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
    marginBottom: 30,
  },
  placeholderBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
  },
  placeholderText: {
    color: '#555',
  }
});

export default UserStellaDex;