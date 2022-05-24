import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  const [products, setProducts] = React.useState([]);
  const [searchname, setSearchname] = React.useState("");
  const [timer, setTimer] = React.useState(0);
  const [isLoading, setLoadingState] = useState(false);
  let url = `${config.endpoint}/products`;
  const { enqueueSnackbar } = useSnackbar();
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    let message = "";
    setLoadingState(true);
    try {
         const response = await axios.get(url);
      setLoadingState(false);
      //console.log(response.data);
      setProducts(response.data);
    } catch (error) {
      setLoadingState(false);
      if (error.response && error.response.status === 400) {
        console.log(error.response);
        message = error.response.data.message;
        enqueueSnackbar(message, {
          variant: "error",
        });
      } else {
        console.log(error);
        message =
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.";
        enqueueSnackbar(message, {
          variant: "error",
        });
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    let message = "";
    setLoadingState(true);
    try {

      url = `${config.endpoint}/products/search?value=${text}`;
      //}
      const response = await axios.get(url);
      setLoadingState(false);
      //console.log(response.data);
      setProducts(response.data);
    } catch (error) {
   
      setLoadingState(false);
     
      if (error.response && error.response.status === 404) {
        setProducts([]);
      } else {
        console.log(error);
        message =
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.";
        enqueueSnackbar(message, {
          variant: "error",
        });
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => performSearch(event.target.value), 500);
    setTimer(newTimeout);
 setSearchname(event.target.value);
  };


  React.useEffect(() => {
     (async () => {
      await performAPICall();
    })();

  }, []);

  return (
    <div>
      <Header
        searchname={searchname}
        handleSearchChange={debounceSearch}
        timer={timer}
        children
        hasHiddenAuthButtons
      >
               
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        value={searchname}
        onChange={(e) => {
          debounceSearch(e, timer);
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container spacing={2}>
        <Grid item className="product-grid">
          <Grid container spacing={2} className="product-card-container-grid">
            <Grid item xs={12}>
              <Box className="hero">
                <p className="hero-heading">
                  India’s{" "}
                  <span className="hero-highlight">FASTEST DELIVERY</span> to
                  your door step
                </p>
              </Box>
            </Grid>

            {isLoading ? (
              <Grid item xs={12}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    p={2}
                  >
                    <CircularProgress size={25} color="primary" />
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    Loading Products...
                  </Box>
                </Box>
              </Grid>
            ) : products.length === 0 ? (
              <Grid item xs={12}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    p={2}
                  >
                    <SentimentDissatisfied />
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    No products found
                  </Box>
                </Box>
              </Grid>
            ) : (
              products.map((product) => (
                <Grid key={product._id} item xs={6} md={3}>
                  <ProductCard
                    product={{
                      name: product.name,
                      category: product.category,
                      cost: product.cost,
                      rating: product.rating,
                      image: product.image,
                      _id: product._id,
                    }}
                    handleAddToCart={() => {}}
                  />
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Footer />
        </Grid>
      </Grid>
    </div>
  );
};

export default Products;