import React from "react";
import "./ShoppingCart.css";
import "../../../utils/API.js";
import "../../../materialize.css";

/*FILE DESCRIPTION
This file contains the Shopping Cart module.
Shopping cart will be the top section of the Checkout page.

Shopping Cart will receive the list of item ids and quantities selected from the Storefront/Checkout as a prop.
    e.g. <ShoppingCart items={ordered:[
        {id: 12345, quantity: 1},
        {id: 75234, quantity: 5},
        {id: 99876, quantity: 3},
        {id: 22333, quantity: 2},
        {id: 08087, quantity: 2}
    ]} />

Features:
    1) get item details by id from database & display each SnackItem
        a. allow user to remove item from cart
        b. allow user to update quantity

    2) calculate
        a. item total cost (quantity * unit price)- DONE, stores in state
        b. subtotal of all cart items
        c. final order total (adding tax, no delivery fee)

    3) store in state (for now)
        a. array of items in cart, including: id, name, quantity
        b. order subtotal
        c. final order total

TODO- once this module is complete, modify so Checkout page will manage the state of the order (lift cart's state up)

TODO- research sessions so cart data persists

*/


//SnackItem 
//single line entry component
class SnackItem extends React.Component {

    render() {
      return (
        <tr className="SnackItem row">
            <td className="col s5">
                <div className="row">
                    <div className="col" width="auto">
                        <img className="responsive-img" src={"./assets/images/" + this.props.image} alt={this.props.name} />
                    </div>

                    <div className="col">
                        {this.props.name}
                    </div>
                </div>
                
                
            </td>
            <td className="col s2">
                <input type="number" name="itemCount" value={this.props.quantity} />
            </td>
            <td className="col s2"> 
                ${this.props.unitPrice.toFixed(2)}
            </td>
            <td className="col s2 bold"> 
                ${this.props.calcPrice.toFixed(2)}
                {/* toFixed forces display as string with 2 decimal places, ensuring the $0.00 format */}
            </td>
            <td className="col s1">
                {/* TODO- make this button remove the entry from display and from state */}
                <button>X</button>
            </td>
        </tr>
      );
    }
  }
//END SnackItem 


//Shopping Cart
//assembled component, contains multiple line entries, imports array of selected items as state
class ShoppingCart extends React.Component {
    

    //constructor builds state, state includes list of selected items from database
    constructor(props) {
        super(props);
        const TAX = 0.10; //constant value TAX holds tax for use in later calculations
        //TODO- look up sales tax for Virginia to enter here, using 10% for development

        this.state = {
            cartItems:[
                {   
                    id: 9,
                    name: "Chocolate Strawberries",
                    image: "choc.jpg",
                    quantity: 2,
                    unitPrice: 2.50,
                    calcPrice: null
                },
                {
                    id: 9,
                    name: "Chocolate Strawberries",
                    image: "choc.jpg",
                    quantity: 3,
                    unitPrice: 4.00,
                    calcPrice: null
                },
                {
                    id: 9,
                    name: "Chocolate Strawberries",
                    image: "choc.jpg",
                    quantity: 1,
                    unitPrice: 3.25,
                    calcPrice: null
                },
                {
                    id: 9,
                    name: "Chocolate Strawberries",
                    image: "choc.jpg",
                    quantity: 5,
                    unitPrice: 4.50,
                    calcPrice: null
                }
            
            ],
            //calculated cart subtotal and total after tax, both initialized as 0
            subtotalPrice: 0,
            finalTotalPrice: 0
        }

        //calcPriceHandler helper function - gives quantity * price result for each line 
        const calcPriceHandler = (localPrice, localQuant) => {
            let localTotalPrice;
            // convert decimals to integers (*100) to avoid imprecise float calculations
            localPrice = localPrice * 100;
            // multiply unit price by quantity
            localTotalPrice = localPrice * localQuant;
            // convert back to decimals (/100)
            localTotalPrice = localTotalPrice / 100;
            return localTotalPrice;
        }
        //END calcPriceHandler helper function


        // LINE PRICE (calcPrice) calculation
        //calculate and store total price (calcPrice) for each item in state
        for (let i = 0; i < this.state.cartItems.length; i++) {
            const item = this.state.cartItems[i];
            item.calcPrice = calcPriceHandler(item.unitPrice, item.quantity);
        }
        // END LINE PRICE (calcPrice) calculation


        // SUBTOTAL Calculation
        let newSubTotal = this.state.cartItems.reduce(
            function (accumulator, item) {
                // convert decimals to integers (*100) to avoid imprecise float calculations
                let localPrice = item.calcPrice * 100;
                // add to accumulator
                let localTotalPrice = accumulator + localPrice;

                return localTotalPrice;
            }, 0);
            // console.log("newSubTotal: " + newSubTotal);

        this.state.subtotalPrice = newSubTotal / 100; //convert total back to decimals by dividing again by 100 before updating state value

            // console.log("new subtotal state value: " + this.state.subtotalPrice);
        // END SUBTOTAL Calculation


        //TOTAL ORDER PRICE Calculation
        // this.state.finalTotalPrice = subtotalPrice + (tax * subtotalprice)
        // let newFinalTotal = this.state.subtotalPrice + (TAX * )      
        

        // END TOTAL ORDER PRICE Calculation

    }

    // RENDER LINE ITEM
    // function to render the listing for each snack being ordered
    renderItem = (i) => {

        return <SnackItem 
        name={this.state.cartItems[i].name}
        image={this.state.cartItems[i].image} 
        quantity={this.state.cartItems[i].quantity}
        unitPrice={this.state.cartItems[i].unitPrice} 
        calcPrice={this.state.cartItems[i].calcPrice} 
        id={this.state.cartItems[i].id} key={i}
        />;
    }
    // END RENDER LINE ITEM


    // MAIN ShoppingCart RENDER SECTION
    render() {
        return (
    
            <div className="ShoppingCart">
                <h3 className="page-header">Your Order:</h3>
                <table className="highlight">
                    <tr className="row">
                        <th className="col s5 cart-header">
                            Snack
                        </th>
                        <th className="col s2 cart-header">
                            Quantity
                        </th>
                        <th className="col s2 cart-header">
                            x Price for Each =
                        </th>
                        <th className="col s2 cart-header">
                            Total
                        </th>
                        <th className="col s1 cart-header">
                            {/* blank because above cart remove button column */}
                        </th>
                    </tr>
                    <tbody>
                        {/* Each row will be a "dumb component" item listing, receiving props from ShoppingCart */}
                        {/* <SnackItem quantity={this.state.cartItems[0].quantity} 
                        unitPrice={this.state.cartItems[0].unitPrice} 
                        calcPrice={this.calcPriceHandler(this.state.cartItems[0].unitPrice)} /> */}
                        {this.renderItem(0)}
                        {this.renderItem(1)}
                        {this.renderItem(2)}
                        {this.renderItem(3)}

                        {/* <SnackItem quantity={this.state.cartItems[1].quantity} unitPrice={this.state.cartItems[1].unitPrice} /> */}
                        {/* <SnackItem quantity={this.state.cartItems[2].quantity} unitPrice={this.state.cartItems[2].unitPrice} /> */}
                        {/* <SnackItem quantity={this.state.cartItems[3].quantity} unitPrice={this.state.cartItems[3].unitPrice} /> */}
                    </tbody>

                </table>
            </div>
        );
    }
    // END MAIN ShoppingCart RENDER SECTION

}

export default ShoppingCart;