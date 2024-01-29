import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import fetchRate, { Rate } from "../api/CurrencyController";

const TestComponent = () => {
  const [rates, setRates] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function func() {
      const tmp = await fetchRate("eur");
      const ratesArray = tmp.rates ? Object.values(tmp.rates) : [];
      setRates(ratesArray);
      setIsLoading(false);
    }
    func();
  }, []);

  const renderItem = ({ item }: { item: Rate }) => (
    <View style={styles.item}>
      <Text>{`${item.currency}: ${item.rate}`}</Text>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <Text>Loading....</Text>
      ) : (
        <View>
          <Text>Done!</Text>
          {rates && (
            <FlatList
              data={rates}
              renderItem={renderItem}
              keyExtractor={(item) => item.currency}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    paddingBottom: 22,
    paddingHorizontal: 6,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    width: "100%",
    borderColor: "red",
    borderWidth: 1,
  },
});

export default TestComponent;
