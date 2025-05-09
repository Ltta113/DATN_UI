"use client";

import { Book } from "app/lib/books";
import React, { createContext, useState, useContext, ReactNode } from "react";

export interface OrderItem {
  id: number;
  orderable_type: string;
  orderable_id: number;
  name: string;
  image: string;
  quantity: number;
  price: string;
  books?: Book[];
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  order_items: OrderItem[];
  payment_method: string;
  order_code: string;
  created_at: string;
  updated_at: string;
}

interface OrderContextType {
  order: Order | null;
  setOrderData: (orderData: Order) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [order, setOrder] = useState<Order | null>(null);

  const setOrderData = (orderData: Order) => {
    setOrder(orderData);
  };

  return (
    <OrderContext.Provider value={{ order, setOrderData }}>
      {children}
    </OrderContext.Provider>
  );
};
