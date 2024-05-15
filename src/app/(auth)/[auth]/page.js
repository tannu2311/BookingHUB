"use client"
import { useEffect, useState } from 'react'
import styles from '@/style/auth.module.css'
import svg from '@/utils/svg'
import { Form } from '@/utils/formValidator'
import { useForm } from "react-hook-form";
import Link from 'next/link'
import { callAPI } from '@/utils/API';
import { signIn } from "next-auth/react";
import { toast } from 'react-toastify';
import { Button, CircularProgress, Skeleton } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { notFound } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { logoutRemoveUser } from '@/app/redux/authSlice'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

function Auth({ params }) {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
    const [btnLoader, setBtnLoader] = useState(false);
    const [tokenVerify, settokenVerify] = useState(false);
    const [isRememberMe, setIsRememberMe] = useState(false);
    const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [paypalClientId, setpaypalClientId] = useState('');
    const [stripePromise, setstripePromise] = useState('');
    const [planData, setPlanData] = useState({});
    const [sessionId, setsessionId] = useState('');
    const [isComefromhome, setiscomefromhome] = useState(false);

    const [payBtnLoader, setPayBtnLoader] = useState(false);

    const [PaymentLoader, setPaymentLoader] = useState(false);
    const [payHelper, setPayHelper] = useState('both');
    const [user, setUser] = useState({});

    const loaderColor = "#fff"

    const { push } = useRouter();
    let authType = params.auth;
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const dispatch = useDispatch();

    useEffect(() => {
        if (authType && !['registration', 'reset-password', 'forgot-password', 'login', 'paymentCheckout'].includes(authType)) {
            return notFound()
        }
        dispatch(logoutRemoveUser());

    }, []);

    useEffect(() => {
        if(authType === 'registration' || authType === 'paymentCheckout')
        {
            let planId = localStorage.getItem('bookinghub_planId');
            if (planId) {
                setiscomefromhome(true);
            }
        }
        else{
            let planId = localStorage.getItem('bookinghub_planId');
            let user = localStorage.getItem('user');
            if (planId) {
                localStorage.removeItem('bookinghub_planId');
            }
            if (user) {
                localStorage.removeItem('user');
            }
        }
    }, [])


    useEffect(() => {
        if (authType == 'reset-password') {
            (async () => {
                await callAPI({
                    method: 'POST',
                    url: '/resetpassword',
                    data: token,
                    loading: true
                }, (resp) => {
                    setBtnLoader(false)
                    if (resp.status == 1) {
                        settokenVerify(true)
                    }
                    else {
                        settokenVerify(false)
                    }
                });
            })();
        }
    }, [authType == 'reset-password'])

    useEffect(() => {
        if (authType == 'paymentCheckout') {
            setPayBtnLoader(true);
            let planId = localStorage.getItem('bookinghub_planId');
            let getuser = localStorage.getItem('user');
            let userdetail = JSON.parse(getuser);

            if (planId && userdetail) {
                setUser(userdetail);

                callAPI({
                    method: 'PUT',
                    url: `/user/checkout?planId=${planId}`,
                }, (resp) => {
                    setPayBtnLoader(false);

                    if (resp.plandetail) {
                        setPlanData(resp.plandetail);
                        if (!(resp.plandetail?.paypal && resp.plandetail?.stripe)) {
                            if (resp.plandetail?.paypal) {
                                setPayHelper('paypal');
                            } else if (resp.plandetail?.stripe) {
                                setPayHelper('stripe');
                                stripeCheckout(resp.plandetail)
                            }
                        }
                    }
                    if (resp.clientId) {
                        setpaypalClientId(resp.clientId);
                    }
                    if (resp.publickey) {
                        let stripePromise = loadStripe(resp.publickey);
                        setstripePromise(stripePromise);
                    }
                });
            }
        }
    }, [authType == 'paymentCheckout'])

    const onSubmit = async (updatedvalues, e) => {
        e.preventDefault()
        setBtnLoader(true)
        if (authType == 'login') {
            if (isRememberMe) {
                const data = {
                    "email": updatedvalues.email,
                }
                Cookies.set('remember_me', JSON.stringify(data));
            } else {
                Cookies.remove('remember_me');
            }


            const res = await signIn('credentials', {
                redirect: false,
                email: updatedvalues.email,
                password: updatedvalues.password,
                callbackUrl: `${window.location.origin}`,
            });


            if (res.ok) {

                let planId = localStorage.getItem('bookinghub_planId');
                let user = localStorage.getItem('user');

                if (planId) {
                    localStorage.removeItem('bookinghub_planId');
                }
                if (user) {
                    localStorage.removeItem('user');
                }
                setBtnLoader(false)
                toast.success("Login Successfully!", { theme: "colored" })
                push('/admin/dashboard');

            } else {
                setBtnLoader(false)
                toast.error(res.error, { theme: "colored" })
            }

        } else if (authType == 'registration') {

            let planId = localStorage.getItem('bookinghub_planId');
            if(planId)
            {
                await callAPI({
                    method: 'POST',
                    url: `auth/register?planId=${planId}`,
                    data: updatedvalues,
                    loading: true
                }, async (resp) => {
                    setBtnLoader(false)
                    if (resp.status == 1) {
                        if (planId) {
                            localStorage.setItem('user', JSON.stringify(resp.user));
                            push('/paymentCheckout');
                        }
                        else {
                            push('/login');
                        }
                    }
                });
            }
            else{
                await callAPI({
                    method: 'POST',
                    url: 'auth/register',
                    data: updatedvalues,
                    loading: true
                }, async (resp) => {
                    setBtnLoader(false)
                    if (resp.status == 1) {
                        push('/login');
                    }
                });
            }

        }
        else if (authType == 'forgot-password') {

            await callAPI({
                method: 'GET',
                url: `/resetpassword?email=${updatedvalues.email}`,
                data: updatedvalues,
                loading: true
            }, (resp) => {
                setBtnLoader(false)
                if (resp.status == 1) {
                    push('/login');
                }
            });
        }
        else if (authType == 'reset-password') {
            let password = updatedvalues.password

            await callAPI({
                method: 'PUT',
                url: `/resetpassword`,
                data: { password, token },
                loading: true
            }, (resp) => {
                setBtnLoader(false)
                if (resp.status == 1) {
                    setPasswordResetSuccess(true)
                }
            });

        }
    }
    /* remember me start */
    useEffect(() => {
        if (authType === 'login') {
            if (Cookies.get('remember_me')) {
                const rememberMeData = JSON.parse(Cookies.get('remember_me'));
                if (rememberMeData.email) {
                    setIsRememberMe(true);
                    reset({
                        email: rememberMeData.email,
                    })
                }
            }
        } else {
            reset({})
        }
    }, [authType]);
    /* remember me end */

    /*payment checkout */

    const stripeCheckout = (data) => {
setiscomefromhome
        let getuser = localStorage.getItem('user');
        let userdetail = JSON.parse(getuser);
        setUser(userdetail)
        setBtnLoader({ show: true, id: data._id });
        setPaymentLoader(true);

        setClientSecret('');
        callAPI({
            method: 'POST',
            url: `/user/checkout`,
            data: {
                email: userdetail.email,
                userId: userdetail.id,
                isSubscribed: false,
                plandetail: data,
                isCurrentPlan: false,
                stripeCustomerId: false,
                stripePriceId: data.stripe.planId,
            }
        }, (resp) => {
            if (resp) {
                setBtnLoader(false);
                if (resp.clientSecret) {
                    setClientSecret(resp.clientSecret);
                    setsessionId(resp.sessionId);
                    setPaymentLoader(false);
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


    const paypalOnApprove = async (data, actions) => {
        callAPI({
            method: 'PATCH',
            url: '/user/checkout',
            data: {
                planId: planData.paypal.planId,
                subscriptionId: data.subscriptionID,
                user: user
            },
            isLoader: true
        }, (resp) => {
            setPayHelper('thanku');
            let planId = localStorage.getItem('bookinghub_planId');
            let user = localStorage.getItem('user');

            if (planId) {
                localStorage.removeItem('bookinghub_planId');
            }
            if (user) {
                localStorage.removeItem('user');
            }
        })
    }

    const handleStripePayment = (id) => {
        callAPI({
            method: 'PUT',
            url: '/paymentControl',
            data: id
        }, (resp) => {
            setPayHelper('thanku');
            let planId = localStorage.getItem('bookinghub_planId');
            let user = localStorage.getItem('user');

            if (planId) {
                localStorage.removeItem('bookinghub_planId');
            }
            if (user) {
                localStorage.removeItem('user');
            }
        })
    }

    return (
        <>
            <div className={styles.auth_bg}>

            {authType != 'paymentCheckout' ?
                            <div className={styles.log_img}>
                                <div className={styles.vedio_box}><img src='/auth/logimg.png' className={styles.img_main}></img></div>
                                <img src='/auth/Ticket_iocn.png' className={styles.sm_img} ></img>
                                <img src='/auth/Event.png' className={styles.sm_img1} ></img>
                                <img src='/auth/Hotel.png' className={styles.sm_img2} ></img>
                                <img src='/auth/Travel_bg.png' className={styles.sm_img3} ></img>
                            </div> : null}
                <div className={styles.auth_wrapper_main}>
                    
                    <div className={styles.auth_wrapper}>

                        <div className={`${styles.auth_card_body} rtl_auth_card`}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div><img src={process.env.LOGO_IMG} alt='logo' /></div>
                                {
                                    authType == 'registration' ?
                                        <>
                                            <h3 className='pt-65'>Hello !  Welcome </h3>
                                            <p>Please Signup To Create Your Account.</p>

                                            <div className='input_wrapper_list'>
                                                <Form fieldname='firstname' label='First Name' inputType='text' register={register} errors={errors} applyValidation={true} isRequired={true} />
                                                <Form fieldname='lastname' label='Last Name' inputType='text' register={register} errors={errors} applyValidation={true} isRequired={true} />
                                            </div>
                                            <Form fieldname='email' label='Email' inputType='email' register={register} errors={errors} isDisable={false} isRequired={true} />
                                            <div className='input_wrapper_list'>
                                                <Form inputType={'password'} fieldname={'password'} label={'Password'} register={register} errors={errors} isRequired={true} applyValidation={true} />
                                                <Form inputType={'password'} fieldname={'confirm_password'} label={'Confirm Password'} register={register} errors={errors} watch={watch} isRequired={true} applyValidation={true} />
                                            </div>

                                            <br />
                                            <button type="submit" disabled={btnLoader} className="ap_btn ap_btn_full">{isComefromhome ? 'Make Payment' : 'Sign Up'}
                                                {btnLoader ? <CircularProgress size={24} sx={{ color: loaderColor }} /> : ''}
                                            </button>
                                            <div className={styles.auth_footer}>Already have an account? <Link href="/login"> Login!</Link></div>
                                        </>

                                        : (authType == 'forgot-password' ?
                                            <>
                                                <h3 className='pt-65'>Forgot Password</h3>
                                                <p>Don't Worry! It Happens. Please Enter the Address
                                                    Associated With Your Account</p>

                                                <Form fieldname='email' label='Email' inputType='email' register={register} errors={errors} isDisable={false} isRequired={true} />

                                                <br />
                                                <button type="submit" disabled={btnLoader} className="ap_btn ap_btn_full">Submit
                                                    {btnLoader ? <CircularProgress size={24} sx={{ color: loaderColor }} /> : ''}
                                                </button>
                                                <div className={styles.auth_footer}><Link href="/login">{svg.back_arrow}Back to Login</Link></div>
                                            </>

                                            :
                                            authType == 'reset-password' ?
                                                <>
                                                    {tokenVerify ? passwordResetSuccess ?
                                                        <>
                                                            <div className={styles.auth_link}>
                                                                <img className={styles.auth_cancel} src='/auth/check.gif' />
                                                                <h1>Successfully Reset </h1>
                                                                <div className={styles.auth_footer}><Link href="/login">{svg.back_arrow}Back to Login</Link></div>
                                                            </div>
                                                        </> :
                                                        <>
                                                            <h3 className='pt-65'>Reset Password </h3>
                                                            <p>Your New Password Must Be Different to
                                                                Previously Used Passwords.</p>

                                                            <Form inputType={'password'} fieldname={'password'} label={'Password'} register={register} errors={errors} isRequired={true} />
                                                            <Form inputType={'password'} fieldname={'confirm_password'} label={'Confirm Password'} register={register} errors={errors} watch={watch} isRequired={true} />

                                                            <br />
                                                            <button type="submit" disabled={btnLoader} className="ap_btn ap_btn_full">Submit
                                                                {btnLoader ? <CircularProgress size={24} sx={{ color: loaderColor }} /> : ''}
                                                            </button>

                                                        </> :
                                                        <>
                                                            <div className={styles.auth_link}>
                                                                <img className={styles.auth_cancel} src='/auth/cancel_icon.jpg' />
                                                                <h1>the link is expired </h1>
                                                                <div className={styles.auth_footer}><Link href="/login">{svg.back_arrow}Back to Login</Link></div>
                                                            </div>

                                                        </>
                                                    }
                                                </>

                                                :

                                                authType == 'login' ?
                                                    <>
                                                        <h3 className='pt-65'>Hello !  Welcome Back </h3>
                                                        <p>Please Login To Your Account To Continue.</p>

                                                        <Form fieldname='email' label='Email' inputType='email' register={register} errors={errors} isDisable={false} isRequired={true} />
                                                        <Form inputType={'password'} fieldname={'password'} label={'Password'} register={register} errors={errors} isRequired={true} />

                                                        <div className={styles.auth_forgotremember}>
                                                            <div><input type='checkbox' checked={isRememberMe === true ? 'checked' : ''} onChange={(e) => setIsRememberMe(!isRememberMe)} /> Remember Me</div>
                                                            <div><Link href="/forgot-password">Forgot Password?</Link></div>

                                                        </div>
                                                        <button type="submit" disabled={btnLoader} className="ap_btn ap_btn_full">Login
                                                            {btnLoader ? <CircularProgress size={24} sx={{ color: loaderColor }} /> : ''}
                                                        </button>
                                                        <div className={styles.auth_footer}>Don't have an account? <Link href="/registration"> Sign up!</Link></div>
                                                    </>

                                                    :

                                                    authType == 'paymentCheckout' && <>
                                                    <div className={styles.paymentdiv}>
                                                        {(payHelper != 'thanku') && <h3 className='pt-65'>Make Your Payment</h3>}
                                                        
                                                        {payHelper != 'stripe' && !payBtnLoader &&
                                                        <div className={styles.plan_information}>
                                                            <h3>{(planData?.planname)?.charAt(0).toUpperCase() + (planData?.planname)?.slice(1)}</h3>
                                                            <h4>${planData?.price} <span>/{planData?.paymentPeriod}</span></h4>
                                                            <ul>
                                                                <li>
                                                                    <h2>{svg.checknew} <span>No of campaign</span></h2>
                                                                    <h3>{planData?.noOfCampaigns}</h3>
                                                                </li>
                                                                <li>
                                                                    <h2>{svg.checknew} <span>Free trial </span></h2>
                                                                    <h3>{(planData?.freeTrialPeriod)? planData.freeTrialPeriod : 'NA' }</h3>
                                                                </li>
                                                            </ul>
                                                        </div> }
                                                        {payBtnLoader && <div className={styles.paybtnloader}>
                                                            <Skeleton variant="rounded" width={426} height={50} />
                                                            <Skeleton variant="rounded" width={426} height={50} />
                                                        </div>}

                                                        <div style={{ display: (payHelper == 'both') ? 'block' : 'none' }}>
                                                            {
                                                                planData && 
                                                                <>
                                                                {(payHelper != 'thanku') && !payBtnLoader && <p>Choose Your Payment Method.</p>}
                                                                <div className={styles.payment_method_wrap}>
                                                                    
                                                                    {(planData?.paypal) && (Object.keys(planData?.paypal).length > 0) && <Button className={styles.payment_paypal} onClick={() => setPayHelper('paypal')}><span className={styles.pay_check_box1}> </span>{svg.paymentt}</Button>
                                                                    }
                                                                    {(planData?.stripe) && (Object.keys(planData?.stripe).length > 0) && <Button className={styles.payment_stripe} onClick={() => { setPayHelper('stripe'); stripeCheckout(planData) }}><span className={styles.pay_check_box2}></span>{svg.stripe}</Button>
                                                                    }
                                                                </div></>
                                                            }
                                                        </div>
                                                        <div>
                                                            <div className={styles.auth_link} style={{ display: (payHelper == 'thanku') ? 'flex' : 'none' }}>
                                                                <img className={styles.auth_cancel} src='/auth/check.gif' />
                                                                <h1>Thanks for subscribing</h1>
                                                                <p>You subscribed successfully.</p>
                                                                <div className={styles.auth_footer}><Link href="/login">{svg.back_arrow}Back to Login</Link></div>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: (payHelper != 'both') ? 'block' : 'none' }}>
                                                            {
                                                                (payHelper == 'paypal') ?
                                                                    <div className="mt">
                                                                        {(planData?.paypal && planData?.stripe) && <div className='mb' style={{ cursor: 'pointer' }} onClick={() => setPayHelper('both')}>{svg.back_arrow}</div>}
                                                                        <PayPalScriptProvider options={{ clientId: paypalClientId, components: "buttons", currency: "USD", vault: true }}>
                                                                            <PaypalButtonWrap />
                                                                        </PayPalScriptProvider>
                                                                    </div> :
                                                                    (payHelper == 'stripe') ?
                                                                        <div id="checkout">
                                                                            {PaymentLoader ? <Skeleton variant="rounded" width={430} height={160} /> : clientSecret && (
                                                                                <div>
                                                                                    {(planData?.paypal && planData?.stripe) && <div className='mb' style={{ cursor: 'pointer' }} onClick={() => setPayHelper('both')}>{svg.back_arrow}</div>}
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
                                                                                </div>
                                                                            )}
                                                                        </div> : null

                                                            }

                                                        </div>
                                                        </div>
                                                    </>

                                        )
                                }

                            </form>
                        </div>


                    </div>
                </div>

            </div>

        </>
    )


}

export default Auth