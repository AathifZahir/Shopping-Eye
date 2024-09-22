import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ProductDetail = ({ route }) => {
  const { product, productId, toggleWishlist, isInWishlist } = route.params;
  const [shop, setShop] = useState([]);
  const [fetchedProduct, setFetchedProduct] = useState(product);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!product) {
        // Only fetch if product isn't already provided
        try {
          const response = await axios.get(
            `http://192.168.1.5:8089/api/products/products/${productId}`
          );
          setFetchedProduct(response.data);
        } catch (err) {
          console.error("Could not fetch product details");
        }
      }
    };

    fetchProductDetails();
  }, [product, productId]);

  useEffect(() => {
    const fetchShop = async () => {
      if (fetchedProduct) {
        try {
          const response = await axios.get(
            `http://192.168.1.5:8089/api/wishlist/shop-by-product/${fetchedProduct.name}`
          );
          setShop(response.data);
        } catch (err) {
          console.error("Could not fetch shop details");
        }
      }
    };

    fetchShop();
  }, [fetchedProduct]);

  if (!fetchedProduct) {
    return <Text>Loading...</Text>; // Simple loading state
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: fetchedProduct.imageUrl }}
        style={styles.productImage}
      />
      <Text style={styles.productCategory}>
        Category: {fetchedProduct.category}
      </Text>
      <Text style={styles.productName}>{fetchedProduct.name}</Text>
      <Text style={styles.productPrice}>
        LKR {fetchedProduct.price.toFixed(2)}
      </Text>
      <Text style={styles.productDescription}>
        {fetchedProduct.description}
      </Text>
      <TouchableOpacity
        onPress={() => toggleWishlist(fetchedProduct)}
        style={styles.wishlistButton}
      >
        <Icon
          name={isInWishlist ? "heart" : "heart-outline"}
          size={30}
          color={isInWishlist ? "red" : "gray"}
        />
      </TouchableOpacity>

      <View style={styles.shopContainer}>
        <Text style={styles.shopTitle}>Available at:</Text>
        {shop.map((Shop, index) => (
          <View key={index}>
            <Text style={styles.shopName}>{Shop.name}</Text>
            <Text style={styles.shopDescription}>{Shop.description}</Text>
            <Text style={styles.shopLocation}>Location: {Shop.location}</Text>
            <Text style={styles.shopLocation}>
              Contact Number: {Shop.contactInfo.phone}
            </Text>
            <Text style={styles.shopLocation}>
              Email: {Shop.contactInfo.email}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
    textAlign: "center",
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    marginBottom: 10,
  },
  productCategory: {
    fontSize: 16,
    color: "blue",
    marginBottom: 20,
  },
  wishlistButton: {
    marginTop: 20,
  },
  shopContainer: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  shopTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  shopName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  shopDescription: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
    textAlign: "center",
  },
  shopLocation: {
    fontSize: 14,
    color: "gray",
    marginBottom: 5,
  },
});
