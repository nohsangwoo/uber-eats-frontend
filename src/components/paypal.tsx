import React, { useEffect, memo } from 'react';
import { PayPalButton } from 'react-paypal-button-v2';
import { ToastContainer, toast } from 'react-toastify';

// import couchImg from './../asset/couch.jpg';
// import PayPal from './PayPal';

interface PaypalProps {
  amount: number;
  successFunction: any;
}

export const PayPal: React.FC<PaypalProps> = ({ amount, successFunction }) => {
  const notifyError = (text: string) => toast.error(`${text}`);

  console.log('amounttttt: ', amount);

  // const [checkout, setCheckOut] = useState(false);\
  // const [loaded, setLoaded] = useState(false);
  // const notifyError = (text) => toast.error(`${text}`);
  // test ClientId
  // const clientID =
  //   "ARW0fUzIEsHdd9wqIN7G0uuslnx3uie8iGKePQJmLE3kmScTYNJcjVlU-aPzQ7Q5I-4VxtLAEqS-gEdW";

  // Prod ClientId
  const clientID =
    'AelK6z7Wfr2La0Xn4-6cJ9tcc_R3zTZvstCQCF_b9xcHltGNtawLkqIIFa9MJFu1v_J8pIzCYG8UedGH';

  useEffect(() => {
    // const script = document.createElement("script");
    // script.src =
    //   "https://www.paypal.com/sdk/js?client-id=ARW0fUzIEsHdd9wqIN7G0uuslnx3uie8iGKePQJmLE3kmScTYNJcjVlU-aPzQ7Q5I-4VxtLAEqS-gEdW&currency=JPY";
    // // script.addEventListener('load', setLoaded(true));
    // document.body.appendChild(script);
  }, []);
  // console.log(loaded);

  return (
    <div>
      <ToastContainer />
      <PayPalButton
        amount={amount}
        // currency="CAD"
        currency="USD"
        onSuccess={successFunction}
        options={{
          clientId: clientID,
        }}
        onError={(e: any) => {
          notifyError(e.message);
        }}
      />
    </div>
  );
};

// export default memo(PayPal);
