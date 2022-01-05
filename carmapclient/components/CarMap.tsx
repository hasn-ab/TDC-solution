import {gql, useSubscription} from '@apollo/client';
import React, {useCallback, useState, useEffect, useRef} from 'react';
import {Image, StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import MapView, {Marker} from 'react-native-maps';

import SlidingUpPanel from 'rn-sliding-up-panel';
import CarDetails from './CarDetails';
import CloseButton from './CloseButton';

type Car = {
  id: string;
  location: {latitude: number; longitude: number};
  distanceToDestination: number;
};

//subscription for getting updated cars
const CARS_SUBSCRIPTION = gql`
  subscription CarsUpdated {
    updatedCars {
      id
      location {
        latitude
        longitude
      }
      destination {
        latitude
        longitude
      }
      distanceToDestination
    }
  }
`;

const CarMap = () => {
  // At the top of this component you should subscribe to updates from the server.
  // See https://www.apollographql.com/docs/react/data/subscriptions/#executing-a-subscription
  const mapRef = useRef<MapView>();
  // flag to check if map centered after initial fetch
  const mapCenteredRef = useRef<Boolean>(false);
  // subscription for graphl data
  const {data, loading, error} = useSubscription(CARS_SUBSCRIPTION);
  const panelEl = useRef<SlidingUpPanel>(null);
  //put cars data in types cars array
  const cars: Array<Car> = data?.updatedCars || [];
  //state for storing tapped car to be displayed in bottomsheet/panel
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  // effect for setting the viewport to have our current cars visibile
  useEffect(() => {
    if (cars.length > 0 && !mapCenteredRef.current) {
      mapRef.current?.fitToCoordinates(cars.map(car => car.location));
      mapCenteredRef.current = true;
    }
  }, [data?.updatedCars]);
  //hiding sliding panel initially
  useEffect(() => panelEl.current?.hide(), []);
  //call when a car on map is press
  const onCarTapped = useCallback((car: Car) => {
    setSelectedCar(car);
    panelEl.current?.show();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        onLayout={() => {
          if (cars.length > 0) {
            mapRef.current?.fitToCoordinates();
            mapCenteredRef.current = true;
          }
        }}>
        {cars.map(car => (
          <Marker key={car.id} coordinate={car.location}>
            <TouchableOpacity onPress={() => onCarTapped(car)}>
              <Image source={require('./Car.png')} style={styles.markerImage} />
            </TouchableOpacity>
          </Marker>
        ))}
      </MapView>
      {/* For documentation on the MapView see https://github.com/react-native-maps/react-native-maps */}
      <SlidingUpPanel
        ref={panelEl}
        draggableRange={{top: 200, bottom: 0}}
        showBackdrop={false}
        allowDragging={false}>
        <View style={styles.panel}>
          {selectedCar && (
            <>
              <CloseButton
                onPress={() => {
                  panelEl.current?.hide();
                }}
              />
              <CarDetails car={selectedCar} />
            </>
          )}
        </View>
      </SlidingUpPanel>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  panel: {
    flex: 1,
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingTop: 20,
  },
  markerImage: {
    width: 40,
    height: 40,
  },
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

export default CarMap;
