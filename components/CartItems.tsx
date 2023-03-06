import React from "react";
export default function CartItems({ cartItems, cartCount}) {
    
    console.log("Cart items", cartItems);
    return (
      <>
        <div>Cart Items</div>
        <div>{cartCount}</div>
      </>
    );
  }
  