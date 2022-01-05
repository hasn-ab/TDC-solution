import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
// displays selected car info
const CarDetails = ({car}: any) => {
  return (
    <View style={styles.carDetails}>
      {/* title with car id */}
      <Text style={styles.carName}>Car # {car?.id}</Text>
      {/* location details */}
      <Text style={styles.carLocationDetails}>
        Location: {car?.location.latitude.toFixed(5)},{' '}
        {car?.location.longitude.toFixed(5)}
      </Text>
      <Text style={styles.carLocationDetails}>
        Distance to Destination: {car?.distanceToDestination}
      </Text>
    </View>
  );
};

export default CarDetails;

const styles = StyleSheet.create({
  carDetails: {
    paddingVertical: 18,
    paddingTop: 18,
  },
  carName: {
    fontSize: 20,
    fontWeight: '800',
  },
  carLocationDetails: {
    fontSize: 15,
    fontWeight: '400',
  },
});
