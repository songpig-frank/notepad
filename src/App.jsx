
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Button, StyleSheet } from 'react-native';
import './App.css';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ADHD Pad!</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Voice Recorder"
          onPress={() => navigation.navigate('VoiceRecorder')}
        />
        <Button
          title="Task List"
          onPress={() => navigation.navigate('TaskList')}
        />
      </View>
    </View>
  );
}

function VoiceRecorderScreen() {
  return (
    <View style={styles.container}>
      <Text>Voice Recorder</Text>
      {/* Voice recorder functionality will be added here */}
    </View>
  );
}

function TaskListScreen() {
  return (
    <View style={styles.container}>
      <Text>Task List</Text>
      {/* Task list functionality will be added here */}
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
});
