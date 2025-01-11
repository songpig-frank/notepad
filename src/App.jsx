
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import './App.css';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ADHD Pad!</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('VoiceRecorder')}
        >
          <Text style={styles.buttonText}>Voice Recorder</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('TaskList')}
        >
          <Text style={styles.buttonText}>Task List</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function VoiceRecorderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Recorder</Text>
    </View>
  );
}

function TaskListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task List</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="VoiceRecorder" component={VoiceRecorderScreen} />
        <Stack.Screen name="TaskList" component={TaskListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 4,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  }
});
