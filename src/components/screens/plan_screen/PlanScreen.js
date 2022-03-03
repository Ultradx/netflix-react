import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  onSnapshot,
} from 'firebase/firestore'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../features/userSlice'
import db from '../../../firebase'
import './plan_screen.css'
import { loadStripe } from '@stripe/stripe-js'

function PlanScreen() {
  const [products, setProducts] = useState([])
  const user = useSelector(selectUser)
  const [subscription, setSubscription] = useState(null)

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

  useEffect(() => {
    async function fetchData() {
      // You can await here
      const querySnapshot = await getDocs(
        collection(db, 'customers', user.uid, 'subscriptions'),
      )
      querySnapshot.forEach((subscription) => {
        setSubscription({
          role: subscription.data().role,
          current_period_end: subscription.data().current_period_end.seconds,
          current_period_start: subscription.data().current_period_start
            .seconds,
        })
      })
    }
    fetchData()
  }, [user.id])

  useEffect(() => {
    async function fetchData() {
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
    }
    fetchData()
  }, [])

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

    const data = {
      price: priceId,
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    }
    let collectionRef = collection(
      db,
      'customers',
      user.uid,
      'checkout_sessions',
    )

    const docRef = await addDoc(collectionRef, data)

    onSnapshot(docRef, async (snap) => {
      const { error, sessionId } = snap.data()

      if (error) {
        // Show error to your customer and
        // inspect your Cloud Function logs in the Firebase console.
        alert(`An error occured: ${error.message}`)
      }

      if (sessionId) {
        // We have a session, let's redirect th Checkout
        // Init Stripe

        const stripe = await loadStripe(
          'pk_test_51KWmT1ALQR1nsXMfOpU6pcKUTIBVF5V3PrR5ILFBtdf03czXrA9BtGQJw9VWbhxCzDxyFlxQ3amP755TEWw1S7iv00u3wsokNs',
        )
        stripe.redirectToCheckout({ sessionId })
      }
    })

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
      {subscription && (
        <p>
          Renewal date:{' '}
          {new Date(
            subscription?.current_period_end * 1000,
          ).toLocaleDateString()}
        </p>
      )}
      {Object.entries(products).map(([productId, productData]) => {
        // add some login to check if the user's subscription is active...
        const isCurrentPackage = productData.name
          ?.toLowerCase()
          .includes(subscription?.role?.toLowerCase())

        return (
          <div
            key={productId}
            className={`${
              isCurrentPackage && 'plansScreen__plan--disable'
            } planScreen__plan`}
          >
            <div className="planScreen__info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>
            <button
              onClick={() =>
                !isCurrentPackage && loadCheckout(productData.prices.priceId)
              }
            >
              {isCurrentPackage ? 'Current Package' : 'Subscribe'}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default PlanScreen
