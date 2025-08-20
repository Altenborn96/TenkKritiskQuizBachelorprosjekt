import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router'; // Use Expo's routing system

export default function TakkTilbakemeldingScreen() {
  const router = useRouter();

  // Handle "Tilbake" button click
  const handleGoBack = () => {
    router.push('/instillinger'); // Navigate back to the settings page or another appropriate page
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>Tilbake</Text>
      </TouchableOpacity>

    

      {/* Thank You Text */}
      <Text style={styles.thankYouText}>Takk for din tilbakemelding!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007BFF',
  },
  iconContainer: {
    backgroundColor: '#F1F8E9', // Light green background color for the icon container
    padding: 40,
    borderRadius: 50,
    marginBottom: 30,
  },
  checkIcon: {
    width: 60,
    height: 60,
  },
  thankYouText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
});
