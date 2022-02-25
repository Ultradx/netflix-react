import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  addDoc,
} from 'firebase/firestore/lite'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../features/userSlice'
import db from '../../../firebase'
import './plan_screen.css'
import { loadStripe } from '@stripe/stripe-js'

function PlanScreen() {
  const [products, setProducts] = useState([])
  const user = useSelector(selectUser)

  // useEffect(() => {
  //   db.collection('products')
  //     .where('active', '==', true)
  //     .get()
  //     .then((querySnapshot) => {
  //       const products = {}
  //       querySnapshot.forEach(async (productDoc) => {
  //         products[productDoc.id] = productDoc.data()
  //         const priceSnap = await productDoc.ref.collection('prices').get()
  //         priceSnap.docs.forEach((price) => {
  //           products[productDoc.id].prices = {
  //             priceId: price.id,
  //             priceDate: price.data(),
  //           }
  //         })
  //       })
  //       setProducts(products)
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  // }, [])

  useEffect(async () => {
    const q = query(collection(db, 'products'), where('active', '==', true))
    const querySnapshot = await getDocs(q)
    const products = {}
    querySnapshot.forEach(async (productDoc) => {
      products[productDoc.id] = productDoc.data()
      const priceSnap = await getDocs(collection(productDoc.ref, 'prices'))
      priceSnap.docs.forEach((price) => {
        products[productDoc.id].prices = {
          priceId: price.id,
          priceDate: price.data(),
        }
      })
    })
    setProducts(products)
  }, [])

  console.log(products)

  const loadCheckout = async (priceId) => {
    // const docRef = await db
    //   .collection('customers')
    //   .doc(user.uid)
    //   .collection('checkout_sessions')
    //   .add({
    //     price: priceId,
    //     success_url: window.location.origin,
    //     cancel_url: window.location.origin,
    //   })

    const docRef = doc(db, 'customers', user.uid)

    const test = doc(docRef, "checkout_sessions");

    const data = {
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
    }

    await addDoc(test, data)

    console.log(docRef)

    // docRef.onSnapshot(async (snap) => {
    //   const { error, sessionId } = snap.data()

    //   if (error) {
    //     // Show error to your customer and
    //     // inspect your Cloud Function logs in the Firebase console.
    //     alert(`An error occured: ${error.message}`)
    //   }

    //   if (sessionId) {
    //     // We have a session, let's redirect th Checkout
    //     // Init Stripe

    //     const stripe = await loadStripe(
    //       'pk_test_51KWmT1ALQR1nsXMfOpU6pcKUTIBVF5V3PrR5ILFBtdf03czXrA9BtGQJw9VWbhxCzDxyFlxQ3amP755TEWw1S7iv00u3wsokNs',
    //     )
    //     stripe.redirectToCheckout({ sessionId })
    //   }
    // })
  }

  return (
    <div className="planScreen">
      {Object.entries(products).map(([productId, productData]) => {
        // add some login to check if the user's subscription is active...
        return (
          <div key={productId} className="planScreen__plan">
            <div className="planScreen__info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>
            <button onClick={() => loadCheckout(productData.prices.priceId)}>
              Subscribe
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default PlanScreen
