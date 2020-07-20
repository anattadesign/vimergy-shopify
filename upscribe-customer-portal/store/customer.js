import request from '@scripts/axiosRequestWrapper.js'

export const state = () => ({
  customer: null,
  customerCards: null,
  customerStripe: null,
  customerShopify: null,
  customerStripeId: null,
  customerShopifyId: null,
  customerDefaultPaymentId: null,
  paymentCustomers: null,
})

export const mutations = {
  SET_CUSTOMER(state, payload) {
    state.customer = payload
    state.paymentCustomers = payload.payment_customers

    state.customerShopify = payload.shopify
    state.customerShopifyId = payload.shopify.id

    if (payload.payment_customer && payload.payment_customers.length) {
      state.customerDefaultPaymentId = payload.payment_customers[0].default_source
    }
  },
}

export const actions = {
  async GET_CUSTOMER({ rootState, commit }, payload) {
    const { storeDomain, customerId } = rootState.route

    return new Promise((resolve, reject) => {
      request({
        method: 'get',
        url: `/customer/${storeDomain}/${customerId}`,
      })
        .then((data) => {
          commit('SET_CUSTOMER', data)
          const payment_methods = data.payment_methods

          // set cards in cards store
          commit('cards/SET_CARDS', payment_methods, { root: true })

          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}
