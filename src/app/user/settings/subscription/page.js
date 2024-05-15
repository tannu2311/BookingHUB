"use client"

import Popup from "@/app/components/popup/popup";
import styles from "@/style/setting.module.css";
import svg from "@/utils/svg";
import { useState, useEffect } from "react";
import { callAPI } from "@/utils/API";
import { useDispatch, useSelector } from 'react-redux';
import { Button, CircularProgress, Skeleton, Tooltip } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

import { updatePlanStatus } from "@/app/redux/authSlice";

function Subscription() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [loading, setLoading] = useState(true)
  const [planslist, setplanslist] = useState([]);
  const [userPlan, setuserPlan] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('');
  const [planData, setPlanData] = useState();
  const [stripePopUp, stripeShowPopUp] = useState(false);
  const [thankuPopUp, thankuShowPopUp] = useState(false);
  const [paypalPopUp, paypalShowPopUp] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paypalClientId, setpaypalClientId] = useState('');
  const [stripePromise, setstripePromise] = useState('');
  const [PaymentLoader, setPaymentLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [sessionId, setsessionId] = useState('');
  const [userCampaignCount, setuserCampaignCount] = useState(0);

  let user = useSelector((store) => store.storeData?.auth?.user);
  const dispatch = useDispatch();

  const fetchPlans = () => {
    setLoading(true);
    callAPI({
      method: 'GET',
      url: `/admin/plan`,
    }, (resp) => {
      setLoading(false);;
      (resp.planlist) && setplanslist(resp.planlist);
      setuserPlan(resp.userplan);
      if (resp.userplanMethod) setPaymentMethod(resp.userplanMethod)
      if (resp.userplan?.planname) {
        dispatch(updatePlanStatus({ status: resp.userplan?.isSubscribed, campCount: resp.userplan?.isSubscribed ? resp.userplan?.noOfCampaigns : 0 }));
      }
    })
  }

  const fetchCampaign = () => {
    setLoading(true)

    callAPI({
      method: 'GET',
      url: `/user/campaign`,
    }, (resp) => {
      if (resp.status == 1) {
        setuserCampaignCount(resp.userCampaignCount)
      }
    })
  }

  useEffect(() => {
    fetchPlans();
    fetchCampaign();

    callAPI({
      method: 'PUT',
      url: `/user/checkout`,
    }, (resp) => {
      if (resp.clientId) {
        setpaypalClientId(resp.clientId);
      }
      if (resp.publickey) {
        let stripePromise = loadStripe(resp.publickey);
        setstripePromise(stripePromise);
      }
    });

  }, []);


  const stripeCheckout = (data) => {
    setBtnLoader({ show: true, id: data._id });
    setPaymentLoader(true);
  
    setPlanData(data);
    setClientSecret('');
    callAPI({
      method: 'POST',
      url: `/user/checkout`,
      data: {
        email: user.email,
        userId: user.id,
        isSubscribed: userPlan ? userPlan?.isSubscribed : false,
        plandetail: data,
        isCurrentPlan: userPlan?.planname === data.planname,
        stripeCustomerId: userPlan ? userPlan.stripeCustomerId : false,
        stripePriceId: data.stripe.planId,
      }
    }, (resp) => {
      if (resp) {
     
        setBtnLoader(false);
        if (resp.clientSecret) {
          stripeShowPopUp(true);
          setClientSecret(resp.clientSecret);
          setsessionId(resp.sessionId);
          setPaymentLoader(false);
         
        }
        else if (resp.url) {
          window.location.href = resp.url ?? "/user/settings";
        }

      }
    })

  }

  const PaypalButtonWrap = () => {
    const [{ isPending }] = usePayPalScriptReducer();

    return (
      <>
        <PayPalButtons
          style={{ "layout": "vertical" }}
          disabled={false}
          forceReRender={[{ "layout": "vertical" }]}
          fundingSource={undefined}
          vault={true}
          onApprove={paypalOnApprove}
          onCancel={(data, actions) => {
          }}
          createSubscription={(data, actions) => {
            return actions.subscription.create({
              'plan_id': planData.paypal.planId,
            })
              .then((orderId) => {

                return orderId;
              });
          }}
        />
      </>
    );
  }

  const paypalCheckout = (data) => {
    setBtnLoader(true);

    setPlanData(data);
    paypalShowPopUp(true);

  }

  const paypalOnApprove = async (data, actions) => {
    callAPI({
      method: 'PATCH',
      url: '/user/checkout',
      data: {
        planId: planData.paypal.planId,
        subscriptionId: data.subscriptionID,
      },
      isLoader: true
    }, (resp) => {
      setShowPopUp(false);
      thankuShowPopUp(true);
      paypalShowPopUp(false)
    })
  }

  const handleStripePayment = (id) => {
    callAPI({
      method: 'PUT',
      url: '/paymentControl',
      data: id
    }, (resp) => {
      setShowPopUp(false);
      stripeShowPopUp(false)
    })

  }

  const customizeDateFormate = (date) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return formattedDate
  }

  return (
    <>
      <div className={styles.plan_outer}>
        <div className="center_content">

          {loading ? <Skeleton variant="rounded" width={960} height={160} /> : (userPlan?.isSubscribed || userPlan?.planname || userPlan?.isadmincreated) ?
            <div className={styles.subscription_wrapper}>
              <div className={styles.plan_detail}>
                <h3>{(userPlan.planname).charAt(0).toUpperCase() + (userPlan.planname).slice(1)}</h3>
                <h2>
                  ${userPlan.price} <span>/{userPlan.paymentPeriod}</span>
                </h2>
              </div>

              <div className={styles.plan_feature_wrap}>
                <div className={styles.planlist}>
                  <span>{svg.plan_tick_svg}</span> No of campaigns : {userPlan.noOfCampaigns ? userPlan.noOfCampaigns : 0}
                </div>
                {(!userPlan?.isadmincreated) ?
                  <> <div className={styles.planlist}>
                    <span>{svg.plan_tick_svg}</span> Free trial : {(userPlan.freeTrialPeriod) ? userPlan.freeTrialPeriod : 0} days
                  </div>
                    <div className={styles.planlist}>
                      {
                        userPlan?.currentPeriodEnd ?
                          <>
                            <span >{svg.plan_tick_svg}</span>
                            {userPlan.isCanceled
                              ? `Your plan will be canceled on ${customizeDateFormate(userPlan.currentPeriodEnd)}`
                              : `Your plan renews on ${customizeDateFormate(userPlan.currentPeriodEnd)}`}
                          </>
                          : null
                      }

                    </div> </> : null}
              </div>
              <div>
                {
                  userPlan?.isSubscribed ? <div className={styles.active_ribbon}><span>Active</span></div> : <div className={styles.in_active_ribbon}><span>Inactive</span></div>
                }

                {(userPlan?.isadmincreated && userPlan?.isPaymentRequired) ?
                  <button
                    type="button"
                    className="ap_btn"
                    onClick={() => {
                      if (userPlan?.paypal && userPlan?.stripe) {
                        setShowPopUp(true); setPlanData(userPlan)
                      } else {
                        (userPlan?.paypal) ? paypalCheckout(userPlan) : (userPlan?.stripe) ? stripeCheckout(userPlan) : null;
                      }
                    }}
                  > Subscribe
                  </button>
                  :
                  null
                }

                {(paymentMethod && paymentMethod == 'stripe') ?
                  <button
                    type="button"
                    className="ap_btn"
                    onClick={() => { stripeCheckout(userPlan) }}
                  > Manage Subscription {(btnLoader.show && (btnLoader.id == userPlan._id)) ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : ''}

                  </button>
                  :
                  null
                }
              </div>
            </div>
            :
            <p>Choose any one plan to access fetaures.</p>
          }
        </div>
      </div>

      <div className="center_content"><h1>Avaliable Plans</h1></div>
      <div className={styles.ava_plan_list}>

        {
          loading ? <> <Skeleton variant="rounded" width={300} height={360} sx={{ marginRight: 0.5 }} />
            <Skeleton variant="rounded" width={300} height={360} sx={{ marginRight: 0.5 }} />
            <Skeleton variant="rounded" width={300} height={360} sx={{ marginRight: 0.5 }} />
          </>
            :
            (planslist.length == 0) ? null : planslist.map((row, i) => (
              <div className={`${styles.ava_plans_wrap}  ${row?.isRecommended && styles.ava_color_plans_wrap}`} key={i}>
                {row?.isRecommended && <span className={styles.ribbon}><span> Recommended</span></span>}

                <div className={`${styles.ava_plan_detail} ${row?.isRecommended && styles.plan_detail}`}>
                  <h3>{(row.planname).charAt(0).toUpperCase() + (row.planname).slice(1)}</h3>
                  <h2>
                    ${row.price} <span>/{row.paymentPeriod}</span>
                  </h2>
                </div>
                <div className={styles.av_plan_feature_wrap}>

                  <div className={styles.planlist}>
                    <span className={styles.feat_svg}>{row?.isRecommended ? svg.plan_tick_white : svg.plan_tick_svg}</span><span className={styles.feature_head}>No of campaigns :</span>  {row.noOfCampaigns ? row.noOfCampaigns : 0}
                  </div>
                  <div className={styles.planlist}>
                    <span className={styles.feat_svg}>{row?.isRecommended ? svg.plan_tick_white : svg.plan_tick_svg}</span><span className={styles.feature_head}>Free trial : </span> {row.freeTrialPeriod ? row.freeTrialPeriod : 0} days
                  </div>
                </div>
                <div>
                <Tooltip title={(userCampaignCount <= row.noOfCampaigns) ? '' : "You have exceeded the campaign limit for this plan."} placement="top" arrow>
                  <button type="button" disabled={(userCampaignCount <= row.noOfCampaigns)? false : true} className={`ap_btn mt ${(userCampaignCount <= row.noOfCampaigns) ? '' : 'not_allow'}` }onClick={() => {
                      if (row?.paypal && row?.stripe) {
                        setShowPopUp(true); setPlanData(row)
                      } else {
                        (row?.paypal) ? paypalCheckout(row) : (row?.stripe) ? stripeCheckout(row) : null;
                      }
                  }}>
                    Subscribe {(btnLoader.show && (btnLoader.id == row._id)) ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : ''}
                  </button>
                 </Tooltip>
                </div>
              </div>
            ))}
        {!loading && (planslist.length == 0) ? (
          <div className='datatable_wrap' style={{ width: '100%', maxWidth: '962px' }}>
            <div className='empty_box'><span>{svg.empty_record}</span>
              <p className='empty_p'>No plans available.</p>
            </div>
          </div>
        ) : ''}

      </div>


      <Popup show={showPopUp} onClose={() => setShowPopUp(false)} maxWidth={'500px'} heading={`Payment Methods`}>
        <div className={styles.payment_method_wrap}>
          {(planData?.paypal) && (Object.keys(planData?.paypal).length > 0) && <Button className={styles.payment_paypal} onClick={() => paypalCheckout(planData)}><span className={styles.pay_check_box1}> </span>{svg.paymentt}</Button>
          }
          {(planData?.stripe) && (Object.keys(planData?.stripe).length > 0) && <Button className={styles.payment_stripe} onClick={() => stripeCheckout(planData)}><span className={styles.pay_check_box2}></span>{svg.stripe}</Button>
          }
        </div>
      </Popup>

      <Popup show={stripePopUp} onClose={() => stripeShowPopUp(false)} maxWidth={'500px'}>
        <div>
          {showPopUp && <div className='mb' style={{ cursor: 'pointer' }} onClick={() => { setShowPopUp(true); stripeShowPopUp(false) }}>{svg.back_arrow}</div>}
          <div id="checkout">
            {PaymentLoader ? <Skeleton variant="rounded" width={430} height={160} /> : clientSecret && (
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{
                  clientSecret,
                  onComplete: async () => {
                    handleStripePayment(sessionId);
                  }
                }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            )}
          </div>
        </div>
      </Popup>

      <Popup show={paypalPopUp} onClose={() => paypalShowPopUp(false)} maxWidth={'500px'}>
        <div >

          {PaymentLoader ? <Skeleton variant="rounded" width={430} height={160} /> : paypalClientId && (
            <div className="mt">
              {showPopUp && <div className='mb' style={{ cursor: 'pointer' }} onClick={() => { setShowPopUp(true); paypalShowPopUp(false) }}>{svg.back_arrow}</div>}
              <PayPalScriptProvider options={{ clientId: paypalClientId, components: "buttons", currency: "USD", vault: true }}>
                <PaypalButtonWrap />
              </PayPalScriptProvider>
            </div>
          )}
        </div>
      </Popup>

      <Popup show={thankuPopUp} onClose={() => thankuShowPopUp(false)} maxWidth={'500px'}>
        <div className={styles.thanku_wrap}>
          <img src='/auth/check.gif' />
          <h3>Thanks for subscribing</h3>
          <p>You subscribed successfully.</p>
        </div>
      </Popup>

    </>
  );
}

export default Subscription;
