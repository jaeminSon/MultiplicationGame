import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const multiplicationTables = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99];

export default function HomeScreen({ navigation }) {
  const handleTableSelect = (table) => {
    navigation.navigate('Game', { table });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {Array.from({ length: 5 }, (_, rowIndex) => (
          <View key={rowIndex} style={styles.buttonRow}>
            {multiplicationTables.slice(rowIndex * 2, rowIndex * 2 + 2).map((table) => (
              <TouchableOpacity
                key={table}
                style={styles.tableButton}
                onPress={() => handleTableSelect(table)}
              >
                <Text style={styles.buttonText}>× {table}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    width: '100%',
  },
  tableButton: {
    backgroundColor: '#0492c2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15,
    width: '48%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});