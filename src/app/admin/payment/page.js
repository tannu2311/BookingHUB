import PageTitle from '@/app/components/common/PageTitle'
import PaymentIntegrate from '@/app/components/common/paymentIntegrate';

const PaymentGateways = () => {

  return (
    <div>
      <PageTitle title="Payment Gateways" />
      <div className='content_wrapper'>
        <PaymentIntegrate />
        </div>
    </div>
  )
}

export default PaymentGateways