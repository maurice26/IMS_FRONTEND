import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query {
    users {
      userId
      name
      email
      role
    }
  }
`;

export const GET_PRODUCTS = gql`
  query {
    products {
      productId
      name
      price
      stockQuantity
    }
  }
`;

export const GET_SALES = gql`
  query {
    sales {
      saleId
      productId
      quantity
      totalPrice
      saleDate
    }
  }
`;

export const GET_SUPPLIERS = gql`
  query {
    suppliers {
      supplierId
      name
      contactInfo
      createdAt
    }
  }
`;

export const GET_PURCHASES = gql`
  query {
    purchases {
      purchaseId
      purchaseDate
    }
  }
`;