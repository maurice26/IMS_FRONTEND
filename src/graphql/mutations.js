import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation ($input: CreateUserInput!) {
    createUser(input: $input) {
      userId
      email
      role
    }
  }
`;

export const LOGIN_USER = gql`
  mutation ($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        userId
        email
        role
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation ($input: DeleteUserInput!) {
    deleteUser(input: $input)
  }
`;

export const UPDATE_USER = gql`
  mutation ($input: UpdateUserInput!) {
    updateUser(input: $input) {
      userId
      name
      role
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation ($input: CreateProductInput!) {
    createProduct(input: $input) {
      productId
      name
      price
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation ($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      productId
      name
      price
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation ($productId: Int!) {
    deleteProduct(productId: $productId)
  }
`;

export const CREATE_SALE = gql`
  mutation ($input: SaleInput!) {
    createSale(input: $input) {
      saleId
      totalPrice
    }
  }
`;

export const ADD_PAYMENT = gql`
  mutation ($saleId: Int!, $amount: Decimal!, $method: String!) {
    addPayment(saleId: $saleId, amount: $amount, method: $method) {
      paymentId
    }
  }
`;

export const CREATE_SUPPLIER = gql`
  mutation ($input: SupplierInput!) {
    createSupplier(input: $input) {
      supplierId
      name
      contactInfo
      createdAt
    }
  }
`;

export const CREATE_PURCHASE = gql`
  mutation ($input: PurchaseInput!) {
    createPurchase(input: $input) {
      purchaseId
    }
  }
`;